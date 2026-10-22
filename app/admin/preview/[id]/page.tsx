import type { Metadata } from "next";
import AdminPreview from "@/components/admin/AdminPreview";

export const metadata: Metadata = { title: "Preview Proyek", robots: { index: false, follow: false } };

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminPreview id={id} />;
}
