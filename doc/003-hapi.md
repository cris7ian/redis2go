# 3. Hapi 

Date: 27/05/2018

## Status

Accepted

## Context

We need an HTTP framework for the networking part of the project.

## Decision

We will use [Hapi.js](https://hapijs.com/) as framework. It's lightweight and enables developers to focus on writing 
reusable application logic instead of spending time building infrastructure.

## Consequences

We will bump the node version to `8.11.2` to support [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) 
and Happi 17.
