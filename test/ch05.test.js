describe('Chapter 5', function() {
  require('should');
  const Redis = require('ioredis');
  const ch05 = require('../src/ch05/main');

  let redis;
  before(async () => {
    redis = new Redis({
      db: 15,
    });
    // await redis.flushdb();
    redis.on('error', error => {
      debug('Redis connection error', error);
    });
  });

  after(function() {
    redis.quit();
  });

  describe('test_log_recent', async () => {
    it(`Let's write a few logs to the recent log: five logs`, async () => {
      for (let msg in [0, 1, 2, 3, 4]) {
        await ch05.logRecent(redis, 'test', `this is message ${msg}`);
      }
      const recent = await redis.lrange(
        `recent:test:${ch05.LOG_SEVERITY.INFO}`,
        0,
        -1,
      );

      recent.length.should.be.aboveOrEqual(5);
    });
  });

  describe('test_log_common', async () => {
    it(`Let's write some items to the common log`, async () => {
      let count = 1;
      while (count < 6) {
        let i = 0;
        while (i < count) {
          await ch05.logCommon(redis, 'test', `message-${count}`);
          i++;
        }
        count++;
      }
      const res = await redis.zrevrange(
        `common:test:${ch05.LOG_SEVERITY.INFO}`,
        0,
        -1,
        'withscores',
      );

      res.length.should.equal(10);
      res[0].should.equal('message-5');
      parseInt(res[1], 10).should.equal(5);
    });
  });
});
