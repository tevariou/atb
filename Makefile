open-api-schema:
	python api/manage.py spectacular --file openapi-schema.yml
	npm --prefix app run generate:api
