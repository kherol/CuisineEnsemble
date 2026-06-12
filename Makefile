.PHONY: up down logs backend frontend test zip

up:
	docker compose up --build

down:
	docker compose down

logs:
	docker compose logs -f

backend:
	cd backend && uvicorn app.main:app --reload

frontend:
	cd frontend && npm run dev

test:
	cd backend && python -m compileall app
	cd frontend && npm run build

zip:
	cd .. && zip -r CuisineEnsemble.zip CuisineEnsemble -x "*/node_modules/*" "*/.venv/*" "*/__pycache__/*"
