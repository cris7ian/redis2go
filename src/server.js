const Hapi = require('hapi')
const Redis2Go = require('./lib/redis2go')

process.title = 'redis2go';

const client = new Redis2Go()

const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: 'localhost'
})

server.route({
  method: 'GET',
  path: '/',
  handler: async request => {
    const commandQuery = request.query.cmd
    if (!commandQuery) {
      return 'No command specified'
    }

    const [command, ...args] =  commandQuery.split(' ')

    switch (command) {
      case 'SET': return client.set(...args)
      case 'GET': return client.get(...args)
      case 'DEL': return client.del(...args)
      case 'DBSIZE': return client.dbSize()
      case 'INCR': return client.incr(...args)
      case 'ZADD': return client.zadd(...args)
      case 'ZCARD': return client.zcard(...args)
      case 'ZRANK': return client.zrank(...args)
      case 'ZRANGE': return client.zrange(...args)
      default: return 'no command found'
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
