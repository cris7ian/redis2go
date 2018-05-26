# 1. Architecture 

Date: 26/05/2018

## Status

Accepted

## Context

We need to decide the tools we'll need for this small project.

## Decision

We will use [Node.js](https://nodejs.org/en/) for development as we want to use the full potential of dynamic languages 
and thanks to it's IO nature, atomicity will be granted out of the box thanks to Node's event loop.

![](./img/eventloop.jpg)

For testing, we'll use [Jest](https://facebook.github.io/jest/) as it provides all the test tooling needed (test runner,
assertion library, mocks and spies).

## Consequences

Everything will be in ES6 / Javascript.
