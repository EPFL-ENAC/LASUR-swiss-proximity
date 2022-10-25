# Mabox vecor tiles



File : access_5th_amenity_transit_0_13.mbtiles

It contains 

2 levels of H3 hexagons (zoom 0 - 8 and 9-10) :

 ![m](h3.png)



and accurate data (zoom 11 -13) :

![  ](polygon.png)



Both layers (amenity and transit) is included. 



## How to start the tile server locally ?

- Place the file access_5th_amenity_transit_0_13.mbtiles into a folder named "tileserv"

- Run the follwoing command : 
  
   `docker `run -it -v ${pwd}/tileserv:/data -p 8080:80 maptiler/tileserver-gl
* Navigate to http://localhost:8080/ to access a viewer





More if on [GitHub - maptiler/tileserver-gl: Vector and raster maps with GL styles. Server side rendering by MapLibre GL Native. Map tile server for MapLibre GL JS, Android, iOS, Leaflet, OpenLayers, GIS via WMTS, etc.](https://github.com/maptiler/tileserver-gl)


