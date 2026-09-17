/**
 * PROTIC Oprec 2026/2027 - Division Constants (src/js/constants/divisions.js)
 *
 * Single source of truth untuk daftar divisi, ikon, deskripsi tugas, dan keahlian yang dicari.
 * Jika pengurus periode selanjutnya ingin mengubah/menambah/menghapus divisi,
 * cukup sunting berkas data ini.
 */
window.PROTIC = window.PROTIC || {};

window.PROTIC.DIVISIONS = {
  "WEB": {
    name: "Web Development",
    icon: "img/icon/web.svg",
    desc: "Pengembangan website responsif organisasi, rancang bangun frontend & backend, dan integrasi API web.",
    skills: ["HTML/CSS", "JavaScript", "Frameworks", "REST API"]
  },
  "UI/UX": {
    name: "UI/UX Design",
    icon: "img/icon/ui.svg",
    desc: "Riset kebutuhan pengguna, perancangan antarmuka visual UI, wireframing sistematis, dan prototipe interaktif.",
    skills: ["Figma", "Wireframing", "UX Research", "Prototyping"]
  },
  "MOBILE": {
    name: "Mobile Development",
    icon: "img/icon/mobile.svg",
    desc: "Pengembangan aplikasi mobile Android & iOS, integrasi layanan API, dan arsitektur performa app.",
    skills: ["Flutter", "Kotlin", "Mobile UI", "API Integration"]
  },
  "DEVOPS": {
    name: "DevOps & System Admin",
    icon: "img/icon/devops.svg",
    desc: "Pengelolaan server Linux/Cloud, otomasi CI/CD, deployment aplikasi, serta pemantauan keandalan sistem.",
    skills: ["Linux", "Git & CI/CD", "Cloud/Server", "Docker"]
  },
  "DATA": {
    name: "Data & Artificial Intelligence",
    icon: "img/icon/data.svg",
    desc: "Pengolahan & visualisasi data organisasi, otomasi analitik, serta pengenalan dasar kecerdasan buatan.",
    skills: ["Python", "Data Mining", "AI Basics", "Visualization"]
  },
  "HUMAS": {
    name: "Humas (Hubungan Masyarakat)",
    icon: "img/icon/humas.svg",
    desc: "Komunikasi eksternal & internal organisasi, perluasan networking industri, dan kolaborasi kemitraan.",
    skills: ["Public Relations", "Networking", "Partnership", "Event Handling"]
  },
  "KOMINFO": {
    name: "Kominfo",
    icon: "img/icon/kominfo.svg",
    desc: "Branding media sosial organisasi, pembuatan konten grafis kreatif, dokumentasi multimedia, dan publikasi.",
    skills: ["Content Creation", "Social Media", "Desain Grafis", "Copywriting"]
  },
  "SEKRETARIS": {
    name: "Sekretaris",
    icon: "img/icon/sekretaris.svg",
    desc: "Pengelolaan administrasi resmi organisasi, persuratan, notulensi rapat, serta pengarsipan dokumen dan proposal kegiatan.",
    skills: ["Administrasi", "Notulensi", "Persuratan", "Dokumentasi"]
  },
  "SEKRE": {
    name: "Sekretaris",
    icon: "img/icon/sekretaris.svg",
    desc: "Pengelolaan administrasi resmi organisasi, persuratan, notulensi rapat, serta pengarsipan dokumen dan proposal kegiatan.",
    skills: ["Administrasi", "Notulensi", "Persuratan", "Dokumentasi"]
  },
  "BENDAHARA": {
    name: "Bendahara",
    icon: "img/icon/bendahara.svg",
    desc: "Pengelolaan keuangan organisasi, budgeting program kerja, pencatatan cash flow kas, serta penyusunan LPJ keuangan.",
    skills: ["Budgeting", "Bookkeeping", "Cash Flow", "LPJ Keuangan"]
  }
};
