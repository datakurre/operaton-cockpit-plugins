.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: build
build: node_modules ## Build the project
	npm run build

.PHONY: shell
shell: ## Enter devenv shell
	devenv shell

.PHONY: develop
develop: devenv.local.nix devenv.local.yaml ## Bootstrap opinionated development environment
	devenv shell --profile=devcontainer -- code .

devenv.local.nix:
	cp devenv.local.nix.example devenv.local.nix

devenv.local.yaml:
	cp devenv.local.yaml.example devenv.local.yaml

up: ## Launch devenv fixture
	devenv up

.PHONY: watch
watch: node_modules ## Watch for changes and rebuild
	npm run watch

.PHONY: lint
lint: node_modules ## Run ESLint on src/
	npm run lint

.PHONY: lint-fix
lint-fix: node_modules ## Run ESLint with auto-fix
	npm run lint:fix

.PHONY: lint-report
lint-report: node_modules ## Generate ESLint JSON report
	npm run lint:report

.PHONY: typecheck
typecheck: node_modules ## Run TypeScript type checking
	npm run typecheck

.PHONY: check
check: node_modules ## Run all static analysis (typecheck + lint + prettier)
	npm run check

.PHONY: fix
fix: node_modules ## Auto-fix all fixable issues (lint + prettier)
	npm run fix

.PHONY: format
format: prettier-format ## Format code

.PHONY: prettier-check
prettier-check: node_modules ## Check code formatting
	npm run prettier:check

.PHONY: prettier-format
prettier-format: node_modules ## Format code with Prettier
	npm run prettier:format

.PHONY: test
test: node_modules ## Run tests
	npm test

.PHONY: upgrade
upgrade: ## Upgrade dependencies
	npm run upgrade

node_modules:
	npm ci
