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
    redis.set('my_key', 100).then(() => {
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
    redis
      .set('my_key', 100, 1)
      .then(() => new Promise(resolve => setTimeout(() => resolve(), 1100)))
      .then(() => {
        redis.get('my_key').then(result => {
          expect(result).toBe(null)
          done()
        })
      })
  })

  it('should delete several keys that already exist', done => {
    const redis = new Redis2Go()
    redis
      .set('my_key', 100)
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
    redis
      .set('my_key', 100)
      .then(() => redis.set('my_other_key', 200))
      .then(() => {
        redis.dbSize().then(size => {
          expect(size).toBe(2)
          done()
        })
      })
  })

  it("should increment my index if I don't have one", done => {
    const redis = new Redis2Go()
    redis.incr('my_key').then(result => {
      expect(result).toBe(1)
      done()
    })
  })

  it('should increment my index by 1 if have one', done => {
    const redis = new Redis2Go()
    redis.set('my_key', 100).then(() => {
      redis
        .incr('my_key')
        .then(result => {
          expect(result).toBe(101)
          done()
        })
        .catch(() => done())
    })
  })

  it('should not be able to increment an index by 1 if have a different type', done => {
    const redis = new Redis2Go()
    redis.set('my_key', 'not a number').then(() => {
      redis.incr('my_key').catch(error => {
        expect(error).toBe('Value stored cannot be represented as an integer')
        done()
      })
    })
  })

  it('should create a sorted set and insert one element', done => {
    const redis = new Redis2Go()
    redis.zadd('myzset', 1, 'one').then(result => {
      expect(result).toBe(1)
      done()
    })
  })

  it('should create a sorted set and insert two elements', done => {
    const redis = new Redis2Go()
    redis.zadd('myzset', 1, 'one', 2, 'two').then(result => {
      expect(result).toBe(2)
      done()
    })
  })

  it('should add another element to my sorted set', done => {
    const redis = new Redis2Go()
    Promise.all([
      redis.zadd('myzset', 1, 'one'),
      redis.zadd('myzset', 2, 'two')
    ]).then(() => {
      redis.get('myzset').then(element => {
        expect(element.set.size).toBe(2)
        done()
      })
    })
  })

  it('should return the cardinality of my sorted set', done => {
    const redis = new Redis2Go()
    Promise.all([
      redis.zadd('myzset', 1, 'one'),
      redis.zadd('myzset', 2, 'two')
    ]).then(() => {
      redis.zcard('myzset').then(size => {
        expect(size).toBe(2)
        done()
      })
    })
  })

  it('should return zero if there is no set with that key', done => {
    const redis = new Redis2Go()
    redis.zcard('no_set').then(size => {
      expect(size).toBe(0)
      done()
    })
  })

  it('should give me the order of the third element', done => {
    const redis = new Redis2Go()
    Promise.all([
      redis.zadd('myzset', 1, 'one'),
      redis.zadd('myzset', 2, 'two'),
      redis.zadd('myzset', 3, 'three')
    ]).then(() => {
      redis.zrank('myzset', 'three').then(rank => {
        expect(rank).toBe(2)
        done()
      })
    })
  })

  it("should return null because the value isn't in the zset", done => {
    const redis = new Redis2Go()
    Promise.all([
      redis.zadd('myzset', 1, 'one'),
      redis.zadd('myzset', 2, 'two'),
      redis.zadd('myzset', 3, 'three')
    ]).then(() => {
      redis.zrank('myzset', 'four').then(rank => {
        expect(rank).toBe(null)
        done()
      })
    })
  })

  it('should return the full range of my zset', done => {
    const redis = new Redis2Go()
    Promise.all([
      redis.zadd('myzset', 1, 'one'),
      redis.zadd('myzset', 2, 'two'),
      redis.zadd('myzset', 3, 'three')
    ]).then(() => {
      redis.zrange('myzset', 0, -1).then(range => {
        expect(range).toEqual(['one', 'two', 'three'])
        done()
      })
    })
  })

  it('should return the element between 2 and 3', done => {
    const redis = new Redis2Go()
    Promise.all([
      redis.zadd('myzset', 1, 'one'),
      redis.zadd('myzset', 2, 'two'),
      redis.zadd('myzset', 3, 'three')
    ]).then(() => {
      redis.zrange('myzset', 2, 3).then(range => {
        expect(range).toEqual(['three'])
        done()
      })
    })
  })

  it('should return the last 2 elements', done => {
    const redis = new Redis2Go()
    Promise.all([
      redis.zadd('myzset', 1, 'one'),
      redis.zadd('myzset', 2, 'two'),
      redis.zadd('myzset', 3, 'three')
    ]).then(() => {
      redis.zrange('myzset', -2, -1).then(range => {
        expect(range).toEqual(['two', 'three'])
        done()
      })
    })
  })
})
