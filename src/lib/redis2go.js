const values = require('lodash').values
const chunk = require('lodash').chunk
class Redis2Go {
  constructor() {
    this.db = {}
    this.del = this.del.bind(this)
  }

  set(key, value, secondsToExpire) {
    return new Promise(resolve => {
      this.db[key] = value
      if (secondsToExpire) {
        setTimeout(() => this.del(key), secondsToExpire * 1000)
      }
      resolve('OK')
    })
  }

  get(key) {
    return new Promise(resolve => {
      const value = this.db[key]
      if (value !== undefined) {
        resolve(value)
      } else {
        resolve(null)
      }
    })
  }

  del() {
    return new Promise((resolve, reject) => {
      if (arguments.length === 1) {
        delete this.db[arguments[0]]
        resolve('OK')
      } else {
        resolve(
          values(arguments).reduce((accumulator, arg) => {
            if (this.db[arg] !== undefined) {
              delete this.db[arg]
              return accumulator + 1
            }
          }, 0)
        )
      }
    })
  }

  dbSize() {
    return new Promise(resolve => {
      resolve(values(this.db).length)
    })
  }

  incr(key) {
    return new Promise((resolve, reject) => {
      if (this.db[key] === undefined) {
        this.db[key] = 1
        resolve(this.db[key])
      } else if (parseInt(this.db[key])) {
        this.set(key, parseInt(this.db[key]) + 1)
        resolve(this.get(key))
      } else {
        reject('Value stored cannot be represented as an integer')
      }
    })
  }

  zadd() {
    return new Promise((resolve, reject) => {
      let element
      const key = arguments[0]
      if (this.db[key] !== undefined) {
        if (!this.db[key].zset) {
          return reject('element is not a zset')
        }
        element = this.db[key]
      } else {
        element = {
          zset: true,
          set: new Set(),
          order: {}
        }
      }
      const instructions = chunk(values(arguments).slice(1), 2)
      instructions.map(([order, value]) => {
        element.set.add(value)
        element.order[value] = order
      })
      this.db[key] = element
      resolve(instructions.length)
    })
  }

  zcard(key) {
    return new Promise(resolve => {
      if (this.db[key] === undefined || !this.db[key].zset) {
        resolve(0)
      } else {
        resolve(this.db[key].set.size)
      }
    })
  }

  zrank(key, value) {
    return new Promise(resolve => {
      const element = this.db[key]
      const hasValue =
        element !== undefined && element.zset && element.set.has(value)
      if (!hasValue) {
        resolve(null)
      } else {
        const sortedSet = Array.from(element.set)
          .sort(object => element.order[object])
          .reverse()
        const rank = sortedSet
          .findIndex(orderedValue => orderedValue === value)
        resolve(rank)
      }
    })
  }

  zrange(key, start, end) {
    return new Promise((resolve,reject) => {
      const element = this.db[key]
      const hasValue =
        element !== undefined && element.zset
      if (!hasValue) {
        reject('Element is not a set')
      } else {
        const sortedSet = Array.from(element.set)
          .sort(object => element.order[object])
          .reverse()
        const endIndex = end < 0 ? sortedSet.length - end : end
        resolve(sortedSet.slice(start, endIndex))
      }
    })
  }

}

module.exports = Redis2Go
