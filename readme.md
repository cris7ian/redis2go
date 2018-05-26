# Redis2Go

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

## Installation

You'll need Node `v6.10.3` and `npm`. First, install dependencies.

```bash
npm run install
```

That's it.

## Tests

To run unit tests,

```bash
npm run test
```