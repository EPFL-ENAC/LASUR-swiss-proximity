
### Proximity criteria formula

The user can interact in three manners with the values projected on the map:

1. Select a series of criteria $x \in \mathcal{X} \subset \{ 'Public','Care','Culture', ... ,'Transport'\}$
2. Specify the criteria-specific diversity index $i_x \in I = \{1, 2, 3, 4, 5 \}$ 
3. Specify a criteria-specific weight $k_x \enspace | \enspace 0 \leq k_x \leq 1$ associated to each criteria

The formula to compute the modified-value Distance $\hat{\delta}$ that will be projected on the map goes as follows:

$$
\hat{\delta}_i = max(\{k_x \cdot Dist_i(x) : x\in\mathcal{X}\}) \enspace \leq 7000 \enspace \forall(x, k, i)
$$

with distances $\hat{\delta}$ and $Dist_i(x)$ in meters.

**Let us take an example.** Let’s say we are interested in defining “proximity” as easy access to the Cultural scene, Sport amenities, and Outdoor locations. When the user selects a series of criteria in the sidebar of the interface, they put together under the hoods $\mathcal{X} = \{'Culture','Sport','Outdoor'\}$. Users can then select, for each criteria the diversity index e.g., $i_{Culture} = 5, \enspace i_{Sport} = 2, \enspace i_{Outdoor} = 2$. This means that the Swiss Proximity engine will look for the distance to the 5 nearest Culture locations, the 2 nearest Sport locations, and the 2 nearest Outdoor location. If a criteria-specific weight is entered e.g., $k_{Culture} = .75$ then the distance will be artificially reduced to give less importance to the Cultural scene in the user’s own definition of the “proximity”.

### Color code

For each zone (Traffic zone or hexagon), the distance value of $\hat{\delta}$ takes a specific color based on the following discretization.

Demand:

| Travel time (up to) | Approx. Distance [m] | Color [Hex] | Cat |
| --- | --- | --- | --- |
| 15’ (walk) | 1200 | #005A32 | A |
| 20’ (walk) | 1600 | #238443 | B |
| 30’ (walk) | 2400 | #41AB5D | C |
| 15’ (bicycle) | 3700 | #78C679 | D |
| 20’ (bicycle) | 5000 | #ADDD8E | E |
| 30’ (bicycle) | 7000 | #D9F0A3 | F |
| > 30’ (bicycle) | > 7000 | #FFFFCC | G |

Supply:

| Share of proximity trips | Color [Hex] |  |
| --- | --- | --- |
| 0 | No fill | G |
| Quantile 1/6 | #D9F0A3 | F |
| Quantile 2/6 | #ADDD8E | E |
| Quantile 3/6 | #78C679 | D |
| Quantile 4/6 | #41AB5D | C |
| Quantile 5/6 | #238443 | B |
| Quantile 6/6 | #005A32 | A |

### Proximity criteria details

| UI | BACKEND | OSM tags | UI infos |
| --- | --- | --- | --- |
| Guichets | Public | community_centre, police, post_box, post_office, bank | Postes, banques, police, … |
| Se soigner | Care | nursing_home, pharmacy, hospital, clinic, doctors, dentist, optician, hairdresser, beauty | Pharmacies, hôpitaux, dentistes, opticiens, coiffeurs, beauté, … |
| Se cultiver | Culture | arts_centre, library, theatre, nightclub, cinema, museum, events_venue, religion (muslim, jewish, christian) | Bibliothèques, théâtres, cinémas, lieux de culte, … |
| S’aérer | Outdoor | park, playground, square, landuse_recreation_ground, water, fountain, riverbank, river | Parcs, places, fontaines, rives, … |
| Bien manger | Catering | restaurant, fast_food, cafe, pub, bar, food_court, biergarten | Restaurants, cafés, pubs, … |
| Faire du sport | Sport | sports_centre, pitch, swimming_pool, swimming_pool, swimming, water_park, fitness_centre, ice_rink, tennis, golf_course, stadium | Piscines, fitness, stades, patinoires, tennis, … |
| Faire ses courses | Provision | marketplace, supermarket, bakery, general, butcher, greengrocery | Super-marchés, boulangeries, marchés, … |
| Faire les magasins | Shopping | kiosk, mall, department_store, convenience, clothes, florist, chemist, books, shoes, furniture | Kiosks, fleuristes, librairies, bricolage, … |
| Apprendre | Education | university, school, college, kindergarten | Ecoles primaires, secondaires, universités, garderies, … |
| Transports publics | Transport | bus_station, taxi, railway (station, alt), tram_stop, bus_stop | Gares, arrêts de bus et tram, zone taxi, … |

### Crédits

Support technique et développement – ENAC IT4R, EPFL

Né au – Laboratoire de Sociologie Urbaine, EPFL

Elaboré à – [Située.ch](http://xn--situe-esa.ch/) 

### Disclaimer