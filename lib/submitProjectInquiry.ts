export interface ProjectInquiry {
  name: string;
  email: string;
  company: string;
  phone: string;
  disciplines: string[];
  brief: string;
  source: "contact-page" | "header-launcher";
}

export async function submitProjectInquiry(inquiry: ProjectInquiry) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inquiry),
  });

  if (!response.ok) {
    throw new Error("Unable to send project inquiry");
  }
}
