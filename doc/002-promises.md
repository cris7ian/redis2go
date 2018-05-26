# 2. Promises 

Date: 26/05/2018

## Status

Accepted

## Context

An async pattern is needed to handle read/write calls.

## Decision

We will use [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to handle
async requests instead of callbacks.

Even tho right now our implementation exists only in memory, it's better for the API to consider side effects so we don't
break future changes.

## Consequences

Node's version to run this project will have to be above 6.4.0
