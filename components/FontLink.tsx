import { getFontConfig } from "@/lib/font-loader";

interface FontLinkProps {
  typeface: string;
}

export default function FontLink({ typeface }: FontLinkProps) {
  const config = getFontConfig(typeface);

  if (!config.googleFontUrl) {
    return null; // System font, no link needed
  }

  return (
    <link
      rel="stylesheet"
      href={config.googleFontUrl}
      precedence="high"
    />
  );
}
