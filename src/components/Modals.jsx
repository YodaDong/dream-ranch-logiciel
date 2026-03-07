import { useState } from "react";
import { MODES_REGLEMENT } from "../data/mockData.jsx";
import { uid, td, fD, fE, Ico, Fld, CAT_COLORS } from "../data/helpers.jsx";

const MS={
  ov:{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",backdropFilter:"blur(4px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:150},
  mdl:{background:"linear-gradient(170deg,#1e1a14,#14120e)",borderRadius:"20px 20px 0 0",padding:"12px 18px 32px",width:"100%",maxWidth:520,maxHeight:"88vh",overflowY:"auto",border:"1px solid rgba(212,175,105,.1)",borderBottom:"none"},
  mdlD:{background:"linear-gradient(170deg,#1e1a14,#14120e)",borderRadius:16,padding:"20px 24px 28px",width:"100%",maxWidth:520,maxHeight:"88vh",overflowY:"auto",border:"1px solid rgba(212,175,105,.1)"},
  bar:{width:36,height:4,borderRadius:2,background:"rgba(212,175,105,.2)",margin:"0 auto 14px"},
  tt:{fontFamily:"'DM Serif Display',serif",fontSize:18,color:"#d4af69",margin:"0 0 12px",fontWeight:400},
  pBtn:{width:"100%",background:"linear-gradient(135deg,#d4af69,#b89430)",color:"#1a1207",border:"none",borderRadius:12,padding:"14px 0",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"},
  mdBtn:{border:"1px solid rgba(212,175,105,.15)",borderRadius:8,padding:"8px 14px",fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:600},
  lRow:{display:"flex",alignItems:"center",gap:10,padding:"10px 4px",width:"100%",border:"none",borderBottom:"1px solid rgba(212,175,105,.05)",background:"transparent",cursor:"pointer",textAlign:"left",fontFamily:"inherit"},
  rT:{fontWeight:600,color:"#e8dcc8",fontSize:13},
  cPill:{display:"inline-block",fontSize:10,padding:"3px 10px",borderRadius:6,fontWeight:600},
  srchW:{display:"flex",alignItems:"center",background:"rgba(212,175,105,.06)",border:"1px solid rgba(212,175,105,.12)",borderRadius:12,padding:"0 14px",gap:10},
  srchI:{flex:1,background:"transparent",border:"none",color:"#e8dcc8",fontSize:14,padding:"11px 0",outline:"none",fontFamily:"inherit"},
  selBx:{background:"rgba(212,175,105,.06)",borderRadius:10,padding:12,marginBottom:14},
  lnkB:{color:"#d4af69",background:"none",border:"none",cursor:"pointer",fontSize:12,padding:0,marginTop:6,fontFamily:"inherit"},
  mSt:{background:"rgba(212,175,105,.05)",borderRadius:10,padding:10,textAlign:"center"},
  mLb:{fontSize:10,color:"#7a6f60",marginBottom:3,textTransform:"uppercase",letterSpacing:.4,fontWeight:600},
  mVl:{fontSize:16,fontWeight:700,color:"#e8dcc8"},
  chkRow:{display:"flex",alignItems:"center",gap:10,padding:"10px 0",cursor:"pointer",userSelect:"none"},
  chkBox:{width:20,height:20,borderRadius:6,border:"2px solid rgba(212,175,105,.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
};

export function Modals({ctx}){
  const{mdl,setMdl,isDesktop}=ctx;
  const close=()=>setMdl(null);
  const mStyle=isDesktop?MS.mdlD:MS.mdl;
  return(
    <div style={{...MS.ov,alignItems:isDesktop?"center":"flex-end"}} onClick={close}>
      <div style={{...mStyle,animation:"mi .25s ease-out"}} onClick={e=>e.stopPropagation()}>
        {!isDesktop&&<div style={MS.bar}/>}
        {mdl.t==="nv"&&<MNewV ctx={ctx} cl={close}/>}
        {mdl.t==="np"&&<MNewP ctx={ctx} cl={close}/>}
        {mdl.t==="nc"&&<MNewC ctx={ctx} cl={close}/>}
        {mdl.t==="ec"&&<MEditC ctx={ctx} cl={close}/>}
        {mdl.t==="pr"&&<MPres ctx={ctx} cl={close}/>}
        {mdl.t==="dh"&&<MDebitH ctx={ctx} cl={close}/>}
      </div>
    </div>
  );
}

function MNewV({ctx,cl}){
  const[sr,setSr]=useState("");const[pid,setPid]=useState(null);const[rem,setRem]=useState(0);const[pm,setPm]=useState("");
  const[payNow,setPayNow]=useState(false);const[payMode,setPayMode]=useState("CB");const[payChq,setPayChq]=useState("");
  const cid=ctx.mdl.cid;const py=ctx.gp(cid);
  const fl=ctx.cat.filter(p=>p.actif&&(sr.length<1||(p.nom+p.cat).toLowerCase().includes(sr.toLowerCase())));
  const pr=ctx.cat.find(z=>z.id===pid);const prix=pr?(pr.prix===0?parseFloat(pm)||0:pr.prix):0;const du=Math.max(0,prix-rem);
  return<>
    <h3 style={MS.tt}>Nouvelle vente</h3>
    <p style={{color:"#7a6f60",fontSize:13,marginBottom:12}}>Pour {ctx.gc(cid)?.prenom} {ctx.gc(cid)?.nom}</p>
    {!pid?<><div style={{...MS.srchW,marginBottom:10}}><Ico n="srch" s={14} c="#7a6f60"/><input placeholder="Rechercher prestation..." value={sr} onChange={e=>setSr(e.target.value)} style={MS.srchI} autoFocus/></div>
    <div style={{maxHeight:280,overflowY:"auto"}}>{fl.map(p=>{const ct=CAT_COLORS[p.cat]||CAT_COLORS.Autre;return<button key={p.id} onClick={()=>setPid(p.id)} style={MS.lRow} className="bh rh"><span style={{...MS.cPill,background:ct.bg,color:ct.fg,fontSize:10}}>{p.cat}</span><span style={{flex:1,color:"#e8dcc8",marginLeft:8,fontSize:13}}>{p.nom}</span><span style={{color:"#d4af69",fontWeight:700,fontSize:13}}>{p.prix===0?"—":fE(p.prix)}</span></button>})}</div></>
    :<><div style={MS.selBx}><div style={{fontWeight:700,color:"#e8dcc8"}}>{pr.nom}</div><div style={{fontSize:12,color:"#7a6f60"}}>{pr.cat} · TVA {pr.tva}%{pr.h>0?` · +${pr.h}h`:""}</div><button onClick={()=>setPid(null)} style={MS.lnkB}>← Changer</button></div>
    {pr.prix===0&&<Fld l="Prix (€)" t="number" v={pm} o={setPm} af/>}
    <Fld l="Remise (€)" t="number" v={rem} o={v=>setRem(Math.max(0,parseFloat(v)||0))}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,margin:"14px 0"}}><div style={MS.mSt}><div style={MS.mLb}>Prix</div><div style={MS.mVl}>{fE(prix)}</div></div><div style={MS.mSt}><div style={MS.mLb}>Montant dû</div><div style={{...MS.mVl,color:"#d4af69"}}>{fE(du)}</div></div></div>

    {/* Pay now toggle */}
    <div style={MS.chkRow} onClick={()=>setPayNow(!payNow)}>
      <div style={{...MS.chkBox,background:payNow?"#d4af69":"transparent",borderColor:payNow?"#d4af69":"rgba(212,175,105,.3)"}}>{payNow&&<Ico n="chk" s={12} c="#1a1207"/>}</div>
      <span style={{color:"#e8dcc8",fontSize:14}}>Encaisser maintenant</span>
    </div>
    {payNow&&<div style={{marginBottom:14}}><label style={{display:"block",color:"#7a6f60",fontSize:12,marginBottom:5,fontWeight:600}}>Mode de règlement</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{MODES_REGLEMENT.map(m=><button key={m} onClick={()=>setPayMode(m)} style={{...MS.mdBtn,background:payMode===m?"#d4af69":"rgba(212,175,105,.08)",color:payMode===m?"#1a1207":"#7a6f60"}} className="bh">{m}</button>)}</div>
    {payMode==="Chèque"&&<div style={{marginTop:8}}><Fld l="N° chèque" v={payChq} o={setPayChq}/></div>}</div>}

    <button onClick={()=>{if(!pr||du<=0)return;ctx.addV({cav:cid,pay:py?.id||cid,prest:pid,prix,rem,payNow,payMode,payChq});cl();}} disabled={du<=0} style={{...MS.pBtn,opacity:du<=0?.4:1}} className="bh">{payNow?"Créer et encaisser":"Créer la vente"}</button></>}
  </>;
}

function MNewP({ctx,cl}){
  const v=ctx.vts.find(z=>z.id===ctx.mdl.vid);if(!v)return null;const r=v.du-v.tp;
  const[mt,setMt]=useState(r);const[md,setMd]=useState("CB");const[chq,setChq]=useState("");
  return<>
    <h3 style={MS.tt}>Ajouter un paiement</h3>
    <div style={MS.selBx}><div style={{fontWeight:600,color:"#e8dcc8"}}>{v.detail}</div><div style={{fontSize:13,color:"#d4af69",marginTop:2}}>Reste : {fE(r)}</div></div>
    <Fld l="Montant (€)" t="number" v={mt} o={v=>setMt(Math.max(0,parseFloat(v)||0))} af/>
    <div style={{marginBottom:14}}><label style={{display:"block",color:"#7a6f60",fontSize:12,marginBottom:5,fontWeight:600}}>Mode de règlement</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{MODES_REGLEMENT.map(m=><button key={m} onClick={()=>setMd(m)} style={{...MS.mdBtn,background:md===m?"#d4af69":"rgba(212,175,105,.08)",color:md===m?"#1a1207":"#7a6f60"}} className="bh">{m}</button>)}</div></div>
    {md==="Chèque"&&<Fld l="N° chèque" v={chq} o={setChq}/>}
    <button onClick={()=>{if(mt<=0)return;ctx.addP(v.id,{mt:Math.min(mt,r),mode:md,date:td(),chq:md==="Chèque"?chq:""});cl();}} disabled={mt<=0} style={{...MS.pBtn,opacity:mt<=0?.4:1}} className="bh">Enregistrer {fE(Math.min(mt,r))}</button>
  </>;
}

function MNewC({ctx,cl}){
  const[tp,setTp]=useState("Enfant");const[nm,setNm]=useState("");const[pn,setPn]=useState("");const[pid,setPid]=useState("");const[tl,setTl]=useState("");const[em,setEm]=useState("");const[na,setNa]=useState("");const[ad,setAd]=useState("");const[cp,setCp]=useState("");const[vi,setVi]=useState("");const[ps,setPs]=useState("");
  const pts=ctx.cls.filter(c=>c.type==="Parent");const fp=ps.length>=1?pts.filter(p=>`${p.nom} ${p.prenom}`.toLowerCase().includes(ps.toLowerCase())):pts;
  return<>
    <h3 style={MS.tt}>Nouveau client</h3>
    <div style={{display:"flex",gap:6,marginBottom:14}}>{["Parent","Enfant"].map(t=><button key={t} onClick={()=>setTp(t)} style={{...MS.mdBtn,flex:1,background:tp===t?"#d4af69":"rgba(212,175,105,.08)",color:tp===t?"#1a1207":"#7a6f60"}} className="bh">{t}</button>)}</div>
    <Fld l="Nom" v={nm} o={setNm} af/><Fld l="Prénom" v={pn} o={setPn}/><Fld l="Date de naissance" t="date" v={na} o={setNa}/>
    {tp==="Enfant"&&<div style={{marginBottom:14}}><label style={{display:"block",color:"#7a6f60",fontSize:12,marginBottom:5,fontWeight:600}}>Parent / Tuteur</label><input placeholder="Rechercher le parent..." value={ps} onChange={e=>setPs(e.target.value)} style={{width:"100%",background:"rgba(212,175,105,.06)",border:"1px solid rgba(212,175,105,.12)",borderRadius:10,padding:"11px 14px",color:"#e8dcc8",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>{ps.length>=1&&<div style={{maxHeight:120,overflowY:"auto",marginTop:4}}>{fp.map(p=><button key={p.id} onClick={()=>{setPid(p.id);setPs(`${p.nom} ${p.prenom}`);}} style={{...MS.lRow,padding:"8px"}} className="bh rh"><span style={{color:pid===p.id?"#d4af69":"#e8dcc8",fontSize:13}}>{p.nom} {p.prenom}</span>{pid===p.id&&<Ico n="chk" s={14} c="#5ae8a0"/>}</button>)}</div>}</div>}
    {tp==="Parent"&&<><Fld l="Téléphone" v={tl} o={setTl}/><Fld l="Email" v={em} o={setEm}/><Fld l="Adresse" v={ad} o={setAd}/><div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:8}}><Fld l="Code postal" v={cp} o={setCp}/><Fld l="Ville" v={vi} o={setVi}/></div></>}
    <button onClick={()=>{if(!nm||!pn)return;const nid=ctx.addCl({nom:nm.toUpperCase(),prenom:pn,type:tp,parentId:tp==="Enfant"?pid:"",tel:tl,email:em,naissance:na,adresse:ad,cp,ville:vi});cl();ctx.setSelC(nid);ctx.setTab("fiche");}} disabled={!nm||!pn||(tp==="Enfant"&&!pid)} style={{...MS.pBtn,opacity:(!nm||!pn||(tp==="Enfant"&&!pid))?.4:1,marginTop:8}} className="bh">Ajouter</button>
  </>;
}

function MEditC({ctx,cl}){
  const c=ctx.gc(ctx.mdl.cid);if(!c)return null;
  const[nm,setNm]=useState(c.nom);const[pn,setPn]=useState(c.prenom);const[tl,setTl]=useState(c.tel);const[em,setEm]=useState(c.email);const[na,setNa]=useState(c.naissance);const[ad,setAd]=useState(c.adresse);const[cp,setCp]=useState(c.cp);const[vi,setVi]=useState(c.ville);
  return<>
    <h3 style={MS.tt}>Modifier {c.prenom}</h3>
    <Fld l="Nom" v={nm} o={setNm}/><Fld l="Prénom" v={pn} o={setPn}/><Fld l="Date de naissance" t="date" v={na} o={setNa}/><Fld l="Téléphone" v={tl} o={setTl}/><Fld l="Email" v={em} o={setEm}/><Fld l="Adresse" v={ad} o={setAd}/><div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:8}}><Fld l="Code postal" v={cp} o={setCp}/><Fld l="Ville" v={vi} o={setVi}/></div>
    <button onClick={()=>{ctx.updCl(c.id,{nom:nm.toUpperCase(),prenom:pn,tel:tl,email:em,naissance:na,adresse:ad,cp,ville:vi});cl();}} style={{...MS.pBtn,marginTop:8}} className="bh">Enregistrer</button>
  </>;
}

function MPres({ctx,cl}){
  const cr=ctx.crs.find(z=>z.id===ctx.mdl.crid);if(!cr)return null;const d=td();
  return<>
    <h3 style={MS.tt}>Présences — {cr.nom}</h3>
    <p style={{color:"#7a6f60",fontSize:13,marginBottom:12}}>{cr.jour} {cr.heure} · {fD(d)}</p>
    {cr.cavs.map(id=>{const c=ctx.gc(id);if(!c)return null;const pr=ctx.prs.find(p=>p.cr===cr.id&&p.date===d&&p.cav===id);const ok=pr?.ok||false;
    return<button key={id} onClick={()=>ctx.togPr(cr.id,d,id)} style={{...MS.lRow,padding:"12px 8px"}} className="bh rh">
      <div style={{width:28,height:28,borderRadius:8,border:`2px solid ${ok?"#5ae8a0":"#7a6f60"}`,background:ok?"#5ae8a0":"rgba(212,175,105,.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{ok&&<Ico n="chk" s={14} c="#1a1207"/>}</div>
      <span style={{color:"#e8dcc8",fontSize:14,flex:1}}>{c.prenom} {c.nom}</span>
      <span style={{fontSize:12,color:ok?"#5ae8a0":"#7a6f60"}}>{ok?"Présent":"Absent"}</span>
    </button>})}
    <button onClick={cl} style={{...MS.pBtn,marginTop:16}} className="bh">Fermer</button>
  </>;
}

function MDebitH({ctx,cl}){
  const[delta,setDelta]=useState(-1);const[motif,setMotif]=useState("");
  const cid=ctx.mdl.cid;const c=ctx.gc(cid);const hrs=ctx.ch(cid);
  return<>
    <h3 style={MS.tt}>Ajuster les heures</h3>
    <p style={{color:"#7a6f60",fontSize:13,marginBottom:8}}>Cavalier : {c?.prenom} {c?.nom} — Solde actuel : {hrs.solde}h</p>
    <Fld l="Heures (négatif pour retirer)" t="number" v={delta} o={v=>setDelta(parseInt(v)||0)} af/>
    <Fld l="Motif" v={motif} o={setMotif} ph="Ex: Cours annulé, erreur de saisie..."/>
    <button onClick={()=>{if(delta===0||!motif)return;ctx.addHM(cid,delta,motif);cl();}} disabled={delta===0||!motif} style={{...MS.pBtn,opacity:(delta===0||!motif)?.4:1,marginTop:8}} className="bh">{delta>0?`Ajouter ${delta}h`:`Retirer ${Math.abs(delta)}h`}</button>
  </>;
}
