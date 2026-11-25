export interface ContactChannel {
  id: string;
  label: string;
  value: string;
  href: string;
  type: "whatsapp" | "email" | "social";
}

export const whatsappAdmins = [
  { name: "Admin 1", number: "0819 9990 0900", href: "https://wa.me/6281999900900" },
  { name: "Admin 2", number: "0817 388 616", href: "https://wa.me/62817388616" },
  { name: "Admin 3", number: "0896 2143 9416", href: "https://wa.me/6289621439416" },
  { name: "Admin 4", number: "0851 7964 5737", href: "https://wa.me/6285179645737" },
  { name: "Admin 5", number: "0895 1789 8767", href: "https://wa.me/6289517898767" },
];

export const contactChannels: ContactChannel[] = [
  ...whatsappAdmins.map((admin, index) => ({
    id: `whatsapp-admin-${index + 1}`,
    label: `WhatsApp — ${admin.name}`,
    value: admin.number,
    href: admin.href,
    type: "whatsapp" as const,
  })),
  {
    id: "email",
    label: "Email",
    value: "marketingutero@gmail.com",
    href: "mailto:marketingutero@gmail.com",
    type: "email",
  },
  {
    id: "instagram",
    label: "Instagram",
    value: "@uteroindonesia",
    href: "https://www.instagram.com/uteroindonesia/?hl=en",
    type: "social",
  },
  {
    id: "facebook",
    label: "Facebook",
    value: "Utero Advertising Indonesia",
    href: "https://www.facebook.com/uteroadvertisingindonesia/",
    type: "social",
  },
  {
    id: "youtube",
    label: "YouTube",
    value: "@uteroindonesia",
    href: "https://www.youtube.com/@uteroindonesia",
    type: "social",
  },
];

export const studioLocation = {
  city: "Malang",
  region: "East Java",
  country: "Indonesia",
  address: "Jl. Bantaran 1 No.25, Tulusrejo, Kec. Lowokwaru, Kota Malang, Jawa Timur 65141",
  mapsUrl: "https://maps.google.com/?q=Jl.+Bantaran+1+No.25,+Tulusrejo,+Lowokwaru,+Malang",
};
