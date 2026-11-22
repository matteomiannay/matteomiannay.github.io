import os

# Dictionnaire des noms de fichiers pour les MP
nom_colles_mp = {
    "colle1.pdf": "Colle 1 MP - Séries numériques.pdf",
    "colle2.pdf": "Colle 2 MP - Algèbre linéaire de sup, valeurs propres, vecteurs propres.pdf",
    "colle3.pdf": "Colle 3 MP - Intégrales généralisées (sans paramètres).pdf",
    "colle4.pdf": "Colle 4 MP - Intégrales à paramètres, dose homéopathique de réduction.pdf",
    "colle5.pdf": "Colle 5 MP - Réduction sans polynôme minimal.pdf",
    "colle6.pdf": "Colle 6 MP - Suites de fonctions.pdf",
    "colle7.pdf": "Colle 7 MP - Suites et séries de fonctions.pdf",
    "colle8.pdf": "Colle 8 MP - Probabilités désespérées.pdf",
    "colle9.pdf": "Colle 9 MP - Polynômes d'endomorphismes.pdf",
    "colle10.pdf": "Colle 10 MP - Réduction, suite & fin.pdf",
    "colle11.pdf": "Colle 11 MP - Début de la topologie.pdf",
    "colle12.pdf": "Colle 12 MP - Applications linéaires continues, début des séries entières.pdf",
    "colle13.pdf": "Colle 13 MP - Séries entières.pdf",
    "colle14.pdf": "Colle 14 MP - Espaces préhilbertiens (sans endomorphismes symétriques).pdf",
    "colle15.pdf": "Colle 15 MP - Espaces préhilbertiens avec isométries.pdf",
    "colle16.pdf": "Colle 16 MP - Probabilités, suite et fin.pdf",
    "colle17.pdf": "Colle 17 MP - Retour de la topologie : ouverts, fermés.pdf",
    "colle18.pdf": "Colle 18 MP - Fin de la topologie : compacité et connexité par arcs.pdf"
}

# Renommage des fichiers
for ancien_nom, nouveau_nom in nom_colles_mp.items():
    if os.path.exists(ancien_nom):  # Vérifie si le fichier existe avant de le renommer
        os.rename(ancien_nom, nouveau_nom)
        print(f'Renommé : "{ancien_nom}" → "{nouveau_nom}"')
    else:
        print(f'⚠️ Fichier introuvable : "{ancien_nom}"')

print("\n✅ Renommage terminé pour les MP !")
