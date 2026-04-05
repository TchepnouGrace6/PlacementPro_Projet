import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, Building2, ArrowLeft, CheckCircle2, 
  UploadCloud, ChevronRight, ShieldCheck, Zap, 
  Briefcase, Globe 
} from "lucide-react";
import { inscriptionCandidat, inscriptionRecruteur } from "../../api/auth";

/* ─── STYLES CSS (À extraire ou laisser en balise style) ───────── */
const REGISTER_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800&family=Instrument+Serif:ital@0;1&display=swap');

  :root {
    --ink: #08090d;
    --ink-2: #111318;
    --lime: #c8f135;
    --muted: #888a94;
    --border: rgba(255, 255, 255, 0.08);
  }

  .reg-root {
    display: flex;
    min-height: 100vh;
    background: var(--ink);
    color: white;
    font-family: 'Cabinet Grotesk', sans-serif;
  }

  /* --- LEFT SIDE: VISUAL --- */
  .reg-visual {
    flex: 1.2;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
  }

  .reg-bg-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.5;
    filter: grayscale(100%) contrast(110%);
    transition: transform 10s ease;
  }
  .reg-visual:hover .reg-bg-img { transform: scale(1.1); }

  .reg-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, var(--ink) 0%, transparent 50%, var(--ink) 100%),
                linear-gradient(to bottom, transparent 60%, var(--ink) 100%);
  }

  .reg-floating-card {
    position: relative;
    z-index: 10;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    padding: 40px;
    border-radius: 32px;
    max-width: 440px;
    animation: regFloat 6s ease-in-out infinite;
  }

  @keyframes regFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }

  .reg-card-tag {
    background: var(--lime);
    color: black;
    font-size: 11px;
    font-weight: 800;
    padding: 4px 12px;
    border-radius: 100px;
    text-transform: uppercase;
    display: inline-block;
    margin-bottom: 20px;
  }

  .reg-floating-card h2 {
    font-family: 'Instrument Serif', serif;
    font-size: 42px;
    font-style: italic;
    line-height: 1;
    margin-bottom: 16px;
  }

  /* --- RIGHT SIDE: FORM --- */
  .reg-form-side {
    flex: 1;
    padding: 60px 80px;
    overflow-y: auto;
    border-left: 1px solid var(--border);
    display: flex;
    flex-direction: column;
  }

  .reg-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 48px;
  }

  .reg-back {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--muted);
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s;
  }
  .reg-back:hover { color: var(--lime); }

  .reg-title { font-size: 32px; font-weight: 800; letter-spacing: -1px; margin-bottom: 8px; }
  .reg-subtitle { color: var(--muted); margin-bottom: 40px; }

  /* Role Selection */
  .reg-roles {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 40px;
  }

  .reg-role-card {
    background: var(--ink-2);
    border: 1px solid var(--border);
    padding: 24px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }

  .reg-role-card.active {
    border-color: var(--lime);
    background: rgba(200, 241, 53, 0.03);
    box-shadow: 0 0 30px rgba(200, 241, 53, 0.05);
  }

  .reg-role-card .icon-box {
    width: 48px;
    height: 48px;
    background: var(--ink);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    color: var(--muted);
    transition: color 0.3s;
  }
  .reg-role-card.active .icon-box { color: var(--lime); }

  .reg-role-card h4 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
  .reg-role-card p { font-size: 12px; color: var(--muted); }

  /* Inputs */
  .reg-field { margin-bottom: 24px; }
  .reg-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
  }

  .reg-input {
    width: 100%;
    background: var(--ink-2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 18px;
    color: white;
    font-family: inherit;
    transition: all 0.2s;
  }
  .reg-input:focus {
    outline: none;
    border-color: var(--lime);
    background: var(--ink);
  }

  /* File Dropzone */
  .reg-dropzone {
    border: 1px dashed var(--border);
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    background: rgba(255,255,255,0.02);
    cursor: pointer;
    transition: all 0.2s;
  }
  .reg-dropzone:hover { border-color: var(--lime); background: rgba(200, 241, 53, 0.02); }
  .reg-dropzone-text { font-size: 12px; color: var(--muted); }

  .reg-submit {
    width: 100%;
    background: var(--lime);
    color: black;
    border: none;
    padding: 18px;
    border-radius: 14px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .reg-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(200, 241, 53, 0.2); }
  .reg-submit:disabled { opacity: 0.5; }

  @media (max-width: 1024px) {
    .reg-visual { display: none; }
    .reg-form-side { padding: 40px 24px; }
  }
`;

export default function Register() {
  const [role, setRole] = useState("candidat");
  const [chargement, setChargement] = useState(false);
  const [succes, setSucces] = useState("");
  const [erreur, setErreur] = useState("");
  const navigate = useNavigate();

  const [formCandidat, setFormCandidat] = useState({ email: "", password: "", confirm: "" });
  const [formRecruteur, setFormRecruteur] = useState({
    email: "", password: "",
    nom_entreprise: "", secteur_activite: "", ville: "",
    adresse: "", telephone: "", description: "",
    taille_entreprise: "Petite (1-50)",
    registre_commerce: null,
    certificat_immatriculation: null,
    patente: null,
  });

  const handleCandidat = (e) => setFormCandidat({ ...formCandidat, [e.target.name]: e.target.value });

  const handleRecruteur = (e) => {
    if (e.target.type === "file") {
      setFormRecruteur({ ...formRecruteur, [e.target.name]: e.target.files[0] });
    } else {
      setFormRecruteur({ ...formRecruteur, [e.target.name]: e.target.value });
    }
  };

  const submitCandidat = async (e) => {
    e.preventDefault();
    setErreur("");
    if (formCandidat.password !== formCandidat.confirm) {
      setErreur("Les mots de passe ne correspondent pas.");
      return;
    }
    setChargement(true);
    try {
      await inscriptionCandidat({ email: formCandidat.email, password: formCandidat.password });
      navigate("/connexion?inscrit=1");
    } catch (err) {
      setErreur(err.response?.data?.email?.[0] || "Erreur lors de l'inscription.");
    } finally {
      setChargement(false);
    }
  };

  const submitRecruteur = async (e) => {
    e.preventDefault();
    setErreur("");
    setChargement(true);
    try {
      const data = new FormData();
      Object.entries(formRecruteur).forEach(([k, v]) => { if (v) data.append(k, v); });
      await inscriptionRecruteur(data);
      setSucces("Votre demande est en cours de validation par nos experts.");
    } catch (err) {
      setErreur("Veuillez vérifier tous les champs requis.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="reg-root">
      <style>{REGISTER_STYLES}</style>

      {/* --- CÔTÉ GAUCHE : VISUEL --- */}
      <div className="reg-visual">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070" 
          alt="Business" 
          className="reg-bg-img" 
        />
        <div className="reg-overlay" />
        
        <div className="reg-floating-card">
          <div className="reg-card-tag">Certification</div>
          <h2>Propulsez votre<br /><em>avenir dès ici.</em></h2>
          <p style={{color: 'var(--muted)', fontSize: '15px', lineHeight: '1.6'}}>
            Plus qu'une simple plateforme de recrutement, PlacementPro est l'écosystème 
            qui transforme le marché de l'emploi au Cameroun.
          </p>
          <div style={{display: 'flex', gap: '12px', marginTop: '30px'}}>
             <div style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'12px'}}>
                <ShieldCheck size={16} color="var(--lime)"/> Entreprises vérifiées
             </div>
             <div style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'12px'}}>
                <Globe size={16} color="var(--lime)"/> Partout au Cameroun
             </div>
          </div>
        </div>
      </div>

      {/* --- CÔTÉ DROIT : FORMULAIRE --- */}
      <div className="reg-form-side">
        <nav className="reg-nav">
          <Link to="/" className="reg-back">
            <ArrowLeft size={16} /> Retour
          </Link>
          <div style={{fontWeight: 800, fontSize: '18px'}}>
            Placement<span style={{color: 'var(--lime)'}}>Pro</span>
          </div>
        </nav>

        <div style={{maxWidth: '480px', width: '100%', margin: '0 auto'}}>
          <h1 className="reg-title">Créer un compte</h1>
          <p className="reg-subtitle">Déjà membre ? <Link to="/connexion" style={{color: 'var(--lime)', textDecoration: 'none'}}>Connectez-vous</Link></p>

          <label className="reg-label">Je souhaite m'inscrire en tant que</label>
          <div className="reg-roles">
            <div 
              className={`reg-role-card ${role === "candidat" ? "active" : ""}`}
              onClick={() => setRole("candidat")}
            >
              <div className="icon-box"><User size={20} /></div>
              <h4>Candidat</h4>
              <p>Je cherche un emploi</p>
              {role === "candidat" && <CheckCircle2 size={16} style={{position:'absolute', top: 12, right: 12, color:'var(--lime)'}}/>}
            </div>
            <div 
              className={`reg-role-card ${role === "recruteur" ? "active" : ""}`}
              onClick={() => setRole("recruteur")}
            >
              <div className="icon-box"><Building2 size={20} /></div>
              <h4>Recruteur</h4>
              <p>Je cherche des talents</p>
              {role === "recruteur" && <CheckCircle2 size={16} style={{position:'absolute', top: 12, right: 12, color:'var(--lime)'}}/>}
            </div>
          </div>

          {erreur && <div style={{background:'rgba(239,68,68,0.1)', color:'#f87171', padding:'12px', borderRadius:'8px', marginBottom:'20px', fontSize:'14px'}}>{erreur}</div>}
          {succes && <div style={{background:'rgba(200,241,53,0.1)', color:'var(--lime)', padding:'12px', borderRadius:'8px', marginBottom:'20px', fontSize:'14px'}}>{succes}</div>}

          {role === "candidat" ? (
            <form onSubmit={submitCandidat} className="hxA">
              <div className="reg-field">
                <label className="reg-label">Email</label>
                <input type="email" name="email" className="reg-input" placeholder="nom@exemple.cm" onChange={handleCandidat} required />
              </div>
              <div className="reg-field">
                <label className="reg-label">Mot de passe</label>
                <input type="password" name="password" className="reg-input" placeholder="••••••••" onChange={handleCandidat} required />
              </div>
              <div className="reg-field">
                <label className="reg-label">Confirmation</label>
                <input type="password" name="confirm" className="reg-input" placeholder="••••••••" onChange={handleCandidat} required />
              </div>
              <button className="reg-submit" disabled={chargement}>
                {chargement ? "Traitement..." : "Créer mon espace"} <ChevronRight size={18}/>
              </button>
            </form>
          ) : (
            <form onSubmit={submitRecruteur} className="hxA">
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                <div className="reg-field">
                  <label className="reg-label">Email PRO</label>
                  <input type="email" name="email" className="reg-input" placeholder="rh@startup.cm" onChange={handleRecruteur} required />
                </div>
                <div className="reg-field">
                  <label className="reg-label">Pass</label>
                  <input type="password" name="password" className="reg-input" placeholder="••••" onChange={handleRecruteur} required />
                </div>
              </div>

              <div className="reg-field">
                <label className="reg-label">Entreprise</label>
                <input name="nom_entreprise" className="reg-input" placeholder="Nom de la structure" onChange={handleRecruteur} required />
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                <div className="reg-field">
                  <label className="reg-label">Secteur</label>
                  <input name="secteur_activite" className="reg-input" placeholder="Tech, Finance..." onChange={handleRecruteur} required />
                </div>
                <div className="reg-field">
                  <label className="reg-label">Ville</label>
                  <input name="ville" className="reg-input" placeholder="Douala" onChange={handleRecruteur} required />
                </div>
              </div>

              <div className="reg-field">
                <label className="reg-label">Documents (PDF)</label>
                
                {/* Registre de Commerce */}
                <div className="reg-dropzone" onClick={() => document.getElementById('rc').click()}>
                  <UploadCloud size={20} color="var(--muted)" style={{marginBottom: 8}}/>
                  <div className="reg-dropzone-text">Charger le Registre de Commerce</div>
                  <input type="file" id="rc" name="registre_commerce" hidden accept=".pdf" onChange={handleRecruteur} required />
                  {formRecruteur.registre_commerce && <div style={{fontSize:10, color:'var(--lime)', marginTop:4}}>✓ {formRecruteur.registre_commerce.name}</div>}
                </div>

                {/* Certificat d'Immatriculation */}
                <div className="reg-dropzone" onClick={() => document.getElementById('ci').click()} style={{marginTop: 12}}>
                  <UploadCloud size={20} color="var(--muted)" style={{marginBottom: 8}}/>
                  <div className="reg-dropzone-text">Charger le Certificat d'Immatriculation</div>
                  <input type="file" id="ci" name="certificat_immatriculation" hidden accept=".pdf" onChange={handleRecruteur} required />
                  {formRecruteur.certificat_immatriculation && <div style={{fontSize:10, color:'var(--lime)', marginTop:4}}>✓ {formRecruteur.certificat_immatriculation.name}</div>}
                </div>

                {/* Patente */}
                <div className="reg-dropzone" onClick={() => document.getElementById('pt').click()} style={{marginTop: 12}}>
                  <UploadCloud size={20} color="var(--muted)" style={{marginBottom: 8}}/>
                  <div className="reg-dropzone-text">Charger la Patente</div>
                  <input type="file" id="pt" name="patente" hidden accept=".pdf" onChange={handleRecruteur} required />
                  {formRecruteur.patente && <div style={{fontSize:10, color:'var(--lime)', marginTop:4}}>✓ {formRecruteur.patente.name}</div>}
                </div>
              </div>

              <button className="reg-submit" disabled={chargement}>
                {chargement ? "Soumission..." : "Soumettre mon dossier"} <Zap size={18}/>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}