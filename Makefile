install:
	npm install
	$(MAKE) -C frontend install

run:
	$(MAKE) -C frontend run

test:
	$(MAKE) -C frontend test

lint:
	$(MAKE) -C frontend lint

deploy:
	docker-compose build --parallel --pull
	docker-compose up --remove-orphans

process:
	$(MAKE) -C data process
