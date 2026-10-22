# Uteroid Project

## Overview
This project is managed by Utero Akselerasi.

## Setup

1. Clone the repository
2. Create your feature branch from `dev`
3. Commit your changes
4. Push to your branch and create a pull request

## Branch Structure
- `main` - Production/stable branch
- `dev` - Development integration branch
- `hammam-dev` - Hammam's development branch
# Portfolio dashboard

Dashboard tersedia pada `/admin`. Backend memakai Go, SQLite WAL, dan SeaweedFS sebagai object storage S3-compatible lokal.

1. Isi `.env` (gitignored) dengan `PORTFOLIO_API_URL=http://portfolio-api:8080/api/v1`, `ADMIN_PASSWORD` yang unik (minimal 16 karakter), `S3_ACCESS_KEY`, dan `S3_SECRET_KEY` acak. `FRONTEND_ORIGIN` harus sama persis dengan origin dashboard; untuk HTTPS tetapkan `COOKIE_SECURE=true`. Jangan jalankan contoh password dari `.env.example` di server publik.
2. Jalankan `docker compose up -d --build`.
3. Buka `http://localhost:3020/admin`, lalu login dengan `ADMIN_USERNAME` dan `ADMIN_PASSWORD`.
4. Pada database kosong, tekan **Impor 34 proyek lama** sekali. Data situs publik belum muncul sampai impor selesai.
5. Buka editor proyek dan tekan **Pindahkan media lama ke S3** untuk memigrasikan cover, hover, galeri, dan halaman deck. Kerjakan tiap proyek dan cek halaman publik. File statis lama tetap ada selama masa transisi.

Untuk development tanpa backend, biarkan `PORTFOLIO_API_URL` kosong: halaman publik memakai array lokal, sedangkan `/admin` membutuhkan backend aktif. Bila backend sudah dikonfigurasi tetapi tidak tersedia, halaman publik tidak membuka konten lokal yang mungkin telah ditarik dari publikasi.

`ADMIN_TOTP_SECRET` opsional, berupa secret Base32 yang dimasukkan manual ke aplikasi authenticator sebelum diaktifkan. Ganti password dari menu **Keamanan**; tindakan itu mencabut seluruh sesi. Backend menyimpan hash password saat pertama membuat database. Mengubah `ADMIN_PASSWORD` di `.env` sesudahnya **tidak** mengganti password akun yang sudah ada.

Data persisten berada di volume Docker `portfolio-db` dan `portfolio-objects`. Backup wajib mencakup kedua volume.
Jangan hapus volume saat upgrade. Cadangkan database SQLite secara konsisten (gunakan SQLite backup API atau hentikan backend lebih dulu), serta salin volume object storage. Periksa akses hanya lewat HTTPS sebelum membuka dashboard kepada publik.

## Project inquiry email

Form project inquiry mengirim email melalui Resend ke `marketingutero@gmail.com` dan `uterobranding@gmail.com`. Buat API key Resend, verifikasi domain pengirim, lalu isi `RESEND_API_KEY` dan `RESEND_FROM_EMAIL` pada `.env`. Contoh format pengirim: `Utero Website <inquiry@utero.id>`.
