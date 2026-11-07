interface PageCounterProps {
  number: string;
  label: string;
  align?: "start" | "end";
}

export default function PageCounter({ number, label, align = "end" }: PageCounterProps) {
  return (
    <div
      className="page-counter"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "start" ? "flex-start" : "flex-end",
        gap: "0.5rem",
      }}
    >
      <span
        className="page-counter__number"
        style={{
          fontFamily: "var(--font-display, 'Helvetica Neue', Arial, sans-serif)",
          fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          color: "rgba(201, 26, 31, 0.15)",
          lineHeight: 1,
        }}
      >
        {number}
      </span>
      <span
        className="page-counter__label"
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(10, 10, 10, 0.35)",
        }}
      >
        {label}
      </span>
    </div>
  );
}
