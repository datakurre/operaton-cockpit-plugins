.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: build
build: node_modules ## Build the project
	npm run build

develop: ## Launch opinionated IDE
	devenv --profile devcontainer shell -- code .

up: ## Launch devenv fixture
	devenv up

.PHONY: watch
watch: node_modules ## Watch for changes and rebuild
	npm run watch

.PHONY: check
check: prettier-check ## Check code

.PHONY: format
format: prettier-format ## Format code

.PHONY: prettier-check
prettier-check:
	npm run prettier:check

.PHONY: prettier-format
prettier-format:
	npm run prettier:format

.PHONY: upgrade
upgrade: ## Upgrade dependencies
	npm run upgrade

node_modules:
	npm ci
