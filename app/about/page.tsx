import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-4xl px-6 py-16 md:px-10 md:py-24">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
            About Onestep Medical Voice AI
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Empowering you with safe, accessible health guidance
          </p>
        </div>

        <div className="mb-16 overflow-hidden rounded-2xl shadow-xl">
          <Image
            src="/About us.jpg"
            alt="About Onestep Medical Voice AI"
            width={1200}
            height={600}
            className="h-auto w-full object-cover"
          />
        </div>

        <div className="space-y-8">
          <section className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">Our Mission</h2>
            <p className="leading-relaxed text-slate-600">
              Onestep Medical Voice AI was created to make reliable health information accessible to everyone, anywhere,
              at any time. We believe that understanding your health should be simple, safe, and respectful of your
              privacy.
            </p>
          </section>

          <section className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">What We Do</h2>
            <p className="mb-4 leading-relaxed text-slate-600">
              Our AI-powered voice assistant provides:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0F766E] text-xs text-white">
                  ✓
                </span>
                <span className="text-slate-600">
                  <strong className="text-slate-900">Non-diagnostic health guidance</strong> – General information
                  about symptoms and wellness
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0F766E] text-xs text-white">
                  ✓
                </span>
                <span className="text-slate-600">
                  <strong className="text-slate-900">Lifestyle and self-care tips</strong> – Diet, exercise, and
                  wellness recommendations
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0F766E] text-xs text-white">
                  ✓
                </span>
                <span className="text-slate-600">
                  <strong className="text-slate-900">Emergency detection</strong> – Immediate alerts when symptoms may
                  require urgent care
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0F766E] text-xs text-white">
                  ✓
                </span>
                <span className="text-slate-600">
                  <strong className="text-slate-900">Structured medical reports</strong> – Summaries you can share with
                  your doctor
                </span>
              </li>
            </ul>
          </section>

          <section className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">Our Commitment</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-[#0F766E] pl-4">
                <h3 className="mb-2 font-semibold text-slate-900">Privacy First</h3>
                <p className="text-sm text-slate-600">
                  Your health information is encrypted and never shared. We follow strict data protection standards to
                  keep your conversations private and secure.
                </p>
              </div>
              <div className="border-l-4 border-[#2563EB] pl-4">
                <h3 className="mb-2 font-semibold text-slate-900">Medical Safety</h3>
                <p className="text-sm text-slate-600">
                  Our AI follows strict medical safety guidelines. It does not diagnose, prescribe medications, or
                  replace professional medical advice. We always encourage consulting with licensed healthcare
                  professionals.
                </p>
              </div>
              <div className="border-l-4 border-[#16A34A] pl-4">
                <h3 className="mb-2 font-semibold text-slate-900">Continuous Improvement</h3>
                <p className="text-sm text-slate-600">
                  We constantly update our AI to provide the most accurate, helpful, and safe health information
                  possible. Your feedback helps us improve every day.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-[#0F766E] p-8 text-white shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold">Important Medical Disclaimer</h2>
            <p className="leading-relaxed">
              Onestep Medical Voice AI is an educational tool and does not provide medical diagnosis, treatment, or
              professional medical advice. Always consult a qualified healthcare provider for medical concerns. In case
              of emergency, contact your local emergency services immediately.
            </p>
          </section>

          <div className="mt-12 text-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-[#0F766E] px-8 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#0b5b55]"
            >
              Start Your Free Consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
