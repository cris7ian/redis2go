const {get} = require('axios')

describe('Integration tests - Happy path', () => {
  it('should set a value for a given key', done => {
    get('http://localhost:3000/?cmd=SET%20mykey%20cool-value')
      .then(({data}) => {
        expect(data).toBe('OK')
        done()
      })
  })

  it('should get a value for a given key', done => {
    get('http://localhost:3000/?cmd=GET%20mykey')
      .then(({data}) => {
        expect(data).toBe('cool-value')
        done()
      })
  })

  it('should give me the size of my db', done => {
    get('http://localhost:3000/?cmd=DBSIZE')
      .then(({data}) => {
        expect(data).toBe(1)
        done()
      })
  })

  //myzset 2 "two" 3 "three"

  it('should delete the value for a given key', done => {
    get('http://localhost:3000/?cmd=DEL%20mykey')
      .then(({data}) => {
        expect(data).toBe('OK')
        done()
      })
  })

  it('should create and increment a counter', done => {
    get('http://localhost:3000/?cmd=INCR%20index')
      .then(({data}) => {
        expect(data).toBe(1)
        done()
      })
  })

  it('should create a zset', done => {
    get('http://localhost:3000/?cmd=ZADD%20myzset%202%20"two"%203%20"three"')
      .then(({data}) => {
        expect(data).toBe(2)
        done()
      })
  })

  it('should give me the cardinality of my set', done => {
    get('http://localhost:3000/?cmd=ZCARD%20myzset')
      .then(({data}) => {
        expect(data).toBe(2)
        done()
      })
  })

  it('should give me the rank of one of the elements in my set', done => {
    get('http://localhost:3000/?cmd=ZRANK%20myzset%20"three"')
      .then(({data}) => {
        expect(data).toBe(1)
        done()
      })
  })

  it('should give me the range of my set', done => {
    get('http://localhost:3000/?cmd=ZRANGE%20myzset%200%201')
      .then(({data}) => {
        expect(data).toEqual(["\"two\""])
        done()
      })
  })
})