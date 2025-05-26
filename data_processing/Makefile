# Directories
OUTPUT_DIR = output
GEOJSON_DIR = geojson

# Common tippecanoe options
TIPPECANOE_BASE = --coalesce-densest-as-needed --force

# Default target
all: $(OUTPUT_DIR)/demand_h3.pmtiles $(OUTPUT_DIR)/supply_h3.pmtiles

# Pattern rule for H3 tiles
$(GEOJSON_DIR)/%_h3_6.pmtiles: $(GEOJSON_DIR)/%_h3_level_6.geojson
	tippecanoe -z5 -Z0 -o $@ --layer=$*_h3 $(TIPPECANOE_BASE) --no-tiny-polygon-reduction $<

$(GEOJSON_DIR)/%_h3_7.pmtiles: $(GEOJSON_DIR)/%_h3_level_7.geojson
	tippecanoe -z7 -Z6 -o $@ --layer=$*_h3 $(TIPPECANOE_BASE) -pk $<

$(GEOJSON_DIR)/%_h3_8.pmtiles: $(GEOJSON_DIR)/%_h3_level_8.geojson
	tippecanoe -z9 -Z8 -o $@ --layer=$*_h3 $(TIPPECANOE_BASE) -pk $<

$(GEOJSON_DIR)/%_h3_9.pmtiles: $(GEOJSON_DIR)/%_h3_level_9.geojson
	tippecanoe -z10 -Z10 -P -o $@ --layer=$*_h3 $(TIPPECANOE_BASE) -pk $<

# Combine tiles
$(OUTPUT_DIR)/%_h3.pmtiles: $(GEOJSON_DIR)/%_h3_6.pmtiles $(GEOJSON_DIR)/%_h3_7.pmtiles $(GEOJSON_DIR)/%_h3_8.pmtiles $(GEOJSON_DIR)/%_h3_9.pmtiles
	tile-join --force -o $@ $^ -pk

# Polygon tiles
tiles-polygon: $(OUTPUT_DIR)/demand_polygon.pmtiles

$(OUTPUT_DIR)/demand_polygon.pmtiles: $(GEOJSON_DIR)/demand_polygon.geojson
	tippecanoe -zg -Z0 -o $@ --layer=demand_polygon $(TIPPECANOE_BASE) -pk $<

# Clean
clean:
	rm -f $(GEOJSON_DIR)/*_h3_*.pmtiles $(OUTPUT_DIR)/*.pmtiles

# Push to CDN
push-cdn: all
	s3cmd put --recursive --acl-public --guess-mime-type $(OUTPUT_DIR) s3://${ENACIT_CDN_BUCKET}/lasur-swiss-proximity/

.PHONY: all tiles-polygon clean push-cdn