### Formule des critères de proximité

L'utilisateur peut interagir de trois manières avec les valeurs projetées sur la carte :

1. Sélectionner une série de critères $x \in \mathcal{X} \subset \{ 'Public','Soins','Culture', ... ,'Transport'\}$
2. Spécifier l'indice de diversité spécifique au critère $i_x \in I = \{1, 2, 3, 4, 5 \}$
3. Spécifier un poids spécifique au critère $k_x \enspace | \enspace 0 \leq k_x \leq 1$ associé à chaque critère

La formule pour calculer la distance modifiée $\hat{\delta}$ qui sera projetée sur la carte est la suivante :

$$
\hat{\delta}_i = max(\{k_x \cdot Dist_i(x) : x\in\mathcal{X}\}) \enspace \leq 7000 \enspace \forall(x, k, i)
$$

avec les distances $\hat{\delta}$ et $Dist_i(x)$ en mètres.

**Prenons un exemple.** Décidons que nous souhaitons définir la "proximité" comme un accès facile à la scène culturelle, aux équipements sportifs et aux espaces extérieurs. Lorsque l'utilisateur sélectionne une série de critères dans la barre latérale de l'interface, ils se regroupent en arrière-plan $\mathcal{X} = \{'Culture','Sport','Extérieur'\}$. Les utilisateurs peuvent ensuite sélectionner, pour chaque critère, l'indice de diversité, par exemple, $i_{Culture} = 5, \enspace i_{Sport} = 2, \enspace i_{Extérieur} = 2$. Cela signifie que le moteur de Swiss Proximity recherchera la distance aux 5 lieux culturels les plus proches, aux 2 équipements sportifs les plus proches et aux 2 lieux extérieurs les plus proches. Si un poids spécifique au critère est entré, par exemple, $k_{Culture} = .75$, alors la distance sera artificiellement réduite pour donner moins d'importance à la scène culturelle dans la propre définition de l'utilisateur de la "proximité".

### Code couleur

Pour chaque zone (polygone ou hexagone), la valeur de distance de $\hat{\delta}$ prend une couleur spécifique basée sur la discrétisation suivante.

Demande :

| Temps de trajet (jusqu'à) | Distance approx. [m] | Couleur [Hex] | Cat |
| ------------------------- | -------------------- | ------------- | --- |
| 15’ (à pied)              | 1200                 | #005A32       | A   |
| 20’ (à pied)              | 1600                 | #238443       | B   |
| 30’ (à pied)              | 2400                 | #41AB5D       | C   |
| 15’ (à vélo)              | 3700                 | #78C679       | D   |
| 20’ (à vélo)              | 5000                 | #ADDD8E       | E   |
| 30’ (à vélo)              | 7000                 | #D9F0A3       | F   |
| > 30’ (à vélo)            | > 7000               | #FFFFCC       | G   |

Offre :

| Part des trajets de proximité | Couleur [Hex]      |     |
| ----------------------------- | ------------------ | --- |
| 0                             | Pas de remplissage | G   |
| Quantile 1/6                  | #D9F0A3            | F   |
| Quantile 2/6                  | #ADDD8E            | E   |
| Quantile 3/6                  | #78C679            | D   |
| Quantile 4/6                  | #41AB5D            | C   |
| Quantile 5/6                  | #238443            | B   |
| Quantile 6/6                  | #005A32            | A   |

### Détails des critères de proximité

| UI                 | BACKEND   | OSM tags                                                                                                                         | UI infos                                                         |
| ------------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Guichets           | Public    | community_centre, police, post_box, post_office, bank                                                                            | Postes, banques, police, …                                       |
| Se soigner         | Care      | nursing_home, pharmacy, hospital, clinic, doctors, dentist, optician, hairdresser, beauty                                        | Pharmacies, hôpitaux, dentistes, opticiens, coiffeurs, beauté, … |
| Se cultiver        | Culture   | arts_centre, library, theatre, nightclub, cinema, museum, events_venue, religion (muslim, jewish, christian)                     | Bibliothèques, théâtres, cinémas, lieux de culte, …              |
| S’aérer            | Outdoor   | park, playground, square, landuse_recreation_ground, water, fountain, riverbank, river                                           | Parcs, places, fontaines, rives, …                               |
| Bien manger        | Catering  | restaurant, fast_food, cafe, pub, bar, food_court, biergarten                                                                    | Restaurants, cafés, pubs, …                                      |
| Faire du sport     | Sport     | sports_centre, pitch, swimming_pool, swimming_pool, swimming, water_park, fitness_centre, ice_rink, tennis, golf_course, stadium | Piscines, fitness, stades, patinoires, tennis, …                 |
| Faire ses courses  | Provision | marketplace, supermarket, bakery, general, butcher, greengrocery                                                                 | Super-marchés, boulangeries, marchés, …                          |
| Faire les magasins | Shopping  | kiosk, mall, department_store, convenience, clothes, florist, chemist, books, shoes, furniture                                   | Kiosks, fleuristes, librairies, bricolage, …                     |
| Apprendre          | Education | university, school, college, kindergarten                                                                                        | Ecoles primaires, secondaires, universités, garderies, …         |
| Transports publics | Transport | bus_station, taxi, railway (station, alt), tram_stop, bus_stop                                                                   | Gares, arrêts de bus et tram, zone taxi, …                       |

### Crédits

Support technique et développement – [ENAC IT4R, EPFL](https://www.epfl.ch/schools/enac/fr/a-propos/data-a-lenac/enac-it4research-fr/)

Né au – [Laboratoire de Sociologie Urbaine, EPFL](https://www.epfl.ch/labs/lasur/fr/index-fr-html/)

Elaboré à – [Située.ch](http://xn--situe-esa.ch/)

### Disclaimer

Ce projet utilise des open data, notamment les données cartographiques Open Street Map (OSM), une base de donnée géoréférencée participative (même fonctionnement que wikipédia). Toutes les informations présentes dans l’offre territorial de proximité ne sont pas des données approuvées par une autorité suisse.

Par ailleurs, les requêtes isochrones font appel à un tiers: [Openrouteservice](https://openrouteservice.org/).

Cette interface est une démo et invite à des collaborations avec des acteurs locaux pour affiner l’outil. Nous appelons les utilisateurs à signaler d’éventuelles erreurs à l’adresse suivante: marc-edouard.schultheiss@epfl.ch.

### Contact

Marc-Edouard Schultheiss | ing. civil dipl. EPF, Dr. en Sociologie Urbaine

marc-edouard.schultheiss@epfl.ch
