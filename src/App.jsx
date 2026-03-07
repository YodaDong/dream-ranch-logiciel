import { useState, useMemo, useCallback } from "react";

const uid=()=>Math.random().toString(36).slice(2,10);
const td=()=>new Date().toISOString().slice(0,10);
const fD=d=>{if(!d)return"";const p=d.split("-");return`${p[2]}/${p[1]}/${p[0]}`;};
const fE=n=>n.toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2})+"€";

const CC={Cours:{bg:"#1a4d3a",fg:"#7ee8b5"},Forfait:{bg:"#3d1a5c",fg:"#c9a0e8"},"Adhésion":{bg:"#1a3352",fg:"#7db8e0"},Licence:{bg:"#52400a",fg:"#e8c84a"},Stage:{bg:"#5c1a1a",fg:"#e88a8a"},Pension:{bg:"#2a4a2a",fg:"#8ac98a"},Autre:{bg:"#3a3a3a",fg:"#aaa"}};
const SC={"Soldée":{bg:"#0f3d2a",fg:"#5ae8a0",i:"✓"},"Partielle":{bg:"#3d2f0a",fg:"#e8c44a",i:"◐"},"Non payée":{bg:"#3d0f0f",fg:"#e87a7a",i:"○"}};

const IC=[
  {id:"c1",nom:"CHALAL",prenom:"Anne-Laure",type:"Parent",email:"chalal.al@gmail.com",tel:"06 12 34 56 78",naissance:"1985-04-12",enfantsIds:["c2","c3"],parentId:null,actif:true,adresse:"12 rue des Prés",cp:"57000",ville:"Metz"},
  {id:"c2",nom:"CHALAL",prenom:"Manelle",type:"Enfant",tel:"",email:"",naissance:"2014-09-23",enfantsIds:[],parentId:"c1",actif:true,adresse:"",cp:"",ville:""},
  {id:"c3",nom:"CHALAL",prenom:"Selma",type:"Enfant",tel:"",email:"",naissance:"2016-12-05",enfantsIds:[],parentId:"c1",actif:true,adresse:"",cp:"",ville:""},
  {id:"c4",nom:"GENCO",prenom:"Marie",type:"Parent",email:"genco.m@gmail.com",tel:"06 98 76 54 32",naissance:"1982-07-30",enfantsIds:["c5","c6"],parentId:null,actif:true,adresse:"8 allée du Bois",cp:"57100",ville:"Thionville"},
  {id:"c5",nom:"GENCO",prenom:"Agathe",type:"Enfant",tel:"",email:"",naissance:"2013-03-15",enfantsIds:[],parentId:"c4",actif:true,adresse:"",cp:"",ville:""},
  {id:"c6",nom:"GENCO",prenom:"Zoé",type:"Enfant",tel:"",email:"",naissance:"2015-11-08",enfantsIds:[],parentId:"c4",actif:true,adresse:"",cp:"",ville:""},
  {id:"c7",nom:"SACCO",prenom:"Léa",type:"Parent",email:"sacco.lea@gmail.com",tel:"06 55 44 33 22",naissance:"1990-01-18",enfantsIds:[],parentId:null,actif:true,adresse:"",cp:"",ville:""},
  {id:"c8",nom:"DE MARVILLE",prenom:"Sophie",type:"Parent",email:"demarville@gmail.com",tel:"06 11 22 33 44",naissance:"1978-06-25",enfantsIds:["c9"],parentId:null,actif:true,adresse:"",cp:"",ville:""},
  {id:"c9",nom:"DE MARVILLE",prenom:"Lucas",type:"Enfant",tel:"",email:"",naissance:"2012-08-14",enfantsIds:[],parentId:"c8",actif:true,adresse:"",cp:"",ville:""},
  {id:"c10",nom:"BIETZER",prenom:"Chloé",type:"Parent",email:"bietzer.c@gmail.com",tel:"06 77 88 99 00",naissance:"1988-02-14",enfantsIds:["c11","c12"],parentId:null,actif:true,adresse:"",cp:"",ville:""},
  {id:"c11",nom:"BIETZER",prenom:"Romane",type:"Enfant",tel:"",email:"",naissance:"2015-05-20",enfantsIds:[],parentId:"c10",actif:true,adresse:"",cp:"",ville:""},
  {id:"c12",nom:"BIETZER",prenom:"Olivia",type:"Enfant",tel:"",email:"",naissance:"2017-10-03",enfantsIds:[],parentId:"c10",actif:true,adresse:"",cp:"",ville:""},
];

const CAT=[
  {id:"p1",nom:"1 séance 1h",cat:"Cours",prix:25,tva:5.5,h:1},{id:"p2",nom:"Carte 4 séances",cat:"Cours",prix:90,tva:5.5,h:4},{id:"p3",nom:"Carte 8 séances",cat:"Cours",prix:170,tva:5.5,h:8},
  {id:"p6",nom:"Cours particulier 1h",cat:"Cours",prix:35,tva:5.5,h:1},{id:"p8",nom:"Cours particulier 10h",cat:"Cours",prix:300,tva:5.5,h:10},
  {id:"p9",nom:"Forfait année 36 séances",cat:"Forfait",prix:630,tva:5.5,h:36},{id:"p11",nom:"Forfait essai 1 mois",cat:"Forfait",prix:90,tva:5.5,h:4},{id:"p14",nom:"Forfait proprio année",cat:"Forfait",prix:410,tva:5.5,h:36},
  {id:"p15",nom:"Adhésion 1er membre",cat:"Adhésion",prix:95,tva:5.5,h:0},{id:"p16",nom:"Adhésion 2e membre+",cat:"Adhésion",prix:90,tva:5.5,h:0},
  {id:"p17",nom:"Licence +18 ans",cat:"Licence",prix:40,tva:0,h:0},{id:"p18",nom:"Licence -18 ans",cat:"Licence",prix:29,tva:0,h:0},
  {id:"p19",nom:"Stage journée",cat:"Stage",prix:50,tva:5.5,h:6},{id:"p22",nom:"Pension complète",cat:"Pension",prix:300,tva:5.5,h:0},
  {id:"p24",nom:"Anniversaire poney",cat:"Autre",prix:150,tva:5.5,h:0},{id:"p25",nom:"Bon cadeau",cat:"Autre",prix:0,tva:5.5,h:0},
];

const IV=[
  {id:"v1",ref:"V-2026-0001",cav:"c2",pay:"c1",prest:"p3",detail:"Carte 8 séances",mt:170,rem:0,du:170,tp:170,st:"Soldée",date:"2026-02-15",pays:[{id:"py1",mt:170,mode:"CB",date:"2026-02-15",chq:""}],fact:true},
  {id:"v2",ref:"V-2026-0002",cav:"c2",pay:"c1",prest:"p15",detail:"Adhésion 1er membre",mt:95,rem:0,du:95,tp:50,st:"Partielle",date:"2026-03-01",pays:[{id:"py2",mt:50,mode:"Chèque",date:"2026-03-01",chq:"1234567"}],fact:false},
  {id:"v3",ref:"V-2026-0003",cav:"c3",pay:"c1",prest:"p18",detail:"Licence -18 ans",mt:29,rem:0,du:29,tp:0,st:"Non payée",date:"2026-03-05",pays:[],fact:false},
  {id:"v4",ref:"V-2026-0004",cav:"c5",pay:"c4",prest:"p9",detail:"Forfait année 36 séances",mt:630,rem:0,du:630,tp:315,st:"Partielle",date:"2026-01-10",pays:[{id:"py3",mt:210,mode:"Virement",date:"2026-01-10",chq:""},{id:"py4",mt:105,mode:"CB",date:"2026-02-10",chq:""}],fact:false},
  {id:"v5",ref:"V-2026-0005",cav:"c5",pay:"c4",prest:"p15",detail:"Adhésion 1er membre",mt:95,rem:0,du:95,tp:95,st:"Soldée",date:"2026-01-10",pays:[{id:"py5",mt:95,mode:"CB",date:"2026-01-10",chq:""}],fact:true},
  {id:"v6",ref:"V-2026-0006",cav:"c11",pay:"c10",prest:"p2",detail:"Carte 4 séances",mt:90,rem:0,du:90,tp:90,st:"Soldée",date:"2026-02-20",pays:[{id:"py6",mt:90,mode:"Espèces",date:"2026-02-20",chq:""}],fact:true},
  {id:"v7",ref:"V-2026-0007",cav:"c7",pay:"c7",prest:"p6",detail:"Cours particulier 1h",mt:35,rem:0,du:35,tp:0,st:"Non payée",date:"2026-03-06",pays:[],fact:false},
];

const JOURS=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
const ICR=[
  {id:"cr1",jour:"Mercredi",heure:"14:00",nom:"Débutants",cavs:["c2","c5","c11"]},
  {id:"cr2",jour:"Mercredi",heure:"15:00",nom:"Galop 1-2",cavs:["c3","c6","c9"]},
  {id:"cr3",jour:"Mercredi",heure:"16:00",nom:"Galop 3-4",cavs:["c12"]},
  {id:"cr4",jour:"Samedi",heure:"10:00",nom:"Débutants",cavs:["c2","c11"]},
  {id:"cr5",jour:"Samedi",heure:"11:00",nom:"Galop 1-2",cavs:["c5","c9"]},
  {id:"cr6",jour:"Samedi",heure:"14:00",nom:"Adultes",cavs:["c7"]},
];
const IPR=[
  {id:"pr1",cr:"cr1",date:"2026-03-05",cav:"c2",ok:true},{id:"pr2",cr:"cr1",date:"2026-03-05",cav:"c5",ok:true},
  {id:"pr3",cr:"cr1",date:"2026-03-05",cav:"c11",ok:false},{id:"pr4",cr:"cr4",date:"2026-03-01",cav:"c2",ok:true},
  {id:"pr5",cr:"cr4",date:"2026-03-01",cav:"c11",ok:true},
];

const Ico=({n,s=18,c="currentColor"})=>{const d={home:"M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4h4v4a1 1 0 001 1h3a1 1 0 001-1V10",users:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z",clock:"M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2",cal:"M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18",plus:"M12 5v14M5 12h14",srch:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",back:"M19 12H5M12 19l-7-7 7-7",x:"M18 6L6 18M6 6l12 12",chk:"M20 6L9 17l-5-5",edit:"M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z",chev:"M9 18l6-6-6-6"};return<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d[n]||""}/></svg>;};

export default function App(){
  const[cls,setCls]=useState(IC);
  const[vts,setVts]=useState(IV);
  const[crs]=useState(ICR);
  const[prs,setPrs]=useState(IPR);
  const[tab,setTab]=useState("home");
  const[selC,setSelC]=useState(null);
  const[selV,setSelV]=useState(null);
  const[mdl,setMdl]=useState(null);
  const[toast,setToast]=useState(null);

  const flash=(m,t="ok")=>{setToast({m,t});setTimeout(()=>setToast(null),2500);};
  const gc=useCallback(id=>cls.find(c=>c.id===id),[cls]);
  const gp=useCallback(id=>{const c=gc(id);return c?.type==="Enfant"?gc(c.parentId):c;},[gc]);
  const gf=useCallback(id=>{const c=gc(id);if(!c)return[];if(c.type==="Enfant"){const p=gc(c.parentId);return p?[p,...p.enfantsIds.filter(x=>x!==id).map(gc).filter(Boolean)]:[]}return c.enfantsIds.map(gc).filter(Boolean);},[gc]);
  const cv=useCallback(id=>vts.filter(v=>v.cav===id),[vts]);
  const ch=useCallback(id=>{const v=cv(id);const a=v.reduce((s,vt)=>{const p=CAT.find(x=>x.id===vt.prest);return s+(p?.h||0);},0);const u=prs.filter(p=>p.cav===id&&p.ok).length;return{a,u,s:a-u};},[cv,prs]);
  const cs=useCallback(id=>cv(id).reduce((s,v)=>s+(v.du-v.tp),0),[cv]);

  const addV=(d)=>{const p=CAT.find(x=>x.id===d.prest);const ref=`V-${td().slice(0,4)}-${String(vts.length+1).padStart(4,"0")}`;const du=(d.prix||p?.prix||0)-(d.rem||0);const nv={id:`v-${uid()}`,ref,cav:d.cav,pay:d.pay,prest:d.prest,detail:p?.nom||"",mt:d.prix||p?.prix||0,rem:d.rem||0,du,tp:0,st:"Non payée",date:td(),pays:[],fact:false};setVts(pr=>[nv,...pr]);flash("Vente créée");};
  const addP=(vid,py)=>{setVts(pr=>pr.map(v=>{if(v.id!==vid)return v;const np=[...v.pays,{id:`py-${uid()}`,...py}];const tp=np.reduce((s,p)=>s+p.mt,0);const r=v.du-tp;const st=r<=0?"Soldée":tp>0?"Partielle":"Non payée";const fact=r<=0||v.fact;if(r<=0&&!v.fact)setTimeout(()=>flash("Facture générée auto","info"),500);return{...v,pays:np,tp,st,fact};}));flash("Paiement enregistré");};
  const addCl=(d)=>{const nid=`c-${uid()}`;const nc={id:nid,...d,enfantsIds:[],actif:true};setCls(pr=>{let n=[...pr,nc];if(d.type==="Enfant"&&d.parentId)n=n.map(c=>c.id===d.parentId?{...c,enfantsIds:[...c.enfantsIds,nid]}:c);return n;});flash("Client ajouté");return nid;};
  const updCl=(id,d)=>{setCls(pr=>pr.map(c=>c.id===id?{...c,...d}:c));flash("Client modifié");};
  const togPr=(cr,dt,cav)=>{setPrs(pr=>{const ex=pr.find(p=>p.cr===cr&&p.date===dt&&p.cav===cav);if(ex)return pr.map(p=>p.id===ex.id?{...p,ok:!p.ok}:p);return[...pr,{id:`pr-${uid()}`,cr,date:dt,cav,ok:true}];});};

  const x={cls,vts,crs,prs,gc,gp,gf,cv,ch,cs,addV,addP,addCl,updCl,togPr,selC,setSelC,selV,setSelV,tab,setTab,mdl,setMdl,flash};
  const goHome=()=>{setTab("home");setSelC(null);setSelV(null);};
  const titles={home:"Dream Ranch",fiche:"Fiche cavalier",vd:"Détail vente",clients:"Clients",heures:"Heures de cours",planning:"Planning"};

  return(
    <div style={R.root}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}body{margin:0;background:#12100c}input::placeholder{color:#5a5040}.bh{transition:transform .1s}.bh:active{transform:scale(.97);opacity:.85}.rh:hover{background:rgba(212,175,105,.06)!important}@keyframes ti{from{transform:translate(-50%,-20px);opacity:0}to{transform:translate(-50%,0);opacity:1}}@keyframes mi{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(212,175,105,.2);border-radius:3px}`}</style>
      
      {toast&&<div style={{...R.toast,background:toast.t==="info"?"#1a3d5c":"#0f3d2a",color:toast.t==="info"?"#7db8e0":"#5ae8a0",animation:"ti .3s ease-out"}}>{toast.m}</div>}
      
      <header style={R.hdr}><div style={R.hdrIn}>
        {tab!=="home"?<button onClick={()=>tab==="vd"?setTab("fiche"):goHome()} style={R.hdrBtn} className="bh"><Ico n="back" s={18}/></button>:<span style={{fontSize:22}}>🐴</span>}
        <h1 style={R.hdrT}>{titles[tab]}</h1><div style={{width:36}}/>
      </div></header>

      <div style={R.body}>
        {tab==="home"&&<Home x={x}/>}
        {tab==="fiche"&&<Fiche x={x}/>}
        {tab==="vd"&&<VDetail x={x}/>}
        {tab==="clients"&&<Clients x={x}/>}
        {tab==="heures"&&<Heures x={x}/>}
        {tab==="planning"&&<Planning x={x}/>}
      </div>

      <nav style={R.nav}>
        {[["home","home","Accueil"],["clients","users","Clients"],["heures","clock","Heures"],["planning","cal","Planning"]].map(([id,ic,lb])=>{
          const act=tab===id||(id==="home"&&(tab==="fiche"||tab==="vd"));
          return<button key={id} onClick={()=>{setTab(id);setSelC(null);setSelV(null);}} style={{...R.navIt,color:act?"#d4af69":"#6a5f50"}} className="bh"><Ico n={ic} s={20} c={act?"#d4af69":"#6a5f50"}/><span style={{fontSize:10}}>{lb}</span></button>;
        })}
      </nav>

      {mdl&&<div style={R.ov} onClick={()=>setMdl(null)}><div style={{...R.mdl,animation:"mi .25s ease-out"}} onClick={e=>e.stopPropagation()}><div style={R.mdlBar}/>
        {mdl.t==="nv"&&<MNewV x={x} cl={()=>setMdl(null)}/>}
        {mdl.t==="np"&&<MNewP x={x} cl={()=>setMdl(null)}/>}
        {mdl.t==="nc"&&<MNewC x={x} cl={()=>setMdl(null)}/>}
        {mdl.t==="ec"&&<MEditC x={x} cl={()=>setMdl(null)}/>}
        {mdl.t==="pr"&&<MPres x={x} cl={()=>setMdl(null)}/>}
      </div></div>}
    </div>
  );
}

// ── SCREENS ─────────────────────────────────

function Home({x}){
  const[q,setQ]=useState("");
  const res=useMemo(()=>{if(q.length<2)return[];const w=q.toLowerCase().split(/\s+/);return x.cls.filter(c=>{const f=`${c.nom} ${c.prenom}`.toLowerCase();return w.every(z=>f.includes(z));}).slice(0,8);},[q,x.cls]);
  return<div style={{padding:"0 16px"}}>
    <div style={{textAlign:"center",padding:"20px 0 14px"}}><div style={{fontSize:34,marginBottom:2}}>🐴</div><h2 style={R.heroT}>Dream Ranch</h2><p style={{color:"#7a6f60",fontSize:13,marginTop:3}}>Gestion du centre équestre</p></div>
    <div style={R.srchW}><Ico n="srch" s={16} c="#7a6f60"/><input placeholder="Rechercher un cavalier..." value={q} onChange={e=>setQ(e.target.value)} style={R.srchI} autoComplete="off"/>{q&&<button onClick={()=>setQ("")} style={R.clrB} className="bh"><Ico n="x" s={14} c="#7a6f60"/></button>}</div>
    {res.length>0&&<div style={R.resList}>{res.map(c=>{const s=x.cs(c.id);return<button key={c.id} onClick={()=>{x.setSelC(c.id);x.setTab("fiche");}} style={R.resRow} className="bh rh"><div style={R.av}>{c.type==="Enfant"?"👧":"👤"}</div><div style={{flex:1,minWidth:0}}><div style={R.rT}>{c.nom} {c.prenom}</div><div style={R.rS}>{c.type}{c.type==="Enfant"&&c.parentId?` · enfant de ${x.gc(c.parentId)?.prenom}`:""}</div></div>{s>0&&<span style={R.sBdg}>{fE(s)}</span>}<Ico n="chev" s={14} c="#6a5f50"/></button>})}</div>}
    {q.length>=2&&res.length===0&&<p style={R.mt}>Aucun résultat</p>}
    <div style={R.qGrid}>
      <button onClick={()=>x.setMdl({t:"nc"})} style={R.qBtn} className="bh"><div style={R.qIco}><Ico n="plus" s={20} c="#d4af69"/></div>Nouveau client</button>
      <button onClick={()=>x.setTab("planning")} style={R.qBtn} className="bh"><div style={R.qIco}><Ico n="cal" s={20} c="#d4af69"/></div>Planning</button>
      <button onClick={()=>x.setTab("clients")} style={R.qBtn} className="bh"><div style={R.qIco}><Ico n="users" s={20} c="#d4af69"/></div>Tous les clients</button>
      <button onClick={()=>x.setTab("heures")} style={R.qBtn} className="bh"><div style={R.qIco}><Ico n="clock" s={20} c="#d4af69"/></div>Heures</button>
    </div>
    <div style={R.secT}>Dernières ventes</div>
    <div style={R.card}>{x.vts.slice(0,5).map(v=>{const c=x.gc(v.cav);const s=SC[v.st];return<button key={v.id} onClick={()=>{x.setSelC(v.cav);x.setSelV(v.id);x.setTab("vd");}} style={R.lRow} className="bh rh"><div style={{flex:1,minWidth:0}}><div style={R.rT}>{v.detail}</div><div style={R.rS}>{c?.prenom} {c?.nom} · {fD(v.date)}</div></div><div style={{textAlign:"right"}}><div style={{fontWeight:700,color:"#d4af69",fontSize:14}}>{fE(v.du)}</div><span style={{...R.pill,background:s.bg,color:s.fg}}>{s.i} {v.st}</span></div></button>})}</div>
  </div>;
}

function Fiche({x}){
  const c=x.gc(x.selC);if(!c)return<p style={R.mt}>Sélectionnez un cavalier</p>;
  const py=x.gp(c.id),fam=x.gf(c.id),vts=x.cv(c.id),hrs=x.ch(c.id),sol=x.cs(c.id);
  return<div style={{padding:"0 16px"}}>
    <div style={R.card}><div style={{display:"flex",gap:14,alignItems:"center",marginBottom:14}}>
      <div style={R.bAv}>{c.type==="Enfant"?"👧":"👤"}</div>
      <div style={{flex:1}}><h2 style={R.fNm}>{c.prenom} {c.nom}</h2><div style={{display:"flex",gap:6,marginTop:4}}><span style={R.tBdg}>{c.type}</span>{c.actif&&<span style={{...R.tBdg,background:"#0f3d2a",color:"#5ae8a0"}}>Actif</span>}</div></div>
      <button onClick={()=>x.setMdl({t:"ec",cid:c.id})} style={R.iBtn} className="bh"><Ico n="edit" s={16} c="#d4af69"/></button>
    </div>
    {c.type==="Enfant"&&py&&<IR l="Payeur" v={`${py.prenom} ${py.nom}`}/>}
    {(py||c).tel&&<IR l="Tél" v={(py||c).tel}/>}
    {(py||c).email&&<IR l="Email" v={(py||c).email}/>}
    {c.naissance&&<IR l="Né(e) le" v={fD(c.naissance)}/>}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
      <div style={R.stBx}><div style={R.stLb}>Reste à payer</div><div style={{...R.stVl,color:sol>0?"#e87a7a":"#5ae8a0"}}>{fE(sol)}</div></div>
      <div style={R.stBx}><div style={R.stLb}>Heures restantes</div><div style={{...R.stVl,color:hrs.s>0?"#7db8e0":"#e87a7a"}}>{hrs.s}h</div><div style={{fontSize:11,color:"#7a6f60",marginTop:2}}>{hrs.a}h achetées · {hrs.u}h prises</div></div>
    </div>
    {fam.length>0&&<div style={R.card}><div style={R.secT}>Famille</div><div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8}}>{fam.map(f=><button key={f.id} onClick={()=>x.setSelC(f.id)} style={R.famC} className="bh">{f.type==="Enfant"?"👧":"👤"} {f.prenom}</button>)}</div></div>}
    <div style={R.card}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={R.secT}>Ventes</div><button onClick={()=>x.setMdl({t:"nv",cid:c.id})} style={R.aBtn} className="bh"><Ico n="plus" s={14}/> Vente</button></div>
    {vts.length===0&&<p style={R.mt}>Aucune vente</p>}
    {vts.map(v=>{const s=SC[v.st];const r=v.du-v.tp;return<button key={v.id} onClick={()=>{x.setSelV(v.id);x.setTab("vd");}} style={R.lRow} className="bh rh"><div style={{flex:1,minWidth:0}}><div style={R.rT}>{v.detail}</div><div style={R.rS}>{fD(v.date)}{r>0?` · reste ${fE(r)}`:""}</div></div><span style={{...R.pill,background:s.bg,color:s.fg}}>{s.i} {v.st}</span><Ico n="chev" s={14} c="#6a5f50"/></button>})}</div>
  </div>;
}

function VDetail({x}){
  const v=x.vts.find(z=>z.id===x.selV);if(!v)return<p style={R.mt}>Vente introuvable</p>;
  const c=x.gc(v.cav),py=x.gc(v.pay),pr=CAT.find(z=>z.id===v.prest),st=SC[v.st],ct=CC[pr?.cat]||CC.Autre,r=v.du-v.tp;
  return<div style={{padding:"0 16px"}}>
    <div style={R.card}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
        <div><h2 style={R.fNm}>{v.detail}</h2><div style={{display:"flex",gap:6,marginTop:6}}><span style={{...R.cPill,background:ct.bg,color:ct.fg}}>{pr?.cat}</span><span style={{...R.pill,background:st.bg,color:st.fg}}>{st.i} {v.st}</span></div></div>
        {v.fact&&<span style={{...R.cPill,background:"#1a3d5c",color:"#7db8e0"}}>📄 Facturée</span>}
      </div>
      <IR l="Cavalier" v={c?`${c.prenom} ${c.nom}`:""}/><IR l="Payeur" v={py?`${py.prenom} ${py.nom}`:""}/><IR l="Date" v={fD(v.date)}/><IR l="Réf." v={v.ref}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:16}}>
        <div style={R.mSt}><div style={R.mLb}>Montant dû</div><div style={R.mVl}>{fE(v.du)}</div></div>
        <div style={R.mSt}><div style={R.mLb}>Payé</div><div style={{...R.mVl,color:"#5ae8a0"}}>{fE(v.tp)}</div></div>
        <div style={R.mSt}><div style={R.mLb}>Reste</div><div style={{...R.mVl,color:r>0?"#e8c44a":"#5ae8a0"}}>{fE(r)}</div></div>
      </div>
    </div>
    <div style={R.card}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={R.secT}>Paiements</div>{r>0&&<button onClick={()=>x.setMdl({t:"np",vid:v.id})} style={R.aBtn} className="bh"><Ico n="plus" s={14}/> Paiement</button>}</div>
    {v.pays.length===0&&<p style={R.mt}>Aucun paiement</p>}
    {v.pays.map(p=><div key={p.id} style={R.lRow}><div style={{flex:1}}><div style={R.rT}>{fE(p.mt)}</div><div style={R.rS}>{fD(p.date)}{p.chq?` · Chq n°${p.chq}`:""}</div></div><span style={R.mBdg}>{p.mode}</span></div>)}</div>
  </div>;
}

function Clients({x}){
  const[q,setQ]=useState("");const[f,setF]=useState("Tous");
  const lst=useMemo(()=>{let l=x.cls;if(f==="Parents")l=l.filter(c=>c.type==="Parent");if(f==="Enfants")l=l.filter(c=>c.type==="Enfant");if(q.length>=2){const w=q.toLowerCase().split(/\s+/);l=l.filter(c=>{const s=`${c.nom} ${c.prenom}`.toLowerCase();return w.every(z=>s.includes(z));});}return l.sort((a,b)=>a.nom.localeCompare(b.nom));},[x.cls,q,f]);
  return<div style={{padding:"0 16px"}}>
    <div style={{display:"flex",gap:8,marginBottom:12}}><div style={{...R.srchW,flex:1}}><Ico n="srch" s={16} c="#7a6f60"/><input placeholder="Rechercher..." value={q} onChange={e=>setQ(e.target.value)} style={R.srchI}/></div><button onClick={()=>x.setMdl({t:"nc"})} style={R.aBtn} className="bh"><Ico n="plus" s={16}/></button></div>
    <div style={{display:"flex",gap:6,marginBottom:12}}>{["Tous","Parents","Enfants"].map(z=><button key={z} onClick={()=>setF(z)} style={{...R.fPill,background:f===z?"#d4af69":"rgba(212,175,105,.08)",color:f===z?"#1a1207":"#7a6f60"}} className="bh">{z}</button>)}<span style={{color:"#7a6f60",fontSize:12,alignSelf:"center",marginLeft:"auto"}}>{lst.length}</span></div>
    <div style={R.card}>{lst.map(c=>{const s=x.cs(c.id);return<button key={c.id} onClick={()=>{x.setSelC(c.id);x.setTab("fiche");}} style={R.lRow} className="bh rh"><div style={R.av}>{c.type==="Enfant"?"👧":"👤"}</div><div style={{flex:1,minWidth:0}}><div style={R.rT}>{c.nom} {c.prenom}</div><div style={R.rS}>{c.type}{c.tel?` · ${c.tel}`:""}</div></div>{s>0&&<span style={R.sBdg}>{fE(s)}</span>}<Ico n="chev" s={14} c="#6a5f50"/></button>})}</div>
  </div>;
}

function Heures({x}){
  const[q,setQ]=useState("");
  const lst=useMemo(()=>{let l=x.cls.filter(c=>{const v=x.cv(c.id);return v.some(vt=>{const p=CAT.find(z=>z.id===vt.prest);return p?.h>0;});});if(q.length>=2){const w=q.toLowerCase().split(/\s+/);l=l.filter(c=>{const s=`${c.nom} ${c.prenom}`.toLowerCase();return w.every(z=>s.includes(z));});}return l.sort((a,b)=>a.nom.localeCompare(b.nom));},[x.cls,x.cv,q]);
  return<div style={{padding:"0 16px"}}>
    <div style={R.srchW}><Ico n="srch" s={16} c="#7a6f60"/><input placeholder="Rechercher..." value={q} onChange={e=>setQ(e.target.value)} style={R.srchI}/></div>
    <div style={{...R.card,marginTop:12}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 70px 60px 60px",gap:4,padding:"8px 0",borderBottom:"1px solid rgba(212,175,105,.1)"}}><span style={R.th}>Cavalier</span><span style={{...R.th,textAlign:"center"}}>Achetées</span><span style={{...R.th,textAlign:"center"}}>Prises</span><span style={{...R.th,textAlign:"center"}}>Solde</span></div>
      {lst.map(c=>{const h=x.ch(c.id);return<button key={c.id} onClick={()=>{x.setSelC(c.id);x.setTab("fiche");}} style={{...R.lRow,display:"grid",gridTemplateColumns:"1fr 70px 60px 60px",gap:4}} className="bh rh"><div style={R.rT}>{c.prenom} {c.nom}</div><div style={{textAlign:"center",color:"#7db8e0",fontWeight:600}}>{h.a}h</div><div style={{textAlign:"center",color:"#e8c44a",fontWeight:600}}>{h.u}h</div><div style={{textAlign:"center",color:h.s>0?"#5ae8a0":"#e87a7a",fontWeight:700}}>{h.s}h</div></button>})}
    </div>
  </div>;
}

function Planning({x}){
  const[j,setJ]=useState("Mercredi");
  const jc=x.crs.filter(cr=>cr.jour===j).sort((a,b)=>a.heure.localeCompare(b.heure));
  return<div style={{padding:"0 16px"}}>
    <div style={{display:"flex",gap:4,marginBottom:14,overflowX:"auto",paddingBottom:4}}>{JOURS.map(d=>{const n=x.crs.filter(cr=>cr.jour===d).length;return<button key={d} onClick={()=>setJ(d)} style={{...R.jPill,background:j===d?"#d4af69":"rgba(212,175,105,.06)",color:j===d?"#1a1207":"#7a6f60"}} className="bh">{d.slice(0,3)}{n>0&&<span style={{fontSize:10,marginLeft:3,opacity:.7}}>({n})</span>}</button>})}</div>
    {jc.length===0&&<p style={R.mt}>Aucun créneau le {j.toLowerCase()}</p>}
    {jc.map(cr=><div key={cr.id} style={R.card}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div><span style={{fontWeight:700,color:"#d4af69",fontSize:16}}>{cr.heure}</span><span style={{color:"#b8a88a",marginLeft:8,fontSize:14}}>{cr.nom}</span></div><button onClick={()=>x.setMdl({t:"pr",crid:cr.id})} style={R.aBtn} className="bh"><Ico n="chk" s={14}/> Présences</button></div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{cr.cavs.map(id=>{const c=x.gc(id);return c?<span key={id} style={R.cavC} onClick={()=>{x.setSelC(id);x.setTab("fiche");}}>{c.prenom} {c.nom}</span>:null})}</div>
    </div>)}
  </div>;
}

// ── MODALS ───────────────────────────────────

function MNewV({x,cl}){
  const[sr,setSr]=useState("");const[pid,setPid]=useState(null);const[rem,setRem]=useState(0);const[pm,setPm]=useState("");
  const cid=x.mdl.cid;const py=x.gp(cid);
  const fl=CAT.filter(p=>sr.length<1||(p.nom+p.cat).toLowerCase().includes(sr.toLowerCase()));
  const pr=CAT.find(z=>z.id===pid);const prix=pr?(pr.prix===0?parseFloat(pm)||0:pr.prix):0;const du=Math.max(0,prix-rem);
  return<>
    <h3 style={R.mdlT}>Nouvelle vente</h3>
    <p style={{color:"#7a6f60",fontSize:13,marginBottom:12}}>Pour {x.gc(cid)?.prenom} {x.gc(cid)?.nom}</p>
    {!pid?<><div style={{...R.srchW,marginBottom:10}}><Ico n="srch" s={14} c="#7a6f60"/><input placeholder="Rechercher prestation..." value={sr} onChange={e=>setSr(e.target.value)} style={{...R.srchI,fontSize:14}} autoFocus/></div>
    <div style={{maxHeight:280,overflowY:"auto"}}>{fl.map(p=>{const ct=CC[p.cat]||CC.Autre;return<button key={p.id} onClick={()=>setPid(p.id)} style={R.lRow} className="bh rh"><span style={{...R.cPill,background:ct.bg,color:ct.fg,fontSize:10}}>{p.cat}</span><span style={{flex:1,color:"#e8dcc8",marginLeft:8,fontSize:13}}>{p.nom}</span><span style={{color:"#d4af69",fontWeight:700,fontSize:13}}>{p.prix===0?"—":fE(p.prix)}</span></button>})}</div></>
    :<><div style={R.selBx}><div style={{fontWeight:700,color:"#e8dcc8"}}>{pr.nom}</div><div style={{fontSize:12,color:"#7a6f60"}}>{pr.cat} · TVA {pr.tva}%{pr.h>0?` · +${pr.h}h`:""}</div><button onClick={()=>setPid(null)} style={R.lnkB}>← Changer</button></div>
    {pr.prix===0&&<Fld l="Prix (€)" t="number" v={pm} o={setPm} af/>}
    <Fld l="Remise (€)" t="number" v={rem} o={v=>setRem(Math.max(0,parseFloat(v)||0))}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,margin:"14px 0"}}><div style={R.mSt}><div style={R.mLb}>Prix</div><div style={R.mVl}>{fE(prix)}</div></div><div style={R.mSt}><div style={R.mLb}>Montant dû</div><div style={{...R.mVl,color:"#d4af69"}}>{fE(du)}</div></div></div>
    <button onClick={()=>{if(!pr||du<=0)return;x.addV({cav:cid,pay:py?.id||cid,prest:pid,prix,rem});cl();}} disabled={du<=0} style={{...R.pBtn,opacity:du<=0?.4:1}} className="bh">Créer la vente</button></>}
  </>;
}

function MNewP({x,cl}){
  const v=x.vts.find(z=>z.id===x.mdl.vid);if(!v)return null;const r=v.du-v.tp;
  const[mt,setMt]=useState(r);const[md,setMd]=useState("CB");const[chq,setChq]=useState("");
  return<>
    <h3 style={R.mdlT}>Ajouter un paiement</h3>
    <div style={R.selBx}><div style={{fontWeight:600,color:"#e8dcc8"}}>{v.detail}</div><div style={{fontSize:13,color:"#d4af69",marginTop:2}}>Reste : {fE(r)}</div></div>
    <Fld l="Montant (€)" t="number" v={mt} o={v=>setMt(Math.max(0,parseFloat(v)||0))} af/>
    <div style={{marginBottom:14}}><label style={R.fLb}>Mode de règlement</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["Espèces","Chèque","Virement","CB"].map(m=><button key={m} onClick={()=>setMd(m)} style={{...R.mdBtn,background:md===m?"#d4af69":"rgba(212,175,105,.08)",color:md===m?"#1a1207":"#7a6f60"}} className="bh">{m}</button>)}</div></div>
    {md==="Chèque"&&<Fld l="N° chèque" v={chq} o={setChq}/>}
    <button onClick={()=>{if(mt<=0)return;x.addP(v.id,{mt:Math.min(mt,r),mode:md,date:td(),chq:md==="Chèque"?chq:""});cl();}} disabled={mt<=0} style={{...R.pBtn,opacity:mt<=0?.4:1}} className="bh">Enregistrer {fE(Math.min(mt,r))}</button>
  </>;
}

function MNewC({x,cl}){
  const[tp,setTp]=useState("Enfant");const[nm,setNm]=useState("");const[pn,setPn]=useState("");const[pid,setPid]=useState("");const[tl,setTl]=useState("");const[em,setEm]=useState("");const[na,setNa]=useState("");const[ad,setAd]=useState("");const[cp,setCp]=useState("");const[vi,setVi]=useState("");const[ps,setPs]=useState("");
  const pts=x.cls.filter(c=>c.type==="Parent");const fp=ps.length>=1?pts.filter(p=>`${p.nom} ${p.prenom}`.toLowerCase().includes(ps.toLowerCase())):pts;
  return<>
    <h3 style={R.mdlT}>Nouveau client</h3>
    <div style={{display:"flex",gap:6,marginBottom:14}}>{["Parent","Enfant"].map(t=><button key={t} onClick={()=>setTp(t)} style={{...R.mdBtn,flex:1,background:tp===t?"#d4af69":"rgba(212,175,105,.08)",color:tp===t?"#1a1207":"#7a6f60"}} className="bh">{t}</button>)}</div>
    <Fld l="Nom" v={nm} o={setNm} af/><Fld l="Prénom" v={pn} o={setPn}/><Fld l="Date de naissance" t="date" v={na} o={setNa}/>
    {tp==="Enfant"&&<div style={{marginBottom:14}}><label style={R.fLb}>Parent / Tuteur</label><input placeholder="Rechercher le parent..." value={ps} onChange={e=>setPs(e.target.value)} style={R.fIn}/>{ps.length>=1&&<div style={{maxHeight:120,overflowY:"auto",marginTop:4}}>{fp.map(p=><button key={p.id} onClick={()=>{setPid(p.id);setPs(`${p.nom} ${p.prenom}`);}} style={{...R.lRow,padding:"8px"}} className="bh rh"><span style={{color:pid===p.id?"#d4af69":"#e8dcc8",fontSize:13}}>{p.nom} {p.prenom}</span>{pid===p.id&&<Ico n="chk" s={14} c="#5ae8a0"/>}</button>)}</div>}</div>}
    {tp==="Parent"&&<><Fld l="Téléphone" v={tl} o={setTl}/><Fld l="Email" v={em} o={setEm}/><Fld l="Adresse" v={ad} o={setAd}/><div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:8}}><Fld l="Code postal" v={cp} o={setCp}/><Fld l="Ville" v={vi} o={setVi}/></div></>}
    <button onClick={()=>{if(!nm||!pn)return;const nid=x.addCl({nom:nm.toUpperCase(),prenom:pn,type:tp,parentId:tp==="Enfant"?pid:"",tel:tl,email:em,naissance:na,adresse:ad,cp,ville:vi});cl();x.setSelC(nid);x.setTab("fiche");}} disabled={!nm||!pn||(tp==="Enfant"&&!pid)} style={{...R.pBtn,opacity:(!nm||!pn||(tp==="Enfant"&&!pid))?.4:1,marginTop:8}} className="bh">Ajouter</button>
  </>;
}

function MEditC({x,cl}){
  const c=x.gc(x.mdl.cid);if(!c)return null;
  const[nm,setNm]=useState(c.nom);const[pn,setPn]=useState(c.prenom);const[tl,setTl]=useState(c.tel);const[em,setEm]=useState(c.email);const[na,setNa]=useState(c.naissance);const[ad,setAd]=useState(c.adresse);const[cp,setCp]=useState(c.cp);const[vi,setVi]=useState(c.ville);
  return<>
    <h3 style={R.mdlT}>Modifier {c.prenom}</h3>
    <Fld l="Nom" v={nm} o={setNm}/><Fld l="Prénom" v={pn} o={setPn}/><Fld l="Date de naissance" t="date" v={na} o={setNa}/><Fld l="Téléphone" v={tl} o={setTl}/><Fld l="Email" v={em} o={setEm}/><Fld l="Adresse" v={ad} o={setAd}/><div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:8}}><Fld l="Code postal" v={cp} o={setCp}/><Fld l="Ville" v={vi} o={setVi}/></div>
    <button onClick={()=>{x.updCl(c.id,{nom:nm.toUpperCase(),prenom:pn,tel:tl,email:em,naissance:na,adresse:ad,cp,ville:vi});cl();}} style={{...R.pBtn,marginTop:8}} className="bh">Enregistrer</button>
  </>;
}

function MPres({x,cl}){
  const cr=x.crs.find(z=>z.id===x.mdl.crid);if(!cr)return null;const d=td();
  return<>
    <h3 style={R.mdlT}>Présences — {cr.nom}</h3>
    <p style={{color:"#7a6f60",fontSize:13,marginBottom:12}}>{cr.jour} {cr.heure} · {fD(d)}</p>
    {cr.cavs.map(id=>{const c=x.gc(id);if(!c)return null;const pr=x.prs.find(p=>p.cr===cr.id&&p.date===d&&p.cav===id);const ok=pr?.ok||false;
    return<button key={id} onClick={()=>x.togPr(cr.id,d,id)} style={{...R.lRow,padding:"12px 8px"}} className="bh rh">
      <div style={{width:28,height:28,borderRadius:8,border:`2px solid ${ok?"#5ae8a0":"#7a6f60"}`,background:ok?"#5ae8a0":"rgba(212,175,105,.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{ok&&<Ico n="chk" s={14} c="#1a1207"/>}</div>
      <span style={{color:"#e8dcc8",fontSize:14,flex:1}}>{c.prenom} {c.nom}</span>
      <span style={{fontSize:12,color:ok?"#5ae8a0":"#7a6f60"}}>{ok?"Présent":"Absent"}</span>
    </button>})}
    <button onClick={cl} style={{...R.pBtn,marginTop:16}} className="bh">Fermer</button>
  </>;
}

// ── SHARED ──────────────────────────────────

function IR({l,v}){return<div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(212,175,105,.04)"}}><span style={{color:"#7a6f60",fontSize:12}}>{l}</span><span style={{color:"#e8dcc8",fontSize:12,fontWeight:500}}>{v}</span></div>}
function Fld({l,v,o,t="text",af}){return<div style={{marginBottom:12}}><label style={R.fLb}>{l}</label><input type={t} value={v} onChange={e=>o(e.target.value)} style={R.fIn} autoFocus={af} autoComplete="off"/></div>}

// ── STYLES ──────────────────────────────────

const R={
  root:{minHeight:"100vh",background:"linear-gradient(175deg,#16130e,#1c1812 50%,#12100c)",fontFamily:"'DM Sans',sans-serif",color:"#e8dcc8",maxWidth:520,margin:"0 auto",position:"relative",paddingBottom:72,paddingTop:56},
  hdr:{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(18,16,12,.92)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(212,175,105,.08)"},
  hdrIn:{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",maxWidth:520,margin:"0 auto"},
  hdrT:{fontFamily:"'DM Serif Display',serif",fontSize:18,fontWeight:400,color:"#d4af69",margin:0,flex:1,textAlign:"center"},
  hdrBtn:{background:"none",border:"none",color:"#d4af69",cursor:"pointer",padding:8,borderRadius:8},
  nav:{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"rgba(18,16,12,.95)",backdropFilter:"blur(12px)",borderTop:"1px solid rgba(212,175,105,.08)",display:"flex",justifyContent:"space-around",padding:"6px 0 8px",maxWidth:520,margin:"0 auto"},
  navIt:{display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",padding:"6px 12px",fontFamily:"inherit"},
  body:{padding:"12px 0 0"},
  toast:{position:"fixed",top:64,left:"50%",transform:"translateX(-50%)",padding:"10px 22px",borderRadius:10,fontWeight:600,fontSize:13,zIndex:200,boxShadow:"0 8px 32px rgba(0,0,0,.5)"},
  heroT:{fontFamily:"'DM Serif Display',serif",fontSize:26,color:"#d4af69",margin:0,fontWeight:400},
  srchW:{display:"flex",alignItems:"center",background:"rgba(212,175,105,.06)",border:"1px solid rgba(212,175,105,.12)",borderRadius:12,padding:"0 14px",gap:10},
  srchI:{flex:1,background:"transparent",border:"none",color:"#e8dcc8",fontSize:15,padding:"13px 0",outline:"none",fontFamily:"inherit"},
  clrB:{background:"none",border:"none",color:"#7a6f60",cursor:"pointer",padding:4},
  resList:{marginTop:8,background:"rgba(212,175,105,.03)",borderRadius:12,border:"1px solid rgba(212,175,105,.08)",overflow:"hidden"},
  resRow:{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",width:"100%",border:"none",borderBottom:"1px solid rgba(212,175,105,.05)",background:"transparent",cursor:"pointer",textAlign:"left",fontFamily:"inherit"},
  qGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"18px 0 14px"},
  qBtn:{display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:"18px 12px",background:"rgba(212,175,105,.04)",border:"1px solid rgba(212,175,105,.1)",borderRadius:14,cursor:"pointer",fontFamily:"inherit",color:"#b8a88a",fontSize:12,fontWeight:500},
  qIco:{width:44,height:44,borderRadius:"50%",background:"rgba(212,175,105,.08)",display:"flex",alignItems:"center",justifyContent:"center"},
  card:{background:"rgba(212,175,105,.03)",border:"1px solid rgba(212,175,105,.08)",borderRadius:14,padding:16,marginBottom:12},
  secT:{fontFamily:"'DM Serif Display',serif",fontSize:16,color:"#d4af69",fontWeight:400,marginBottom:4},
  lRow:{display:"flex",alignItems:"center",gap:10,padding:"10px 4px",width:"100%",border:"none",borderBottom:"1px solid rgba(212,175,105,.05)",background:"transparent",cursor:"pointer",textAlign:"left",fontFamily:"inherit"},
  rT:{fontWeight:600,color:"#e8dcc8",fontSize:13},
  rS:{color:"#7a6f60",fontSize:11,marginTop:1},
  av:{width:36,height:36,borderRadius:"50%",background:"rgba(212,175,105,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0},
  bAv:{width:52,height:52,borderRadius:"50%",background:"rgba(212,175,105,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0},
  tBdg:{display:"inline-block",background:"rgba(212,175,105,.1)",color:"#d4af69",fontSize:10,padding:"2px 10px",borderRadius:20,fontWeight:600},
  pill:{display:"inline-block",fontSize:10,padding:"2px 8px",borderRadius:6,fontWeight:600,whiteSpace:"nowrap"},
  cPill:{display:"inline-block",fontSize:10,padding:"3px 10px",borderRadius:6,fontWeight:600},
  sBdg:{fontSize:11,color:"#e87a7a",fontWeight:600,whiteSpace:"nowrap",background:"rgba(232,122,122,.1)",padding:"2px 8px",borderRadius:6},
  mBdg:{background:"rgba(212,175,105,.08)",color:"#d4af69",fontSize:11,padding:"4px 10px",borderRadius:6,fontWeight:600},
  famC:{background:"rgba(212,175,105,.06)",border:"1px solid rgba(212,175,105,.12)",borderRadius:20,padding:"6px 14px",color:"#e8dcc8",fontSize:12,cursor:"pointer",fontFamily:"inherit"},
  stBx:{background:"rgba(212,175,105,.04)",border:"1px solid rgba(212,175,105,.08)",borderRadius:12,padding:14,textAlign:"center"},
  stLb:{fontSize:11,color:"#7a6f60",marginBottom:4,textTransform:"uppercase",letterSpacing:.5,fontWeight:600},
  stVl:{fontSize:22,fontWeight:700},
  mSt:{background:"rgba(212,175,105,.05)",borderRadius:10,padding:10,textAlign:"center"},
  mLb:{fontSize:10,color:"#7a6f60",marginBottom:3,textTransform:"uppercase",letterSpacing:.4,fontWeight:600},
  mVl:{fontSize:16,fontWeight:700,color:"#e8dcc8"},
  fNm:{fontFamily:"'DM Serif Display',serif",fontSize:20,color:"#d4af69",margin:0,fontWeight:400},
  aBtn:{display:"inline-flex",alignItems:"center",gap:4,background:"#d4af69",color:"#1a1207",border:"none",borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"},
  pBtn:{width:"100%",background:"linear-gradient(135deg,#d4af69,#b89430)",color:"#1a1207",border:"none",borderRadius:12,padding:"14px 0",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"},
  iBtn:{background:"rgba(212,175,105,.08)",border:"1px solid rgba(212,175,105,.12)",borderRadius:8,padding:8,cursor:"pointer"},
  lnkB:{color:"#d4af69",background:"none",border:"none",cursor:"pointer",fontSize:12,padding:0,marginTop:6,fontFamily:"inherit"},
  ov:{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",backdropFilter:"blur(4px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:150},
  mdl:{background:"linear-gradient(170deg,#1e1a14,#14120e)",borderRadius:"20px 20px 0 0",padding:"12px 18px 32px",width:"100%",maxWidth:520,maxHeight:"88vh",overflowY:"auto",border:"1px solid rgba(212,175,105,.1)",borderBottom:"none"},
  mdlBar:{width:36,height:4,borderRadius:2,background:"rgba(212,175,105,.2)",margin:"0 auto 14px"},
  mdlT:{fontFamily:"'DM Serif Display',serif",fontSize:18,color:"#d4af69",margin:"0 0 12px",fontWeight:400},
  fLb:{display:"block",color:"#7a6f60",fontSize:12,marginBottom:5,fontWeight:600},
  fIn:{width:"100%",background:"rgba(212,175,105,.06)",border:"1px solid rgba(212,175,105,.12)",borderRadius:10,padding:"11px 14px",color:"#e8dcc8",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"},
  mdBtn:{border:"1px solid rgba(212,175,105,.15)",borderRadius:8,padding:"8px 14px",fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:600},
  fPill:{border:"none",borderRadius:20,padding:"6px 14px",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600},
  jPill:{border:"none",borderRadius:10,padding:"8px 14px",fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:600,whiteSpace:"nowrap"},
  cavC:{background:"rgba(212,175,105,.06)",borderRadius:8,padding:"4px 10px",fontSize:12,color:"#b8a88a",cursor:"pointer"},
  th:{fontSize:10,color:"#7a6f60",fontWeight:600,textTransform:"uppercase",letterSpacing:.4},
  selBx:{background:"rgba(212,175,105,.06)",borderRadius:10,padding:12,marginBottom:14},
  mt:{textAlign:"center",color:"#5a5040",padding:20,fontSize:13},
};
