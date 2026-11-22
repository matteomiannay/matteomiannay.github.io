import os

# Dossier contenant les fichiers PDF
dossier_pdf = os.path.dirname(os.path.abspath(__file__))


# Liste des fichiers PDF avec leurs nouveaux noms
fichiers = [
    {"ancien_nom": "Colle1-MP-Series-numeriques.pdf", "nouveau_nom": "Colle 1 MP : Séries numériques.pdf"},
    {"ancien_nom": "Colle2-MP-Algebre-lineaire.pdf", "nouveau_nom": "Colle 2 MP : Algèbre linéaire de sup, valeurs propres, vecteurs propres.pdf"},
    {"ancien_nom": "Colle3-MP-Integrales-generalisees.pdf", "nouveau_nom": "Colle 3 MP : Intégrales généralisées (sans paramètres).pdf"},
    {"ancien_nom": "Colle3-Bis-MP-Integrales-generalisees.pdf", "nouveau_nom": "Colle 3 Bis MP : Intégrales généralisées (sans paramètres).pdf"},
    {"ancien_nom": "Colle4-MP-Integrales-generalisees.pdf", "nouveau_nom": "Colle 4 MP : Intégrales à paramètres, dose homéopathique de réduction.pdf"},
    {"ancien_nom": "Colle5-MP-Reduction-sans-polynome-minimal.pdf", "nouveau_nom": "Colle 5 MP : Réduction sans polynôme minimal.pdf"},
    {"ancien_nom": "Colle5-Bis-MP-Reduction-sans-polynome-minimal.pdf", "nouveau_nom": "Colle 5 Bis MP : Réduction sans polynôme minimal.pdf"},
    {"ancien_nom": "Colle6-MP-Suites-fonctions.pdf", "nouveau_nom": "Colle 6 MP : Suites de fonctions.pdf"},
    {"ancien_nom": "Colle7-MP-Families-sommables.pdf", "nouveau_nom": "Colle 7 MP : Suites et séries de fonctions.pdf"},
    {"ancien_nom": "Colle7-Bis-MP-Families-sommables.pdf", "nouveau_nom": "Colle 7 Bis MP : Suites et séries de fonctions.pdf"},
    {"ancien_nom": "Colle8-MP-Probabilites-desesperees.pdf", "nouveau_nom": "Colle 8 MP : Probabilités désespérées.pdf"},
    {"ancien_nom": "Colle9-MP-Polynomes-endomorphismes.pdf", "nouveau_nom": "Colle 9 MP : Polynômes d'endomorphismes.pdf"},
    {"ancien_nom": "Colle10-MP-Reduction-suite-fin.pdf", "nouveau_nom": "Colle 10 MP : Réduction, suite et fin.pdf"},
    {"ancien_nom": "Colle11-MP-Topologie-normes.pdf", "nouveau_nom": "Colle 11 MP : Début de la topologie.pdf"},
    {"ancien_nom": "Colle12-MP-Applications-lineaires-continues-debut-series-entieres.pdf", "nouveau_nom": "Colle 12 MP : Applications linéaires continues, début des séries entières.pdf"},
    {"ancien_nom": "Colle13-MP-Series-entieres.pdf", "nouveau_nom": "Colle 13 MP : Séries entières.pdf"},
    {"ancien_nom": "Colle14-MP-Espaces-prehilbertiens-sans-endo-symetriques.pdf", "nouveau_nom": "Colle 14 MP : Espaces préhilbertiens (sans endomorphismes symétriques).pdf"},
    {"ancien_nom": "Colle15-MP-Espaces-prehilbertiens-isometries.pdf", "nouveau_nom": "Colle 15 MP : Espaces préhilbertiens, sans endomorphismes symétriques, mais avec des isométries.pdf"},
    {"ancien_nom": "Colle16-MP-Probabilites-suite-fin.pdf", "nouveau_nom": "Colle 16 MP : Probabilités, suite et fin.pdf"},
    {"ancien_nom": "Colle17-MP-Topologie-ouverts-fermes.pdf", "nouveau_nom": "Colle 17 MP : Retour de la topologie, ouverts et fermés.pdf"},
    {"ancien_nom": "Colle18-MP-Topologie-comparite-connerite.pdf", "nouveau_nom": "Colle 18 MP : Fin de la topologie, compacité et connexité par arcs.pdf"}
]

# Renommer les fichiers
for fichier in fichiers:
    ancien_chemin = os.path.join(dossier_pdf, fichier["ancien_nom"])
    nouveau_chemin = os.path.join(dossier_pdf, fichier["nouveau_nom"])
    
    if os.path.exists(ancien_chemin):
        os.rename(ancien_chemin, nouveau_chemin)
        print(f"Renommé : {ancien_chemin} -> {nouveau_chemin}")
    else:
        print(f"Fichier introuvable : {ancien_chemin}")