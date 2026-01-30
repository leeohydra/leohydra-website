import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[0.5px] border-[var(--border-subtle)] mt-12 py-6 text-sm bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start gap-6 justify-between">
        <div className="space-y-1">
          <div className="font-semibold tracking-wide text-xs">LEOHYDRA</div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Placeholder description for the LeoHydra studio.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-xs">
          <Link href="/original-artworks" className="link-editorial">Original Artworks</Link>
          <Link href="/prints" className="link-editorial">Prints</Link>
          <Link href="/request-project" className="link-editorial">Request a Project</Link>
          <Link href="/about" className="link-editorial">About</Link>
          <Link href="/contact" className="link-editorial">Contact</Link>
        </div>

        <div className="flex flex-col gap-2 text-xs">
          <Link href="/contact" className="link-editorial">Newsletter</Link>
          <a
            href="https://www.instagram.com/leeohydra/"
            target="_blank"
            rel="noreferrer"
            className="link-editorial"
          >
            Instagram
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 text-[11px] text-gray-600 dark:text-gray-400">
        <p>© {year} LeoHydra. All rights reserved.</p>
      </div>
    </footer>
  );
}

