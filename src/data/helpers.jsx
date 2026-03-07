export const uid=()=>Math.random().toString(36).slice(2,10);
export const td=()=>new Date().toISOString().slice(0,10);
export const fD=d=>{if(!d)return"";const p=d.split("-");return`${p[2]}/${p[1]}/${p[0]}`;};
export const fE=n=>n.toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2})+"€";

export const CAT_COLORS={Cours:{bg:"#1a4d3a",fg:"#7ee8b5"},Forfait:{bg:"#3d1a5c",fg:"#c9a0e8"},"Adhésion":{bg:"#1a3352",fg:"#7db8e0"},Licence:{bg:"#52400a",fg:"#e8c84a"},Stage:{bg:"#5c1a1a",fg:"#e88a8a"},Pension:{bg:"#2a4a2a",fg:"#8ac98a"},Autre:{bg:"#3a3a3a",fg:"#aaa"}};
export const STATUT_COLORS={"Soldée":{bg:"#0f3d2a",fg:"#5ae8a0",i:"✓"},"Partielle":{bg:"#3d2f0a",fg:"#e8c44a",i:"◐"},"Non payée":{bg:"#3d0f0f",fg:"#e87a7a",i:"○"}};

export const Ico=({n,s=18,c="currentColor"})=>{
  const d={home:"M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4h4v4a1 1 0 001 1h3a1 1 0 001-1V10",users:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z",clock:"M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2",cal:"M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18",plus:"M12 5v14M5 12h14",srch:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",back:"M19 12H5M12 19l-7-7 7-7",x:"M18 6L6 18M6 6l12 12",chk:"M20 6L9 17l-5-5",edit:"M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z",chev:"M9 18l6-6-6-6",file:"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6",trash:"M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2",minus:"M5 12h14",dl:"M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",chart:"M18 20V10M12 20V4M6 20v-6",list:"M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",settings:"M12 15a3 3 0 100-6 3 3 0 000 6z"};
  return<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d[n]||""}/></svg>;
};

export const IR=({l,v})=><div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(212,175,105,.04)"}}><span style={{color:"#7a6f60",fontSize:12}}>{l}</span><span style={{color:"#e8dcc8",fontSize:12,fontWeight:500}}>{v}</span></div>;
export const Fld=({l,v,o,t="text",af,ph=""})=><div style={{marginBottom:12}}><label style={{display:"block",color:"#7a6f60",fontSize:12,marginBottom:5,fontWeight:600}}>{l}</label><input type={t} value={v} onChange={e=>o(e.target.value)} style={{width:"100%",background:"rgba(212,175,105,.06)",border:"1px solid rgba(212,175,105,.12)",borderRadius:10,padding:"11px 14px",color:"#e8dcc8",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}} autoFocus={af} autoComplete="off" placeholder={ph}/></div>;

export const CSS_GLOBAL=`
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{margin:0;background:#12100c;height:100%;overflow-y:scroll;-webkit-overflow-scrolling:touch;overscroll-behavior-y:none}
#root{min-height:100%;overflow-y:auto}
input::placeholder{color:#5a5040}
.bh{transition:transform .1s}.bh:active{transform:scale(.97);opacity:.85}
.rh:hover{background:rgba(212,175,105,.06)!important}
@keyframes ti{from{transform:translate(-50%,-20px);opacity:0}to{transform:translate(-50%,0);opacity:1}}
@keyframes mi{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(212,175,105,.2);border-radius:4px}
`;
