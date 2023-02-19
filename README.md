# Swiss Proximity - LASUR & TRANSP OR

## Setup

```bash
make install
```

You need to specify your APIs keys in `.env` file (Openrouteservice, Traveltime, Maptiler) for api-proxy.
For ENACIT team, you can find our keys in KeeWeb keyring (Notion for details)
Example of `.env` file (root folder, as docker-compose.yml):

```
TRAVELTIME_API_KEY=changeit
TRAVELTIME_APP_ID=notreallysecretbutchangeit
ORS_API_KEY=changeit
MAPTILER_API_KEY=changeit
```

## Start dev app

```bash
make run
```

Only starts development server.

## Start dev app with api-proxy

```bash
make run-dev
```

Run only reverse-proxy & api-proxy with docker, then starts development server.

## Deploy

```bash
make deploy
```

Build the app in a docker image and then runs nginx container, including api-proxy.

## Data Processing

See `/data_processing/README.md`

## Test app deployed

https://swiss-proximity-test.epfl.ch/
