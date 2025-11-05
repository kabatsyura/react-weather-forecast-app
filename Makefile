dev:
	npm run dev

lint:
	npm run lint

lint-fix:
	npm run lint-fix

build:
	npm run build

docker-build:
	docker build -t tatneft-react-app -f deploy/Dockerfile .

docker-run:
	docker run -p 80:80 tatneft-react-app

docker-push:
	docker tag tatneft-react-app dmitriikabatsiura/tatneft-react-app:latest
	docker push dmitriikabatsiura/tatneft-react-app:latest

docker-pull:
	docker pull dmitriikabatsiura/tatneft-react-app:latest
	docker run -d -p 80:80 dmitriikabatsiura/tatneft-react-app:latest
