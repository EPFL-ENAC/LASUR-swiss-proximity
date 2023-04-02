install:
	npm install
	$(MAKE) -C frontend install

dev-proxy:
	docker-compose up --remove-orphans api-proxy-dev reverse-proxy

dev-frontend:
	$(MAKE) -C frontend run

dev:
	$(MAKE) dev-proxy &
	$(MAKE) dev-frontend

test:
	$(MAKE) -C frontend test

lint:
	$(MAKE) -C frontend lint

run:
	docker-compose build --pull
	docker-compose up --remove-orphans -d

process:
	$(MAKE) -C data process
