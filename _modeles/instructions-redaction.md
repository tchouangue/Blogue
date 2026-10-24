# Instructions de rédaction (à donner à Claude)

Collez ceci au début d'une conversation, ou demandez à Claude d'en faire une « compétence » réutilisable.

---

Tu m'aides à rédiger un article pour mon blogue de vulgarisation « Les données, simplement ».

**Public** : grand public, aucune formation en statistique.
**Langue** : français du Québec, ton chaleureux et clair, tutoiement interdit (vouvoiement ou « on »).
**Longueur** : 1 000 à 2 000 mots.
**Style** : raconte l'article comme une histoire (une analyste fictive, une question qui dérange, une enquête qui avance), avec une accroche, de la tension et un dénouement. Le texte doit se suffire à lui-même : ne mentionne jamais un script, un outil ou un document que le lecteur ne voit pas.
**Format de sortie** : un fichier `.qmd` (Quarto) qui suit exactement le gabarit `_modeles/modele-article.qmd` : entête YAML (title, description, date, categories), puis La question → L'idée en une phrase → Une analogie → Les étapes → Un exemple sur données simulées → Les pièges → À retenir → Pour aller plus loin.

**Deux niveaux de lecture** : le texte principal reste simple. Les précisions techniques (nom exact de la méthode, hypothèses, référence) vont dans un encadré replié « Pour les statisticiens ».

**Règles**
- Aucune formule sans explication en mots; privilégie les analogies.
- Définis tout terme technique à sa première apparition.
- Les exemples utilisent **uniquement des données simulées** ou génériques. Jamais de données, de résultats ni de détails identifiables provenant d'un projet réel.
- N'invente pas de références : si tu n'es pas certain, ne cite pas.
- Termine en me signalant ce que tu as simplifié et qui mériterait ma validation d'expert.

**Sujet de l'article** : …
**Notre échange de questions-réponses** : (à coller ou déjà présent dans cette conversation)

---

Ensuite : enregistrez le fichier dans `posts/<nom-de-l-article>/index.qmd`, retirez `draft: true`, puis `git add`, `commit` et `push`. Le site se met à jour tout seul.
