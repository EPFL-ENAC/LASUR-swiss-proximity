install:
	npm install
	$(MAKE) -C frontend install

dev-proxy:
	docker-compose --profile dev up --build --remove-orphans

dev-frontend:
	$(MAKE) -C frontend run

dev:
	$(MAKE) run-proxy &
	$(MAKE) run

test:
	$(MAKE) -C frontend test

lint:
	$(MAKE) -C frontend lint

run:
	docker-compose --profile prod build --pull
	docker-compose --profile prod up --remove-orphans

process:
	$(MAKE) -C data process
