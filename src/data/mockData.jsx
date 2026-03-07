export const INIT_CLIENTS = [
  {id:"c1",nom:"CHALAL",prenom:"Anne-Laure",type:"Parent",email:"chalal.al@gmail.com",tel:"06 12 34 56 78",naissance:"1985-04-12",enfantsIds:["c2","c3"],parentId:null,actif:true,adresse:"12 rue des Prés",cp:"57000",ville:"Metz"},
  {id:"c2",nom:"CHALAL",prenom:"Manelle",type:"Enfant",tel:"",email:"",naissance:"2014-09-23",enfantsIds:[],parentId:"c1",actif:true,adresse:"",cp:"",ville:""},
  {id:"c3",nom:"CHALAL",prenom:"Selma",type:"Enfant",tel:"",email:"",naissance:"2016-12-05",enfantsIds:[],parentId:"c1",actif:true,adresse:"",cp:"",ville:""},
  {id:"c4",nom:"GENCO",prenom:"Marie",type:"Parent",email:"genco.m@gmail.com",tel:"06 98 76 54 32",naissance:"1982-07-30",enfantsIds:["c5","c6"],parentId:null,actif:true,adresse:"8 allée du Bois",cp:"57100",ville:"Thionville"},
  {id:"c5",nom:"GENCO",prenom:"Agathe",type:"Enfant",tel:"",email:"",naissance:"2013-03-15",enfantsIds:[],parentId:"c4",actif:true,adresse:"",cp:"",ville:""},
  {id:"c6",nom:"GENCO",prenom:"Zoé",type:"Enfant",tel:"",email:"",naissance:"2015-11-08",enfantsIds:[],parentId:"c4",actif:true,adresse:"",cp:"",ville:""},
  {id:"c7",nom:"SACCO",prenom:"Léa",type:"Parent",email:"sacco.lea@gmail.com",tel:"06 55 44 33 22",naissance:"1990-01-18",enfantsIds:[],parentId:null,actif:true,adresse:"3 impasse du Ranch",cp:"57200",ville:"Sarreguemines"},
  {id:"c8",nom:"DE MARVILLE",prenom:"Sophie",type:"Parent",email:"demarville@gmail.com",tel:"06 11 22 33 44",naissance:"1978-06-25",enfantsIds:["c9"],parentId:null,actif:true,adresse:"45 bd Liberté",cp:"57000",ville:"Metz"},
  {id:"c9",nom:"DE MARVILLE",prenom:"Lucas",type:"Enfant",tel:"",email:"",naissance:"2012-08-14",enfantsIds:[],parentId:"c8",actif:true,adresse:"",cp:"",ville:""},
  {id:"c10",nom:"BIETZER",prenom:"Chloé",type:"Parent",email:"bietzer.c@gmail.com",tel:"06 77 88 99 00",naissance:"1988-02-14",enfantsIds:["c11","c12"],parentId:null,actif:true,adresse:"22 rue Foch",cp:"57000",ville:"Metz"},
  {id:"c11",nom:"BIETZER",prenom:"Romane",type:"Enfant",tel:"",email:"",naissance:"2015-05-20",enfantsIds:[],parentId:"c10",actif:true,adresse:"",cp:"",ville:""},
  {id:"c12",nom:"BIETZER",prenom:"Olivia",type:"Enfant",tel:"",email:"",naissance:"2017-10-03",enfantsIds:[],parentId:"c10",actif:true,adresse:"",cp:"",ville:""},
];

export const INIT_CATALOGUE = [
  {id:"p1",nom:"1 séance 1h",cat:"Cours",prix:25,tva:5.5,h:1,actif:true},
  {id:"p2",nom:"Carte 4 séances",cat:"Cours",prix:90,tva:5.5,h:4,actif:true},
  {id:"p3",nom:"Carte 8 séances",cat:"Cours",prix:170,tva:5.5,h:8,actif:true},
  {id:"p4",nom:"Petit cowboy 2-4 ans",cat:"Cours",prix:12,tva:5.5,h:1,actif:true},
  {id:"p5",nom:"Petit cowboy 4-6 ans",cat:"Cours",prix:18,tva:5.5,h:1,actif:true},
  {id:"p6",nom:"Cours particulier 1h (1p)",cat:"Cours",prix:35,tva:5.5,h:1,actif:true},
  {id:"p7",nom:"Cours particulier 1h (2-3p)",cat:"Cours",prix:30,tva:5.5,h:1,actif:true},
  {id:"p8",nom:"Cours particulier 10h",cat:"Cours",prix:300,tva:5.5,h:10,actif:true},
  {id:"p9",nom:"Carte proprio 4 séances",cat:"Cours",prix:70,tva:5.5,h:4,actif:true},
  {id:"p10",nom:"Carte proprio 8 séances",cat:"Cours",prix:130,tva:5.5,h:8,actif:true},
  {id:"p11",nom:"Cours particulier proprio 1h",cat:"Cours",prix:30,tva:5.5,h:1,actif:true},
  {id:"p12",nom:"Cours particulier proprio 10h",cat:"Cours",prix:250,tva:5.5,h:10,actif:true},
  {id:"p20",nom:"Forfait année 36 séances",cat:"Forfait",prix:630,tva:5.5,h:36,actif:true},
  {id:"p21",nom:"Forfait année 2e heure/membre",cat:"Forfait",prix:570,tva:5.5,h:36,actif:true},
  {id:"p22",nom:"Forfait essai 1 mois",cat:"Forfait",prix:90,tva:5.5,h:4,actif:true},
  {id:"p23",nom:"Forfait PC 2-4 ans année",cat:"Forfait",prix:320,tva:5.5,h:36,actif:true},
  {id:"p24",nom:"Forfait PC 4-6 ans année",cat:"Forfait",prix:410,tva:5.5,h:36,actif:true},
  {id:"p25",nom:"Forfait essai PC 2-4 ans",cat:"Forfait",prix:50,tva:5.5,h:4,actif:true},
  {id:"p26",nom:"Forfait essai PC 4-6 ans",cat:"Forfait",prix:60,tva:5.5,h:4,actif:true},
  {id:"p27",nom:"Forfait proprio année",cat:"Forfait",prix:410,tva:5.5,h:36,actif:true},
  {id:"p28",nom:"Forfait mixte proprio/club",cat:"Forfait",prix:520,tva:5.5,h:36,actif:true},
  {id:"p30",nom:"Adhésion 1er membre",cat:"Adhésion",prix:95,tva:5.5,h:0,actif:true},
  {id:"p31",nom:"Adhésion 2e membre+",cat:"Adhésion",prix:90,tva:5.5,h:0,actif:true},
  {id:"p32",nom:"Licence +18 ans",cat:"Licence",prix:40,tva:0,h:0,actif:true},
  {id:"p33",nom:"Licence -18 ans",cat:"Licence",prix:29,tva:0,h:0,actif:true},
  {id:"p40",nom:"Stage journée",cat:"Stage",prix:50,tva:5.5,h:6,actif:true},
  {id:"p41",nom:"Stage 1/2 journée 2h",cat:"Stage",prix:20,tva:5.5,h:2,actif:true},
  {id:"p42",nom:"Stage 1/2 journée 3h",cat:"Stage",prix:30,tva:5.5,h:3,actif:true},
  {id:"p43",nom:"Stage semaine pirouette",cat:"Stage",prix:220,tva:5.5,h:30,actif:true},
  {id:"p44",nom:"Stage galop 4 jours",cat:"Stage",prix:175,tva:5.5,h:24,actif:true},
  {id:"p45",nom:"Challenge interne",cat:"Stage",prix:20,tva:5.5,h:2,actif:true},
  {id:"p50",nom:"Location box journée",cat:"Pension",prix:35,tva:5.5,h:0,actif:true},
  {id:"p51",nom:"Location box 3 jours",cat:"Pension",prix:75,tva:5.5,h:0,actif:true},
  {id:"p52",nom:"Location casier mois",cat:"Pension",prix:20,tva:20,h:0,actif:true},
  {id:"p53",nom:"Location casier an",cat:"Pension",prix:240,tva:20,h:0,actif:true},
  {id:"p54",nom:"Location manège",cat:"Pension",prix:40,tva:5.5,h:0,actif:true},
  {id:"p55",nom:"Pension complète",cat:"Pension",prix:300,tva:5.5,h:0,actif:true},
  {id:"p56",nom:"Pension compétition",cat:"Pension",prix:235,tva:5.5,h:0,actif:true},
  {id:"p57",nom:"Pension DP club 1x/sem",cat:"Pension",prix:65,tva:5.5,h:0,actif:true},
  {id:"p58",nom:"Pension DP club 2x/sem",cat:"Pension",prix:100,tva:5.5,h:0,actif:true},
  {id:"p59",nom:"Pension DP club 3x/sem",cat:"Pension",prix:140,tva:5.5,h:0,actif:true},
  {id:"p60",nom:"Pension DP club 4x/sem",cat:"Pension",prix:175,tva:5.5,h:0,actif:true},
  {id:"p61",nom:"Travail cheval mois",cat:"Pension",prix:100,tva:5.5,h:0,actif:true},
  {id:"p62",nom:"Travail cheval séance",cat:"Pension",prix:30,tva:5.5,h:0,actif:true},
  {id:"p63",nom:"Tonte complète",cat:"Pension",prix:80,tva:20,h:0,actif:true},
  {id:"p70",nom:"Anniversaire poney",cat:"Autre",prix:150,tva:5.5,h:0,actif:true},
  {id:"p71",nom:"Balade en main",cat:"Autre",prix:15,tva:5.5,h:0,actif:true},
  {id:"p72",nom:"Centre aéré demi-journée",cat:"Autre",prix:8,tva:5.5,h:0,actif:true},
  {id:"p73",nom:"Centre aéré journée",cat:"Autre",prix:15,tva:5.5,h:0,actif:true},
  {id:"p74",nom:"Bon cadeau",cat:"Autre",prix:0,tva:5.5,h:0,actif:true},
  {id:"p75",nom:"Engagement concours",cat:"Autre",prix:0,tva:0,h:0,actif:true},
];

export const INIT_VENTES = [
  {id:"v1",ref:"V-2026-0001",cav:"c2",pay:"c1",prest:"p3",detail:"Carte 8 séances",mt:170,rem:0,du:170,tp:170,st:"Soldée",date:"2026-02-15",pays:[{id:"py1",mt:170,mode:"CB",date:"2026-02-15",chq:""}],fact:true},
  {id:"v2",ref:"V-2026-0002",cav:"c2",pay:"c1",prest:"p30",detail:"Adhésion 1er membre",mt:95,rem:0,du:95,tp:50,st:"Partielle",date:"2026-03-01",pays:[{id:"py2",mt:50,mode:"Chèque",date:"2026-03-01",chq:"1234567"}],fact:false},
  {id:"v3",ref:"V-2026-0003",cav:"c3",pay:"c1",prest:"p33",detail:"Licence -18 ans",mt:29,rem:0,du:29,tp:0,st:"Non payée",date:"2026-03-05",pays:[],fact:false},
  {id:"v4",ref:"V-2026-0004",cav:"c5",pay:"c4",prest:"p20",detail:"Forfait année 36 séances",mt:630,rem:0,du:630,tp:315,st:"Partielle",date:"2026-01-10",pays:[{id:"py3",mt:210,mode:"Virement",date:"2026-01-10",chq:""},{id:"py4",mt:105,mode:"CB",date:"2026-02-10",chq:""}],fact:false},
  {id:"v5",ref:"V-2026-0005",cav:"c5",pay:"c4",prest:"p30",detail:"Adhésion 1er membre",mt:95,rem:0,du:95,tp:95,st:"Soldée",date:"2026-01-10",pays:[{id:"py5",mt:95,mode:"CB",date:"2026-01-10",chq:""}],fact:true},
  {id:"v6",ref:"V-2026-0006",cav:"c11",pay:"c10",prest:"p2",detail:"Carte 4 séances",mt:90,rem:0,du:90,tp:90,st:"Soldée",date:"2026-02-20",pays:[{id:"py6",mt:90,mode:"Espèces",date:"2026-02-20",chq:""}],fact:true},
  {id:"v7",ref:"V-2026-0007",cav:"c7",pay:"c7",prest:"p6",detail:"Cours particulier 1h (1p)",mt:35,rem:0,du:35,tp:0,st:"Non payée",date:"2026-03-06",pays:[],fact:false},
  {id:"v8",ref:"V-2026-0008",cav:"c3",pay:"c1",prest:"p31",detail:"Adhésion 2e membre+",mt:90,rem:0,du:90,tp:90,st:"Soldée",date:"2026-03-01",pays:[{id:"py7",mt:90,mode:"CB",date:"2026-03-01",chq:""}],fact:true},
];

export const INIT_CRENEAUX = [
  {id:"cr1",jour:"Mercredi",heure:"14:00",nom:"Débutants",duree:60,cavs:["c2","c5","c11"]},
  {id:"cr2",jour:"Mercredi",heure:"15:00",nom:"Galop 1-2",duree:60,cavs:["c3","c6","c9"]},
  {id:"cr3",jour:"Mercredi",heure:"16:00",nom:"Galop 3-4",duree:60,cavs:["c12"]},
  {id:"cr4",jour:"Samedi",heure:"10:00",nom:"Débutants",duree:60,cavs:["c2","c11"]},
  {id:"cr5",jour:"Samedi",heure:"11:00",nom:"Galop 1-2",duree:60,cavs:["c5","c9"]},
  {id:"cr6",jour:"Samedi",heure:"14:00",nom:"Adultes",duree:60,cavs:["c7"]},
];

export const INIT_PRESENCES = [
  {id:"pr1",cr:"cr1",date:"2026-03-05",cav:"c2",ok:true},
  {id:"pr2",cr:"cr1",date:"2026-03-05",cav:"c5",ok:true},
  {id:"pr3",cr:"cr1",date:"2026-03-05",cav:"c11",ok:false},
  {id:"pr4",cr:"cr4",date:"2026-03-01",cav:"c2",ok:true},
  {id:"pr5",cr:"cr4",date:"2026-03-01",cav:"c11",ok:true},
];

export const INIT_HEURES_MANUELLES = [
  {id:"hm1",cav:"c2",delta:-1,motif:"Cours annulé - remboursement 1h",date:"2026-02-20"},
];

export const JOURS = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
export const CATEGORIES = ["Cours","Forfait","Adhésion","Licence","Stage","Pension","Autre"];
export const MODES_REGLEMENT = ["Espèces","Chèque","Virement","CB"];
