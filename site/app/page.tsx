import Link from "next/link";
import { BookOpen, Brain, FileText, Search, ShieldCheck, Landmark, Clock, ArrowRight } from "lucide-react";

import { MODULE_CONFIG } from "./lib/modules";
import Header from "./components/Header";

const moduleIcons = [BookOpen, Brain, FileText, Search, ShieldCheck, Landmark];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--site-bg)' }}>
      <Header />

      {/* Hero Section */}
      <section className="w-full pt-16 pb-12 px-6 text-center">
        <h1
          className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight"
          style={{ color: 'var(--site-text)' }}
        >
          KDB 생성형 AI 활용 교육
        </h1>
        <p
          className="text-lg md:text-xl mb-8"
          style={{ color: 'var(--site-text-secondary)' }}
        >
          한국산업은행(KDB) 임직원을 위한 실전 가이드
        </p>

        {/* AI Tool Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {["Gemini", "Claude", "ChatGPT", "사내 LLM"].map((name) => (
            <span
              key={name}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background: 'var(--site-accent-light)',
                color: 'var(--site-accent)',
                border: '1px solid var(--site-border)',
              }}
            >
              {name}
            </span>
          ))}
        </div>

      </section>

      {/* Module Cards Grid */}
      <main id="modules" className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULE_CONFIG.map((mod, idx) => {
            const Icon = moduleIcons[idx] || BookOpen;
            return (
              <div
                key={mod.id}
                className="rounded-xl p-6 flex flex-col"
                style={{
                  background: 'var(--site-bg)',
                  border: '1px solid var(--site-border)',
                }}
              >
                {/* Module number + icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--site-accent-light)' }}
                  >
                    <Icon size={20} style={{ color: 'var(--site-accent)' }} />
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: 'var(--site-accent)' }}
                  >
                    {mod.subtitle}
                  </span>
                </div>

                {/* Title + description */}
                <h2
                  className="text-lg font-bold mb-2"
                  style={{ color: 'var(--site-text)' }}
                >
                  {mod.title}
                </h2>
                <p
                  className="text-sm mb-3 flex-1"
                  style={{ color: 'var(--site-text-secondary)' }}
                >
                  {mod.description}
                </p>

                {/* Duration */}
                <div
                  className="flex items-center gap-1.5 text-xs mb-3"
                  style={{ color: 'var(--site-text-secondary)' }}
                >
                  <Clock size={14} />
                  <span>{mod.duration}</span>
                </div>

                {/* Keywords */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {mod.keywords.slice(0, 3).map((kw) => (
                    <span
                      key={kw}
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        background: 'var(--site-bg-secondary)',
                        color: 'var(--site-text-secondary)',
                      }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-auto">
                  <Link
                    href={`/learn/${mod.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                    style={{
                      background: 'var(--site-accent)',
                      color: '#FFFFFF',
                    }}
                  >
                    <ArrowRight size={14} />
                    학습하기
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="w-full py-8 px-6 text-center text-sm"
        style={{
          borderTop: '1px solid var(--site-border)',
          color: 'var(--site-text-secondary)',
        }}
      >
        KDB 생성형 AI 활용 교육 &copy; 2026
      </footer>
    </div>
  );
}
