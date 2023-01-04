install:
	npm install
	$(MAKE) -C frontend install

run-proxy:
	docker-compose --profile dev up  --build --remove-orphans

run:
	$(MAKE) -C frontend run

run-dev:
	$(MAKE) run-proxy &
	$(MAKE) run

test:
	$(MAKE) -C frontend test

lint:
	$(MAKE) -C frontend lint

deploy:
	docker-compose --profile prod  build --pull
	docker-compose --profile prod  up --remove-orphans

process:
	$(MAKE) -C data process
