import Link from "next/link";
import { BookOpen, Brain, FileText, Search, ShieldCheck, Factory } from "lucide-react";
import type { SlidesData } from "./types";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/ai-edu";

const moduleIcons = [BookOpen, Brain, FileText, Search, ShieldCheck, Factory];

async function getSlidesData(): Promise<SlidesData> {
  const fs = await import("fs");
  const path = await import("path");
  const filePath = path.join(process.cwd(), "public", "slides.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export default async function Home() {
  const data = await getSlidesData();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <header className="w-full pt-16 pb-12 px-6 text-center">
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          생성형 AI 활용 교육
        </h1>
        <p
          className="text-lg md:text-xl"
          style={{ color: "var(--text-secondary)" }}
        >
          제조업 &#183; 금융권 직장인을 위한 실전 가이드
        </p>
      </header>

      {/* Module Cards Grid */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.modules.map((mod, idx) => {
            const Icon = moduleIcons[idx] || BookOpen;
            return (
              <Link
                key={mod.id}
                href={`/modules/${mod.id}`}
                className="group block rounded-xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--accent-light)" }}
                  >
                    <Icon
                      size={20}
                      style={{ color: "var(--accent)" }}
                    />
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--accent)" }}
                  >
                    Module {idx + 1}
                  </span>
                </div>
                <h2
                  className="text-lg font-semibold mb-2 group-hover:underline"
                  style={{ color: "var(--text-primary)" }}
                >
                  {mod.title}
                </h2>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {mod.slides.length}개 슬라이드
                </p>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Footer Badges */}
      <footer
        className="w-full py-8 px-6 text-center"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <p
          className="text-sm mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          교육에서 다루는 AI 도구
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {["Gemini", "Claude", "ChatGPT", "사내 LLM"].map((name) => (
            <span
              key={name}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium"
              style={{
                background: "var(--accent-light)",
                color: "var(--accent-dark)",
                border: "1px solid var(--border)",
              }}
            >
              {name}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
