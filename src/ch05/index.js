const Redis = require('ioredis');
const ch05 = require('./main');

async function run() {
  const redis = new Redis({
    db: 15,
  });
  redis.on('error', error => {
    debug('Redis connection error', error);
  });
  await redis.flushdb();

  let num = 200;
  while(num--) {
    await ch05.logRecent(redis, 'test', `this is message ${num}`);
  }

  let count = 1;
  while (count < 6) {
    let i = 0;
    while (i < count) {
      await ch05.logCommon(redis, 'test', `message-${count}`);
      i++;
    }
    count++;
  }
  const common = await redis.zrevrange('common:test:info', 0, -1, 'withscores');
  console.log(common);

  await redis.quit();
}

run();
