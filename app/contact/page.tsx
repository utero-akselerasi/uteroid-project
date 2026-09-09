import type { Metadata } from "next";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Utero Indonesia in Malang. Start a design project or collaborate on strategic brand solutions.",
};

export default function ContactPage() {
  return (
    <section className="pt-28 md:pt-36 pb-24 bg-[#f5efe6] min-h-screen text-[#0a0a0a]">
      <div className="container-page">
        <RevealOnScroll>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#c91a1f]" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#c91a1f]">
              05 / START A CONVERSATION
            </span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={1}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-[#0a0a0a] mb-8">
            CONTACT.
          </h1>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-black/10 pt-12">
          {/* Left Column: Direct Inquiries */}
          <div className="lg:col-span-6 space-y-8">
            <RevealOnScroll delay={2}>
              <p className="text-xl md:text-2xl font-medium leading-relaxed text-[#0a0a0a]/90">
                Have a brand, product, digital experience, or space that needs to be designed with purpose? Let&apos;s build the solution together.
              </p>
            </RevealOnScroll>

            {/* Direct WhatsApp Links */}
            <RevealOnScroll delay={3}>
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#c91a1f] block">
                  Direct WhatsApp Connect
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="https://wa.me/6281999900900"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="CHAT"
                    className="flex items-center justify-between p-4 bg-white border border-black/10 hover:border-[#c91a1f] hover:bg-[#c91a1f] hover:text-white transition-all group no-underline text-[#0a0a0a]"
                  >
                    <div>
                      <span className="text-xs text-black/50 group-hover:text-white/80 block mb-0.5">
                        Client Relations
                      </span>
                      <span className="text-sm font-bold">
                        081 999 900 900 (Wahyu)
                      </span>
                    </div>
                    <span className="text-[#25D366] group-hover:text-white font-bold">&rarr;</span>
                  </a>

                  <a
                    href="https://wa.me/62817388616"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="CHAT"
                    className="flex items-center justify-between p-4 bg-white border border-black/10 hover:border-[#c91a1f] hover:bg-[#c91a1f] hover:text-white transition-all group no-underline text-[#0a0a0a]"
                  >
                    <div>
                      <span className="text-xs text-black/50 group-hover:text-white/80 block mb-0.5">
                        Studio Management
                      </span>
                      <span className="text-sm font-bold">
                        081 7388 616 (Utero)
                      </span>
                    </div>
                    <span className="text-[#25D366] group-hover:text-white font-bold">&rarr;</span>
                  </a>
                </div>
              </div>
            </RevealOnScroll>

            {/* Email & Studio Info */}
            <RevealOnScroll delay={4}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-black/10">
                <div>
                  <span className="text-xs uppercase tracking-widest text-black/50 block mb-1">
                    Email
                  </span>
                  <a
                    href="mailto:marketingutero@gmail.com"
                    data-cursor="EMAIL"
                    className="text-base font-bold text-[#0a0a0a] hover:text-[#c91a1f] transition-colors"
                  >
                    marketingutero@gmail.com
                  </a>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-widest text-black/50 block mb-1">
                    Studio Base
                  </span>
                  <p className="text-base font-bold text-[#0a0a0a] m-0">
                    Malang, East Java, Indonesia
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right Column: Social & Direct CTA Card */}
          <div className="lg:col-span-5 lg:col-start-8">
            <RevealOnScroll delay={3}>
              <div className="bg-[#0a0a0a] text-white p-8 md:p-10 space-y-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#c91a1f] block mb-2">
                    Studio Hours
                  </span>
                  <p className="text-lg font-bold">
                    Monday — Friday
                  </p>
                  <p className="text-sm text-white/60">
                    09:00 — 17:00 WIB (UTC+7)
                  </p>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#c91a1f] block mb-4">
                    Follow Our Channels
                  </span>
                  <div className="flex flex-col gap-3">
                    <a
                      href="https://www.instagram.com/uteroindonesia/?hl=en"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold uppercase tracking-wider text-white/80 hover:text-[#c91a1f] transition-colors flex justify-between items-center"
                    >
                      <span>Instagram</span>
                      <span>&nearr;</span>
                    </a>
                    <a
                      href="https://www.facebook.com/uteroadvertisingindonesia/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold uppercase tracking-wider text-white/80 hover:text-[#c91a1f] transition-colors flex justify-between items-center"
                    >
                      <span>Facebook</span>
                      <span>&nearr;</span>
                    </a>
                    <a
                      href="https://www.youtube.com/@uteroindonesia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold uppercase tracking-wider text-white/80 hover:text-[#c91a1f] transition-colors flex justify-between items-center"
                    >
                      <span>YouTube</span>
                      <span>&nearr;</span>
                    </a>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <p className="text-xs uppercase tracking-widest text-white/50">
                    Design as a Solution. Est. 1998 in Malang.
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
