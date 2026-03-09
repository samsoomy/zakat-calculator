import Link from "next/link";
import { IslamicArch } from "@/components/GeometricBorder";

export default function LandingPage() {
  return (
    <main className="min-h-screen geo-bg flex flex-col">
      {/* Nav */}
      <nav className="container-main flex items-center justify-between py-5">
        <span className="font-bold text-[#1F3C88] text-lg tracking-tight">
          زكاة <span className="text-[#C99A2E]">·</span> Zakat
        </span>
        <Link href="/onboard" className="btn-primary text-sm py-2 px-4">
          Get Started
        </Link>
      </nav>

      {/* Hero */}
      <section className="container-main flex-1 flex flex-col justify-center py-20 text-center">
        <div className="max-w-xl mx-auto">
          {/* Arch + badge grouped tightly */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <IslamicArch />
            <div className="inline-flex items-center gap-2 bg-[#C99A2E]/15 text-[#1F3C88] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#C99A2E]/30">
              <span>&#128274;</span>
              <span>We never store your financial data</span>
            </div>
          </div>

          {/* Headline + body + CTAs */}
          <div className="space-y-5">
            <h1 className="text-5xl sm:text-6xl font-bold text-[#1F3C88] leading-tight">
              Calculate your{" "}
              <span style={{ color: "var(--gold)" }}>zakat</span> precisely
            </h1>

            <p className="text-lg text-[#3A2A22]/70 leading-relaxed">
              Connect your real bank and investment accounts. We scan 13 months of
              history, apply the hawl rule, and compute your exact zakat
              obligation — in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-3">
              <Link href="/onboard" className="btn-primary text-base px-8 py-3">
                Calculate My Zakat
              </Link>
              <a href="#how" className="btn-secondary text-base px-8 py-3">
                How it works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="container-main py-16 border-t border-[#C99A2E]/10">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#1F3C88] mb-2">How it works</h2>
          <div className="w-12 h-0.5 bg-[#C99A2E] mx-auto" />
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <circle cx="16" cy="16" r="14" stroke="#C99A2E" strokeWidth="1.5" />
                  <path d="M10 16h12M16 10v12" stroke="#1F3C88" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ),
              title: "Set your preferences",
              body: "Choose gold or silver nisab standard, your zakat anniversary date, and whether to include retirement accounts.",
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <rect x="4" y="6" width="24" height="20" rx="3" stroke="#C99A2E" strokeWidth="1.5" />
                  <path d="M10 14h12M10 19h7" stroke="#1F3C88" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ),
              title: "Connect your accounts",
              body: "Link banks, brokerages, and investment accounts via Plaid's secure, read-only connection.",
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <circle cx="16" cy="16" r="14" stroke="#C99A2E" strokeWidth="1.5" />
                  <path d="M10 17l4 4 8-8" stroke="#1F3C88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              title: "Get your number",
              body: "We calculate your minimum hawl balance, check nisab, and show you exactly what you owe — 2.5% of eligible wealth.",
            },
          ].map(({ icon, title, body }, i) => (
            <div key={i} className="card space-y-3">
              <div>{icon}</div>
              <h3 className="font-semibold text-[#1F3C88]">{title}</h3>
              <p className="text-sm text-[#3A2A22]/70 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What is Zakat */}
      <section className="container-main pb-8">
        <div className="card-elevated">
          <h2 className="font-semibold text-[#1F3C88] mb-3 text-lg">What is Zakat?</h2>
          <p className="text-sm text-[#3A2A22]/75 leading-relaxed">
            Zakat is one of the Five Pillars of Islam — an annual obligation to donate 2.5% of
            your accumulated wealth above a minimum threshold (nisab) to those in need, provided
            the wealth has been held for a full lunar year (hawl). It purifies wealth and
            redistributes it to those in need.
          </p>
        </div>
      </section>

      {/* Privacy callout */}
      <section className="container-main pb-20">
        <div
          className="card-elevated text-center space-y-3"
          style={{ borderTopColor: "var(--turquoise)" }}
        >
          <div className="text-2xl">&#128274;</div>
          <h3 className="font-semibold text-[#2FAFA3]">Your privacy is sacred</h3>
          <p className="text-sm text-[#3A2A22]/70 max-w-sm mx-auto leading-relaxed">
            We never store your balances, transactions, or any financial data. Only an encrypted
            session token is retained — keyed to a random ID in your browser — and it
            auto-expires after 13 months. No account, no email, no password.
          </p>
        </div>
      </section>

      <footer className="border-t border-[#C99A2E]/15 py-6 text-center text-xs text-[#3A2A22]/40">
        This tool is a guide. Consult a scholar for your specific situation.
      </footer>
    </main>
  );
}
