import { useState, useMemo } from "react";
const JOURS = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
import { fD, fE, Ico, IR, STATUT_COLORS } from "../data/helpers.jsx";
import { Modals } from "./Modals.jsx";

const S={root:{maxWidth:520,margin:"0 auto",position:"relative",paddingBottom:80,paddingTop:56,minHeight:"100vh",overflowY:"auto",WebkitOverflowScrolling:"touch"},hdr:{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(18,16,12,.92)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(212,175,105,.08)"},hdrIn:{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",maxWidth:520,margin:"0 auto"},hdrT:{fontFamily:"'DM Serif Display',serif",fontSize:18,fontWeight:400,color:"#d4af69",margin:0,flex:1,textAlign:"center"},hdrBtn:{background:"none",border:"none",color:"#d4af69",cursor:"pointer",padding:8,borderRadius:8},
/* Nav bar: higher padding, better visibility */
nav0:{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"rgba(18,16,12,.98)",backdropFilter:"blur(12px)",borderTop:"1px solid rgba(212,175,105,.1)",display:"flex",justifyContent:"space-around",alignItems:"stretch",padding:"8px 0 14px",maxWidth:520,margin:"0 auto"},
navIt:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"4px 14px",fontFamily:"inherit",flex:1},
/* Caisse nav button special */
navCaisse:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"4px 14px",fontFamily:"inherit",flex:1,position:"relative"},
card:{background:"rgba(212,175,105,.03)",border:"1px solid rgba(212,175,105,.08)",borderRadius:14,padding:16,marginBottom:12},secT:{fontFamily:"'DM Serif Display',serif",fontSize:16,color:"#d4af69",fontWeight:400,marginBottom:4},lRow:{display:"flex",alignItems:"center",gap:10,padding:"10px 4px",width:"100%",border:"none",borderBottom:"1px solid rgba(212,175,105,.05)",background:"transparent",cursor:"pointer",textAlign:"left",fontFamily:"inherit"},rT:{fontWeight:600,color:"#e8dcc8",fontSize:13},rS:{color:"#7a6f60",fontSize:11,marginTop:1},av:{width:36,height:36,borderRadius:"50%",background:"rgba(212,175,105,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0},bAv:{width:52,height:52,borderRadius:"50%",background:"rgba(212,175,105,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0},tBdg:{display:"inline-block",background:"rgba(212,175,105,.1)",color:"#d4af69",fontSize:10,padding:"2px 10px",borderRadius:20,fontWeight:600},pill:{display:"inline-block",fontSize:10,padding:"2px 8px",borderRadius:6,fontWeight:600,whiteSpace:"nowrap"},cPill:{display:"inline-block",fontSize:10,padding:"3px 10px",borderRadius:6,fontWeight:600},sBdg:{fontSize:11,color:"#e87a7a",fontWeight:600,whiteSpace:"nowrap",background:"rgba(232,122,122,.1)",padding:"2px 8px",borderRadius:6},mBdg:{background:"rgba(212,175,105,.08)",color:"#d4af69",fontSize:11,padding:"4px 10px",borderRadius:6,fontWeight:600},mSt:{background:"rgba(212,175,105,.05)",borderRadius:10,padding:10,textAlign:"center"},mLb:{fontSize:10,color:"#7a6f60",marginBottom:3,textTransform:"uppercase",letterSpacing:.4,fontWeight:600},mVl:{fontSize:16,fontWeight:700,color:"#e8dcc8"},fNm:{fontFamily:"'DM Serif Display',serif",fontSize:20,color:"#d4af69",margin:0,fontWeight:400},aBtn:{display:"inline-flex",alignItems:"center",gap:4,background:"#d4af69",color:"#1a1207",border:"none",borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"},iBtn:{background:"rgba(212,175,105,.08)",border:"1px solid rgba(212,175,105,.12)",borderRadius:8,padding:8,cursor:"pointer"},srchW:{display:"flex",alignItems:"center",background:"rgba(212,175,105,.06)",border:"1px solid rgba(212,175,105,.12)",borderRadius:12,padding:"0 14px",gap:10},srchI:{flex:1,background:"transparent",border:"none",color:"#e8dcc8",fontSize:15,padding:"13px 0",outline:"none",fontFamily:"inherit"},clrB:{background:"none",border:"none",color:"#7a6f60",cursor:"pointer",padding:4},famC:{background:"rgba(212,175,105,.06)",border:"1px solid rgba(212,175,105,.12)",borderRadius:20,padding:"6px 14px",color:"#e8dcc8",fontSize:12,cursor:"pointer",fontFamily:"inherit"},qGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"18px 0 14px"},qBtn:{display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:"18px 12px",background:"rgba(212,175,105,.04)",border:"1px solid rgba(212,175,105,.1)",borderRadius:14,cursor:"pointer",fontFamily:"inherit",color:"#b8a88a",fontSize:12,fontWeight:500},qIco:{width:44,height:44,borderRadius:"50%",background:"rgba(212,175,105,.08)",display:"flex",alignItems:"center",justifyContent:"center"},mt:{textAlign:"center",color:"#5a5040",padding:20,fontSize:13},resList:{marginTop:8,background:"rgba(212,175,105,.03)",borderRadius:12,border:"1px solid rgba(212,175,105,.08)",overflow:"hidden"},jPill:{border:"none",borderRadius:10,padding:"8px 14px",fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:600,whiteSpace:"nowrap"},th:{fontSize:10,color:"#7a6f60",fontWeight:600,textTransform:"uppercase",letterSpacing:.4},fPill:{border:"none",borderRadius:20,padding:"6px 14px",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600},tabBtn:{flex:1,padding:"8px 0",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",textAlign:"center"},stBx:{background:"rgba(212,175,105,.04)",border:"1px solid rgba(212,175,105,.08)",borderRadius:12,padding:14,textAlign:"center",display:"flex",flexDirection:"column",minHeight:120},stLb:{fontSize:10,color:"#7a6f60",marginBottom:6,textTransform:"uppercase",letterSpacing:.5,fontWeight:600},stVl:{fontSize:22,fontWeight:700,flex:1,display:"flex",alignItems:"center",justifyContent:"center"},stSub:{fontSize:10,color:"#7a6f60",marginTop:6,textAlign:"center"}};

export default function MobileApp({ctx}){
  const{tab,setTab,selC,setSelC,selV,setSelV,mdl}=ctx;
  const goHome=()=>{setTab("home");setSelC(null);setSelV(null);};
  const titles={home:"Dream Ranch",fiche:"Fiche cavalier",vd:"Détail vente",clients:"Clients",heures:"Heures de cours",planning:"Planning",caisse:"Caisse"};
  const navTabs=[["home","home","Accueil"],["clients","users","Clients"],["planning","cal","Planning"],["caisse","file","Caisse"]];

  return(<div style={S.root}>
    <header style={S.hdr}><div style={S.hdrIn}>
      {tab!=="home"?<button onClick={()=>{if(tab==="vd")setTab("fiche");else goHome();}} style={S.hdrBtn} className="bh"><Ico n="back" s={18}/></button>:<div style={{width:30,height:30,borderRadius:"50%",background:"white",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 2px 8px rgba(0,0,0,.2)"}}><img src="/logo.svg" alt="" style={{width:22,height:22,objectFit:"contain"}}/></div>}
      <h1 style={S.hdrT}>{titles[tab]}</h1>
      {tab==="planning"?<button onClick={()=>ctx.setMdl({t:"ncr",jour:"Mercredi"})} style={{...S.aBtn,padding:"5px 10px",fontSize:11}} className="bh"><Ico n="plus" s={14}/></button>:tab==="heures"?<button onClick={()=>ctx.setMdl({t:"dhq"})} style={{...S.aBtn,padding:"5px 10px",fontSize:11}} className="bh"><Ico n="plus" s={14}/></button>:<div style={{width:36}}/>}
    </div></header>

    <div style={{padding:"12px 0 0"}}>
      {tab==="home"&&<Home ctx={ctx}/>}
      {tab==="fiche"&&<Fiche ctx={ctx}/>}
      {tab==="vd"&&<VDetail ctx={ctx}/>}
      {tab==="clients"&&<Clients ctx={ctx}/>}
      {tab==="heures"&&<Heures ctx={ctx}/>}
      {tab==="planning"&&<Planning ctx={ctx}/>}
      {tab==="caisse"&&<Caisse ctx={ctx}/>}
    </div>

    {/* Nav bar */}
    <nav style={S.nav0}>
      {navTabs.map(([id,ic,lb])=>{
        const act=tab===id||(id==="home"&&(tab==="fiche"||tab==="vd"));
        const isCaisse=id==="caisse";
        return<button key={id} onClick={()=>{setTab(id);setSelC(null);setSelV(null);}} style={{...S.navIt,color:act?"#d4af69":"#6a5f50"}} className="bh">
          {isCaisse?<div style={{width:42,height:42,borderRadius:"50%",background:act?"#d4af69":"rgba(212,175,105,.15)",display:"flex",alignItems:"center",justifyContent:"center",marginTop:-14,border:"3px solid #12100c",boxShadow:"0 2px 12px rgba(212,175,105,.3)"}}><span style={{fontSize:20,fontWeight:800,color:act?"#1a1207":"#d4af69"}}>€</span></div>:<Ico n={ic} s={20} c={act?"#d4af69":"#6a5f50"}/>}
          <span style={{fontSize:10,color:act?"#d4af69":"#6a5f50",fontWeight:isCaisse?700:400,marginTop:isCaisse?2:0}}>{lb}</span>
        </button>;
      })}
    </nav>

    {mdl&&<Modals ctx={ctx}/>}
  </div>);
}

function Home({ctx}){const[q,setQ]=useState("");const res=useMemo(()=>{if(q.length<2)return[];const w=q.toLowerCase().split(/\s+/);return ctx.cls.filter(c=>w.every(z=>`${c.prenom} ${c.nom}`.toLowerCase().includes(z))).slice(0,8);},[q,ctx.cls]);return<div style={{padding:"0 16px"}}><div style={{textAlign:"center",padding:"20px 0 14px"}}><div style={{width:72,height:72,borderRadius:"50%",background:"white",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px",boxShadow:"0 4px 20px rgba(0,0,0,.3)"}}><img src="/logo.svg" alt="Dream Ranch" style={{width:56,height:56,objectFit:"contain"}}/></div><h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:26,color:"#d4af69",margin:0,fontWeight:400}}>Dream Ranch</h2><p style={{color:"#7a6f60",fontSize:13,marginTop:3}}>Gestion du centre équestre</p></div><div style={S.srchW}><Ico n="srch" s={16} c="#7a6f60"/><input placeholder="Rechercher un cavalier..." value={q} onChange={e=>setQ(e.target.value)} style={S.srchI} autoComplete="off"/>{q&&<button onClick={()=>setQ("")} style={S.clrB} className="bh"><Ico n="x" s={14} c="#7a6f60"/></button>}</div>{res.length>0&&<div style={S.resList}>{res.map(c=>{const s=ctx.cs(c.id);return<button key={c.id} onClick={()=>{ctx.setSelC(c.id);ctx.setTab("fiche");}} style={{...S.lRow,padding:"10px 14px"}} className="bh rh"><div style={S.av}>{c.type==="Enfant"?"👧":"👤"}</div><div style={{flex:1,minWidth:0}}><div style={S.rT}>{c.prenom} {c.nom}</div><div style={S.rS}>{c.type}{c.type==="Enfant"&&c.parentId?` · enfant de ${ctx.gc(c.parentId)?.prenom}`:""}</div></div>{s>0&&<span style={S.sBdg}>{fE(s)}</span>}<Ico n="chev" s={14} c="#6a5f50"/></button>})}</div>}{q.length>=2&&res.length===0&&<p style={S.mt}>Aucun résultat</p>}<div style={S.qGrid}><button onClick={()=>ctx.setMdl({t:"nvq"})} style={S.qBtn} className="bh"><div style={S.qIco}><Ico n="plus" s={20} c="#d4af69"/></div>Prestation</button><button onClick={()=>ctx.setMdl({t:"nc"})} style={S.qBtn} className="bh"><div style={S.qIco}><Ico n="users" s={20} c="#d4af69"/></div>Nouveau client</button><button onClick={()=>ctx.setTab("planning")} style={S.qBtn} className="bh"><div style={S.qIco}><Ico n="cal" s={20} c="#d4af69"/></div>Planning</button><button onClick={()=>ctx.setTab("heures")} style={S.qBtn} className="bh"><div style={S.qIco}><Ico n="clock" s={20} c="#d4af69"/></div>Heures</button></div><div style={S.secT}>Dernières prestations</div><div style={S.card}>{[...ctx.vts].sort((a,b)=>(b.date||"").localeCompare(a.date||"")).slice(0,5).map(v=>{const c=ctx.gc(v.cav);const st=STATUT_COLORS[v.st];return<button key={v.id} onClick={()=>{ctx.setSelC(v.cav);ctx.setSelV(v.id);ctx.setTab("vd");}} style={S.lRow} className="bh rh"><div style={{flex:1,minWidth:0}}><div style={S.rT}>{v.detail}</div><div style={S.rS}>{c?.prenom} {c?.nom} · {fD(v.date)}</div></div><div style={{textAlign:"right"}}><div style={{fontWeight:700,color:"#d4af69",fontSize:14}}>{fE(v.du)}</div><span style={{...S.pill,background:st.bg,color:st.fg}}>{st.i} {v.st}</span></div></button>})}</div></div>;}

/* ── FICHE CAVALIER ── */
function Fiche({ctx}){
  const c=ctx.gc(ctx.selC);if(!c)return<p style={S.mt}>Sélectionnez un cavalier</p>;
  const isP=c.type==="Parent";const py=ctx.gp(c.id);const fam=ctx.gf(c.id);
  const vts=ctx.cv(c.id);const hrs=ctx.ch(c.id);
  const famData=ctx.csFamille(c.id);
  const displaySolde=isP?famData.total:ctx.cs(c.id);
  const[ficheTab,setFicheTab]=useState("prestations");
  const heurHist=ctx.hm.filter(h=>h.cav===c.id).sort((a,b)=>b.date.localeCompare(a.date));

  return<div style={{padding:"0 16px"}}>
    <div style={S.card}>
      <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:14}}>
        <div style={S.bAv}>{c.type==="Enfant"?"👧":"👤"}</div>
        <div style={{flex:1}}>
          <h2 style={S.fNm}>{c.prenom} {c.nom}</h2>
          <div style={{display:"flex",gap:6,marginTop:4}}>
            <span style={S.tBdg}>{c.type}</span>
            {c.actif&&<span style={{...S.tBdg,background:"#0f3d2a",color:"#5ae8a0"}}>Actif</span>}
          </div>
        </div>
        <button onClick={()=>ctx.setMdl({t:"ec",cid:c.id})} style={S.iBtn} className="bh"><Ico n="edit" s={16} c="#d4af69"/></button>
      </div>
      {!isP&&<>{py&&<IR l="Parent" v={`${py.prenom} ${py.nom}`}/>}</>}
      {isP&&<>{c.tel&&<IR l="Tél" v={c.tel}/>}</>}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
      <div style={S.stBx}>
        <div style={S.stLb}>Reste à payer</div>
        <div style={{...S.stVl,color:displaySolde>0?"#e87a7a":"#5ae8a0"}}>{fE(displaySolde)}</div>
        {isP&&famData.details.length>1&&<div style={{marginTop:4,borderTop:"1px solid rgba(212,175,105,.08)",paddingTop:4}}>
          {famData.details.map(d=><div key={d.id} style={{display:"flex",justifyContent:"space-between",padding:"1px 0"}}>
            <span style={{color:"#7a6f60",fontSize:9}}>{d.nom.split(" ")[0]}</span>
            <span style={{color:d.solde>0?"#e87a7a":"#5ae8a0",fontSize:9,fontWeight:600}}>{fE(d.solde)}</span>
          </div>)}
        </div>}
      </div>
      <div style={S.stBx}>
        <div style={S.stLb}>Heures restantes</div>
        <div style={{...S.stVl,color:hrs.solde>0?"#7db8e0":hrs.solde<0?"#e87a7a":"#5ae8a0"}}>{hrs.solde}h</div>
        <div style={S.stSub}>{hrs.achats}h achetées · {hrs.consommes}h prises</div>
      </div>
    </div>
    {fam.length>0&&<div style={S.card}><div style={S.secT}>Famille</div><div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8}}>{fam.map(f=><button key={f.id} onClick={()=>ctx.setSelC(f.id)} style={S.famC} className="bh">{f.type==="Enfant"?"👧":"👤"} {f.prenom}</button>)}</div></div>}
    <div style={S.card}>
      <div style={S.secT}>Historique</div>
      <div style={{display:"flex",gap:4,marginBottom:12,marginTop:8,background:"rgba(212,175,105,.06)",borderRadius:10,padding:3}}>
        <button onClick={()=>setFicheTab("prestations")} style={{...S.tabBtn,background:ficheTab==="prestations"?"#d4af69":"transparent",color:ficheTab==="prestations"?"#1a1207":"#7a6f60"}} className="bh">Prestations</button>
        <button onClick={()=>setFicheTab("heures")} style={{...S.tabBtn,background:ficheTab==="heures"?"#d4af69":"transparent",color:ficheTab==="heures"?"#1a1207":"#7a6f60"}} className="bh">Heures de cours</button>
      </div>
      {ficheTab==="prestations"&&<>
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}><button onClick={()=>ctx.setMdl({t:"nv",cid:c.id})} style={S.aBtn} className="bh"><Ico n="plus" s={14}/> Prestation</button></div>
        {vts.length===0&&<p style={S.mt}>Aucune prestation</p>}
        {vts.map(v=>{const st=STATUT_COLORS[v.st];const r=v.du-v.tp;return<button key={v.id} onClick={()=>{ctx.setSelV(v.id);ctx.setTab("vd");}} style={S.lRow} className="bh rh"><div style={{flex:1,minWidth:0}}><div style={S.rT}>{v.detail}</div><div style={S.rS}>{fD(v.date)}{r>0?` · reste ${fE(r)}`:""}</div></div><span style={{...S.pill,background:st.bg,color:st.fg}}>{st.i} {v.st}</span><Ico n="chev" s={14} c="#6a5f50"/></button>})}
      </>}
      {ficheTab==="heures"&&<>
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}><button onClick={()=>ctx.setMdl({t:"dh",cid:c.id})} style={S.aBtn} className="bh"><Ico n="plus" s={14}/> Ajuster</button></div>
        {/* Achats de prestations avec heures */}
        {vts.filter(vt=>{const p=ctx.cat.find(z=>z.id===vt.prest);return p?.h>0;}).sort((a,b)=>(b.date||"").localeCompare(a.date||"")).map(vt=>{const p=ctx.cat.find(z=>z.id===vt.prest);return<div key={"vt-"+vt.id} style={{...S.lRow,cursor:"default"}}><div style={{flex:1}}><div style={S.rT}>{vt.detail||p?.nom||"Prestation"}</div><div style={S.rS}>{fD(vt.date)} · Achat</div></div><span style={{fontSize:13,fontWeight:700,color:"#5ae8a0"}}>+{p?.h||0}h</span></div>})}
        {/* Présences (heures prises) */}
        {ctx.prs.filter(p=>p.cav===c.id&&p.ok).sort((a,b)=>(b.date||"").localeCompare(a.date||"")).map(p=>{const cr=ctx.crs.find(x=>x.id===p.cr);return<div key={p.id} style={{...S.lRow,cursor:"default"}}><div style={{flex:1}}><div style={S.rT}>{cr?.nom||"Cours"}</div><div style={S.rS}>{fD(p.date)} · Présence</div></div><span style={{fontSize:13,fontWeight:700,color:"#e87a7a"}}>-1h</span></div>})}
        {/* Ajustements manuels — afficher le motif */}
        {heurHist.map(h=><div key={h.id} style={{...S.lRow,cursor:"default"}}><div style={{flex:1}}><div style={{...S.rT,color:h.delta>0?"#5ae8a0":"#e87a7a"}}>{h.delta>0?"+":""}{h.delta}h — {h.motif||"Ajustement"}</div><div style={S.rS}>{fD(h.date)}</div></div></div>)}
        {vts.filter(vt=>{const p=ctx.cat.find(z=>z.id===vt.prest);return p?.h>0;}).length===0&&heurHist.length===0&&ctx.prs.filter(p=>p.cav===c.id&&p.ok).length===0&&<p style={S.mt}>Aucun historique</p>}
      </>}
    </div>
  </div>;
}

function VDetail({ctx}){const v=ctx.vts.find(z=>z.id===ctx.selV);if(!v)return<p style={S.mt}>Vente introuvable</p>;const c=ctx.gc(v.cav),py=ctx.gc(v.pay),pr=ctx.cat.find(z=>z.id===v.prest);const st=STATUT_COLORS[v.st],ct=(pr?.cat&&{Cours:{bg:"#1a4d3a",fg:"#7ee8b5"},Forfait:{bg:"#3d1a5c",fg:"#c9a0e8"},"Adhésion":{bg:"#1a3352",fg:"#7db8e0"},Licence:{bg:"#52400a",fg:"#e8c84a"},Stage:{bg:"#5c1a1a",fg:"#e88a8a"},Pension:{bg:"#2a4a2a",fg:"#8ac98a"},Autre:{bg:"#3a3a3a",fg:"#aaa"}}[pr.cat])||{bg:"#3a3a3a",fg:"#aaa"},r=v.du-v.tp;return<div style={{padding:"0 16px"}}><div style={S.card}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}><div><h2 style={S.fNm}>{v.detail}</h2><div style={{display:"flex",gap:6,marginTop:6}}><span style={{...S.cPill,background:ct.bg,color:ct.fg}}>{pr?.cat}</span><span style={{...S.pill,background:st.bg,color:st.fg}}>{st.i} {v.st}</span></div></div>{v.fact&&<span style={{...S.cPill,background:"#1a3d5c",color:"#7db8e0"}}>📄</span>}</div><IR l="Cavalier" v={c?`${c.prenom} ${c.nom}`:""}/><IR l="Payeur" v={py?`${py.prenom} ${py.nom}`:""}/><IR l="Date" v={fD(v.date)}/><IR l="Réf." v={v.ref}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:16}}><div style={S.mSt}><div style={S.mLb}>Dû</div><div style={S.mVl}>{fE(v.du)}</div></div><div style={S.mSt}><div style={S.mLb}>Payé</div><div style={{...S.mVl,color:"#5ae8a0"}}>{fE(v.tp)}</div></div><div style={S.mSt}><div style={S.mLb}>Reste</div><div style={{...S.mVl,color:r>0?"#e8c44a":"#5ae8a0"}}>{fE(r)}</div></div></div></div><div style={S.card}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={S.secT}>Paiements</div>{r>0&&<button onClick={()=>ctx.setMdl({t:"np",vid:v.id})} style={S.aBtn} className="bh"><Ico n="plus" s={14}/> Paiement</button>}</div>{v.pays.length===0&&<p style={S.mt}>Aucun paiement</p>}{v.pays.map(p=><div key={p.id} style={S.lRow}><div style={{flex:1}}><div style={S.rT}>{fE(p.mt)}</div><div style={S.rS}>{fD(p.date)}{p.chq?` · Chq n°${p.chq}`:""}</div></div><span style={S.mBdg}>{p.mode}</span></div>)}</div><div style={{padding:"8px 0"}}><button onClick={()=>{if(confirm("Supprimer cette prestation ? Cette action est irréversible.")){ctx.delV(v.id);ctx.setTab("fiche");}}} style={{width:"100%",background:"rgba(232,122,122,.1)",color:"#e87a7a",border:"1px solid rgba(232,122,122,.2)",borderRadius:12,padding:"12px 0",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} className="bh">Annuler cette prestation</button></div></div>;}

function Clients({ctx}){const[q,setQ]=useState("");const[f,setF]=useState("Tous");const lst=useMemo(()=>{let l=ctx.cls;if(f==="Parents")l=l.filter(c=>c.type==="Parent");if(f==="Enfants")l=l.filter(c=>c.type==="Enfant");if(q.length>=2){const w=q.toLowerCase().split(/\s+/);l=l.filter(c=>w.every(z=>`${c.prenom} ${c.nom}`.toLowerCase().includes(z)));}return l.sort((a,b)=>a.nom.localeCompare(b.nom));},[ctx.cls,q,f]);return<div style={{padding:"0 16px"}}><div style={{display:"flex",gap:8,marginBottom:12}}><div style={{...S.srchW,flex:1}}><Ico n="srch" s={16} c="#7a6f60"/><input placeholder="Rechercher..." value={q} onChange={e=>setQ(e.target.value)} style={S.srchI}/></div><button onClick={()=>ctx.setMdl({t:"nc"})} style={S.aBtn} className="bh"><Ico n="plus" s={16}/></button></div><div style={{display:"flex",gap:6,marginBottom:12}}>{["Tous","Parents","Enfants"].map(z=><button key={z} onClick={()=>setF(z)} style={{...S.fPill,background:f===z?"#d4af69":"rgba(212,175,105,.08)",color:f===z?"#1a1207":"#7a6f60"}} className="bh">{z}</button>)}<span style={{color:"#7a6f60",fontSize:12,alignSelf:"center",marginLeft:"auto"}}>{lst.length}</span></div><div style={S.card}>{lst.map(c=>{const s=ctx.cs(c.id);return<button key={c.id} onClick={()=>{ctx.setSelC(c.id);ctx.setTab("fiche");}} style={S.lRow} className="bh rh"><div style={S.av}>{c.type==="Enfant"?"👧":"👤"}</div><div style={{flex:1,minWidth:0}}><div style={S.rT}>{c.prenom} {c.nom}</div><div style={S.rS}>{c.type}{c.tel?` · ${c.tel}`:""}</div></div>{s>0&&<span style={S.sBdg}>{fE(s)}</span>}<Ico n="chev" s={14} c="#6a5f50"/></button>})}</div></div>;}

/* ── HEURES with + button in header ── */
function Heures({ctx}){const[q,setQ]=useState("");const lst=useMemo(()=>{let l=ctx.cls.filter(c=>{const v=ctx.cv(c.id);return v.some(vt=>{const p=ctx.cat.find(z=>z.id===vt.prest);return p?.h>0;});});if(q.length>=2){const w=q.toLowerCase().split(/\s+/);l=l.filter(c=>w.every(z=>`${c.prenom} ${c.nom}`.toLowerCase().includes(z)));}return l.sort((a,b)=>a.nom.localeCompare(b.nom));},[ctx.cls,ctx.cv,ctx.cat,q]);return<div style={{padding:"0 16px"}}><div style={S.srchW}><Ico n="srch" s={16} c="#7a6f60"/><input placeholder="Rechercher..." value={q} onChange={e=>setQ(e.target.value)} style={S.srchI}/></div><div style={{...S.card,marginTop:12}}><div style={{display:"grid",gridTemplateColumns:"1fr 70px 60px 60px",gap:4,padding:"8px 0",borderBottom:"1px solid rgba(212,175,105,.1)"}}><span style={S.th}>Cavalier</span><span style={{...S.th,textAlign:"center"}}>Achetées</span><span style={{...S.th,textAlign:"center"}}>Prises</span><span style={{...S.th,textAlign:"center"}}>Solde</span></div>{lst.map(c=>{const h=ctx.ch(c.id);return<button key={c.id} onClick={()=>{ctx.setSelC(c.id);ctx.setTab("fiche");}} style={{...S.lRow,display:"grid",gridTemplateColumns:"1fr 70px 60px 60px",gap:4}} className="bh rh"><div style={S.rT}>{c.prenom} {c.nom}</div><div style={{textAlign:"center",color:"#7db8e0",fontWeight:600}}>{h.achats}h</div><div style={{textAlign:"center",color:"#e8c44a",fontWeight:600}}>{h.consommes}h</div><div style={{textAlign:"center",color:h.solde>0?"#5ae8a0":"#e87a7a",fontWeight:700}}>{h.solde}h</div></button>})}</div></div>;}

function Planning({ctx}){const[j,setJ]=useState("Mercredi");const jc=ctx.crs.filter(cr=>cr.jour===j).sort((a,b)=>a.heure.localeCompare(b.heure));return<div style={{padding:"0 16px"}}><div style={{display:"flex",gap:4,marginBottom:14,overflowX:"auto",paddingBottom:4}}>{JOURS.map(d=>{const n=ctx.crs.filter(cr=>cr.jour===d).length;return<button key={d} onClick={()=>setJ(d)} style={{...S.jPill,background:j===d?"#d4af69":"rgba(212,175,105,.06)",color:j===d?"#1a1207":"#7a6f60"}} className="bh">{d.slice(0,3)}{n>0&&<span style={{fontSize:10,marginLeft:3,opacity:.7}}>({n})</span>}</button>})}</div>{jc.length===0&&<p style={S.mt}>Aucun créneau le {j.toLowerCase()}</p>}{jc.map(cr=>{const cavNames=cr.cavs.map(id=>{const c=ctx.gc(id);return c?`${c.prenom} ${c.nom[0]}.`:null}).filter(Boolean).join(", ");return<div key={cr.id} style={{...S.card,position:"relative",cursor:"pointer"}} onClick={()=>ctx.setMdl({t:"pr",crid:cr.id})} className="bh"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><div><span style={{fontWeight:700,color:"#d4af69",fontSize:18}}>{cr.heure}</span><span style={{color:"#b8a88a",marginLeft:10,fontSize:15}}>{cr.nom}</span></div><button onClick={e=>{e.stopPropagation();ctx.setMdl({t:"ecr",crid:cr.id});}} style={{...S.iBtn,padding:6}} className="bh"><Ico n="edit" s={16} c="#d4af69"/></button></div><div style={{color:"#7a6f60",fontSize:12}}>{cavNames||"Aucun cavalier"}</div><div style={{color:"#5a5040",fontSize:10,marginTop:4}}>Appuyer pour gérer les présences</div></div>})}</div>;}

/* ── CAISSE ── */
function Caisse({ctx}){
  // Collect all cash movements: auto from payments + manual
  // From caisse API directly
  const allMvtsRaw=(ctx.caisseMvts||[]).map(m=>({id:m.id,date:m.date,mt:m.mt,type:m.type==="Entrée"||m.type==="entree"?"entree":"sortie",label:m.motif||"Mouvement",auto:m.auto||false}));
  const allMvts=allMvtsRaw.sort((a,b)=>(b.date||"").localeCompare(a.date||""));
  const solde=allMvts.reduce((s,m)=>s+(m.type==="entree"?m.mt:-m.mt),0);

  return<div style={{padding:"0 16px"}}>
    {/* Solde */}
    <div style={{...S.card,textAlign:"center",padding:24}}>
      <div style={{fontSize:11,color:"#7a6f60",textTransform:"uppercase",letterSpacing:1,fontWeight:600,marginBottom:8}}>Solde caisse espèces</div>
      <div style={{fontSize:36,fontWeight:700,color:solde>=0?"#5ae8a0":"#e87a7a"}}>{fE(solde)}</div>
    </div>

    {/* Actions */}
    <div style={{display:"flex",gap:8,marginBottom:14}}>
      <button onClick={()=>ctx.setMdl({t:"mc",dir:"entree"})} style={{...S.aBtn,flex:1,justifyContent:"center",padding:"12px 0"}} className="bh"><Ico n="plus" s={14}/> Entrée</button>
      <button onClick={()=>ctx.setMdl({t:"mc",dir:"sortie"})} style={{flex:1,justifyContent:"center",padding:"12px 0",background:"rgba(232,122,122,.15)",color:"#e87a7a",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}} className="bh"><Ico n="minus" s={14} c="#e87a7a"/> Sortie</button>
    </div>

    {/* Journal */}
    <div style={S.secT}>Journal de caisse</div>
    <div style={S.card}>
      {allMvts.length===0&&<p style={S.mt}>Aucun mouvement</p>}
      {allMvts.map(m=><div key={m.id} style={S.lRow}>
        <div style={{width:8,height:8,borderRadius:4,background:m.type==="entree"?"#5ae8a0":"#e87a7a",flexShrink:0}}/>
        <div style={{flex:1}}>
          <div style={S.rT}>{m.label||m.motif||"Mouvement"}</div>
          <div style={S.rS}>{fD(m.date)}{m.auto?" · Auto":""}{m.cav?` · ${m.cav.prenom} ${m.cav.nom}`:""}</div>
        </div>
        <span style={{fontSize:14,fontWeight:700,color:m.type==="entree"?"#5ae8a0":"#e87a7a"}}>{m.type==="entree"?"+":"−"}{fE(m.mt)}</span>
      </div>)}
    </div>
  </div>;
}
