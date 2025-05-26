

# Directory variables
OUTPUT_DIR = output
GEOJSON_DIR = $(OUTPUT_DIR)

# Input GeoJSON files
GEOJSON_6 = $(GEOJSON_DIR)/demand_h3_level_6.geojson
GEOJSON_7 = $(GEOJSON_DIR)/demand_h3_level_7.geojson
GEOJSON_8 = $(GEOJSON_DIR)/demand_h3_level_8.geojson
GEOJSON_9 = $(GEOJSON_DIR)/demand_h3_level_9.geojson

# Output PMTiles files
PMTILES_6 = $(OUTPUT_DIR)/demand_h3_6.pmtiles
PMTILES_7 = $(OUTPUT_DIR)/demand_h3_7.pmtiles
PMTILES_8 = $(OUTPUT_DIR)/demand_h3_8.pmtiles
PMTILES_9 = $(OUTPUT_DIR)/demand_h3_9.pmtiles
PMTILES_COMPLETE = $(OUTPUT_DIR)/demand_complete.pmtiles

# Default target
all: $(PMTILES_COMPLETE)

# Generate level 6 tiles (zoom 0-5)
$(PMTILES_6): $(GEOJSON_6)
	tippecanoe -z5 -Z0 -o $@ \
		--layer=demand \
		--coalesce-densest-as-needed \
		--force \
		--no-tiny-polygon-reduction \
		$<

# Generate level 7 tiles (zoom 6-7)
$(PMTILES_7): $(GEOJSON_7)
	tippecanoe -z7 -Z6 -o $@ \
		--layer=demand \
		--coalesce-densest-as-needed \
		--force \
		-pk \
		$<

# Generate level 8 tiles (zoom 8-9)
$(PMTILES_8): $(GEOJSON_8)
	tippecanoe -z9 -Z8 -o $@ \
		--layer=demand \
		--coalesce-densest-as-needed \
		--force \
		-pk \
		$<

# Generate level 9 tiles (zoom 10+, auto-detect max zoom)
$(PMTILES_9): $(GEOJSON_9)
	tippecanoe -zg -Z10 -P -o $@ \
		--layer=demand \
		--coalesce-densest-as-needed \
		--force \
		-pk \
		$<

# Combine all tiles into final PMTiles file
$(PMTILES_COMPLETE): $(PMTILES_6) $(PMTILES_7) $(PMTILES_8) $(PMTILES_9)
	tile-join --force -o $@ \
		$(PMTILES_6) \
		$(PMTILES_7) \
		$(PMTILES_8) \
		$(PMTILES_9) \
		-pk

# Individual targets
tiles-6: $(PMTILES_6)
tiles-7: $(PMTILES_7)
tiles-8: $(PMTILES_8)
tiles-9: $(PMTILES_9)

# Clean generated tiles
clean:
	rm -f $(PMTILES_6) $(PMTILES_7) $(PMTILES_8) $(PMTILES_9) $(PMTILES_COMPLETE)

# Force rebuild
rebuild: clean all

.PHONY: all tiles-6 tiles-7 tiles-8 tiles-9 clean rebuild