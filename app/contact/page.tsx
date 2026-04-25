"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ArrowRight } from "lucide-react";
import { submitContact } from "@/app/actions/contact";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ─── Data ─── */
const TOPICS = [
  { id: "inquiry", label: "General inquiry" },
  { id: "press", label: "Press & media" },
  { id: "partner", label: "Partnership" },
  { id: "support", label: "Support" },
  { id: "wholesale", label: "Wholesale" },
] as const;

const STEPS = ["name", "email", "topic", "message"] as const;
type StepKey = (typeof STEPS)[number];
type Answers = Record<StepKey, string>;

const QUESTIONS: Record<number, (a: Answers) => string> = {
  0: () => "What's your\nname?",
  1: (a) => `Nice to meet\nyou, ${a.name || "…"}.`,
  2: () => "What brings\nyou here?",
  3: () => "Tell us\nmore.",
};

const TICKER_ITEMS = [
  "GENERAL INQUIRY",
  "PRESS & MEDIA",
  "PARTNERSHIP",
  "SUPPORT",
  "WHOLESALE",
  "< 48H RESPONSE",
  "PARIS, FR",
  "EST. MMXXI",
];

export default function ContactPage() {
  /* ── Refs ── */
  const heroRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const textaRef = useRef<HTMLTextAreaElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);

  /* ── State ── */
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    name: "",
    email: "",
    topic: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const field = STEPS[step];

  /* ── Hero + global scroll reveals ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText(heroRef.current, {
        type: "chars",
        charsClass: "inline-block overflow-hidden",
      });
      gsap.from(split.chars, {
        yPercent: 110,
        opacity: 0,
        stagger: 0.025,
        duration: 1.2,
        ease: "expo.out",
        delay: 0.3,
      });

      gsap.set(subtitleRef.current, { clipPath: "inset(0 100% 0 0)" });
      gsap.to(subtitleRef.current, {
        clipPath: "inset(0 0% 0 0)",
        duration: 1,
        ease: "expo.out",
        delay: 0.9,
      });

      document.querySelectorAll("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      return () => split.revert();
    });
    return () => ctx.revert();
  }, []);

  /* ── Left panel entrance (scroll-triggered) ── */
  useEffect(() => {
    const items = leftRef.current?.querySelectorAll("[data-panel]");
    if (!items) return;
    gsap.set(items, { opacity: 0.75 });
    gsap.from(items, {
      x: -20,
      stagger: 0.08,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: leftRef.current, start: "top 80%", once: true },
    });
  }, []);

  /* ── Step animation ── */
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.55, ease: "expo.out", delay: 0.05 },
    );
    gsap.to(progressRef.current, {
      scaleX: (step + 1) / STEPS.length,
      duration: 0.5,
      ease: "expo.out",
      transformOrigin: "left center",
    });
    const timer = setTimeout(() => {
      if (field === "name" || field === "email") inputRef.current?.focus();
      if (field === "message") textaRef.current?.focus();
    }, 350);
    return () => clearTimeout(timer);
  }, [step, field]);

  /* ── Navigation ── */
  const animOut = useCallback((cb: () => void) => {
    gsap.to(contentRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.25,
      ease: "power2.in",
      onComplete: cb,
    });
  }, []);

  const submit = useCallback(async () => {
    setLoading(true);
    await submitContact({
      name: answers.name,
      email: answers.email,
      topic: answers.topic,
      message: answers.message,
    });
    setLoading(false);
    setSent(true);
  }, [answers]);

  const goNext = useCallback(
    (overrideVal?: string) => {
      const val = overrideVal ?? answers[field];
      if (!val.trim()) return;
      if (step < STEPS.length - 1) {
        animOut(() => setStep((s) => s + 1));
      } else {
        submit();
      }
    },
    [answers, field, step, animOut, submit],
  );

  const goBack = useCallback(() => {
    if (step > 0) animOut(() => setStep((s) => s - 1));
  }, [step, animOut]);

  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && field !== "message") {
        e.preventDefault();
        goNext();
      }
    },
    [field, goNext],
  );

  const setField = (val: string) => setAnswers((a) => ({ ...a, [field]: val }));
  const val = answers[field];

  return (
    <main
      className="relative z-10 bg-[#000000]"
      style={{ overflowX: "clip" }}
      aria-label="Contact VØID"
    >
      {/* ─────── HERO ─────── */}
      <section className="relative min-h-screen flex flex-col justify-end px-8 md:px-16 pb-16 pt-32 border-b border-[#1C1C1C] overflow-hidden">
        {/* Watermark */}
        <span
          aria-hidden="true"
          className="pointer-events-none select-none absolute right-[-2vw] top-1/2 -translate-y-1/2 leading-none font-display font-light"
          style={{
            color: "transparent",
            WebkitTextStroke: "1px #0A0A0A",
            fontSize: "clamp(16vw, 26vw, 34vw)",
            letterSpacing: "-0.05em",
          }}
        >
          CONTACT
        </span>

        <p
          className="font-mono text-[#4DFFB4] uppercase mb-10 relative z-10"
          style={{ fontSize: "10px", letterSpacing: "0.35em" }}
        >
          GET IN TOUCH &nbsp;·&nbsp; PARIS, FR
        </p>

        <h1
          ref={heroRef}
          className="font-display font-light text-[#E8E8E8] leading-none mb-12 relative z-10"
          style={{ fontSize: "clamp(4.5rem, 12vw, 13rem)", letterSpacing: "-0.045em" }}
        >
          Say<br />hello.
        </h1>

        <div className="flex items-end justify-between gap-8 relative z-10">
          <p
            ref={subtitleRef}
            className="font-sans font-light text-[#666666] leading-relaxed max-w-sm"
            style={{ fontSize: "14px" }}
          >
            Every message is read by a human. We reply personally within 48 hours.
          </p>
          <span
            className="hidden md:flex items-center gap-3 font-mono text-[#3A3A3A] shrink-0"
            style={{ fontSize: "10px", letterSpacing: "0.2em" }}
          >
            <span className="inline-block w-8 h-px bg-[#4DFFB4]" />
            AW25 COLLECTION
          </span>
        </div>
      </section>

      {/* ─────── TICKER ─────── */}
      <div
        className="py-5 border-b border-[#1C1C1C] overflow-hidden bg-[#040404]"
        aria-hidden="true"
      >
        <div
          className="flex whitespace-nowrap"
          style={{
            width: "max-content",
            "--marquee-offset": "-50%",
            animation: "scroll-left 32s linear infinite",
          } as React.CSSProperties}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span
              key={i}
              className="font-mono text-[#4DFFB4] uppercase inline-flex items-center gap-8 px-8"
              style={{ fontSize: "10px", letterSpacing: "0.3em" }}
            >
              {item}
              <span className="inline-block w-1 h-1 rounded-full bg-[#4DFFB4] opacity-30" />
            </span>
          ))}
        </div>
      </div>

      {/* ─────── FORM SECTION ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[420px_1px_1fr]">

        {/* ─── LEFT PANEL ─── */}
        <aside
          ref={leftRef}
          className="lg:sticky lg:top-0 lg:h-screen flex flex-col justify-between px-10 md:px-12 py-12 border-b lg:border-b-0 lg:border-r border-[#1C1C1C] bg-[#020202]"
        >
          <div className="flex flex-col gap-10">
            {/* Brand */}
            <div data-panel>
              <p
                className="font-display font-light text-[#E8E8E8]"
                style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", letterSpacing: "-0.04em" }}
              >
                VØID
              </p>
            </div>

            <div className="w-6 h-px bg-[#4DFFB4]" data-panel />

            {/* Studio */}
            <div className="flex flex-col gap-1" data-panel>
              <p
                className="font-mono text-[#555555] uppercase mb-2"
                style={{ fontSize: "9px", letterSpacing: "0.3em" }}
              >
                Studio
              </p>
              <p className="font-sans font-light text-[#666666]" style={{ fontSize: "14px" }}>
                Paris, France
              </p>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1" data-panel>
              <p
                className="font-mono text-[#555555] uppercase mb-2"
                style={{ fontSize: "9px", letterSpacing: "0.3em" }}
              >
                Email
              </p>
              <a
                href="mailto:contact@void-studio.com"
                className="font-sans font-light text-[#666666] hover:text-[#4DFFB4] transition-colors duration-200"
                style={{ fontSize: "14px" }}
              >
                contact@void-studio.com
              </a>
            </div>

            {/* Response time — big stat */}
            <div className="flex flex-col gap-2" data-panel>
              <p
                className="font-mono text-[#555555] uppercase mb-2"
                style={{ fontSize: "9px", letterSpacing: "0.3em" }}
              >
                Response time
              </p>
              <div
                className="font-display font-light leading-none"
                style={{ fontSize: "clamp(3.5rem, 7vw, 5.5rem)", letterSpacing: "-0.05em" }}
              >
                <span className="text-[#E8E8E8]">&lt;&nbsp;48</span>
                <span className="text-[#4DFFB4]">H</span>
              </div>
              <p className="font-sans font-light text-[#555555]" style={{ fontSize: "12px" }}>
                Guaranteed personal reply.
              </p>
            </div>
          </div>

          {/* Bottom note */}
          <div className="flex flex-col gap-4 mt-10 lg:mt-0" data-panel>
            <div className="w-full h-px bg-[#1C1C1C]" />
            <p
              className="font-sans font-light text-[#555555] leading-relaxed"
              style={{ fontSize: "12px" }}
            >
              No bots. No automated replies. Every message is handled personally by our team.
            </p>
          </div>
        </aside>

        {/* ── Vertical separator ── */}
        <div className="hidden lg:block bg-[#1C1C1C]" />

        {/* ─── RIGHT — FORM ─── */}
        <div className="flex flex-col min-h-screen lg:min-h-[80vh] relative overflow-hidden">
          {/* Progress bar */}
          <div className="h-px bg-[#0E0E0E] relative overflow-hidden">
            <div
              ref={progressRef}
              className="absolute inset-0 bg-[#4DFFB4] origin-left"
              style={{ transform: "scaleX(0.25)" }}
            />
          </div>

          {/* Watermark step number */}
          <span
            aria-hidden="true"
            className="pointer-events-none select-none absolute right-0 bottom-0 leading-none font-display font-light"
            style={{
              color: "transparent",
              WebkitTextStroke: "1px #0C0C0C",
              fontSize: "clamp(22vw, 32vw, 42vw)",
              letterSpacing: "-0.05em",
              lineHeight: 0.8,
            }}
          >
            {String(step + 1).padStart(2, "0")}
          </span>

          <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-24 relative z-10">
            {sent ? (
              /* ── Confirmation ── */
              <div className="flex flex-col gap-8 max-w-xl">
                <span
                  className="font-mono text-[#4DFFB4]"
                  style={{ fontSize: "10px", letterSpacing: "0.3em" }}
                >
                  MESSAGE RECEIVED ✓
                </span>
                <h2
                  className="font-display font-light text-[#E8E8E8]"
                  style={{
                    fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                    letterSpacing: "-0.04em",
                    lineHeight: 0.88,
                  }}
                >
                  {"We'll be\nin touch."}
                </h2>
                <p
                  className="font-sans font-light text-[#666666] leading-relaxed"
                  style={{ fontSize: "15px" }}
                >
                  A real person will reply within 48 hours.
                </p>
                <Link
                  href="/collection"
                  data-cursor="pointer"
                  className="font-sans font-medium text-[#000000] bg-[#4DFFB4] hover:bg-[#E8E8E8] transition-colors duration-300 uppercase px-10 py-4 w-fit"
                  style={{ fontSize: "11px", letterSpacing: "0.25em" }}
                >
                  Explore collection →
                </Link>
              </div>
            ) : (
              /* ── Conversational form ── */
              <div className="max-w-xl w-full">
                {/* Step counter */}
                <p
                  className="font-mono text-[#444444] mb-10"
                  style={{ fontSize: "10px", letterSpacing: "0.25em" }}
                >
                  {String(step + 1).padStart(2, "0")} —{" "}
                  {String(STEPS.length).padStart(2, "0")}
                </p>

                <div ref={contentRef}>
                  {/* Question */}
                  <h2
                    className="font-display font-light text-[#E8E8E8] mb-10 whitespace-pre-line"
                    style={{
                      fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
                      letterSpacing: "-0.04em",
                      lineHeight: 0.9,
                    }}
                  >
                    {QUESTIONS[step](answers)}
                  </h2>

                  {/* ── Name ── */}
                  {field === "name" && (
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Your name…"
                      autoComplete="name"
                      value={val}
                      onChange={(e) => setField(e.target.value)}
                      onKeyDown={onKey}
                      className="w-full bg-transparent border-b border-[#1C1C1C] text-[#E8E8E8] font-display font-light pb-4 outline-none transition-colors duration-200 placeholder:text-[#333333] focus:border-[#4DFFB4]"
                      style={{
                        fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)",
                        letterSpacing: "-0.02em",
                      }}
                    />
                  )}

                  {/* ── Email ── */}
                  {field === "email" && (
                    <input
                      ref={inputRef}
                      type="email"
                      placeholder="your@email.com"
                      autoComplete="email"
                      value={val}
                      onChange={(e) => setField(e.target.value)}
                      onKeyDown={onKey}
                      className="w-full bg-transparent border-b border-[#1C1C1C] text-[#E8E8E8] font-display font-light pb-4 outline-none transition-colors duration-200 placeholder:text-[#333333] focus:border-[#4DFFB4]"
                      style={{
                        fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)",
                        letterSpacing: "-0.02em",
                      }}
                    />
                  )}

                  {/* ── Topic pills ── */}
                  {field === "topic" && (
                    <div className="flex flex-col gap-2 mt-2">
                      {TOPICS.map((t) => {
                        const active = answers.topic === t.label;
                        return (
                          <button
                            key={t.id}
                            onClick={() => {
                              setField(t.label);
                              setTimeout(() => goNext(t.label), 220);
                            }}
                            data-cursor="pointer"
                            className="group flex items-center justify-between border px-6 py-4 transition-all duration-200 text-left w-full"
                            style={{
                              borderColor: active ? "#4DFFB4" : "#1C1C1C",
                              background: active ? "rgba(77,255,180,0.04)" : "transparent",
                            }}
                          >
                            <span
                              className="font-sans font-light transition-colors duration-200"
                              style={{
                                fontSize: "14px",
                                color: active ? "#E8E8E8" : "#555555",
                                letterSpacing: "0.05em",
                              }}
                            >
                              {t.label}
                            </span>
                            {active && (
                              <ArrowRight size={12} className="text-[#4DFFB4] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ── Message ── */}
                  {field === "message" && (
                    <textarea
                      ref={textaRef}
                      rows={5}
                      placeholder="Say anything…"
                      value={val}
                      onChange={(e) => setField(e.target.value)}
                      className="w-full bg-transparent border-b border-[#1C1C1C] text-[#E8E8E8] font-sans font-light pb-4 outline-none transition-colors duration-200 placeholder:text-[#333333] focus:border-[#4DFFB4] resize-none"
                      style={{ fontSize: "18px", lineHeight: 1.6 }}
                    />
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-14">
                  <button
                    onClick={goBack}
                    data-cursor="pointer"
                    className="font-mono text-[#555555] hover:text-[#E8E8E8] transition-colors duration-200 uppercase"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.25em",
                      visibility: step > 0 ? "visible" : "hidden",
                    }}
                  >
                    ← Back
                  </button>

                  {field !== "topic" && (
                    <button
                      onClick={() => goNext()}
                      disabled={!val.trim() || loading}
                      data-cursor="pointer"
                      className="flex items-center gap-3 font-sans font-medium text-[#000000] bg-[#4DFFB4] hover:bg-[#E8E8E8] transition-colors duration-300 uppercase px-8 py-4 disabled:opacity-20 disabled:cursor-not-allowed"
                      style={{ fontSize: "11px", letterSpacing: "0.2em" }}
                    >
                      <span>
                        {loading
                          ? "Sending…"
                          : step === STEPS.length - 1
                            ? "Send"
                            : "Next"}
                      </span>
                      {!loading && <ArrowRight size={13} />}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
