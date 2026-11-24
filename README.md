# matteomiannay.github.io

Site personnel de Matteo Miannay, publié avec GitHub Pages : <https://matteomiannay.github.io/>.
Site statique (HTML, CSS, un peu de JavaScript), sans outil de construction : chaque fichier du dépôt est servi tel quel.

## Organisation

| Chemin | Contenu |
| --- | --- |
| `index.html`, `recherche.html`, `agregation.html`, `enseignement.html`, `autres.html` | Pages en français |
| `en.html`, `research.html` | Pages en anglais (accueil et recherche) |
| `style.css` | Mise en page et couleurs de tout le site (la couleur principale est `--accent`, en haut du fichier) |
| `site.js` | Particules, onglets des colles, filtre par leçon, bouton « Copier » du BibTeX, date de mise à jour |
| `fonts/` | Polices hébergées avec le site (`fonts.css` + fichiers woff2) |
| `documents/` | CV, rapport de stage, notes de M2, archives `.zip` |
| `docagreg/` | Agrégation : couplage, plans, retours d'oraux, mémoire, conseils option A |
| `devmaths/` | Développements tapés |
| `TDPRO/` | Monitorat ENS : TD, CC et corrections de PRO |
| `mpsi/`, `mp/`, `mpsi1/` | Sujets de colles, par classe |
| `ensai/integration/` | TD d'intégration de l'ENSAI |
| `polymarkov.pdf`, `polyseriesmpsi.pdf` | Polys de cours |
| `photo.jpg`, `favicon.svg`, `og-image.png` | Portrait, icône d'onglet, image d'aperçu des liens partagés |
| `sitemap.xml`, `robots.txt` | Pour les moteurs de recherche |
| `google85ff76aac48a9436.html` | Vérification Google Search Console (ne pas supprimer) |

## Ajouter un document

1. **Nommer le fichier** en minuscules, sans espaces, accents, apostrophes ni parenthèses, avec des tirets :
   `td10-martingales.pdf` plutôt que `TD10 Martingales (v2).pdf`.
2. **Le déposer dans le bon dossier** (voir le tableau). Sur github.com : ouvrir le dossier, puis *Add file › Upload files*.
3. **Ajouter le lien dans la page** :
   - TD, poly, document : copier une ligne voisine dans la page concernée et changer le texte et le chemin, par exemple
     `<li>Le <a href="TDPRO/td10-martingales.pdf">TD10</a>&nbsp;: martingales.</li>`.
   - Colle : dans `enseignement.html`, ajouter une ligne dans la liste `window.COLLES` (en bas de la page), dans la bonne classe :
     `{ file: "mpsi/colle-31-mpsi3-....pdf", name: "Titre affiché" },`.
     Les onglets et le compteur se mettent à jour tout seuls.
   - Développement ou plan sur la page Agrégation : copier un bloc `<li class="dev" ...>` ; les numéros de leçons vont dans
     `data-lecons="223 230"` (utilisé par le filtre) et dans la ligne `<p class="tags">`.
4. **Faire un seul commit** pour le fichier et la page modifiée, avec un message qui dit ce qui change (« Ajoute le TD10 de PRO »).
   La mise en ligne prend une à deux minutes.

## Points d'attention

- Une page en français et sa version anglaise (`index.html` ↔ `en.html`, `recherche.html` ↔ `research.html`) se modifient ensemble.
- Ne pas supprimer un fichier sans chercher son nom dans les pages (barre de recherche de GitHub, ou `grep`) : un lien cassé ne prévient pas.
- La date « Mis à jour » du pied de page se règle toute seule ; le texte écrit dans les pages ne sert que de secours.
