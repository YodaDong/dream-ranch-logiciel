import { useState, useMemo } from "react";
import { JOURS, CATEGORIES } from "../data/mockData.jsx";
import { fD, fE, Ico, IR, Fld, CAT_COLORS, STATUT_COLORS } from "../data/helpers.jsx";
import { Modals } from "./Modals";

const D={
  wrap:{display:"flex",minHeight:"100vh"},
  side:{width:220,background:"rgba(18,16,12,.95)",borderRight:"1px solid rgba(212,175,105,.08)",padding:"20px 0",position:"fixed",top:0,bottom:0,left:0,zIndex:50,display:"flex",flexDirection:"column"},
  logo:{display:"flex",alignItems:"center",gap:10,padding:"0 20px 20px",borderBottom:"1px solid rgba(212,175,105,.08)",marginBottom:8},
  logoT:{fontFamily:"'DM Serif Display',serif",fontSize:20,color:"#d4af69",fontWeight:400},
  navIt:{display:"flex",alignItems:"center",gap:10,padding:"10px 20px",width:"100%",border:"none",background:"transparent",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:500,borderRadius:0,textAlign:"left"},
  main:{marginLeft:220,flex:1,padding:"24px 32px",minHeight:"100vh"},
  pageT:{fontFamily:"'DM Serif Display',serif",fontSize:24,color:"#d4af69",fontWeight:400,margin:"0 0 20px"},
  grid:{display:"grid",gap:16,marginBottom:20},
  card:{background:"rgba(212,175,105,.03)",border:"1px solid rgba(212,175,105,.08)",borderRadius:14,padding:20},
  statCard:{background:"rgba(212,175,105,.03)",border:"1px solid rgba(212,175,105,.08)",borderRadius:14,padding:20,textAlign:"center"},
  statLb:{fontSize:12,color:"#7a6f60",textTransform:"uppercase",letterSpacing:.5,fontWeight:600,marginBottom:6},
  statVl:{fontSize:28,fontWeight:700},
  secT:{fontFamily:"'DM Serif Display',serif",fontSize:17,color:"#d4af69",fontWeight:400,marginBottom:12},
  tbl:{width:"100%",borderCollapse:"collapse"},
  thd:{textAlign:"left",padding:"8px 10px",fontSize:11,color:"#7a6f60",fontWeight:600,textTransform:"uppercase",letterSpacing:.4,borderBottom:"1px solid rgba(212,175,105,.1)"},
  td:{padding:"10px",fontSize:13,color:"#e8dcc8",borderBottom:"1px solid rgba(212,175,105,.05)",cursor:"pointer"},
  pill:{display:"inline-block",fontSize:10,padding:"2px 8px",borderRadius:6,fontWeight:600,whiteSpace:"nowrap"},
  cPill:{display:"inline-block",fontSize:10,padding:"3px 10px",borderRadius:6,fontWeight:600},
  aBtn:{display:"inline-flex",alignItems:"center",gap:4,background:"#d4af69",color:"#1a1207",border:"none",borderRadius:8,padding:"8px 14px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"},
  sBdg:{fontSize:12,color:"#e87a7a",fontWeight:600,background:"rgba(232,122,122,.1)",padding:"2px 8px",borderRadius:6},
  srchW:{display:"flex",alignItems:"center",background:"rgba(212,175,105,.06)",border:"1px solid rgba(212,175,105,.12)",borderRadius:10,padding:"0 12px",gap:8},
  srchI:{flex:1,background:"transparent",border:"none",color:"#e8dcc8",fontSize:14,padding:"10px 0",outline:"none",fontFamily:"inherit"},
  fPill:{border:"none",borderRadius:20,padding:"5px 12px",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600},
  mBdg:{background:"rgba(212,175,105,.08)",color:"#d4af69",fontSize:11,padding:"3px 8px",borderRadius:6,fontWeight:600},
};

export default function DesktopApp({ctx}){
  const{tab,setTab,setSelC,setSelV,mdl}=ctx;
  const navItems=[
    {id:"dashboard",icon:"chart",label:"Dashboard"},
    {id:"clients",icon:"users",label:"Clients"},
    {id:"ventes",icon:"list",label:"Ventes"},
    {id:"heures",icon:"clock",label:"Heures"},
    {id:"planning",icon:"cal",label:"Planning"},
    {id:"catalogue",icon:"settings",label:"Catalogue"},
  ];

  return(
    <div style={D.wrap}>
      <aside style={D.side}>
        <div style={D.logo}><span style={{fontSize:24}}>🐴</span><span style={D.logoT}>Dream Ranch</span></div>
        {navItems.map(it=>(
          <button key={it.id} onClick={()=>{setTab(it.id);setSelC(null);setSelV(null);}} style={{...D.navIt,color:tab===it.id||(!navItems.find(n=>n.id===tab)&&it.id==="dashboard")?"#d4af69":"#7a6f60",background:tab===it.id?"rgba(212,175,105,.06)":"transparent"}} className="bh">
            <Ico n={it.icon} s={18} c={tab===it.id?"#d4af69":"#7a6f60"}/>{it.label}
          </button>
        ))}
      </aside>
      <main style={D.main}>
        {(tab==="home"||tab==="dashboard")&&<Dashboard ctx={ctx}/>}
        {tab==="clients"&&<DClients ctx={ctx}/>}
        {(tab==="fiche")&&<DFiche ctx={ctx}/>}
        {tab==="ventes"&&<DVentes ctx={ctx}/>}
        {(tab==="vd")&&<DVenteDetail ctx={ctx}/>}
        {tab==="heures"&&<DHeures ctx={ctx}/>}
        {tab==="planning"&&<DPlanning ctx={ctx}/>}
        {tab==="catalogue"&&<DCatalogue ctx={ctx}/>}
      </main>
      {mdl&&<Modals ctx={ctx}/>}
    </div>
  );
}

// ── DASHBOARD ──

function Dashboard({ctx}){
  const totalCA=ctx.vts.reduce((s,v)=>s+v.tp,0);
  const totalDu=ctx.vts.reduce((s,v)=>s+(v.du-v.tp),0);
  const nbClients=ctx.cls.length;
  const nbVentes=ctx.vts.length;
  const ventesMonth=ctx.vts.filter(v=>v.date.startsWith("2026-03"));
  const caMonth=ventesMonth.reduce((s,v)=>s+v.tp,0);
  const impayees=ctx.vts.filter(v=>v.st!=="Soldée");

  return<>
    <h1 style={D.pageT}>Dashboard</h1>
    <div style={{...D.grid,gridTemplateColumns:"repeat(4,1fr)"}}>
      <div style={D.statCard}><div style={D.statLb}>CA Total encaissé</div><div style={{...D.statVl,color:"#5ae8a0"}}>{fE(totalCA)}</div></div>
      <div style={D.statCard}><div style={D.statLb}>Reste à encaisser</div><div style={{...D.statVl,color:"#e87a7a"}}>{fE(totalDu)}</div></div>
      <div style={D.statCard}><div style={D.statLb}>CA Mars 2026</div><div style={{...D.statVl,color:"#7db8e0"}}>{fE(caMonth)}</div></div>
      <div style={D.statCard}><div style={D.statLb}>Clients actifs</div><div style={{...D.statVl,color:"#d4af69"}}>{nbClients}</div></div>
    </div>

    <div style={{...D.grid,gridTemplateColumns:"1fr 1fr"}}>
      <div style={D.card}>
        <div style={D.secT}>Impayés ({impayees.length})</div>
        <table style={D.tbl}><thead><tr><th style={D.thd}>Vente</th><th style={D.thd}>Cavalier</th><th style={D.thd}>Reste</th><th style={D.thd}>Statut</th></tr></thead><tbody>
        {impayees.slice(0,8).map(v=>{const c=ctx.gc(v.cav);const st=STATUT_COLORS[v.st];return<tr key={v.id} className="rh" onClick={()=>{ctx.setSelC(v.cav);ctx.setSelV(v.id);ctx.setTab("vd");}} style={{cursor:"pointer"}}><td style={D.td}>{v.detail}</td><td style={D.td}>{c?.prenom} {c?.nom}</td><td style={{...D.td,color:"#e87a7a",fontWeight:600}}>{fE(v.du-v.tp)}</td><td style={D.td}><span style={{...D.pill,background:st.bg,color:st.fg}}>{st.i} {v.st}</span></td></tr>})}
        </tbody></table>
      </div>
      <div style={D.card}>
        <div style={D.secT}>Dernières ventes</div>
        <table style={D.tbl}><thead><tr><th style={D.thd}>Date</th><th style={D.thd}>Vente</th><th style={D.thd}>Cavalier</th><th style={D.thd}>Montant</th></tr></thead><tbody>
        {ctx.vts.slice(0,8).map(v=>{const c=ctx.gc(v.cav);return<tr key={v.id} className="rh" onClick={()=>{ctx.setSelC(v.cav);ctx.setSelV(v.id);ctx.setTab("vd");}} style={{cursor:"pointer"}}><td style={D.td}>{fD(v.date)}</td><td style={D.td}>{v.detail}</td><td style={D.td}>{c?.prenom} {c?.nom}</td><td style={{...D.td,color:"#d4af69",fontWeight:600}}>{fE(v.du)}</td></tr>})}
        </tbody></table>
      </div>
    </div>
  </>;
}

// ── CLIENTS ──

function DClients({ctx}){
  const[q,setQ]=useState("");const[f,setF]=useState("Tous");
  const lst=useMemo(()=>{let l=ctx.cls;if(f==="Parents")l=l.filter(c=>c.type==="Parent");if(f==="Enfants")l=l.filter(c=>c.type==="Enfant");if(q.length>=2){const w=q.toLowerCase().split(/\s+/);l=l.filter(c=>w.every(z=>`${c.nom} ${c.prenom}`.toLowerCase().includes(z)));}return l.sort((a,b)=>a.nom.localeCompare(b.nom));},[ctx.cls,q,f]);
  return<>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><h1 style={{...D.pageT,margin:0}}>Clients ({lst.length})</h1><button onClick={()=>ctx.setMdl({t:"nc"})} style={D.aBtn} className="bh"><Ico n="plus" s={16}/> Nouveau client</button></div>
    <div style={{display:"flex",gap:10,marginBottom:16}}>
      <div style={{...D.srchW,flex:1,maxWidth:400}}><Ico n="srch" s={16} c="#7a6f60"/><input placeholder="Rechercher..." value={q} onChange={e=>setQ(e.target.value)} style={D.srchI}/></div>
      {["Tous","Parents","Enfants"].map(z=><button key={z} onClick={()=>setF(z)} style={{...D.fPill,background:f===z?"#d4af69":"rgba(212,175,105,.08)",color:f===z?"#1a1207":"#7a6f60"}} className="bh">{z}</button>)}
    </div>
    <div style={D.card}>
      <table style={D.tbl}><thead><tr><th style={D.thd}>Nom</th><th style={D.thd}>Type</th><th style={D.thd}>Tél</th><th style={D.thd}>Email</th><th style={D.thd}>Reste dû</th><th style={D.thd}>Heures</th></tr></thead><tbody>
      {lst.map(c=>{const s=ctx.cs(c.id);const h=ctx.ch(c.id);return<tr key={c.id} className="rh" onClick={()=>{ctx.setSelC(c.id);ctx.setTab("fiche");}} style={{cursor:"pointer"}}><td style={{...D.td,fontWeight:600}}>{c.nom} {c.prenom}</td><td style={D.td}><span style={{fontSize:11,color:c.type==="Parent"?"#d4af69":"#b8a88a"}}>{c.type}</span></td><td style={D.td}>{c.tel||"—"}</td><td style={D.td}>{c.email||"—"}</td><td style={D.td}>{s>0?<span style={D.sBdg}>{fE(s)}</span>:<span style={{color:"#5ae8a0",fontSize:12}}>OK</span>}</td><td style={D.td}><span style={{color:h.solde>0?"#7db8e0":"#7a6f60",fontWeight:600}}>{h.solde>0?`${h.solde}h`:"—"}</span></td></tr>})}
      </tbody></table>
    </div>
  </>;
}

// ── FICHE (Desktop) ──

function DFiche({ctx}){
  const c=ctx.gc(ctx.selC);if(!c)return<p>Sélectionnez un client</p>;
  const isP=c.type==="Parent";const py=ctx.gp(c.id);const fam=ctx.gf(c.id);const vts=ctx.cv(c.id);const hrs=ctx.ch(c.id);const famData=ctx.csFamille(c.id);
  return<>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
      <div style={{display:"flex",gap:14,alignItems:"center"}}>
        <button onClick={()=>ctx.setTab("clients")} style={{background:"none",border:"none",color:"#d4af69",cursor:"pointer",padding:4}} className="bh"><Ico n="back" s={20}/></button>
        <h1 style={{...D.pageT,margin:0}}>{c.prenom} {c.nom}</h1>
        <span style={{background:"rgba(212,175,105,.1)",color:"#d4af69",fontSize:11,padding:"3px 12px",borderRadius:20,fontWeight:600}}>{c.type}</span>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>ctx.setMdl({t:"dh",cid:c.id})} style={{...D.aBtn,background:"rgba(212,175,105,.15)",color:"#d4af69"}} className="bh"><Ico n="minus" s={14}/> Heures</button>
        <button onClick={()=>ctx.setMdl({t:"nv",cid:c.id})} style={D.aBtn} className="bh"><Ico n="plus" s={14}/> Vente</button>
        <button onClick={()=>ctx.setMdl({t:"ec",cid:c.id})} style={{...D.aBtn,background:"rgba(212,175,105,.15)",color:"#d4af69"}} className="bh"><Ico n="edit" s={14}/> Modifier</button>
      </div>
    </div>

    <div style={{...D.grid,gridTemplateColumns:isP?"1fr 1fr":"1fr 1fr 1fr"}}>
      {!isP&&<div style={D.statCard}><div style={D.statLb}>Reste à payer</div><div style={{...D.statVl,color:ctx.cs(c.id)>0?"#e87a7a":"#5ae8a0"}}>{fE(ctx.cs(c.id))}</div></div>}
      <div style={D.statCard}><div style={D.statLb}>Heures restantes</div><div style={{...D.statVl,color:hrs.solde>0?"#7db8e0":"#e87a7a"}}>{hrs.solde}h</div><div style={{fontSize:12,color:"#7a6f60",marginTop:4}}>{hrs.achats}h achetées · {hrs.consommes}h prises{hrs.manuels!==0?` · ${hrs.manuels>0?"+":""}${hrs.manuels}h ajustées`:""}</div></div>
      {isP&&<div style={D.card}><div style={D.secT}>Reste à payer — Famille</div>{famData.details.map(d=><div key={d.id} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(212,175,105,.04)"}}><span style={{color:"#b8a88a",fontSize:13}}>{d.nom}</span><span style={{color:d.solde>0?"#e87a7a":"#5ae8a0",fontWeight:600}}>{fE(d.solde)}</span></div>)}<div style={{display:"flex",justifyContent:"space-between",padding:"8px 0 0",marginTop:4}}><span style={{color:"#d4af69",fontWeight:700}}>Total</span><span style={{color:famData.total>0?"#e87a7a":"#5ae8a0",fontWeight:700,fontSize:18}}>{fE(famData.total)}</span></div></div>}
      {!isP&&<div style={D.card}><div style={D.secT}>Infos</div>{c.naissance&&<IR l="Né(e) le" v={fD(c.naissance)}/>}{py&&<IR l="Payeur" v={`${py.prenom} ${py.nom}`}/>}</div>}
    </div>

    {isP&&<div style={D.card}><div style={D.secT}>Informations</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{c.tel&&<IR l="Tél" v={c.tel}/>}{c.email&&<IR l="Email" v={c.email}/>}{c.adresse&&<IR l="Adresse" v={`${c.adresse}, ${c.cp} ${c.ville}`}/>}{c.naissance&&<IR l="Né(e) le" v={fD(c.naissance)}/>}</div></div>}

    {fam.length>0&&<div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}><span style={{color:"#7a6f60",fontSize:13,alignSelf:"center"}}>Famille :</span>{fam.map(f=><button key={f.id} onClick={()=>ctx.setSelC(f.id)} style={{background:"rgba(212,175,105,.06)",border:"1px solid rgba(212,175,105,.12)",borderRadius:20,padding:"5px 14px",color:"#e8dcc8",fontSize:12,cursor:"pointer",fontFamily:"inherit"}} className="bh">{f.type==="Enfant"?"👧":"👤"} {f.prenom}</button>)}</div>}

    <div style={D.card}><div style={D.secT}>Ventes ({vts.length})</div>
    <table style={D.tbl}><thead><tr><th style={D.thd}>Date</th><th style={D.thd}>Prestation</th><th style={D.thd}>Montant</th><th style={D.thd}>Payé</th><th style={D.thd}>Reste</th><th style={D.thd}>Statut</th></tr></thead><tbody>
    {vts.map(v=>{const st=STATUT_COLORS[v.st];const r=v.du-v.tp;return<tr key={v.id} className="rh" onClick={()=>{ctx.setSelV(v.id);ctx.setTab("vd");}} style={{cursor:"pointer"}}><td style={D.td}>{fD(v.date)}</td><td style={{...D.td,fontWeight:600}}>{v.detail}</td><td style={D.td}>{fE(v.du)}</td><td style={{...D.td,color:"#5ae8a0"}}>{fE(v.tp)}</td><td style={{...D.td,color:r>0?"#e87a7a":"#5ae8a0"}}>{fE(r)}</td><td style={D.td}><span style={{...D.pill,background:st.bg,color:st.fg}}>{st.i} {v.st}</span></td></tr>})}
    </tbody></table></div>
  </>;
}

// ── VENTE DETAIL (Desktop) ──

function DVenteDetail({ctx}){
  const v=ctx.vts.find(z=>z.id===ctx.selV);if(!v)return<p>Vente introuvable</p>;
  const c=ctx.gc(v.cav),py=ctx.gc(v.pay),pr=ctx.cat.find(z=>z.id===v.prest);
  const st=STATUT_COLORS[v.st],ct=CAT_COLORS[pr?.cat]||CAT_COLORS.Autre,r=v.du-v.tp;
  return<>
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
      <button onClick={()=>ctx.setTab(ctx.selC?"fiche":"ventes")} style={{background:"none",border:"none",color:"#d4af69",cursor:"pointer"}} className="bh"><Ico n="back" s={20}/></button>
      <h1 style={{...D.pageT,margin:0}}>{v.detail}</h1>
      <span style={{...D.cPill,background:ct.bg,color:ct.fg}}>{pr?.cat}</span>
      <span style={{...D.pill,background:st.bg,color:st.fg}}>{st.i} {v.st}</span>
      {v.fact&&<span style={{...D.cPill,background:"#1a3d5c",color:"#7db8e0"}}>📄 Facturée</span>}
      <div style={{flex:1}}/>
      {r>0&&<button onClick={()=>ctx.setMdl({t:"np",vid:v.id})} style={D.aBtn} className="bh"><Ico n="plus" s={14}/> Paiement</button>}
    </div>
    <div style={{...D.grid,gridTemplateColumns:"1fr 1fr"}}>
      <div style={D.card}><div style={D.secT}>Informations</div><IR l="Cavalier" v={c?`${c.prenom} ${c.nom}`:""}/><IR l="Payeur" v={py?`${py.prenom} ${py.nom}`:""}/><IR l="Date" v={fD(v.date)}/><IR l="Réf." v={v.ref}/>{v.rem>0&&<IR l="Remise" v={fE(v.rem)}/>}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        <div style={D.statCard}><div style={D.statLb}>Montant dû</div><div style={{...D.statVl,color:"#e8dcc8"}}>{fE(v.du)}</div></div>
        <div style={D.statCard}><div style={D.statLb}>Payé</div><div style={{...D.statVl,color:"#5ae8a0"}}>{fE(v.tp)}</div></div>
        <div style={D.statCard}><div style={D.statLb}>Reste</div><div style={{...D.statVl,color:r>0?"#e8c44a":"#5ae8a0"}}>{fE(r)}</div></div>
      </div>
    </div>
    <div style={D.card}><div style={D.secT}>Paiements ({v.pays.length})</div>
    {v.pays.length===0?<p style={{color:"#5a5040",fontSize:13}}>Aucun paiement</p>:
    <table style={D.tbl}><thead><tr><th style={D.thd}>Date</th><th style={D.thd}>Montant</th><th style={D.thd}>Mode</th><th style={D.thd}>N° chèque</th></tr></thead><tbody>
    {v.pays.map(p=><tr key={p.id}><td style={D.td}>{fD(p.date)}</td><td style={{...D.td,fontWeight:600,color:"#5ae8a0"}}>{fE(p.mt)}</td><td style={D.td}><span style={D.mBdg}>{p.mode}</span></td><td style={D.td}>{p.chq||"—"}</td></tr>)}
    </tbody></table>}</div>
  </>;
}

// ── VENTES TABLE ──

function DVentes({ctx}){
  const[f,setF]=useState("Tous");
  const lst=useMemo(()=>{if(f==="Tous")return ctx.vts;return ctx.vts.filter(v=>v.st===f);},[ctx.vts,f]);
  return<>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><h1 style={{...D.pageT,margin:0}}>Ventes ({lst.length})</h1></div>
    <div style={{display:"flex",gap:6,marginBottom:16}}>{["Tous","Non payée","Partielle","Soldée"].map(z=><button key={z} onClick={()=>setF(z)} style={{...D.fPill,background:f===z?"#d4af69":"rgba(212,175,105,.08)",color:f===z?"#1a1207":"#7a6f60"}} className="bh">{z}</button>)}</div>
    <div style={D.card}><table style={D.tbl}><thead><tr><th style={D.thd}>Date</th><th style={D.thd}>Réf.</th><th style={D.thd}>Prestation</th><th style={D.thd}>Cavalier</th><th style={D.thd}>Montant</th><th style={D.thd}>Payé</th><th style={D.thd}>Reste</th><th style={D.thd}>Statut</th></tr></thead><tbody>
    {lst.map(v=>{const c=ctx.gc(v.cav);const st=STATUT_COLORS[v.st];const r=v.du-v.tp;return<tr key={v.id} className="rh" onClick={()=>{ctx.setSelC(v.cav);ctx.setSelV(v.id);ctx.setTab("vd");}} style={{cursor:"pointer"}}><td style={D.td}>{fD(v.date)}</td><td style={{...D.td,color:"#7a6f60",fontSize:11}}>{v.ref}</td><td style={{...D.td,fontWeight:600}}>{v.detail}</td><td style={D.td}>{c?.prenom} {c?.nom}</td><td style={D.td}>{fE(v.du)}</td><td style={{...D.td,color:"#5ae8a0"}}>{fE(v.tp)}</td><td style={{...D.td,color:r>0?"#e87a7a":"#5ae8a0"}}>{fE(r)}</td><td style={D.td}><span style={{...D.pill,background:st.bg,color:st.fg}}>{st.i} {v.st}</span></td></tr>})}
    </tbody></table></div>
  </>;
}

// ── HEURES ──

function DHeures({ctx}){
  const lst=useMemo(()=>ctx.cls.filter(c=>ctx.cv(c.id).some(v=>{const p=ctx.cat.find(z=>z.id===v.prest);return p?.h>0;})).sort((a,b)=>a.nom.localeCompare(b.nom)),[ctx.cls,ctx.cv,ctx.cat]);
  return<>
    <h1 style={D.pageT}>Heures de cours</h1>
    <div style={D.card}><table style={D.tbl}><thead><tr><th style={D.thd}>Cavalier</th><th style={D.thd}>Type</th><th style={D.thd}>Achetées</th><th style={D.thd}>Prises</th><th style={D.thd}>Ajustées</th><th style={D.thd}>Solde</th><th style={D.thd}></th></tr></thead><tbody>
    {lst.map(c=>{const h=ctx.ch(c.id);return<tr key={c.id} className="rh"><td style={{...D.td,fontWeight:600,cursor:"pointer"}} onClick={()=>{ctx.setSelC(c.id);ctx.setTab("fiche");}}>{c.prenom} {c.nom}</td><td style={D.td}>{c.type}</td><td style={{...D.td,color:"#7db8e0",fontWeight:600}}>{h.achats}h</td><td style={{...D.td,color:"#e8c44a",fontWeight:600}}>{h.consommes}h</td><td style={{...D.td,color:h.manuels!==0?"#c9a0e8":"#7a6f60",fontWeight:600}}>{h.manuels!==0?`${h.manuels>0?"+":""}${h.manuels}h`:"—"}</td><td style={{...D.td,color:h.solde>0?"#5ae8a0":"#e87a7a",fontWeight:700,fontSize:15}}>{h.solde}h</td><td style={D.td}><button onClick={()=>ctx.setMdl({t:"dh",cid:c.id})} style={{background:"rgba(212,175,105,.1)",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",color:"#d4af69",fontSize:11,fontWeight:600}} className="bh">± Ajuster</button></td></tr>})}
    </tbody></table></div>
  </>;
}

// ── PLANNING ──

function DPlanning({ctx}){
  const[j,setJ]=useState("Mercredi");
  const jc=ctx.crs.filter(cr=>cr.jour===j).sort((a,b)=>a.heure.localeCompare(b.heure));
  return<>
    <h1 style={D.pageT}>Planning</h1>
    <div style={{display:"flex",gap:6,marginBottom:16}}>{JOURS.map(d=>{const n=ctx.crs.filter(cr=>cr.jour===d).length;return<button key={d} onClick={()=>setJ(d)} style={{...D.fPill,background:j===d?"#d4af69":"rgba(212,175,105,.08)",color:j===d?"#1a1207":"#7a6f60",padding:"8px 16px"}} className="bh">{d}{n>0&&<span style={{fontSize:10,marginLeft:4,opacity:.7}}>({n})</span>}</button>})}</div>
    {jc.length===0&&<p style={{color:"#5a5040"}}>Aucun créneau</p>}
    <div style={{...D.grid,gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))"}}>
    {jc.map(cr=><div key={cr.id} style={D.card}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div><span style={{fontWeight:700,color:"#d4af69",fontSize:18}}>{cr.heure}</span><span style={{color:"#b8a88a",marginLeft:10,fontSize:15}}>{cr.nom}</span></div><button onClick={()=>ctx.setMdl({t:"pr",crid:cr.id})} style={D.aBtn} className="bh"><Ico n="chk" s={14}/> Présences</button></div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{cr.cavs.map(id=>{const c=ctx.gc(id);return c?<span key={id} style={{background:"rgba(212,175,105,.06)",borderRadius:8,padding:"5px 12px",fontSize:13,color:"#b8a88a",cursor:"pointer"}} onClick={()=>{ctx.setSelC(id);ctx.setTab("fiche");}} className="bh">{c.prenom} {c.nom}</span>:null})}</div>
    </div>)}
    </div>
  </>;
}

// ── CATALOGUE ──

function DCatalogue({ctx}){
  const[f,setF]=useState("Tous");const[q,setQ]=useState("");
  const lst=useMemo(()=>{let l=ctx.cat.filter(p=>p.actif);if(f!=="Tous")l=l.filter(p=>p.cat===f);if(q.length>=2)l=l.filter(p=>p.nom.toLowerCase().includes(q.toLowerCase()));return l;},[ctx.cat,f,q]);
  return<>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><h1 style={{...D.pageT,margin:0}}>Catalogue ({lst.length})</h1></div>
    <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
      <div style={{...D.srchW,maxWidth:300}}><Ico n="srch" s={14} c="#7a6f60"/><input placeholder="Rechercher..." value={q} onChange={e=>setQ(e.target.value)} style={D.srchI}/></div>
      {["Tous",...["Cours","Forfait","Adhésion","Licence","Stage","Pension","Autre"]].map(z=><button key={z} onClick={()=>setF(z)} style={{...D.fPill,background:f===z?"#d4af69":"rgba(212,175,105,.08)",color:f===z?"#1a1207":"#7a6f60"}} className="bh">{z}</button>)}
    </div>
    <div style={D.card}><table style={D.tbl}><thead><tr><th style={D.thd}>Prestation</th><th style={D.thd}>Catégorie</th><th style={D.thd}>Prix TTC</th><th style={D.thd}>TVA</th><th style={D.thd}>Heures</th></tr></thead><tbody>
    {lst.map(p=>{const ct=CAT_COLORS[p.cat]||CAT_COLORS.Autre;return<tr key={p.id} className="rh"><td style={{...D.td,fontWeight:600}}>{p.nom}</td><td style={D.td}><span style={{...D.cPill,background:ct.bg,color:ct.fg}}>{p.cat}</span></td><td style={{...D.td,color:"#d4af69",fontWeight:600}}>{p.prix===0?"Variable":fE(p.prix)}</td><td style={D.td}>{p.tva}%</td><td style={D.td}>{p.h>0?`${p.h}h`:"—"}</td></tr>})}
    </tbody></table></div>
  </>;
}
