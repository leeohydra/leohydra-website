import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { ethers } from "ethers";
import { log } from "console";

const POLYGON_RPC = process.env.POLYGON_RPC_URL!;
const USDT_CONTRACT = process.env.USDT_CONTRACT_ADDRESS!;
const provider = new ethers.JsonRpcProvider(POLYGON_RPC);

export async function POST(req: Request) {
  try {
    const { order_id, tx_hash } = await req.json();

    if (!order_id || !tx_hash) {
      return NextResponse.json(
        { error: "Missing order_id or tx_hash" },
        { status: 400 }
      );
    }

    // 1️⃣ Fetch payment
    const { data: payment, error: paymentError } = await supabaseServer
      .from("payments")
      .select("id, expected_amount_micro, status, receiving_wallet, order_id")
      .eq("order_id", order_id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (payment.status !== "initiated") {
      return NextResponse.json(
        { error: "Payment not in initiated state" },
        { status: 400 }
      );
    }

    // 2️⃣ Fetch order
    const { data: order } = await supabaseServer
      .from("orders")
      .select("id, status, expires_at, created_at")
      .eq("id", order_id)
      .single();

    if (!order || order.status !== "pending_payment") {
      return NextResponse.json(
        { error: "Order not payable" },
        { status: 400 }
      );
    }

    // DEBUG: Timezone/expiry check
    const now = new Date();
    const expiresAtParsed = new Date(order.expires_at);
    const createdAtParsed = new Date(order.created_at);
    console.log("[EXPIRY DEBUG] Raw from DB:", {
      expires_at: order.expires_at,
      created_at: order.created_at,
      hasZ_suffix: {
        expires_at: String(order.expires_at).endsWith("Z"),
        created_at: String(order.created_at).endsWith("Z"),
      },
      parsed: {
        expiresAt: expiresAtParsed.toISOString(),
        createdAt: createdAtParsed.toISOString(),
        now: now.toISOString(),
      },
      isExpired: expiresAtParsed < now,
    });

    if (expiresAtParsed < now) {
      return NextResponse.json(
        { error: "Order expired" },
        { status: 400 }
      );
    }

    // 3️⃣ Fetch transaction receipt
    const receipt = await provider.getTransactionReceipt(tx_hash);

    if (!receipt || receipt.status !== 1) {
      return NextResponse.json(
        { error: "Transaction not confirmed" },
        { status: 400 }
      );
    }

    // ✅ Proper confirmation calculation (ethers v6)
    const currentBlock = await provider.getBlockNumber();
    const confirmations = currentBlock - receipt.blockNumber;

    if (confirmations < 3) {
      return NextResponse.json(
        { error: "Not enough confirmations" },
        { status: 400 }
      );
    }

    // 4️⃣ Parse logs for USDT Transfer
    const iface = new ethers.Interface([
      "event Transfer(address indexed from, address indexed to, uint256 value)"
    ]);

    let matched = false;
    let senderAddress = "";
    let receivedAmount = BigInt(0);

    console.log(`🔍 LOG DETECTED FROM: ${receipt.logs[0].address} (Looking for: ${USDT_CONTRACT})`);
    for (const log of receipt.logs) {
      // console.log("Checking Log Address:", log.address); // DEBUG
      if (log.address.toLowerCase() !== USDT_CONTRACT.toLowerCase()) continue;

      try {
        const parsed = iface.parseLog(log);
        // console.log("Parsed Log 'To':", parsed?.args.to); // DEBUG
        // console.log("Expected 'To':", payment.receiving_wallet); // DEBUG
        if (!parsed) continue;

        const to = parsed.args.to;
        const value = parsed.args.value;

        if (to.toLowerCase() === payment.receiving_wallet.toLowerCase()) {
          senderAddress = parsed.args.from;
          receivedAmount = BigInt(value.toString());
          console.log("✅ MATCH FOUND:", { to, value: receivedAmount.toString() });
          matched = true;
          break;
        }else {
          console.log("❌ Address mismatch:", { 
            logTo: to.toLowerCase(), 
            expectedTo: payment.receiving_wallet.toLowerCase()
          });
        }
      } catch {
        continue;
      }
    }

    if (!matched) {
      return NextResponse.json(
        { error: "No matching USDT transfer found" },
        { status: 400 }
      );
    }

    // Normalize to string for comparison (Supabase may return numeric columns as number)
    const receivedStr = receivedAmount.toString();
    const expectedStr = String(payment.expected_amount_micro);

    if (receivedStr !== expectedStr) {
      return NextResponse.json(
        { error: "Amount mismatch" },
        { status: 400 }
      );
    }

    // 5️⃣ Block timestamp validation
    const block = await provider.getBlock(receipt.blockNumber);
    if (!block) {
      return NextResponse.json(
        { error: "Unable to fetch block" },
        { status: 400 }
      );
    }

    const blockTimestamp = new Date(block.timestamp * 1000);

    if (blockTimestamp < createdAtParsed) {
      return NextResponse.json(
        { error: "Transaction predates order" },
        { status: 400 }
      );
    }

    if (blockTimestamp > expiresAtParsed) {
      return NextResponse.json(
        { error: "Transaction after expiry" },
        { status: 400 }
      );
    }

    // 6️⃣ Atomic DB update
    const { error: rpcError } = await supabaseServer.rpc(
      "confirm_payment_atomic",
      {
        p_payment_id: payment.id,
        p_tx_hash: tx_hash,
        p_sender: senderAddress,
        p_amount: receivedAmount.toString(),
        p_block_number: receipt.blockNumber,
        p_block_timestamp: blockTimestamp.toISOString()
      }
    );

    if (rpcError) {
      console.error("RPC ERROR:", rpcError);
      return NextResponse.json(
        { error: "Database update failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("VERIFY ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
