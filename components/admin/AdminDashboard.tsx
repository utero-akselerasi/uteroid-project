"use client";

import { useEffect, useMemo, useState } from "react";
import { projects as legacyProjects } from "@/lib/projects";
import type { Project } from "@/lib/types";
import styles from "./AdminDashboard.module.css";

type Status = "draft" | "published" | "archived";
type AdminProject = Project & { id?: number; status: Status; publishedAt?: string; createdAt?: string; updatedAt?: string };
type SessionResponse = { authenticated: boolean; csrfToken: string };
type MediaItem = { id:number; mediaType:string; url:string; filename:string; sortOrder:number };

const disciplines = ["identity","packaging","signage","campaign","print","digital","exhibition","indoor","outdoor"] as const;
const industries = ["fnb","corporate","government","education","property","retail","arts","event","services","products"] as const;

const emptyProject = (): AdminProject => ({
  slug:"",routeSlug:"",title:"",client:"",year:new Date().getFullYear().toString(),category:"",industry:"services",
  disciplines:["identity"],shortDescription:"",description:"",coverImage:"",featured:false,priority:0,tags:[],
  galleryImages:[],details:{scope:[],challenge:"",solution:""},status:"draft",
});

async function api(path: string, options: RequestInit = {}, csrfToken = "") {
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (csrfToken) headers.set("X-CSRF-Token", csrfToken);
  const response = await fetch(`/portfolio-api/${path}`, { ...options, headers, credentials: "same-origin", cache: "no-store" });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Permintaan gagal");
  return data;
}

export default function AdminDashboard() {
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [checking, setChecking] = useState(true);
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [editing, setEditing] = useState<AdminProject | null>(null);
  const [settings, setSettings] = useState(false);
  const [projectQuery, setProjectQuery] = useState("");
  const [clientQuery, setClientQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);

  async function loadProjects() {
    const data = await api("admin/projects");
    setProjects(data);
  }
  useEffect(() => {
    api("admin/auth/session").then((data) => { setSession(data); return loadProjects(); }).catch(() => setSession(null)).finally(() => setChecking(false));
  }, []);
  useEffect(()=>{if(session&&editing?.id){api(`admin/projects/${editing.id}/media`).then(setMedia).catch(()=>setMedia([]))}else{setMedia([])}},[session,editing?.id]);

  const years = useMemo(() => [...new Set(projects.map((project) => project.year).filter(Boolean))].sort((a, b) => b.localeCompare(a)), [projects]);
  const filtered = useMemo(() => projects.filter((project) => {
    const projectText = `${project.title} ${project.routeSlug}`.toLowerCase();
    const clientText = project.client.toLowerCase();
    return projectText.includes(projectQuery.toLowerCase())
      && clientText.includes(clientQuery.toLowerCase())
      && (yearFilter === "all" || project.year === yearFilter)
      && (statusFilter === "all" || project.status === statusFilter);
  }), [projects, projectQuery, clientQuery, yearFilter, statusFilter]);
  const stats = useMemo(() => ({
    total: projects.length,
    published: projects.filter((item) => item.status === "published").length,
    draft: projects.filter((item) => item.status === "draft").length,
    archived: projects.filter((item) => item.status === "archived").length,
    featured: projects.filter((item) => item.featured).length,
  }), [projects]);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const data = await api("admin/auth/login", { method:"POST", body:JSON.stringify({username:form.get("username"),password:form.get("password"),totpCode:form.get("totpCode")}) });
      setSession(data); await loadProjects();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Login gagal"); } finally { setBusy(false); }
  }
  async function logout() { if (!session) return; await api("admin/auth/logout",{method:"POST"},session.csrfToken);setSession(null);setProjects([]); }
  async function changePassword(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); if(!session)return;const form=new FormData(event.currentTarget);const next=String(form.get("newPassword")||"");if(next!==form.get("confirmation")){setError("Konfirmasi password tidak sama.");return}setBusy(true);setError("");try{await api("admin/auth/change-password",{method:"POST",body:JSON.stringify({currentPassword:form.get("currentPassword"),newPassword:next})},session.csrfToken);setSession(null);setNotice("");}catch(caught){setError(caught instanceof Error?caught.message:"Password gagal diubah")}finally{setBusy(false)} }
  async function importLegacy() {
    if (!session || projects.length > 0 || !confirm("Impor 34 proyek lokal ke backend?")) return;
    setBusy(true); setError("");
    try { const payload = legacyProjects.map((project) => ({...project,status:"published"})); const result=await api("admin/projects/import",{method:"POST",body:JSON.stringify(payload)},session.csrfToken);setNotice(`${result.imported} proyek berhasil diimpor.`);await loadProjects(); }
    catch(caught){setError(caught instanceof Error?caught.message:"Impor gagal");}finally{setBusy(false)}
  }
  async function saveProject(project: AdminProject) {
    if (!session) return; setBusy(true); setError("");setNotice("");
    try {
      const path = project.id ? `admin/projects/${project.id}` : "admin/projects";
      const result = await api(path,{method:project.id?"PUT":"POST",body:JSON.stringify(project)},session.csrfToken);
      setNotice("Proyek tersimpan.");setEditing(result);await loadProjects();
    } catch(caught){setError(caught instanceof Error?caught.message:"Penyimpanan gagal");}finally{setBusy(false)}
  }
  async function removeProject(project: AdminProject) { if(!session||!project.id||!confirm(`Arsipkan dan hapus ${project.title} dari dashboard?`))return;await api(`admin/projects/${project.id}`,{method:"DELETE"},session.csrfToken);setEditing(null);await loadProjects(); }
  async function upload(project: AdminProject, mediaType: string, file?: File) {
    if(!session||!project.id||!file)return;setBusy(true);setError("");const form=new FormData();form.set("file",file);form.set("mediaType",mediaType);form.set("altText",project.title);
    try{await api(`admin/projects/${project.id}/media`,{method:"POST",body:form},session.csrfToken);const refreshed=await api(`admin/projects/${project.id}`);setEditing(refreshed);setMedia(await api(`admin/projects/${project.id}/media`));await loadProjects();setNotice("Media berhasil diunggah.");}catch(caught){setError(caught instanceof Error?caught.message:"Upload gagal");}finally{setBusy(false)}
  }
  async function deleteMedia(project:AdminProject,item:MediaItem){if(!session||!project.id||!confirm(`Hapus ${item.filename}?`))return;await api(`admin/projects/${project.id}/media/${item.id}`,{method:"DELETE"},session.csrfToken);setMedia(await api(`admin/projects/${project.id}/media`));setEditing(await api(`admin/projects/${project.id}`));await loadProjects()}
  async function moveMedia(project:AdminProject,item:MediaItem,direction:-1|1){if(!session||!project.id)return;const same=media.filter(value=>value.mediaType===item.mediaType);const index=same.findIndex(value=>value.id===item.id);const target=index+direction;if(target<0||target>=same.length)return;[same[index],same[target]]=[same[target],same[index]];await api(`admin/projects/${project.id}/media/order`,{method:"PUT",body:JSON.stringify({ids:same.map(value=>value.id)})},session.csrfToken);setMedia(await api(`admin/projects/${project.id}/media`))}
  async function migrateMedia(project:AdminProject){if(!session||!project.id||!confirm(`Pindahkan media ${project.title} ke storage S3?`))return;setBusy(true);setError("");try{const result=await api(`admin/projects/${project.id}/migrate-media`,{method:"POST"},session.csrfToken);setEditing(await api(`admin/projects/${project.id}`));setMedia(await api(`admin/projects/${project.id}/media`));await loadProjects();setNotice(`${result.migrated} file media dipindahkan ke S3.`)}catch(caught){setError(caught instanceof Error?caught.message:"Migrasi media gagal")}finally{setBusy(false)}}

  if (checking) return <div className={styles.root}><div className={styles.loading}>Memeriksa sesi…</div></div>;
  if (!session) return <div className={styles.root}><div className={styles.login}><form className={styles.loginCard} onSubmit={login}><div className={styles.eyebrow}>Utero Portfolio System</div><h1>Admin Login</h1><p className={styles.muted}>Kelola proyek, publikasi, dan media dari satu dashboard.</p><div className={styles.formStack}>{error&&<div className={styles.error}>{error}</div>}<Field label="Username"><input name="username" autoComplete="username" required defaultValue="admin" /></Field><Field label="Password"><input name="password" type="password" autoComplete="current-password" required /></Field><Field label="Kode TOTP"><input name="totpCode" inputMode="numeric" autoComplete="one-time-code" placeholder="Opsional jika belum diaktifkan" /></Field><button className={styles.primary} disabled={busy}>{busy?"Memeriksa…":"Masuk Dashboard"}</button></div></form></div></div>;

  return <div className={styles.root}><div className={styles.shell}>
    <aside className={styles.sidebar}><div className={styles.brand}>UTERO.ID<span> •</span></div><div className={styles.sideMeta}>PORTFOLIO ADMIN</div><div className={styles.nav}><button className={!editing&&!settings?styles.active:""} onClick={()=>{setEditing(null);setSettings(false)}}>Daftar proyek</button><button className={editing?styles.active:""} onClick={()=>{setEditing(emptyProject());setSettings(false)}}>Tambah proyek</button><button className={settings?styles.active:""} onClick={()=>{setEditing(null);setSettings(true)}}>Keamanan</button></div><div className={styles.sideBottom}><button className={styles.ghost} onClick={()=>window.open("/work","_blank")}>Lihat website</button><button className={styles.danger} onClick={logout}>Keluar</button></div></aside>
    <main className={styles.main}>{error&&<div className={styles.error}>{error}</div>}{notice&&<div className={styles.success}>{notice}</div>}
      {settings ? <form className={styles.editor} onSubmit={changePassword}><div className={styles.editorHead}><div><div className={styles.eyebrow}>Account Security</div><h2>Ganti password</h2></div></div><div className={styles.formStack}><Field label="Password sekarang"><input name="currentPassword" type="password" autoComplete="current-password" required/></Field><Field label="Password baru"><input name="newPassword" type="password" autoComplete="new-password" minLength={16} required/></Field><Field label="Konfirmasi password"><input name="confirmation" type="password" autoComplete="new-password" minLength={16} required/></Field><p className={styles.muted}>Minimal 16 karakter. Semua sesi akan dicabut setelah password berubah.</p><button className={styles.primary} disabled={busy}>{busy?"Memproses…":"Ganti password"}</button></div></form> : editing ? <ProjectEditor project={editing} media={media} busy={busy} onChange={setEditing} onSave={saveProject} onDelete={removeProject} onDeleteMedia={deleteMedia} onMoveMedia={moveMedia} onUpload={upload} onMigrate={migrateMedia} onBack={()=>setEditing(null)} /> : <>
        <header className={styles.topbar}><div><div className={styles.eyebrow}>Archive Management</div><h1>Work</h1><p className={styles.muted}>Kelola portofolio publik dan status publikasi.</p></div><div className={styles.actions}>{projects.length===0&&<button className={styles.secondary} disabled={busy} onClick={importLegacy}>Impor 34 proyek lama</button>}<button className={styles.primary} onClick={()=>setEditing(emptyProject())}>+ Proyek baru</button></div></header>
        <div className={styles.stats}><Stat label="Total" value={stats.total}/><Stat label="Published" value={stats.published}/><Stat label="Draft" value={stats.draft}/><Stat label="Archived" value={stats.archived}/><Stat label="Featured" value={stats.featured}/></div>
        <div className={styles.toolbar}><input aria-label="Filter nama proyek" placeholder="Nama proyek…" value={projectQuery} onChange={(event)=>setProjectQuery(event.target.value)}/><input aria-label="Filter nama client" placeholder="Nama client…" value={clientQuery} onChange={(event)=>setClientQuery(event.target.value)}/><select aria-label="Filter tahun" value={yearFilter} onChange={(event)=>setYearFilter(event.target.value)}><option value="all">Semua tahun</option>{years.map((year)=><option key={year} value={year}>{year}</option>)}</select><select aria-label="Filter status" value={statusFilter} onChange={(event)=>setStatusFilter(event.target.value)}><option value="all">Semua status</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></div>
        <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Proyek</th><th>Client</th><th>Tahun</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{filtered.map((project)=><tr key={project.id}><td><div className={styles.projectCell}>{project.coverImage?<img className={styles.thumb} src={project.coverImage} alt=""/>:<div className={styles.thumb}/>}<div><div className={styles.title}>{project.title}</div><div className={styles.slug}>/work/{project.routeSlug}</div></div></div></td><td>{project.client}</td><td>{project.year}</td><td><span className={`${styles.status} ${styles[project.status]}`}>{project.status}</span></td><td><div className={styles.rowActions}><button onClick={()=>setEditing(project)}>Edit</button><button onClick={()=>window.open(`/admin/preview/${project.id}`,"_blank")}>Preview</button></div></td></tr>)}</tbody></table></div>
      </>}
    </main>
  </div></div>;
}

function Field({label,children,className=""}:{label:string;children:React.ReactNode;className?:string}){return <div className={`${styles.field} ${className}`}><label>{label}</label>{children}</div>}
function Stat({label,value}:{label:string;value:number}){return <div className={styles.stat}><strong>{value}</strong><span>{label}</span></div>}
function split(value:string){return value.split("\n").map((item)=>item.trim()).filter(Boolean)}

function ProjectEditor({project,media,busy,onChange,onSave,onDelete,onDeleteMedia,onMoveMedia,onUpload,onMigrate,onBack}:{project:AdminProject;media:MediaItem[];busy:boolean;onChange:(p:AdminProject)=>void;onSave:(p:AdminProject)=>void;onDelete:(p:AdminProject)=>void;onDeleteMedia:(p:AdminProject,item:MediaItem)=>void;onMoveMedia:(p:AdminProject,item:MediaItem,direction:-1|1)=>void;onUpload:(p:AdminProject,type:string,file?:File)=>void;onMigrate:(p:AdminProject)=>void;onBack:()=>void}){
  const set=<K extends keyof AdminProject>(key:K,value:AdminProject[K])=>onChange({...project,[key]:value});
  const details=project.details||{};
  return <div className={styles.editor}><div className={styles.editorHead}><div><div className={styles.eyebrow}>{project.id?`Project #${project.id}`:"New Project"}</div><h2>{project.title||"Proyek baru"}</h2></div><button className={styles.ghost} onClick={onBack}>← Kembali</button></div>
    <div className={styles.grid2}><Field label="Judul"><input value={project.title} onChange={(e)=>set("title",e.target.value)} required/></Field><Field label="Client"><input value={project.client} onChange={(e)=>set("client",e.target.value)} required/></Field><Field label="Slug internal"><input value={project.slug} onChange={(e)=>set("slug",e.target.value.toLowerCase())}/></Field><Field label="Slug URL"><input value={project.routeSlug} onChange={(e)=>set("routeSlug",e.target.value.toLowerCase())}/></Field><Field label="Tahun"><input value={project.year} onChange={(e)=>set("year",e.target.value)}/></Field><Field label="Kategori"><input value={project.category} onChange={(e)=>set("category",e.target.value)}/></Field><Field label="Industri"><select value={project.industry} onChange={(e)=>set("industry",e.target.value as AdminProject["industry"])}>{industries.map((item)=><option key={item}>{item}</option>)}</select></Field><Field label="Status"><select value={project.status} onChange={(e)=>set("status",e.target.value as Status)}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></Field><Field label="Ringkasan" className={styles.wide}><textarea value={project.shortDescription} onChange={(e)=>set("shortDescription",e.target.value)}/></Field><Field label="Deskripsi" className={styles.wide}><textarea value={project.description} onChange={(e)=>set("description",e.target.value)}/></Field></div>
    <section className={styles.section}><h3>Disiplin & metadata</h3><div className={styles.checkGrid}>{disciplines.map((item)=><label className={styles.check} key={item}><input type="checkbox" checked={project.disciplines.includes(item)} onChange={(e)=>set("disciplines",e.target.checked?[...project.disciplines,item]:project.disciplines.filter((value)=>value!==item))}/>{item}</label>)}<label className={styles.check}><input type="checkbox" checked={!!project.featured} onChange={(e)=>set("featured",e.target.checked)}/>Featured</label></div><div className={styles.grid2} style={{marginTop:18}}><Field label="Tags, satu per baris"><textarea value={(project.tags||[]).join("\n")} onChange={(e)=>set("tags",split(e.target.value))}/></Field><Field label="Scope, satu per baris"><textarea value={(details.scope||[]).join("\n")} onChange={(e)=>set("details",{...details,scope:split(e.target.value)})}/></Field></div></section>
    <section className={styles.section}><h3>Studi kasus</h3><div className={styles.grid2}><Field label="Challenge"><textarea value={details.challenge||""} onChange={(e)=>set("details",{...details,challenge:e.target.value})}/></Field><Field label="Solution"><textarea value={details.solution||""} onChange={(e)=>set("details",{...details,solution:e.target.value})}/></Field></div></section>
    <section className={styles.section}><h3>Media S3</h3>{!project.id?<p className={styles.muted}>Simpan proyek dahulu sebelum mengunggah media.</p>:<><div className={styles.mediaGrid}>{["cover","hover","gallery","deck"].map((type)=><label className={styles.upload} key={type}><strong>{type.toUpperCase()}</strong><p className={styles.muted}>JPEG, PNG, atau WebP. Maksimal 20 MB.</p><input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(e)=>onUpload(project,type,e.target.files?.[0])}/></label>)}</div>{project.coverImage.startsWith("/projects/")&&<button className={styles.secondary} style={{marginTop:18}} disabled={busy} onClick={()=>onMigrate(project)}>Pindahkan media lama ke S3</button>}{media.length>0&&<div className={styles.tableWrap} style={{marginTop:18}}><table className={styles.table}><thead><tr><th>Media</th><th>Tipe</th><th>Urutan</th><th>Aksi</th></tr></thead><tbody>{media.map((item)=><tr key={item.id}><td><div className={styles.projectCell}><img className={styles.thumb} src={item.url} alt=""/><span>{item.filename}</span></div></td><td>{item.mediaType}</td><td>{item.sortOrder+1}</td><td><div className={styles.rowActions}><button onClick={()=>onMoveMedia(project,item,-1)} type="button">↑</button><button onClick={()=>onMoveMedia(project,item,1)} type="button">↓</button><button onClick={()=>onDeleteMedia(project,item)} type="button">Hapus</button></div></td></tr>)}</tbody></table></div>}</>}</section>
    <div className={styles.footerActions}><div>{project.id&&<button className={styles.danger} onClick={()=>onDelete(project)}>Hapus proyek</button>}</div><div className={styles.actions}><button className={styles.ghost} onClick={onBack}>Batal</button><button className={styles.primary} disabled={busy} onClick={()=>onSave(project)}>{busy?"Menyimpan…":"Simpan proyek"}</button></div></div>
  </div>
}
