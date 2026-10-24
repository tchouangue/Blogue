# Les données, simplement — blogue Quarto

Blogue de vulgarisation en données administratives et statistiques, gratuit sur GitHub Pages.

## Structure

```
blogue/
├── _quarto.yml              Réglages du site (titre, menu, thème)
├── index.qmd                Page d'accueil (liste automatique des articles)
├── a-propos.qmd             Page « À propos »
├── styles.scss              Couleurs, typographie et styles
├── fonts.scss               Polices intégrées (générées)
├── _assets/                 Champ d'équations, traducteur, barre de lecture (générés)
├── _outils/gen.mjs          Régénère les fichiers ci-dessus
├── posts/
│   ├── _metadata.yml        Réglages communs aux articles (auteur, etc.)
│   └── bienvenue/index.qmd  Premier article
├── _modeles/                (non publié)
│   ├── modele-article.qmd   Gabarit d'article
│   └── instructions-redaction.md   Consignes à donner à Claude
└── .github/workflows/publish.yml   Publication automatique
```

## Mise en ligne (une seule fois, ~15 minutes)

1. Créez un compte gratuit sur [github.com](https://github.com).
2. Créez un nouveau dépôt public (ex. `blogue`) et téléversez-y tout le contenu de ce dossier (bouton **Add file → Upload files**).
3. Dans le dépôt : **Settings → Actions → General → Workflow permissions** : choisissez **Read and write permissions**.
4. Laissez le workflow s'exécuter (onglet **Actions**). Il crée la branche `gh-pages`.
5. **Settings → Pages** : source = branche `gh-pages`, dossier `/ (root)`.
6. Votre site est à `https://VOTRE-COMPTE.github.io/blogue`. Mettez cette adresse dans `site-url` de `_quarto.yml`.

## Ajouter un article

1. Faites rédiger l'article par Claude avec les consignes de `_modeles/instructions-redaction.md`.
2. Enregistrez-le dans `posts/nom-de-l-article/index.qmd`.
3. Téléversez-le sur GitHub : le site se met à jour automatiquement en 1 à 3 minutes.

## À personnaliser

- `_quarto.yml` : titre du blogue, `site-url`.
- `posts/_metadata.yml` : nom de l'auteur.
- `a-propos.qmd` : votre présentation et vos coordonnées.

## Modifier les équations ou le traducteur (facultatif)

Dans `_outils/` : `npm install`, modifiez les listes d'équations dans `gen.mjs`, puis `node gen.mjs`.

## Aperçu local (facultatif)

Installez [Quarto](https://quarto.org), puis : `quarto preview`.

## Nom de domaine (facultatif, ~15–25 $/an)

Achetez un domaine, ajoutez un fichier `CNAME` à la racine contenant votre domaine, puis configurez-le dans **Settings → Pages**.

## Confidentialité

N'ajoutez jamais de données réelles, de petits effectifs ni de résultats identifiables issus de projets de recherche. Vérifiez vos ententes de confidentialité avant de décrire un projet.
