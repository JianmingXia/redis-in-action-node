describe('Chapter 2', function () {
    require('should');
    const Redis = require('ioredis');
    const ch02 = require('../ch02/main');
    const uuid4 = require('uuid/v4');

    let redis;
    before(async () => {
        redis = new Redis({
            db: 15
        });
        await redis.flushdb();
        redis.on("error", (error) => {
            debug("Redis connection error", error);
        });
    });

    after(function () {
        redis.quit();
    });

    let token;
    describe('test_login_cookies', async () => {
        it(`What username do we get when we look-up that token => username`, async () => {
            token = uuid4();
            await ch02.updateToken(redis, token, 'username', 'itemX');

            const res = await ch02.checkToken(redis, token);
            res.should.equal('username');
        });

        it(`Let's drop the maximum number of cookies to 0 to clean them out: len = 0`, async () => {
            ch02.Config.LIMIT = 0;

            await ch02.cleanSessions(redis);

            const len = await redis.hlen('login:');
            len.should.equal(0);
        });
    });
});