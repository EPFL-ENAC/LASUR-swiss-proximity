# %%
import os
import pandas as pd
import geopandas as gpd
import h3
import h3pandas
from shapely.geometry import Polygon
import numpy
import pydeck as pdk
import h3pandas
from sqlalchemy import create_engine


# %% [markdown]
# Define paths and password

# %%
root_folder = os.path.dirname(os.path.abspath("__file__"))
data_folder = os.path.join(root_folder, "source_data")
geojson_folder = os.path.join(root_folder, "geojson")
path_demand_h3 = os.path.join(
    data_folder, "demand", "ALL_2017_2050_share_of_trips_h3.pkl"
)
path_demand_polygon = os.path.join(
    data_folder, "demand", "ALL_2017_2050_share_of_trips_taz.pkl"
)
path_demand_geneva_h3 = os.path.join(
    data_folder, "demand", "Geneva_mmt_2015_2023_share_of_trips_h3.pkl"
)
path_supply_h3 = os.path.join(data_folder, "supply", "All_CH_access_light_H3.pkl")
path_supply_polygon = os.path.join(data_folder, "supply", "All_CH_access_light_TAZ.pkl")
path_verkehrszonen = os.path.join(data_folder, "verkehrszonen.gpkg")


# %% [markdown]
# # Load demand h3 data

# %%
df = pd.read_pickle(path_demand_h3, compression="gzip")
df = df[df["h3index"].notna()]
df["h3index_int"] = df["h3index"].astype(numpy.int64)
df["h3index"] = df["h3index_int"].apply(lambda x: h3.int_to_str(x))
df.set_index("h3index", inplace=True)


# %%
# First, let's pivot the data to have separate columns for each year and proximity threshold combination
df_combined = df.pivot_table(
    index="h3index",
    columns=["Proximity_threshold", "Year"],
    values=["Fuss", "Velo", "OeV", "Auto", "All_modes"],
    aggfunc="first",  # Use 'first' since there should be only one value per combination
)

# Flatten the multi-level column names
df_combined.columns = [f"{col[0]}_{col[1]}_{col[2]}" for col in df_combined.columns]

# Keep the Agglo column (it should be the same for all rows with same h3index)
df_combined["Agglo"] = df.groupby("h3index")["Agglo"].first()


# Reset index to have h3index as a column for h3pandas operations
df_combined = df_combined.reset_index()
df_combined = df_combined.set_index("h3index")


# %%
df_level9 = df_combined.copy()
df_level9 = df_level9.h3.h3_to_geo_boundary()
numeric_cols = df_level9.select_dtypes(include=[numpy.number]).columns

for col in numeric_cols:
    # Round all values
    rounded_col = df_level9[col].round(4)
    # Replace exact zeros back to 0 (not 0.0000)
    df_level9[col] = numpy.where(df_level9[col] == 0, 0, rounded_col)


# %%


def aggregation(series):
    if series.name == "Agglo":
        return series.iloc[0]
    else:
        return series.mean().round(4)  # Example: return the mean of the series


def to_parent_aggregate(df, level):
    return df.h3.h3_to_parent_aggregate(level, operation=aggregation)


def h3_to_geojson(df, level):
    gdf = gpd.GeoDataFrame(df)

    # Convert to GeoJSON string with drop_id option, then write to file
    geojson_str = gdf.to_json(drop_id=True)

    # Write the GeoJSON string to file
    with open(
        os.path.join("geojson", "demand_h3_level_" + level + ".geojson"), "w"
    ) as f:
        f.write(geojson_str)


# %%
# Aggregate to level 6
df_level6 = to_parent_aggregate(df_combined, 6)

# Aggregate to level 7
df_level7 = to_parent_aggregate(df_combined, 7)
# Aggregate to level 8
df_level8 = to_parent_aggregate(df_combined, 8)

# %%
h3_to_geojson(df_level6, "6")
h3_to_geojson(df_level7, "7")
h3_to_geojson(df_level8, "8")
h3_to_geojson(df_level9, "9")

# %%
# Prepare the data for pydeck H3 layer
df_viz = df_level9.copy()
df_viz = df_viz[df_viz["All_modes_3800_2050"] > 0.1]
# Reset index to get h3index as a column
# df_viz = df_viz.sample(frac=0.5)
df_viz
df_viz["hex"] = df_viz.index

df_viz["value"] = (df_viz["All_modes_3800_2050"] * 255).astype(int)


# %%
layer = pdk.Layer(
    "H3HexagonLayer",
    df_viz,
    pickable=True,
    stroked=False,
    filled=True,
    extruded=False,
    get_hexagon="hex",
    get_fill_color="[255 - value, 100, value, 180]",  # Red to blue gradient with transparency
)
# Set the viewport to Switzerland
view_state = pdk.ViewState(
    latitude=46.8182,  # Switzerland center
    longitude=8.2275,
    zoom=7,
    bearing=0,
    pitch=0,
)
# Create the deck
r = pdk.Deck(
    layers=[layer],
    initial_view_state=view_state,
    tooltip={
        "text": "H3 Index: {hex}\nAll modes: {All_modes}\nAgglo: {Agglo}\nYear: {Year}"
    },
)
r.show()


# %% [markdown]
# # Load supply h3 data

# %%
df = pd.read_pickle(path_supply_h3, compression="gzip")
df = df[df["h3index"].notna()]
df["h3index_int"] = df["h3index"].astype(numpy.int64)
df["h3index"] = df["h3index_int"].apply(lambda x: h3.int_to_str(x))
df.set_index("h3index", inplace=True)

# %%
# First, let's pivot the data to have separate columns for each year and proximity threshold combination
df_combined = df.pivot_table(
    index="h3index",
    columns=["poi_kind"],
    values=["1", "2", "3", "4", "5"],
    aggfunc="first",  # Use 'first' since there should be only one value per combination
)

# Flatten the multi-level column names
df_combined.columns = [f"{col[0]}_{col[1]}" for col in df_combined.columns]

# Keep the Agglo column (it should be the same for all rows with same h3index)
df_combined["Agglo"] = df.groupby("h3index")["agglo"].first()


# Reset index to have h3index as a column for h3pandas operations
df_combined = df_combined.reset_index()
df_combined = df_combined.set_index("h3index")


# %%
def aggregation(series):
    if series.name == "Agglo":
        return series.iloc[0]
    else:
        return int(series.mean())


def to_parent_aggregate(df, level):
    return df.h3.h3_to_parent_aggregate(level, operation=aggregation)


def supply_h3_to_geojson(df, level):
    gdf = gpd.GeoDataFrame(df)

    # Convert to GeoJSON string with drop_id option, then write to file
    geojson_str = gdf.to_json(drop_id=True)

    # Write the GeoJSON string to file
    with open(
        os.path.join("geojson", "supply_h3_level_" + level + ".geojson"), "w"
    ) as f:
        f.write(geojson_str)


# %%
# Aggregate to level 6
df_level6 = to_parent_aggregate(df_combined, 6)

# Aggregate to level 7
df_level7 = to_parent_aggregate(df_combined, 7)
# Aggregate to level 8
df_level8 = to_parent_aggregate(df_combined, 8)

# %%
df_level9 = df_combined.copy()
df_level9 = df_level9.h3.h3_to_geo_boundary()

# %%
supply_h3_to_geojson(df_level6, "6")
supply_h3_to_geojson(df_level7, "7")
supply_h3_to_geojson(df_level8, "8")
supply_h3_to_geojson(df_level9, "9")

# %% [markdown]
# # Demand polygon

# %%
# load the verkehrszonen
df_verkehrszonen = gpd.read_file(path_verkehrszonen)
# df_verkehrszonen = df_verkehrszonen.drop_duplicates(subset=['id_zone'])
# set index to the verkehrszonen
df_verkehrszonen.set_index("id_zone", inplace=True)


# %%
# load the demand data
df_demand_polygon = pd.read_pickle(path_demand_polygon, compression="gzip")
df_demand_polygon.set_index("Origin", inplace=True)

# %%
# First, let's pivot the data to have separate columns for each year and proximity threshold combination
df_combined = df_demand_polygon.pivot_table(
    index="Origin",
    columns=["Proximity_threshold", "Year"],
    values=["Fuss", "Velo", "OeV", "Auto", "All_modes"],
    aggfunc="first",  # Use 'first' since there should be only one value per combination
)

# Flatten the multi-level column names
df_combined.columns = [f"{col[0]}_{col[1]}_{col[2]}" for col in df_combined.columns]

# Keep the Agglo column (it should be the same for all rows with same h3index)
df_combined["Agglo"] = df_demand_polygon.groupby("Origin")["Agglo"].first()

# Reset index to have h3index as a column for h3pandas operations
df_combined = df_combined.reset_index()
df_combined = df_combined.set_index("Origin")

print(f"Combined dataframe shape: {df_combined.shape}")


# %%
df_demand_polygon = df_combined.merge(
    df_verkehrszonen[["geometry"]], left_on="Origin", right_index=True, how="left"
)

# %%
gdf = gpd.GeoDataFrame(df_demand_polygon)
geojson_str = gdf.to_json(drop_id=True)

with open(os.path.join("geojson", "demand_polygon.geojson"), "w") as f:
    f.write(geojson_str)

# %% [markdown]
# # Supply polygon

# %%
# load the demand data
df_supply_polygon = pd.read_pickle(path_supply_polygon, compression="gzip")
df_supply_polygon

# %%
# Add the verkehrszonen polygons dataframe to the demand dataframe
print(len(df_supply_polygon))

df_supply_with_geom = df_supply_polygon.join(df_verkehrszonen, on="taz_id", how="left")
print(len(df_supply_with_geom))

# select where taz_id is null
df_supply_with_geom


# %%
gdf = gpd.GeoDataFrame(df_supply_with_geom, geometry="geometry")
conn_string = (
    f"postgresql://postgres:{postgresql_password}@enacit4r-tiles.epfl.ch:25432/db"
)
engine = create_engine(conn_string)
gdf.to_postgis(
    name="supply_polygon_2",
    schema="swiss_mobility",
    con=engine,
    if_exists="replace",
    index=False,
)
