import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Target, Lock, Mail, Search, ArrowRight, ChevronRight, Star, Users, Briefcase, TrendingUp, MapPin, Clock, Zap, Shield, Bell, ArrowUpRight, Play } from "lucide-react";

/* ─── DATA ─────────────────────────────────────────────────────── */
const offresRecentes = [
  { id:1, poste:"Développeur Full Stack React/Django", entreprise:"Orange Cameroun", ville:"Douala", type:"CDI", date:"Il y a 2j", logo:"OC", couleur:"#FF6600", salaire:"450k–650k FCFA" },
  { id:2, poste:"Responsable Marketing Digital", entreprise:"MTN Cameroun", ville:"Yaoundé", type:"CDD", date:"Il y a 3j", logo:"MT", couleur:"#FFCC00", salaire:"380k–500k FCFA" },
  { id:3, poste:"Comptable Expérimenté(e)", entreprise:"Afriland First Bank", ville:"Douala", type:"CDI", date:"Il y a 5j", logo:"AF", couleur:"#4f46e5", salaire:"500k–700k FCFA" },
  { id:4, poste:"Ingénieur Réseaux & Systèmes", entreprise:"Camtel", ville:"Yaoundé", type:"CDI", date:"Il y a 1j", logo:"CA", couleur:"#0891b2", salaire:"420k–580k FCFA" },
  { id:5, poste:"Designer UX/UI Mobile", entreprise:"Express Union", ville:"Douala", type:"Stage", date:"Il y a 6j", logo:"EU", couleur:"#059669", salaire:"180k–250k FCFA" },
  { id:6, poste:"Data Analyst Junior", entreprise:"CCA Bank", ville:"Bafoussam", type:"CDI", date:"Il y a 4j", logo:"CC", couleur:"#7c3aed", salaire:"400k–550k FCFA" },
];

const etapes = [
  { num:"01", titre:"Créez votre profil", desc:"Inscrivez-vous en 2 minutes. Renseignez compétences, formations et expériences.", icon:Users },
  { num:"02", titre:"Notre IA analyse", desc:"Notre moteur de matching compare votre profil avec des milliers d'offres disponibles.", icon:Zap },
  { num:"03", titre:"Postulez & décrochez", desc:"Recevez des offres ciblées et postulez en un clic. Notifié à chaque étape.", icon:Bell },
];

const stats = [
  { valeur:"2 400+", label:"Offres publiées" },
  { valeur:"850+", label:"Entreprises" },
  { valeur:"12 000+", label:"Candidats" },
  { valeur:"78%", label:"Taux de placement" },
];

const chatbotResponses = {
  bonjour: "Bonjour ! Je suis l'assistant PlacementPro. Comment puis-je vous aider ?",
  inscription: "Pour vous inscrire, cliquez sur « S'inscrire » en haut. Candidat : rapide avec email + mot de passe. Recruteur : documents d'entreprise requis.",
  offres: "Nous avons plus de 2 400 offres : tech, finance, marketing, santé et bien plus. Rendez-vous sur « Nos Offres » !",
  recruteur: "L'inscription recruteur nécessite une vérification (24–48h) : registre de commerce, certificat d'immatriculation et patente.",
  matching: "Notre algorithme analyse vos compétences, votre expérience et vos préférences pour des offres parfaitement ciblées.",
  "mot de passe": "Cliquez sur « Connexion » puis « Mot de passe oublié ». Vous recevrez un email de réinitialisation.",
  gratuit: "PlacementPro est entièrement gratuit pour les candidats ! Les recruteurs ont aussi un accès de base sans frais.",
  default: "Je peux vous aider sur : l'inscription, les offres, le matching, les recruteurs, ou le mot de passe.",
};

function getChatbotReply(msg) {
  const m = msg.toLowerCase();
  for (const k of Object.keys(chatbotResponses)) {
    if (k !== "default" && m.includes(k)) return chatbotResponses[k];
  }
  return chatbotResponses.default;
}

/* ─── UNSPLASH ─────────────────────────────────────────────────── */
const IMG_HERO   = "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=85&fit=crop";
const IMG_ABOUT  = "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80&fit=crop";
const IMG_CITY   = "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1400&q=80&fit=crop";

/* ─── CSS ──────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Serif:ital@0;1&display=swap');

:root {
  --ink:    #08090d;
  --ink-2:  #111318;
  --ink-3:  #1c1f28;
  --lime:   #c8f135;
  --lime-2: rgba(200,241,53,.12);
  --lime-3: rgba(200,241,53,.06);
  --white:  #ffffff;
  --off:    #f5f5f0;
  --muted:  #888a94;
  --muted-2:#4a4d58;
  --border: rgba(255,255,255,0.07);
  --font-h: 'Cabinet Grotesk', system-ui, sans-serif;
  --font-s: 'Instrument Serif', Georgia, serif;
}

.hx *, .hx *::before, .hx *::after { box-sizing:border-box; margin:0; padding:0; }
.hx a { text-decoration:none; color:inherit; }
.hx button { font-family:var(--font-h); }

.hx { font-family:var(--font-h); background:var(--ink); color:var(--white); overflow-x:hidden; }

/* ── NAV ── */
.hx-nav {
  position:fixed; top:0; left:0; right:0; z-index:300;
  display:flex; align-items:center; justify-content:space-between;
  padding:0 56px; height:68px;
  background:rgba(8,9,13,0); transition:background .3s, border-color .3s;
  border-bottom:.5px solid transparent;
}
.hx-nav.scrolled {
  background:rgba(8,9,13,.92); backdrop-filter:blur(20px);
  border-color:var(--border);
}
.hx-logo {
  font-family:var(--font-h); font-size:20px; font-weight:900;
  letter-spacing:-.3px; color:var(--white); display:flex; align-items:center; gap:8px;
}
.hx-logo-dot { width:8px; height:8px; border-radius:50%; background:var(--lime); box-shadow:0 0 12px var(--lime); }
.hx-nav-links { display:flex; align-items:center; gap:0; }
.hx-nav-link {
  padding:7px 16px; border-radius:100px; font-size:13px; font-weight:500;
  color:rgba(255,255,255,.5); transition:all .18s; white-space:nowrap;
}
.hx-nav-link:hover { color:var(--white); }
.hx-nav-link.active { color:var(--white); background:rgba(255,255,255,.07); }
.hx-nav-right { display:flex; align-items:center; gap:8px; }
.hx-btn-login {
  padding:9px 20px; border-radius:100px; font-size:13px; font-weight:600;
  color:rgba(255,255,255,.6); background:transparent; border:.5px solid var(--border);
  cursor:pointer; transition:all .18s;
}
.hx-btn-login:hover { color:var(--white); border-color:rgba(255,255,255,.2); }
.hx-btn-signup {
  padding:9px 22px; border-radius:100px; font-size:13px; font-weight:700;
  color:var(--ink); background:var(--lime); border:none; cursor:pointer;
  transition:all .2s; box-shadow:0 4px 20px rgba(200,241,53,.25);
}
.hx-btn-signup:hover { background:#d8ff44; transform:translateY(-1px); box-shadow:0 8px 28px rgba(200,241,53,.35); }

/* ── HERO ── */
.hx-hero {
  position:relative; min-height:100vh; display:flex; flex-direction:column;
  justify-content:flex-end; overflow:hidden;
  padding:0 56px 72px;
}
.hx-hero-bg {
  position:absolute; inset:0;
  background:linear-gradient(to bottom, rgba(8,9,13,.2) 0%, rgba(8,9,13,.5) 50%, rgba(8,9,13,.95) 100%);
  z-index:1;
}
.hx-hero-img {
  position:absolute; inset:0; object-fit:cover; width:100%; height:100%;
}
.hx-hero-content { position:relative; z-index:2; max-width:1200px; margin:0 auto; width:100%; }
.hx-hero-row { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:flex-end; }

.hx-hero-tag {
  display:inline-flex; align-items:center; gap:8px;
  background:rgba(200,241,53,.15); border:.5px solid rgba(200,241,53,.3);
  padding:6px 16px; border-radius:100px;
  font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
  color:var(--lime); margin-bottom:24px;
}
.hx-blink { width:5px; height:5px; border-radius:50%; background:var(--lime); animation:hxblink 1.8s infinite; }
@keyframes hxblink { 0%,100%{opacity:1} 50%{opacity:.2} }

.hx-hero h1 {
  font-family:var(--font-h); font-size:clamp(44px,6vw,76px);
  font-weight:900; line-height:.96; letter-spacing:-2.5px;
  color:var(--white); margin-bottom:28px;
  text-transform:uppercase;
}
.hx-hero h1 em {
  font-family:var(--font-s); font-style:italic; font-weight:400;
  text-transform:none; color:var(--lime); letter-spacing:-1px;
  font-size:clamp(48px,6.5vw,82px);
}

.hx-hero-search {
  display:flex; align-items:center;
  background:rgba(255,255,255,.06); border:.5px solid rgba(255,255,255,.12);
  border-radius:14px; overflow:hidden; backdrop-filter:blur(12px);
  max-width:520px; margin-bottom:32px;
  transition:border-color .2s;
}
.hx-hero-search:focus-within { border-color:rgba(200,241,53,.4); }
.hx-hero-search input {
  flex:1; background:transparent; border:none; outline:none;
  padding:14px 18px; font-family:var(--font-h); font-size:14px; color:var(--white);
}
.hx-hero-search input::placeholder { color:rgba(255,255,255,.3); }
.hx-search-btn {
  padding:12px 22px; background:var(--lime); color:var(--ink);
  border:none; font-family:var(--font-h); font-size:13px; font-weight:700;
  cursor:pointer; display:flex; align-items:center; gap:6px; flex-shrink:0;
  transition:background .18s;
}
.hx-search-btn:hover { background:#d8ff44; }

.hx-hero-stats { display:flex; gap:32px; }
.hx-hstat { display:flex; flex-direction:column; }
.hx-hstat-val {
  font-family:var(--font-h); font-size:28px; font-weight:900; color:var(--white);
  letter-spacing:-1px; line-height:1;
}
.hx-hstat-label { font-size:11px; color:rgba(255,255,255,.35); margin-top:4px; text-transform:uppercase; letter-spacing:.8px; }

.hx-hero-right { display:flex; flex-direction:column; align-items:flex-end; gap:20px; padding-bottom:8px; }
.hx-hero-cards { display:flex; flex-direction:column; gap:12px; width:100%; max-width:320px; }
.hx-hero-card {
  background:rgba(255,255,255,.07); backdrop-filter:blur(20px);
  border:.5px solid rgba(255,255,255,.12); border-radius:16px;
  padding:16px 18px; display:flex; align-items:center; gap:14px;
  animation:hxfloat 4s ease-in-out infinite;
}
.hx-hero-card:nth-child(2) { animation-delay:1.5s; }
@keyframes hxfloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
.hx-card-ico {
  width:40px; height:40px; border-radius:12px; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
}
.hx-card-label { font-size:10px; color:rgba(255,255,255,.4); margin-bottom:3px; text-transform:uppercase; letter-spacing:.8px; }
.hx-card-val { font-family:var(--font-h); font-size:18px; font-weight:800; color:var(--white); line-height:1; }

.hx-scroll-hint {
  display:flex; align-items:center; gap:10px;
  font-size:11px; color:rgba(255,255,255,.3); letter-spacing:1px; text-transform:uppercase;
  margin-top:20px;
}
.hx-scroll-line { width:40px; height:1px; background:rgba(255,255,255,.2); }

/* ── TICKER ── */
.hx-ticker {
  background:var(--lime); padding:13px 0; overflow:hidden; position:relative;
}
.hx-ticker-inner {
  display:flex; gap:48px; white-space:nowrap;
  animation:hxticker 22s linear infinite;
}
@keyframes hxticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
.hx-ticker-item {
  display:flex; align-items:center; gap:10px;
  font-family:var(--font-h); font-size:12px; font-weight:700;
  color:var(--ink); text-transform:uppercase; letter-spacing:1.5px; flex-shrink:0;
}
.hx-ticker-sep { width:5px; height:5px; border-radius:50%; background:rgba(8,9,13,.25); }

/* ── ABOUT ── */
.hx-about { background:var(--off); padding:0; overflow:hidden; }
.hx-about-grid { display:grid; grid-template-columns:1fr 1fr; min-height:640px; }
.hx-about-img-side { position:relative; overflow:hidden; }
.hx-about-img-side img { width:100%; height:100%; object-fit:cover; display:block; }
.hx-about-img-overlay {
  position:absolute; inset:0;
  background:linear-gradient(to right, rgba(8,9,13,0) 60%, var(--off) 100%);
}
.hx-about-content {
  background:var(--off); padding:80px 64px 80px 56px;
  display:flex; flex-direction:column; justify-content:center;
}
.hx-eyebrow-dark {
  display:inline-flex; align-items:center; gap:8px;
  font-size:10px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase;
  color:var(--ink); margin-bottom:18px; opacity:.4;
}
.hx-eyebrow-dark::before { content:''; width:20px; height:1px; background:var(--ink); }
.hx-section-h {
  font-family:var(--font-h); font-size:clamp(30px,4vw,48px);
  font-weight:900; line-height:.98; letter-spacing:-2px; color:var(--ink);
  margin-bottom:20px; text-transform:uppercase;
}
.hx-section-h em { font-family:var(--font-s); font-style:italic; font-weight:400; letter-spacing:-1px; text-transform:none; }
.hx-section-sub { font-size:14px; color:var(--muted); line-height:1.75; margin-bottom:32px; max-width:400px; }

.hx-features { display:flex; flex-direction:column; gap:12px; }
.hx-feature {
  display:flex; gap:14px; align-items:flex-start; padding:16px;
  background:white; border-radius:14px; border:.5px solid rgba(0,0,0,.06);
  transition:all .25s;
}
.hx-feature:hover { transform:translateX(6px); border-color:rgba(200,241,53,.5); background:#fcfce8; }
.hx-feature-ico {
  width:38px; height:38px; border-radius:11px; background:var(--ink);
  display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.hx-feature-title { font-size:14px; font-weight:700; color:var(--ink); margin-bottom:2px; }
.hx-feature-desc { font-size:12px; color:var(--muted); line-height:1.5; }

/* ── OFFRES ── */
.hx-offres { background:var(--ink-2); padding:96px 56px; }
.hx-offres-inner { max-width:1200px; margin:0 auto; }
.hx-offres-head { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:40px; gap:16px; flex-wrap:wrap; }
.hx-eyebrow-light {
  display:inline-flex; align-items:center; gap:8px;
  font-size:10px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase;
  color:var(--lime); margin-bottom:14px;
}
.hx-eyebrow-light::before { content:''; width:20px; height:1px; background:var(--lime); }
.hx-section-h-light {
  font-family:var(--font-h); font-size:clamp(28px,4vw,48px);
  font-weight:900; line-height:.98; letter-spacing:-2px; color:var(--white);
  text-transform:uppercase; margin-bottom:6px;
}
.hx-section-h-light em { font-family:var(--font-s); font-style:italic; font-weight:400; letter-spacing:-1px; text-transform:none; }
.hx-offres-link {
  display:inline-flex; align-items:center; gap:6px;
  font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase;
  color:var(--lime); border:.5px solid rgba(200,241,53,.25);
  padding:10px 20px; border-radius:100px;
  transition:all .2s; flex-shrink:0;
}
.hx-offres-link:hover { background:var(--lime); color:var(--ink); }

.hx-offres-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
@media (max-width:900px) { .hx-offres-grid { grid-template-columns:1fr 1fr; } }

.hx-offre {
  background:var(--ink-3); border:.5px solid var(--border);
  border-radius:18px; padding:20px; cursor:pointer;
  transition:all .28s cubic-bezier(.22,1,.36,1);
  display:flex; flex-direction:column; gap:14px;
}
.hx-offre:hover { border-color:rgba(200,241,53,.3); transform:translateY(-4px); background:rgba(200,241,53,.04); }
.hx-offre-top { display:flex; justify-content:space-between; align-items:flex-start; }
.hx-offre-logo {
  width:42px; height:42px; border-radius:11px;
  display:flex; align-items:center; justify-content:center;
  font-size:12px; font-weight:800; color:#fff; flex-shrink:0;
}
.hx-type-pill {
  font-size:9px; font-weight:800; padding:4px 10px; border-radius:100px;
  letter-spacing:.8px; text-transform:uppercase; border:.5px solid;
}
.hx-type-cdi   { background:rgba(200,241,53,.1);  color:var(--lime);    border-color:rgba(200,241,53,.2); }
.hx-type-cdd   { background:rgba(251,191,36,.1);  color:#fbbf24;        border-color:rgba(251,191,36,.2); }
.hx-type-stage { background:rgba(52,211,153,.1);  color:#34d399;        border-color:rgba(52,211,153,.2); }

.hx-offre-title {
  font-family:var(--font-h); font-size:14px; font-weight:700;
  color:var(--white); line-height:1.3;
}
.hx-offre-co { font-size:12px; color:var(--muted); margin-top:3px; }
.hx-offre-meta { display:flex; gap:10px; flex-wrap:wrap; }
.hx-offre-meta span { display:flex; align-items:center; gap:4px; font-size:11px; color:var(--muted-2); }
.hx-offre-salary {
  font-size:12px; font-weight:700; color:var(--lime);
  background:var(--lime-2); padding:4px 10px; border-radius:100px; display:inline-block;
}
.hx-offre-foot {
  display:flex; align-items:center; justify-content:space-between;
  border-top:.5px solid var(--border); padding-top:12px;
}
.hx-offre-link-btn {
  display:flex; align-items:center; gap:4px;
  font-size:11px; font-weight:700; color:var(--muted);
  text-transform:uppercase; letter-spacing:.8px;
  transition:color .18s;
}
.hx-offre:hover .hx-offre-link-btn { color:var(--lime); }

/* ── HOW + CHAT ── */
.hx-how { background:var(--off); padding:96px 56px; }
.hx-how-grid { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:80px; }

.hx-steps { display:flex; flex-direction:column; margin-top:36px; }
.hx-step { display:flex; gap:22px; }
.hx-step-left { display:flex; flex-direction:column; align-items:center; }
.hx-step-num {
  width:48px; height:48px; border-radius:14px; background:var(--ink);
  display:flex; align-items:center; justify-content:center;
  font-family:var(--font-h); font-size:15px; font-weight:900; color:var(--lime);
  flex-shrink:0; transition:background .2s, transform .2s;
}
.hx-step:hover .hx-step-num { background:var(--lime); color:var(--ink); transform:scale(1.08); }
.hx-step-line { width:2px; flex:1; background:rgba(8,9,13,.08); min-height:40px; }
.hx-step-body { padding:8px 0 36px; }
.hx-step-title { font-size:16px; font-weight:800; color:var(--ink); margin-bottom:6px; letter-spacing:-.3px; }
.hx-step-desc { font-size:13px; color:var(--muted); line-height:1.7; }

/* ── CHATBOT ── */
.hx-chat { background:var(--ink); border-radius:20px; overflow:hidden; border:.5px solid var(--border); }
.hx-chat-hd {
  background:var(--ink-3); padding:18px 20px;
  display:flex; align-items:center; justify-content:space-between;
  border-bottom:.5px solid var(--border);
}
.hx-chat-hd-left { display:flex; align-items:center; gap:12px; }
.hx-chat-av {
  width:38px; height:38px; border-radius:50%; background:var(--lime-2);
  border:.5px solid rgba(200,241,53,.3); display:flex; align-items:center;
  justify-content:center; font-size:18px;
}
.hx-chat-name { font-size:13px; font-weight:700; color:var(--white); }
.hx-chat-status { display:flex; align-items:center; gap:5px; margin-top:2px; }
.hx-chat-dot { width:5px; height:5px; border-radius:50%; background:var(--lime); animation:hxblink 2s infinite; }
.hx-chat-dot-txt { font-size:10px; color:rgba(255,255,255,.35); }
.hx-chat-live {
  font-size:9px; font-weight:700; letter-spacing:1px; text-transform:uppercase;
  background:var(--lime-2); color:var(--lime); padding:4px 10px; border-radius:100px;
  border:.5px solid rgba(200,241,53,.2);
}

.hx-msgs { height:240px; overflow-y:auto; padding:18px; display:flex; flex-direction:column; gap:10px; scroll-behavior:smooth; }
.hx-msgs::-webkit-scrollbar { width:3px; }
.hx-msgs::-webkit-scrollbar-thumb { background:var(--muted-2); border-radius:99px; }
.hx-msg { max-width:84%; padding:10px 14px; border-radius:14px; font-size:13px; line-height:1.55; }
.hx-msg-bot { background:var(--ink-3); border:.5px solid var(--border); color:rgba(255,255,255,.8); border-bottom-left-radius:4px; align-self:flex-start; }
.hx-msg-user { background:var(--lime); color:var(--ink); font-weight:600; border-bottom-right-radius:4px; align-self:flex-end; }

.hx-chips { padding:10px 18px; display:flex; gap:6px; flex-wrap:wrap; border-bottom:.5px solid var(--border); }
.hx-chip {
  padding:5px 12px; border-radius:100px; font-size:11px; font-weight:600;
  background:var(--ink-3); color:rgba(255,255,255,.5); cursor:pointer;
  border:.5px solid var(--border); transition:all .15s; font-family:var(--font-h);
}
.hx-chip:hover { background:var(--lime); color:var(--ink); border-color:var(--lime); }
.hx-input-row { display:flex; gap:8px; padding:14px 18px; }
.hx-chat-input {
  flex:1; background:var(--ink-3); border:.5px solid var(--border);
  border-radius:10px; padding:10px 14px; font-size:13px; font-family:var(--font-h);
  color:var(--white); outline:none; transition:border-color .2s;
}
.hx-chat-input::placeholder { color:var(--muted-2); }
.hx-chat-input:focus { border-color:rgba(200,241,53,.4); }
.hx-send {
  background:var(--lime); color:var(--ink); border:none; border-radius:10px;
  padding:10px 18px; font-size:12px; font-weight:800; cursor:pointer;
  font-family:var(--font-h); text-transform:uppercase; letter-spacing:.8px;
  transition:background .18s;
}
.hx-send:hover { background:#d8ff44; }

/* ── CTA ── */
.hx-cta { position:relative; overflow:hidden; }
.hx-cta-img { width:100%; height:480px; object-fit:cover; display:block; filter:brightness(.3); }
.hx-cta-over {
  position:absolute; inset:0;
  background:linear-gradient(135deg, rgba(8,9,13,.95) 0%, rgba(8,9,13,.7) 100%);
  display:flex; align-items:center; justify-content:center; padding:56px;
}
.hx-cta-content { max-width:640px; text-align:center; }
.hx-cta-h {
  font-family:var(--font-h); font-size:clamp(32px,5vw,56px);
  font-weight:900; line-height:.95; letter-spacing:-2px;
  color:var(--white); margin-bottom:16px; text-transform:uppercase;
}
.hx-cta-h em { font-family:var(--font-s); font-style:italic; font-weight:400; text-transform:none; color:var(--lime); }
.hx-cta-sub { font-size:14px; color:rgba(255,255,255,.45); margin-bottom:36px; line-height:1.65; }
.hx-cta-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
.hx-cta-primary {
  padding:14px 32px; border-radius:100px; font-family:var(--font-h);
  font-size:13px; font-weight:800; letter-spacing:.5px; text-transform:uppercase;
  color:var(--ink); background:var(--lime); border:none; cursor:pointer;
  transition:all .2s; box-shadow:0 8px 32px rgba(200,241,53,.3);
}
.hx-cta-primary:hover { transform:translateY(-2px); box-shadow:0 12px 40px rgba(200,241,53,.4); }
.hx-cta-secondary {
  padding:14px 28px; border-radius:100px; font-family:var(--font-h);
  font-size:13px; font-weight:600; color:rgba(255,255,255,.6);
  background:transparent; border:.5px solid rgba(255,255,255,.2); cursor:pointer;
  transition:all .2s;
}
.hx-cta-secondary:hover { border-color:rgba(255,255,255,.5); color:var(--white); }

/* ── FOOTER ── */
.hx-footer { background:var(--ink); padding:40px 56px; border-top:.5px solid var(--border); }
.hx-footer-inner { max-width:1200px; margin:0 auto; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; }
.hx-footer-logo { font-size:18px; font-weight:900; color:var(--white); display:flex; align-items:center; gap:8px; }
.hx-footer-copy { font-size:12px; color:rgba(255,255,255,.2); margin-top:6px; }
.hx-footer-links { display:flex; gap:24px; }
.hx-footer-link { font-size:13px; color:rgba(255,255,255,.3); transition:color .2s; }
.hx-footer-link:hover { color:rgba(255,255,255,.7); }

/* ── ANIMATIONS ── */
@keyframes ppFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
.hxA  { opacity:0; transform:translateY(30px); transition:opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1); }
.hxAL { opacity:0; transform:translateX(-30px); transition:opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1); }
.hxAR { opacity:0; transform:translateX(30px); transition:opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1); }
.hxV  { opacity:1 !important; transform:none !important; }

@media (max-width:960px) {
  .hx-nav { padding:0 20px; }
  .hx-nav-links { display:none; }
  .hx-hero { padding:0 24px 56px; }
  .hx-hero-row { grid-template-columns:1fr; }
  .hx-hero-right { display:none; }
  .hx-about-grid { grid-template-columns:1fr; }
  .hx-about-img-side { height:300px; }
  .hx-about-content { padding:48px 24px; }
  .hx-offres { padding:64px 24px; }
  .hx-offres-grid { grid-template-columns:1fr 1fr; }
  .hx-how { padding:64px 24px; }
  .hx-how-grid { grid-template-columns:1fr; gap:48px; }
  .hx-cta-over { padding:32px 24px; }
  .hx-footer { padding:32px 24px; }
}
@media (max-width:580px) {
  .hx-offres-grid { grid-template-columns:1fr; }
}
`;

/* ─── SCROLL ANIM ──────────────────────────────────────────────── */
function useAnim() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const delay = parseInt(e.target.dataset.delay || "0");
          setTimeout(() => e.target.classList.add("hxV"), delay);
        }
      });
    }, { threshold: 0.08 });
    const t = setTimeout(() => {
      document.querySelectorAll(".hxA,.hxAL,.hxAR").forEach(el => obs.observe(el));
    }, 100);
    return () => { clearTimeout(t); obs.disconnect(); };
  }, []);
}

/* ────────────────────────────────────────────────────────────────  */
const TICKER_ITEMS = ["2 400 Offres disponibles","850 Entreprises vérifiées","12 000 Candidats inscrits","78% Taux de placement","Matching IA instantané","100% Gratuit pour les candidats"];

export default function Home() {
  useAnim();
  const styleRef  = useRef(false);
  const [scrolled, setScrolled] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [messages, setMessages] = useState([{ from:"bot", text:"Bonjour 👋 Je suis votre assistant PlacementPro. Comment puis-je vous aider ?" }]);
  const [inputChat, setInputChat] = useState("");
  const navigate = useNavigate();
  const msgEnd = useRef(null);

  useEffect(() => {
    if (!styleRef.current) {
      const s = document.createElement("style");
      s.textContent = CSS;
      document.head.appendChild(s);
      styleRef.current = true;
    }
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const handleSearch = e => { e.preventDefault(); navigate(`/offres?q=${recherche}`); };

  const send = (t) => {
    const txt = t || inputChat; if (!txt.trim()) return;
    setMessages(p => [...p, { from:"user", text:txt }, { from:"bot", text:getChatbotReply(txt) }]);
    setInputChat("");
  };

  const typeClass = { CDI:"hx-type-cdi", CDD:"hx-type-cdd", Stage:"hx-type-stage" };

  return (
    <div className="hx">

      {/* NAV */}
      <nav className={`hx-nav${scrolled?" scrolled":""}`}>
        <div className="hx-logo"><div className="hx-logo-dot"/>PlacementPro</div>
        <div className="hx-nav-links">
          {[{l:"Accueil",to:"/"},{l:"Nos Offres",to:"/offres"},{l:"À propos",to:"/a-propos"},{l:"FAQ",to:"/faq"}].map((x,i) => (
            <Link key={x.l} to={x.to} className={`hx-nav-link${i===0?" active":""}`}>{x.l}</Link>
          ))}
        </div>
        <div className="hx-nav-right">
          <Link to="/connexion"><button className="hx-btn-login">Connexion</button></Link>
          <Link to="/inscription"><button className="hx-btn-signup">S'inscrire</button></Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hx-hero">
        <img src={IMG_HERO} className="hx-hero-img" alt="Professionnels" />
        <div className="hx-hero-bg"/>
        <div className="hx-hero-content">
          <div className="hx-hero-row">
            <div>
              <div className="hx-hero-tag"><div className="hx-blink"/>🇨🇲 Plateforme n°1 au Cameroun</div>
              <h1>Trouvez<br />l'emploi qui<br />vous <em>correspond</em></h1>
              <form className="hx-hero-search" onSubmit={handleSearch}>
                <Search size={16} color="rgba(255,255,255,.3)" style={{marginLeft:16,flexShrink:0}}/>
                <input type="text" placeholder="Poste, compétence, entreprise..." value={recherche} onChange={e=>setRecherche(e.target.value)}/>
                <button type="submit" className="hx-search-btn"><Search size={14}/>Chercher</button>
              </form>
              <div className="hx-hero-stats">
                {stats.map((s,i) => (
                  <div key={s.label} style={{display:"flex",alignItems:"center",gap:32}}>
                    <div className="hx-hstat">
                      <span className="hx-hstat-val">{s.valeur}</span>
                      <span className="hx-hstat-label">{s.label}</span>
                    </div>
                    {i < stats.length-1 && <div style={{width:1,height:36,background:"rgba(255,255,255,.1)"}}/>}
                  </div>
                ))}
              </div>
            </div>

            <div className="hx-hero-right">
              <div className="hx-hero-cards">
                <div className="hx-hero-card">
                  <div className="hx-card-ico" style={{background:"rgba(200,241,53,.12)"}}>
                    <TrendingUp size={20} color="var(--lime)"/>
                  </div>
                  <div>
                    <div className="hx-card-label">Taux de réussite</div>
                    <div className="hx-card-val">78% placés</div>
                  </div>
                </div>
                <div className="hx-hero-card">
                  <div className="hx-card-ico" style={{background:"rgba(255,255,255,.06)"}}>
                    <Zap size={20} color="rgba(255,255,255,.6)"/>
                  </div>
                  <div>
                    <div className="hx-card-label">Matching IA</div>
                    <div className="hx-card-val">Instantané</div>
                  </div>
                </div>
                <div className="hx-hero-card">
                  <div className="hx-card-ico" style={{background:"rgba(200,241,53,.12)"}}>
                    <Shield size={20} color="var(--lime)"/>
                  </div>
                  <div>
                    <div className="hx-card-label">Entreprises</div>
                    <div className="hx-card-val">Vérifiées ✓</div>
                  </div>
                </div>
              </div>
              <div className="hx-scroll-hint">
                <div className="hx-scroll-line"/> Défilez pour explorer
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="hx-ticker">
        <div className="hx-ticker-inner">
          {[...TICKER_ITEMS,...TICKER_ITEMS].map((item,i) => (
            <div key={i} className="hx-ticker-item">
              {item}<div className="hx-ticker-sep"/>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section className="hx-about">
        <div className="hx-about-grid">
          <div className="hx-about-img-side hxAL" data-delay="0">
            <img src={IMG_ABOUT} alt="Équipe en réunion"/>
            <div className="hx-about-img-overlay"/>
            <div style={{position:"absolute",bottom:32,left:32,background:"var(--lime)",borderRadius:16,padding:"16px 20px"}}>
              <div style={{fontFamily:"var(--font-h)",fontSize:32,fontWeight:900,color:"var(--ink)",lineHeight:1}}>96%</div>
              <div style={{fontSize:11,color:"rgba(8,9,13,.6)",marginTop:4,fontWeight:600}}>UTILISATEURS SATISFAITS</div>
            </div>
          </div>
          <div className="hx-about-content hxAR" data-delay="80">
            <div className="hx-eyebrow-dark">Qui sommes-nous</div>
            <h2 className="hx-section-h">Bien plus<br />qu'une<br /><em>simple plateforme</em></h2>
            <p className="hx-section-sub">
              Né d'un constat simple — la difficulté pour les jeunes diplômés camerounais de trouver un emploi adapté — PlacementPro transforme la façon dont talents et entreprises se rencontrent.
            </p>
            <div className="hx-features">
              {[
                { icon:Target, titre:"Matching intelligent", desc:"Algorithme multicritères pour des opportunités parfaitement ciblées." },
                { icon:Shield, titre:"Entreprises vérifiées", desc:"Chaque recruteur est validé manuellement par notre équipe." },
                { icon:Bell,   titre:"Suivi en temps réel",  desc:"Notifications email à chaque étape de votre candidature." },
              ].map(f => (
                <div key={f.titre} className="hx-feature">
                  <div className="hx-feature-ico"><f.icon size={18} color="var(--lime)"/></div>
                  <div>
                    <div className="hx-feature-title">{f.titre}</div>
                    <div className="hx-feature-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* OFFRES */}
      <section className="hx-offres">
        <div className="hx-offres-inner">
          <div className="hx-offres-head hxA" data-delay="0">
            <div>
              <div className="hx-eyebrow-light">Opportunités récentes</div>
              <h2 className="hx-section-h-light">Les dernières<br /><em>offres</em></h2>
              <p style={{fontSize:13,color:"var(--muted)",marginTop:6}}>Explorez sans connexion — postulez après inscription</p>
            </div>
            <Link to="/offres" className="hx-offres-link">Voir tout <ArrowUpRight size={14}/></Link>
          </div>
          <div className="hx-offres-grid">
            {offresRecentes.map((o,i) => (
              <div key={o.id} className="hx-offre hxA" data-delay={i*70}>
                <div className="hx-offre-top">
                  <div className="hx-offre-logo" style={{background:o.couleur}}>{o.logo}</div>
                  <span className={`hx-type-pill ${typeClass[o.type]||""}`}>{o.type}</span>
                </div>
                <div>
                  <div className="hx-offre-title">{o.poste}</div>
                  <div className="hx-offre-co">{o.entreprise}</div>
                </div>
                <div className="hx-offre-meta">
                  <span><MapPin size={10}/>{o.ville}</span>
                  <span><Clock size={10}/>{o.date}</span>
                </div>
                <span className="hx-offre-salary">{o.salaire}</span>
                <div className="hx-offre-foot">
                  <Link to={`/offres/${o.id}`} className="hx-offre-link-btn">Voir l'offre <ArrowUpRight size={11}/></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW + CHAT */}
      <section className="hx-how">
        <div className="hx-how-grid">
          <div className="hxAL" data-delay="60">
            <div className="hx-eyebrow-dark">Comment ça marche</div>
            <h2 className="hx-section-h">Décrochez en<br /><em>3 étapes</em></h2>
            <div className="hx-steps">
              {etapes.map((e,i) => (
                <div key={e.num} className="hx-step hxA" data-delay={100+i*90}>
                  <div className="hx-step-left">
                    <div className="hx-step-num">{e.num}</div>
                    {i < etapes.length-1 && <div className="hx-step-line"/>}
                  </div>
                  <div className="hx-step-body">
                    <div className="hx-step-title">{e.titre}</div>
                    <div className="hx-step-desc">{e.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hxAR" data-delay="100">
            <div className="hx-eyebrow-dark" style={{marginBottom:12}}>Assistant virtuel</div>
            <h2 className="hx-section-h" style={{marginBottom:20}}>Une <em>question ?</em></h2>
            <div className="hx-chat">
              <div className="hx-chat-hd">
                <div className="hx-chat-hd-left">
                  <div className="hx-chat-av">🤖</div>
                  <div>
                    <div className="hx-chat-name">Assistant PlacementPro</div>
                    <div className="hx-chat-status">
                      <div className="hx-chat-dot"/><span className="hx-chat-dot-txt">En ligne</span>
                    </div>
                  </div>
                </div>
                <span className="hx-chat-live">Live</span>
              </div>
              <div className="hx-msgs">
                {messages.map((m,i) => (
                  <div key={i} className={`hx-msg ${m.from==="bot"?"hx-msg-bot":"hx-msg-user"}`}>{m.text}</div>
                ))}
                <div ref={msgEnd}/>
              </div>
              <div className="hx-chips">
                {["Inscription","Matching","Gratuit ?","Recruteur"].map(s => (
                  <button key={s} className="hx-chip" onClick={()=>send(s)}>{s}</button>
                ))}
              </div>
              <div className="hx-input-row">
                <input className="hx-chat-input" type="text" placeholder="Posez votre question…"
                  value={inputChat} onChange={e=>setInputChat(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&send()}/>
                <button className="hx-send" onClick={()=>send()}>Envoyer</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hx-cta">
        <img src={IMG_CITY} alt="Douala" className="hx-cta-img"/>
        <div className="hx-cta-over">
          <div className="hx-cta-content hxA" data-delay="60">
            <h2 className="hx-cta-h">Prêt à booster<br /><em>votre carrière ?</em></h2>
            <p className="hx-cta-sub">Rejoignez les 12 000+ candidats et 850+ entreprises qui font confiance à PlacementPro.</p>
            <div className="hx-cta-btns">
              <Link to="/inscription"><button className="hx-cta-primary">Créer mon compte gratuit</button></Link>
              <Link to="/offres"><button className="hx-cta-secondary">Explorer les offres</button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="hx-footer">
        <div className="hx-footer-inner">
          <div>
            <div className="hx-footer-logo"><div className="hx-logo-dot"/>PlacementPro</div>
            <div className="hx-footer-copy">© 2025 PlacementPro — Tous droits réservés — Cameroun</div>
          </div>
          <div className="hx-footer-links">
            {["Nos Offres","À propos","FAQ","Connexion"].map(l => <a key={l} href="#" className="hx-footer-link">{l}</a>)}
          </div>
        </div>
      </footer>

    </div>
  );
}