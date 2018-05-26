const Redis2Go = require('./redis2go')

describe('Redis2Go Commands', () => {

  it('should set a key', done => {
    const redis = new Redis2Go()
    redis.set(100).then(result => {
      expect(result).toBe('OK')
      done()
    })
  })


  it('should set a key and get it', done => {
    const redis = new Redis2Go()
    redis.set('my_key', 100)
      .then(() => {
        redis.get('my_key').then(result => {
          expect(result).toBe(100)
          done()
        })
      })
  })

  it('should delete a key already set', done => {
    const redis = new Redis2Go()
    redis.set('my_key', 100).then(() => {
      redis.del('my_key').then(result => {
        expect(result).toBe('OK')
        done()
      })
    })
  })

  it('should set a key and this key should expire after a second', done => {
    const redis = new Redis2Go()
    redis.set('my_key', 100, 1)
      .then(() => new Promise(resolve => setTimeout(() => resolve(), 1100)))
      .then(() => {
        console.log('hey!')
        redis.get('my_key').then(result => {
          expect(result).toBe(null)
          done()
        })
      })
  })

  it('should delete several keys that already exist', done => {
    const redis = new Redis2Go()
    redis.set('my_key', 100)
      .then(() => redis.set('my_other_key', 200))
      .then(() => {
        redis.del('my_key', 'my_other_key').then(result => {
          expect(result).toBe(2)
          done()
        })
      })
  })

  it('Should return the size of my db', done => {
    const redis = new Redis2Go()
    redis.set('my_key', 100)
      .then(() => redis.set('my_other_key', 200))
      .then(() => {
        redis.dbSize().then(size => {
          expect(size).toBe(2)
          done()
        })
      })
  })

  it('should increment my index if I don\'t have one', done => {
    const redis = new Redis2Go()
    redis.incr('my_key').then(result => {
      expect(result).toBe(1)
      done()
    })
  })

  it('should increment my index by 1 if have one', done => {
    const redis = new Redis2Go()
    redis.set('my_key', 100)
      .then(() => {
      redis.incr('my_key').then(result => {
        expect(result).toBe(101)
        done()
      })
        .catch(() => done())
    })
  })

  it('should not be able to increment an index by 1 if have a different type', done => {
    const redis = new Redis2Go()
    redis.set('my_key', 'not a number')
      .then(() => {
        redis.incr('my_key')
          .catch(error => {
            expect(error).toBe('Value stored cannot be represented as an integer')
            done()
          })
      })
  })
})