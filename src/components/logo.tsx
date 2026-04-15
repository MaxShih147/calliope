"use client";

export function Logo({ size = 44 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        fontFamily: "var(--font-logo), cursive",
        fontSize: size * 0.58,
        lineHeight: 1,
        paddingTop: size * 0.02,
        border: "1.5px dotted currentColor",
      }}
      aria-hidden="true"
    >
      <span style={{ position: "relative", top: size * 0.06, left: -size * 0.05, WebkitTextStroke: "0.8px currentColor" }}>C</span>
    </span>
  );
}
