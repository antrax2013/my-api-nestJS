Small API to play with :

- NestJS / TypeORM & MongoDB / Elastic Search & Kibanna and Docker

## Installation

```bash
$ npm install
```

### Install modules individually

```bash
$ npm i -g @nestjs/cli
$ npm i --save @nestjs/config
$ npm i --save typeorm mongoose
$ npm add @types/mongodb
$ npm i class-validator --save
$ npm i class-transformer --save
$ npm i --save @nestjs/swagger
$ npm install @nestjs/elasticsearch @elastic/elasticsearch
```

## Running the app on localhost

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Swagger UI on localhost

http://localhost:3000/api

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment on docker containers

```bash
$ docker-compose up
```
