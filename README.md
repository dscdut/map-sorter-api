# Map Sorter API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://res.cloudinary.com/dddj3wlza/image/upload/v1701334697/gdsc/GDSC-DUT_hxqptp.jpg" width="200" alt="Nest Logo" /></a>
</p>
<p align="center">Map Sorter - Product of GDSC-DUT</p>

## Description

API for **Map Sorter** Product

## Installation

```bash
# install packages
$ npm ci

# init database
$ docker compose up -d init_db
```

Remember to add `--build` option when running at the first time

## Run up the api (For Mobile and Frontend team)

```bash
$ docker compose up -d api_dev
```

Remember to add `--build` option when running at the first time

### Sync code when development

```bash
# show the running container
$ docker ps

# get the CONTAINER ID or NAME of the running container of map-sorter-api
# restart the container
$ docker restart <container_id>

```

## Migration

1. Using TypeORM

```bash
# run migration
$ npm run typeorm:run-migration

# generate migration
$ npm run typeorm:generate-migration --name=some-name

# if script above doesn't work, try using git bash, change $npm_config_name in package.json to %name% and run the following script:
$ name=migration-name npm run typeorm:generate-migration
```

## Seeding

### Creating seeds

1. Create seed file with `npm run seed:create -- --name=Demo`. Where `Demo` is name of entity.
2. Go to `src/database/typeorm/seeds/demo/demo-seed.service.ts`.
3. In `run` method extend your logic.

### Run seed

```bash
$ npm run seed:run
```

## Generate module, controller & service

```bash
# Generate module
$ name=demo npm run module:generate

# Generate controller
$ name=demo npm run controller:generate

# Generate service
$ name=demo npm run service:generate
```

Module, controller & service of Demo will be created in `src/modules/demo`

## Gen entity from database

1. Change the desired database name in the `gen-entity-local` script in `package.json`
2. Run the following command

```bash
$ npm run gen-entity-local
```

The new entities can be found at `src/database/typeorm/generated` folder

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# unit tests in watch mode
$ npm run test:watch

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
