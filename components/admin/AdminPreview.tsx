"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/types";
import styles from "./AdminDashboard.module.css";

export default function AdminPreview({ id }: { id: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch(`/portfolio-api/admin/projects/${encodeURIComponent(id)}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Sesi admin diperlukan untuk melihat draf.");
        return response.json();
      })
      .then(setProject).catch((caught) => setError(caught.message));
  }, [id]);

  return <div className={styles.root} style={{padding:"clamp(20px,5vw,70px)"}}>
    <Link href="/admin" className={styles.eyebrow}>← Kembali ke dashboard</Link>
    {error && <div className={styles.error} style={{marginTop:30}}>{error}</div>}
    {!error && !project && <div className={styles.loading}>Memuat pratinjau…</div>}
    {project && <article style={{maxWidth:1100,margin:"50px auto"}}>
      <div className={styles.eyebrow}>Pratinjau privat · {project.year}</div>
      <h1 style={{fontSize:"clamp(40px,8vw,100px)",letterSpacing:"-.07em",lineHeight:.95,margin:"16px 0"}}>{project.title}</h1>
      <p className={styles.muted}>{project.client} · {project.category} · {project.disciplines.join(" / ")}</p>
      {project.coverImage && <img src={project.coverImage} alt={project.title} style={{width:"100%",marginTop:30,objectFit:"cover",maxHeight:680}}/>}
      <p style={{fontSize:22,lineHeight:1.5,maxWidth:850,margin:"40px 0"}}>{project.description || project.shortDescription}</p>
      <div className={styles.grid2} style={{marginBottom:40}}><div><h2>Tantangan</h2><p>{project.details?.challenge}</p></div><div><h2>Solusi</h2><p>{project.details?.solution}</p></div></div>
      <div className={styles.grid2}>{project.galleryImages?.map((src,index)=><img key={`${src}-${index}`} src={src} alt={`${project.title} · ${index+1}`} style={{width:"100%"}}/>)}</div>
    </article>}
  </div>;
}
