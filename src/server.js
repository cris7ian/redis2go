const Hapi = require('hapi')
const Redis2Go = require('./lib/redis2go')

process.title = 'redis2go'

const client = new Redis2Go()

const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: 'localhost'
})

server.route({
  method: 'GET',
  path: '/dbSize',
  handler: async () => {
    return client.dbSize().catch(error => `Error: ${error}`)
  }
})

server.route({
  method: 'PUT',
  path: '/{key}/incr',
  handler: async request => {
    const key = request.params.key
    return client.incr(key).catch(error => `Error: ${error}`)
  }
})

server.route({
  method: 'PUT',
  path: '/{key}/zadd',
  handler: async request => {
    const key = request.params.key
    if (typeof request.payload !== 'string') {
      return 'Content-Type not supported'
    }
    const args = request.payload.split(' ')
    return client.zadd(key, ...args).catch(error => `Error: ${error}`)
  }
})

server.route({
  method: 'GET',
  path: '/{key}/zcard',
  handler: async request => {
    const key = request.params.key
    return client.zcard(key).catch(error => `Error: ${error}`)
  }
})

server.route({
  method: 'GET',
  path: '/{key}/zrank/{value}',
  handler: async request => {
    const key = request.params.key
    const value = request.params.value
    return client.zrank(key, value).catch(error => `Error: ${error}`)
  }
})

server.route({
  method: 'GET',
  path: '/{key}/zrange/{start}/{end}',
  handler: async request => {
    const { key, start, end } = request.params
    return client.zrange(key, start, end).catch(error => `Error: ${error}`)
  }
})

server.route({
  method: 'PUT',
  path: '/{key}',
  handler: async request => {
    const key = request.params.key
    if (typeof request.payload !== 'string') {
      return 'Content-Type not supported'
    }
    const args = request.payload.split(' ')
    return client.set(key, ...args).catch(error => `Error: ${error}`)
  }
})

server.route({
  method: 'GET',
  path: '/{key}',
  handler: async request => {
    const key = request.params.key
    return client.get(key).catch(error => `Error: ${error}`)
  }
})

server.route({
  method: 'DELETE',
  path: '/{key}',
  handler: async request => {
    const key = request.params.key
    return client.del(key).catch(error => `Error: ${error}`)
  }
})

server.route({
  method: 'GET',
  path: '/',
  handler: async request => {
    const commandQuery = request.query.cmd
    if (!commandQuery) {
      return 'No command specified'
    }

    const [command, ...args] = commandQuery.split(' ')

    switch (command) {
      case 'SET':
        return client.set(...args)
      case 'GET':
        return client.get(...args)
      case 'DEL':
        return client.del(...args)
      case 'DBSIZE':
        return client.dbSize()
      case 'INCR':
        return client.incr(...args)
      case 'ZADD':
        return client.zadd(...args)
      case 'ZCARD':
        return client.zcard(...args)
      case 'ZRANK':
        return client.zrank(...args)
      case 'ZRANGE':
        return client.zrange(...args)
      default:
        return 'no command found'
    }
  }
})

const init = async () => {
  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

init()
