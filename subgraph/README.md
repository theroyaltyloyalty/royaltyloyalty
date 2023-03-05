# @royaltyloyalty/subgraph

A subgraph that indexes royalty events.

## Quickstart

From a clean pull:
```sh
npm install
```

# RoyaltyLoyalty Subgraph

## Running tests

### Matchstick setup

We're using [Matchstick](https://github.com/LimeChain/matchstick). Matchstick supports Macs and other Ubuntu-based machines natively. For other operating systems they have a Docker-based solution (see their repo for more info).

Copy `matchstick.yaml.example` and name the copy `matchstick.yaml`. Make sure the path there is a \*_full_ working path to your monorepo's top `node_modules` folder. Matchstick compilation fails when using relative paths.

### Running tests

Run these commands in sequence

```sh
npm run prepare:local 
```

```sh
npm run codegen
```

```sh
npm run test
```

## Deploy Your Own - UPDATE stevennevins/royaltyloyaly in package.json

### Authenticate

To authenticate for thegraph deployment use the `Access Token` from thegraph dashboard:

```sh
graph auth --product hosted-service $ACCESS_TOKEN
```

### Create subgraph.yaml from config template

## Prepare Subgraph
```sh
npm run prepare:mumbai

```

### Generate types to use with Typescript

```sh
npm run codegen
```

### Compile and deploy to thegraph (must be authenticated)

## Deploy Subgraph
```sh
npm run deploy:mumbai
```
