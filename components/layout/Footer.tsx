import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.jpeg"
                alt="Onestep Medical Voice AI"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-base font-semibold text-slate-900">
                Onestep Medical AI
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Calm, secure voice-based health guidance providing non-diagnostic medical information.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Product</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-slate-600 transition-colors hover:text-[#0F766E]"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/consultation"
                  className="text-sm text-slate-600 transition-colors hover:text-[#0F766E]"
                >
                  Start Consultation
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-slate-600 transition-colors hover:text-[#0F766E]"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Support</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/help"
                  className="text-sm text-slate-600 transition-colors hover:text-[#0F766E]"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-600 transition-colors hover:text-[#0F766E]"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-slate-600 transition-colors hover:text-[#0F766E]"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <p className="text-sm text-slate-600">
                  This assistant provides general health information only.
                </p>
              </li>
              <li>
                <p className="text-sm text-slate-600">
                  Does not diagnose conditions or replace a licensed medical professional.
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-8 text-center">
          <p className="text-sm text-slate-600">
            &copy; {new Date().getFullYear()} Onestep Medical Voice AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
