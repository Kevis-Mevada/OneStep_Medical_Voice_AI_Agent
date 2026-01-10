import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 items-center bg-[#F8FAFC]">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-12 px-6 py-16 md:flex-row md:px-10 md:py-24">
          <div className="max-w-xl space-y-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#0F766E]">
              Calm, secure voice-based health guidance
            </p>
            <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
              Your Personal Medical Voice Assistant
            </h1>
            <p className="text-base leading-relaxed text-slate-600 md:text-lg">
              Talk naturally about your health concerns and receive clear, non-diagnostic guidance on lifestyle, diet,
              and self-care – all with privacy and safety at the center.
            </p>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-[#0F766E] px-8 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#0b5b55]"
              >
                Get started – it&apos;s free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-3 text-base font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                Sign in
              </Link>
            </div>

            <div className="rounded-lg bg-white/80 p-4 text-xs text-slate-600 shadow-sm ring-1 ring-slate-100">
              <p className="font-semibold text-slate-800">⚕️ Important medical notice</p>
              <p className="mt-1">
                This assistant does <span className="font-semibold">not</span> diagnose conditions, prescribe
                medications, or replace a licensed medical professional. In an emergency, contact your local emergency
                services immediately.
              </p>
            </div>
          </div>

          <div className="relative h-96 w-full max-w-md overflow-hidden rounded-2xl bg-slate-900/5 shadow-xl ring-1 ring-slate-100 md:h-[500px]">
            <Image
              src="/Home.jpg"
              alt="Modern digital healthcare consultation"
              fill
              className="object-cover"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
              <p className="text-xs font-medium uppercase tracking-wide text-cyan-300">
                🎙️ Voice AI consultation (non-diagnostic)
              </p>
              <p className="text-sm leading-snug">
                Designed for calm, clear conversations about your health – with built-in safety checks and strong privacy
                controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              How It Works
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              Simple, secure, and designed with your wellbeing in mind
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-[#F8FAFC] p-6 shadow-sm ring-1 ring-slate-100">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0F766E] text-xl text-white">
                🎤
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Voice Consultation
              </h3>
              <p className="text-sm text-slate-600">
                Talk naturally about your symptoms and health concerns using voice or text input.
              </p>
            </div>

            <div className="rounded-xl bg-[#F8FAFC] p-6 shadow-sm ring-1 ring-slate-100">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#2563EB] text-xl text-white">
                🧠
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                AI-Powered Guidance
              </h3>
              <p className="text-sm text-slate-600">
                Receive personalized, non-diagnostic health information, lifestyle tips, and self-care suggestions.
              </p>
            </div>

            <div className="rounded-xl bg-[#F8FAFC] p-6 shadow-sm ring-1 ring-slate-100">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#16A34A] text-xl text-white">
                📄
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Medical Reports
              </h3>
              <p className="text-sm text-slate-600">
                Get structured consultation summaries you can share with your doctor or keep for your records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section with Image */}
      <section className="bg-[#F8FAFC] py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="flex flex-col items-center gap-12 md:flex-row">
            <div className="relative h-80 w-full max-w-md overflow-hidden rounded-2xl shadow-xl ring-1 ring-slate-100 md:h-96">
              <Image
                src="/About us.jpg"
                alt="About Onestep Medical Voice AI"
                fill
                className="object-cover"
              />
            </div>
            <div className="max-w-xl space-y-4">
              <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
                Why Choose Onestep?
              </h2>
              <p className="text-base leading-relaxed text-slate-600">
                Onestep Medical Voice AI combines cutting-edge artificial intelligence with a commitment to safety,
                privacy, and responsible healthcare guidance.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0F766E] text-xs text-white">
                    ✓
                  </span>
                  <span className="text-sm text-slate-600">
                    <strong className="text-slate-900">100% Private & Secure:</strong> Your health information is
                    encrypted and never shared.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0F766E] text-xs text-white">
                    ✓
                  </span>
                  <span className="text-sm text-slate-600">
                    <strong className="text-slate-900">Emergency Detection:</strong> Built-in safety checks alert you to
                    seek immediate medical care when needed.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0F766E] text-xs text-white">
                    ✓
                  </span>
                  <span className="text-sm text-slate-600">
                    <strong className="text-slate-900">Non-Diagnostic:</strong> We provide educational guidance only –
                    never replacing your doctor.
                  </span>
                </li>
              </ul>
              <Link
                href="/about"
                className="inline-flex items-center text-sm font-medium text-[#0F766E] hover:underline"
              >
                Learn more about our mission →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="flex flex-col items-center gap-12 md:flex-row-reverse">
            <div className="relative h-80 w-full max-w-md overflow-hidden rounded-2xl shadow-xl ring-1 ring-slate-100 md:h-96">
              <Image
                src="/Future.jpg"
                alt="Future of healthcare with AI"
                fill
                className="object-cover"
              />
            </div>
            <div className="max-w-xl space-y-4">
              <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
                The Future of Healthcare Guidance
              </h2>
              <p className="text-base leading-relaxed text-slate-600">
                We&apos;re building a world where everyone has access to instant, reliable health information—anytime,
                anywhere. Our AI assistant is constantly learning and improving to serve you better.
              </p>
              <p className="text-base leading-relaxed text-slate-600">
                Join thousands of users who trust Onestep for their everyday health questions and wellness guidance.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-[#2563EB] px-8 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#1d4fd8]"
              >
                Start your free consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
