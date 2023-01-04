# Swiss Mobility - LASUR & TRANSP OR

## Project setup

```bash
make install
```

You need to specify your APIs keys in .env file (Openrouteservice, Traveltime, Maptiler)

## Project start dev app

```bash
make run
```

For a completely functional app, you will need to have a nginx reverse-proxy working to add secret APIs keys to your requests.
Before running you can use make ploy

## Project deploy

```bash
make deploy
```

This builds the app in a docker image and then runs nginx container, including proxy.

## Data Processing

See `/data_processing/README.md`

## Dev app deployed

https://swiss-proximity-test.epfl.ch/
