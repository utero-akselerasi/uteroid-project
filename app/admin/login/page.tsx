"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/admin/AdminDashboard.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch("/portfolio-api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login gagal.");
      }
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal.");
      setBusy(false);
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.login}>
        <form className={styles.loginCard} onSubmit={onSubmit}>
          <div className={styles.eyebrow}>Utero Studio System</div>
          <h1>Admin Login</h1>
          <p className={styles.muted}>Kelola portofolio, banner, tipografi, studio, dan publikasi insights website dari satu kontrol pusat.</p>
          <div className={styles.formStack}>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.field}>
              <label>Username</label>
              <input name="username" autoComplete="username" required defaultValue="admin" />
            </div>
            <div className={styles.field}>
              <label>Password</label>
              <input name="password" type="password" autoComplete="current-password" required />
            </div>
            <button className={styles.primary} type="submit" disabled={busy}>
              {busy ? "Memeriksa…" : "Masuk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
