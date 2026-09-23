const slugs = ["stamford","jmt","lacamino","techlink","sfi","yin-yam","maitri","wismari","garageplug","mcc"];
(async () => {
  for (const slug of slugs) {
    try {
      const res = await fetch("http://localhost:3000/work/" + slug);
      const html = await res.text();
      const m = html.match(/<h1 class="pd-ident__title">([^<]*)<\/h1>/);
      const imgs = [...html.matchAll(/<img [^>]*>/g)].map(x => x[0]);
      const cover = imgs.find(i => i.includes("cover.webp"));
      const eager = cover && cover.includes('loading="eager"');
      const fp = cover && cover.includes('fetchPriority="high"');
      console.log(slug.padEnd(22), res.status, "| ident=" + (m ? JSON.stringify(m[1]) : "MISSING"), "| coverEager=" + eager, "coverFP=" + fp, "coverPresent=" + !!cover);
    } catch (e) {
      console.log(slug.padEnd(22), "FAIL", e.message);
    }
  }
})();