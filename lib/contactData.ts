export interface ContactChannel {
  id: string;
  label: string;
  value: string;
  href: string;
  type: "whatsapp" | "email" | "social";
}

export const contactChannels: ContactChannel[] = [
  {
    id: "whatsapp-wahyu",
    label: "WhatsApp — Client Relations",
    value: "081 999 900 900 (Wahyu)",
    href: "https://wa.me/6281999900900",
    type: "whatsapp",
  },
  {
    id: "whatsapp-utero",
    label: "WhatsApp — Studio Management",
    value: "081 7388 616 (Utero)",
    href: "https://wa.me/62817388616",
    type: "whatsapp",
  },
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
  address: "Jl. Bantaran 1 No. 25, Purwantoro, Blimbing, Malang, Jawa Timur 65141, Indonesia",
  mapsUrl: "https://maps.google.com/?q=Utero+Indonesia+Malang",
};
