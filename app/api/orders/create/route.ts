import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

type CartItem = {
  product_id: string;
  quantity: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email: string = body.email;
    const items: CartItem[] = body.items;

    // 1️⃣ Basic validation
    if (!email || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (!item.product_id || item.quantity <= 0) {
        return NextResponse.json(
          { error: "Invalid cart item" },
          { status: 400 }
        );
      }
    }

    // 2️⃣ Fetch products
    const productIds = items.map((i) => i.product_id);

    const { data: products, error: productError } = await supabaseServer
      .from("products")
      .select("id, price_micro, active")
      .in("id", productIds);

    if (productError || !products) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Some products not found" },
        { status: 400 }
      );
    }

    for (const p of products) {
      if (!p.active) {
        return NextResponse.json(
          { error: "Inactive product in cart" },
          { status: 400 }
        );
      }
    }

    // 3️⃣ Calculate total_micro using BigInt
    let totalMicro = BigInt(0);

    const productMap = new Map(
      products.map((p) => [p.id, BigInt(p.price_micro)])
    );

    const orderItemsToInsert = items.map((item) => {
      const unitPrice = productMap.get(item.product_id)!;
      const quantity = BigInt(item.quantity);
      const lineTotal = unitPrice * quantity;

      totalMicro += lineTotal;

      return {
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price_micro: unitPrice.toString(),
        line_total_micro: lineTotal.toString(),
      };
    });

    // 4️⃣ Generate offset (1–999) with retry for race-condition protection
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    const MAX_RETRIES = 3;
    const isDuplicateAmountError = (err: { code?: string; message?: string }) =>
      err?.code === "23505" || /duplicate key|unique constraint/i.test(err?.message ?? "");

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const { data: activePayments } = await supabaseServer
        .from("payments")
        .select("expected_amount_micro")
        .eq("status", "initiated");

      const usedAmounts = new Set(
        (activePayments || []).map((p) => BigInt(String(p.expected_amount_micro)))
      );

      let offset: bigint | null = null;
      for (let i = BigInt(1); i <= BigInt(999); i++) {
        const candidate = totalMicro + i;
        if (!usedAmounts.has(candidate)) {
          offset = i;
          break;
        }
      }

      if (offset === null) {
        return NextResponse.json(
          { error: "No available payment offsets" },
          { status: 500 }
        );
      }

      const expectedAmountMicro = totalMicro + offset;

      const { data: order, error: orderError } = await supabaseServer
        .from("orders")
        .insert({
          email,
          status: "pending_payment",
          total_micro: totalMicro.toString(),
          expires_at: expiresAt.toISOString(),
        })
        .select("id")
        .single();

      if (orderError || !order) {
        return NextResponse.json(
          { error: "Failed to create order" },
          { status: 500 }
        );
      }

      const orderId = order.id;

      const orderItemsPayload = orderItemsToInsert.map((item) => ({
        order_id: orderId,
        ...item,
      }));

      const { error: itemsError } = await supabaseServer
        .from("order_items")
        .insert(orderItemsPayload);

      if (itemsError) {
        await supabaseServer.from("orders").delete().eq("id", orderId);
        return NextResponse.json(
          { error: "Failed to insert order items" },
          { status: 500 }
        );
      }

      const { error: paymentError } = await supabaseServer
        .from("payments")
        .insert({
          order_id: orderId,
          provider: "crypto_direct",
          expected_amount_micro: expectedAmountMicro.toString(),
          receiving_wallet: process.env.CRYPTO_RECEIVING_WALLET,
          status: "initiated",
        });

      if (paymentError) {
        if (isDuplicateAmountError(paymentError) && attempt < MAX_RETRIES) {
          await supabaseServer.from("order_items").delete().eq("order_id", orderId);
          await supabaseServer.from("orders").delete().eq("id", orderId);
          continue;
        }
        console.error(paymentError);
        return NextResponse.json(
          { error: paymentError.message || "Failed to create payment" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        order_id: orderId,
        expected_amount_micro: expectedAmountMicro.toString(),
        expires_at: expiresAt.toISOString(),
        receiving_wallet: process.env.CRYPTO_RECEIVING_WALLET,
      });
    }

    return NextResponse.json(
      { error: "No available payment offsets after retries" },
      { status: 500 }
    );

  } catch (error: any) {
    console.error("ORDER CREATE ERROR:", error);
    return NextResponse.json(
      { error: error?.message || error },
      { status: 500 }
    );
  }
  
}
