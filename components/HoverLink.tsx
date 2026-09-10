"use client";

import Link from "next/link";

interface HoverLinkProps {
  href: string;
  dataCursor?: string;
  style?: React.CSSProperties;
  hoverStyle?: React.CSSProperties;
  children: React.ReactNode;
}

export function HoverLink({
  href,
  dataCursor,
  style = {},
  hoverStyle = {},
  children,
}: HoverLinkProps) {
  return (
    <Link
      href={href}
      data-cursor={dataCursor}
      style={{ ...style, transition: "all 0.2s ease" }}
      onMouseEnter={(e) => {
        Object.assign((e.currentTarget as HTMLElement).style, hoverStyle);
      }}
      onMouseLeave={(e) => {
        // Reset to base style
        const el = e.currentTarget as HTMLElement;
        for (const key of Object.keys(hoverStyle)) {
          (el.style as unknown as Record<string, string>)[key] =
            (style as Record<string, string>)[key] ?? "";
        }
      }}
    >
      {children}
    </Link>
  );
}
