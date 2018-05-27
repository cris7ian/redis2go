# Redis2Go 
[![Build Status](https://travis-ci.org/cris7ian/redis2go.svg?branch=master)](https://travis-ci.org/cris7ian/redis2go)
[![npm version](https://badge.fury.io/js/redis2go.svg)](https://badge.fury.io/js/redis2go)

This is a implementation of a subset of [Redis](https://redis.io/) commands. In particular:

1. SET  key value
2. SET  key value EX seconds  (need not implement other SET options)
3. GET  key
4. DEL  key
5. DBSIZE
6. INCR  key
7. ZADD  key score member
8. ZCARD  key
9. ZRANK  key member
10. ZRANGE  key start stop

## Lightweight Architecture Decision Records

We use [ADRs](https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records), so major decisions
are justified and put on context for future consideration.

- [Architecture](./doc/001-architecture.md)
- [Promises](./doc/002-promises.md)
- [Hapi](./doc/003-hapi.md)

## Installation in your Project

You'll need Node `v6.10.3` and `npm`. This packaged it's published on [NPM](https://www.npmjs.com/package/redis2go), so 
you can add it to your JS projects.

```bash
npm install redis2go --save
```

### Usage Example

```js

const Redis2Go = require('./redis2go')
const client = new Redis2Go()

client.set(100).then(result => console.log(result)) // 'OK'


client.get('my_key').then(result => console.log(result)) // '100'
 
```

### JS API of Available Commands

For behavior of each command, check the [Command Reference](https://redis.io/commands).

#### GET
```
 get(key) -> Promise
```

#### SET
```
 set(key, value, expiration_time) -> Promise
```

#### DEL
```
 del(...args) -> Promise
```

#### INCR
```
 incr(key) -> Promise
```

#### DBSIZE
```
 dbsize() -> Promise
```

#### ZADD
```
 zadd(key, [... order, value]) -> Promise
```

#### ZCARD
```
 zcard(key) -> Promise
```

#### ZRANK
```
 zrank(key, value) -> Promise
```

#### ZRANGE
```
 zrange(key, start, end) -> Promise
```

## Tests

To run unit tests, clone this repo and run the following:

```bash
npm install
npm run test
```

To run integration tests:

```bash
npm install
npm run start

#different terminal run the tests
npm run integration-tests

```