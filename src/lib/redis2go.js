const values = require('lodash').values
class Redis2Go {
  constructor() {
    this.db = {}
    this.del = this.del.bind(this)
  }

  set(key, value, secondsToExpire) {
    return new Promise((resolve) => {
      this.db[key] = value
      if(secondsToExpire) {
        setTimeout(() => this.del(key), secondsToExpire*1000)
      }
      resolve('OK')
    })
  }

  get(key) {
    return new Promise((resolve, reject) => {
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
        resolve(values(arguments).reduce((accumulator, arg)=> {
          if (this.db[arg] !== undefined) {
            delete this.db[arg]
            return accumulator + 1
          }
        }, 0))
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
      } else  {
        reject('Value stored cannot be represented as an integer')
      }
    })
  }
}

module.exports = Redis2Go