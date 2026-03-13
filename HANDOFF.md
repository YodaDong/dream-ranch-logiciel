# DREAM RANCH — Récap complet pour transfert de conversation
## Date : 10 mars 2026 — Version : v4.3

---

## 1. CONTEXTE PROJET

**Dream Ranch** = centre équestre en Moselle (France), géré par la sœur du client.
**Objectif** = remplacer Equimundo (50€/mois) par une solution interne gratuite.
**Stack** : Notion (BDD) + Vercel serverless functions (API) + React/Vite (frontend) + GitHub auto-deploy.

**URLs :**
- GitHub : `YodaDong/dream-ranch-logiciel`
- Vercel : `https://dream-ranch-logiciel.vercel.app`
- n8n : `https://n8n.srv908649.hstgr.cloud` (pour futures automatisations uniquement)
- Credential Notion dans n8n : "DREAM RANCH /Logiciel" (ID : cLrcinBjorH0yc0C)

**Tokens & API Keys :**
Tous les tokens sont stockés dans **Vercel > Settings > Environment Variables** :
- `NOTION_KEY` → token d'API Notion (utilisé par le code serveur)
- `NOTION_TOKEN_CLAIR` → même token Notion en backup lisible
- `GITHUB_TOKEN` → token GitHub (repo YodaDong)
- `VERCEL_TOKEN` → token Vercel (déploiement + API)

Pour y accéder : https://vercel.com/dashboard → projet dream-ranch-logiciel → Settings → Environment Variables.

---

## 2. ARCHITECTURE

### Stack technique
- **Frontend** : React + Vite, déployé sur Vercel
- **Backend** : API routes Vercel serverless dans `/api/` (Node.js)
- **BDD** : Notion (10 bases de données)
- **Auth Notion** : variable d'environnement `NOTION_KEY` sur Vercel

### Principe
- Une seule app responsive : mobile = télécommande terrain, desktop = back-office SaaS
- Détection écran : `useIsDesktop(860px)` dans `/src/hooks/useIsDesktop.jsx`
- L'app charge TOUTES les données au démarrage via `loadAll()` (appels API parallèles)
- Chaque action utilisateur → appel API → reload des données concernées
- Notion = base de données invisible, l'utilisateur ne l'ouvre jamais

---

## 3. BASES NOTION (10 bases)

| Base | ID Notion | Statut intégration |
|------|-----------|-------------------|
| **CLIENTS** | `31bdae11-828a-80b3-97b5-c3446bfde644` | ✅ Connecté |
| **PRESTATIONS** (catalogue) | `31bdae11-828a-806a-8edc-f04cabc7eca3` | ✅ Connecté |
| **VENTES** | `31bdae11-828a-8029-a6da-ebcae1780a06` | ✅ Connecté |
| **PAIEMENTS** | `31bdae11-828a-802e-8a3f-d2ae894e2f22` | ⚠️ Doit être connecté à l'intégration |
| **FACTURES** | `31bdae11-828a-801e-9f94-c3849530d1ae` | ✅ Connecté |
| **Planning (CRÉNEAUX)** | `31edae11-828a-80cb-8c90-e962093b1957` | ✅ Connecté |
| **Présences** | `31edae11-828a-80ea-81c9-f622e3e3900c` | ✅ Connecté |
| **Heure manuelle** | `31edae11-828a-80b2-a4f4-fc8650bd3977` | ⚠️ Doit être connecté à l'intégration |
| **CAISSE** | `31edae11-828a-80b8-a702-fa23da998918` | ✅ Connecté |
| Livre de caisse (archive) | `31bdae11-828a-8029-a6da-ebcae1780a06` | Archive, pas utilisé |

### Propriétés exactes des bases (vérifié via API debug) :

**CLIENTS** : Nom(title), Prénom(rich_text), Type(select:Parent/Enfant), Adresse mail(email), Téléphone(rich_text), Date de naissance(rich_text), Adresse(rich_text), Code postal(number), Ville(rich_text), Parent(relation→CLIENTS), Enfants(relation→CLIENTS), Actif(checkbox), Formule(formula), + relations vers autres bases

**PRESTATIONS** : Nom(title), Catégorie(select), Prix TTC(number), TVA %(number), heure(number), Impacte les heures(checkbox), Active(checkbox), Nécessite une personne(checkbox)

**VENTES** : Référence(title), Date(date), Cavalier(relation→CLIENTS), Client payeur(relation→CLIENTS), Prestations(relation→PRESTATIONS) ⚠️ PLURIEL, Détail(rich_text), Montant TTC(number), Remise(number), Montant du(formula), Reste à payer(formula), Statut(formula), Factures(relation)

**PAIEMENTS** : Référence(title), Date(date), Prestation cavalier(relation→VENTES), Montant(number), Règlement(select:Espèces/Chèque/Virement/CB), N° chèque(rich_text)

**FACTURES** : N° Facture(title), Date(date), Client(relation), Prestations cavalier(relation), Montant HT(number), TVA(number), Montant TTC(number), Statut(select)

**PLANNING** : Nom(title), Jour(select:Lundi-Samedi), Start Date(rich_text = heure ex "14:00"), Minutes(number), Cavaliers(relation→CLIENTS), Présences(relation)

**PRÉSENCES** : Nom(title), Créneau(relation→PLANNING), Date(date), FICHIER CLIENT(relation→CLIENTS), Présent(checkbox)

**HEURE MANUELLE** : Détail(title), Cavalier(relation→CLIENTS), Delta(number), Date(date)
⚠️ NOTE : Il existe aussi une base "Heure de cours" (ID: 31bdae11-828a-802d) qui est un TABLEAU DE SUIVI (Heures achetées, consommées, Solde formula) — c'est DIFFÉRENT de la base "Heure manuelle" qui sert aux ajustements.

**CAISSE** : Motif(title), Date(date), Montant(number), Type(select:Entrée/Sortie), Auto(checkbox)

---

## 4. STRUCTURE DU PROJET

```
dream-ranch-deploy/
├── api/                          ← API routes Vercel serverless
│   ├── _notion.js                ← Config Notion + helpers (queryAll, createPage, prop, etc.)
│   ├── clients.js                ← GET/POST/PATCH clients
│   ├── prestations.js            ← GET catalogue (filtre Active=true)
│   ├── ventes.js                 ← GET (avec paiements joints)/POST ventes
│   ├── paiements.js              ← GET/POST paiements + auto-caisse si Espèces
│   ├── planning.js               ← GET/POST/PATCH créneaux
│   ├── presences.js              ← GET/POST (toggle) présences
│   ├── heures.js                 ← GET/POST heures manuelles
│   └── caisse.js                 ← GET/POST mouvements caisse
├── src/
│   ├── App.jsx                   ← État global, chargement API, toutes les fonctions métier
│   ├── api.js                    ← Service API frontend (fetch vers /api/*)
│   ├── data/
│   │   ├── mockData.jsx          ← Données fictives (PLUS UTILISÉES en prod, gardées en backup)
│   │   └── helpers.jsx           ← uid, td, fE, fD, Ico, IR, Fld, CAT_COLORS, STATUT_COLORS, CSS_GLOBAL
│   ├── hooks/
│   │   └── useIsDesktop.jsx      ← Hook responsive (860px breakpoint)
│   └── components/
│       ├── MobileApp.jsx         ← Interface téléphone complète
│       ├── DesktopApp.jsx        ← Dashboard SaaS desktop (à développer)
│       └── Modals.jsx            ← Tous les formulaires modals (mobile + desktop)
├── public/
│   └── logo.svg                  ← Logo officiel Dream Ranch
├── vercel.json                   ← Config Vercel (rewrites, serverless)
├── vite.config.js
└── package.json
```

---

## 5. FONCTIONS MÉTIER (App.jsx)

### Données dérivées (calculées côté frontend) :
- `gc(id)` → get client
- `gp(id)` → get payeur (parent si enfant)
- `gf(id)` → get famille
- `cv(id)` → ventes d'un cavalier
- `ch(id)` → heures {achats, consommes, manuels, solde}
- `cs(id)` → solde individuel (reste à payer)
- `csFamille(id)` → {details:[{id,nom,solde}], total}

### Actions (appellent l'API puis rechargent) :
- `addV(d)` → créer vente (+ paiement immédiat optionnel)
- `addP(vid, py)` → ajouter paiement
- `addCl(d)` / `updCl(id,d)` → clients
- `togPr(cr,dt,cav)` → toggle présence
- `addHM(cav,delta,motif,date)` → ajustement heures manuel
- `addCr(d)` / `updCr(id,d)` → CRUD créneaux
- `addCaisseMvt(d)` → mouvement caisse manuel

---

## 6. INTERFACE MOBILE (état actuel)

### Navigation barre du bas :
Accueil | Clients | Planning | **€ Caisse** (bouton cercle doré proéminent)

### Écrans :
1. **Accueil** : logo, recherche cavalier (prénom prioritaire), 4 boutons (Prestation+, Nouveau client, Planning, Heures), dernières prestations
2. **Fiche cavalier** : identité, solde reste à payer (famille si parent), heures restantes, famille (chips), historique (onglets Prestations | Heures)
3. **Détail prestation** : infos + 3 stats (dû/payé/reste) + paiements
4. **Clients** : liste triée, filtres Tous/Parents/Enfants
5. **Heures** : tableau achetées/prises/solde + bouton + en header
6. **Planning** : sélecteur jours, créneaux cliquables → présences, bouton + créneau en header
7. **Caisse** : solde espèces, boutons Entrée/Sortie, journal

### Modals :
- `nv` : Nouvelle prestation (depuis fiche cavalier)
- `nvq` : Nouvelle prestation quick (depuis homepage, avec recherche cavalier d'abord)
- `np` : Ajouter paiement
- `nc` : Nouveau client
- `ec` : Modifier client
- `pr` : Présences (avec bouton modifier créneau)
- `dh` : Ajuster heures (depuis fiche)
- `dhq` : Ajuster heures quick (depuis header heures, avec recherche cavalier)
- `ecr` : Modifier créneau (avec recherche cavalier)
- `ncr` : Nouveau créneau (avec recherche cavalier)
- `mc` : Mouvement caisse (entrée ou sortie)

---

## 7. BUGS CONNUS / À CORRIGER

### Critiques :
1. ⚠️ **PAIEMENTS et HEURE MANUELLE** : bases peut-être pas connectées à l'intégration Notion → vérifier
2. ⚠️ **Ventes pas affichées dans fiche cavalier** : le join ventes+paiements a été implémenté mais à vérifier après le hotfix clients.js
3. ⚠️ **Clients manquants** : pagination ajoutée (queryAll) mais hotfix vient d'être poussé, à retester
4. ⚠️ **Bug clavier iOS** : quand on tape un montant dans les champs "Montant encaissé" des formulaires prestation (via homepage), le clavier se ferme tout seul après chaque caractère

### UX à améliorer :
5. Liste des prestations coupée en bas dans le modal (paddingBottom réduit de 280→60, à vérifier)
6. Présences : chaque coche fait un appel API (latence). Idéal = cocher localement + bouton "Enregistrer" qui envoie tout d'un coup
7. Notion : Nom+Prénom dans les relations (il faut changer la colonne Titre de CLIENTS pour être "Prénom Nom" via une formule, ou renommer manuellement)

### À développer :
8. Interface desktop/SaaS (DesktopApp.jsx existe mais basique)
9. Interface client (espace perso pour visualiser son compte)
10. Automatisations n8n : facture auto quand soldée, notification Telegram
11. Gestion catalogue depuis l'app (actuellement redirige vers Notion)

---

## 8. PLAN D'ACTION RESTANT

### Phase 1 — Stabilisation (en cours) :
- [ ] Vérifier connexion PAIEMENTS + HEURE MANUELLE à l'intégration Notion
- [ ] Tester : tous les clients s'affichent
- [ ] Tester : ventes + paiements visibles dans fiches cavalier
- [ ] Tester : caisse affiche les mouvements
- [ ] Fix bug clavier iOS sur champs montant
- [ ] Fix latence présences (batch save)

### Phase 2 — Production mobile :
- [ ] Tests fonctionnels complets sur iPhone
- [ ] Corriger tous les bugs remontés
- [ ] PWA : ajouter manifest.json + service worker pour "Add to Home Screen"
- [ ] Domaine personnalisé (optionnel)

### Phase 3 — Interface desktop SaaS :
- [ ] Dashboard avec stats (CA, impayés, dernières ventes)
- [ ] Gestion complète clients (tableau, export)
- [ ] Gestion catalogue prestations
- [ ] Gestion planning avancée
- [ ] Factures (visualisation, génération PDF)

### Phase 4 — Interface client :
- [ ] Espace perso cavalier/parent
- [ ] Visualisation solde, heures, historique
- [ ] Auth simple (code ou lien unique)

### Phase 5 — Automatisations n8n :
- [ ] Facture auto quand vente soldée
- [ ] Mouvement caisse auto sur paiement espèces (déjà fait côté API)
- [ ] Notifications Telegram
- [ ] Récap hebdomadaire

---

## 9. POINTS TECHNIQUES IMPORTANTS

### API Notion :
- Notion Simplify ON dans n8n → préfixe `property_`
- Webhook n8n mode "When Last Node Finishes" + "First Entry JSON"
- Notion API : header `Notion-Version: 2022-06-28`
- `queryAll()` dans `_notion.js` gère la pagination automatiquement

### Vercel :
- Variable d'env : `NOTION_KEY` = clé API Notion (commence par `ntn_`)
- Les API routes sont dans `/api/` et sont des fonctions serverless Node.js
- Le frontend est buildé par Vite et servi statiquement
- Redéploiement auto sur chaque push sur `main`

### UX Mobile :
- `overscroll-behavior-y:none` + `overflow-y:scroll` sur html/body (fix scroll iOS)
- Formulaires montant : `input type="text" inputMode="decimal"` (évite le 0 bloquant)
- Modal padding : 60px en bas pour laisser de la place au clavier
- Pas de scrollIntoView auto (causait perte de focus sur iOS)
- Mode règlement par défaut : Espèces

### Recherche :
- Partout la recherche se fait sur `${prenom} ${nom}` (prénom en premier)
- Résultats limités à 8 dans la homepage, 12 dans les modals

---

## 10. DERNIÈRE VERSION DÉPLOYÉE

**Commit** : `6288a59` — hotfix: clients.js queryDB → queryAll
**Version** : v4.3 + hotfix
**État** : L'app se charge mais des données peuvent manquer si les bases PAIEMENTS et HEURE MANUELLE ne sont pas connectées à l'intégration Notion.

---

## 11. PROBLÈME ACTUEL (10 mars 2026, 16h)

**L'app affiche un écran vide (aucune donnée).** Causes probables dans cet ordre :

1. **Base PAIEMENTS non connectée** à l'intégration Notion → la route `/api/ventes` fait un `queryAll(DB.PAIEMENTS)` qui plante en 404. Le `.catch(() => [])` devrait gérer ça mais peut causer un timeout Vercel.

2. **Base Heure manuelle non connectée** → même problème pour `/api/heures`.

**ACTION IMMÉDIATE POUR DÉBLOQUER :**
- Ouvrir Notion → base PAIEMENTS → "..." → Connexions → ajouter "DREAM RANCH /Logiciel"
- Ouvrir Notion → base Heure manuelle (31edae11...3977) → même chose
- Recharger l'app

**Si ça ne marche toujours pas :**
- Ouvrir le navigateur desktop : `https://[vercel-url]/api/clients` → doit retourner du JSON
- Tester : `https://[vercel-url]/api/ventes` → si erreur, c'est PAIEMENTS pas connecté
- Tester : `https://[vercel-url]/api/heures` → si erreur, c'est HEURE MANUELLE pas connecté

**Alternative rapide** : dans `api/ventes.js`, remplacer la ligne `queryAll(DB.PAIEMENTS).catch(() => [])` par juste `Promise.resolve([])` pour ignorer les paiements temporairement et que les ventes s'affichent.

