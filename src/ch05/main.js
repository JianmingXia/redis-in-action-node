const { currentTimestamp, currentHour } = require('../utils');

const LOG_SEVERITY = {
  DEBUG: 'debug',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
};

// 5-1
// if you are using transaction, pipe is a redis client
async function logRecent(
  client,
  name,
  message,
  serverity = LOG_SEVERITY.INFO,
  pipe = false,
) {
  try {
    const destination = `recent:${name}:${serverity}`;
    const msg = `${Date()} ${message}`;

    pipe = pipe || client.pipeline();

    pipe.lpush(destination, msg);
    pipe.ltrim(destination, 0, 99);

    return await pipe.exec();
  } catch (err) {
    console.error(err);
    return false;
  }
}

// 5-2
async function logCommon(
  client,
  name,
  message,
  serverity = LOG_SEVERITY.INFO,
  timeout = 5,
) {
  try {
    const destination = `common:${name}:${serverity}`;
    const startKey = `${destination}:start`;

    const end = currentTimestamp() + timeout;
    while (currentTimestamp() < end) {
      client.watch(startKey);

      const hourStart = currentHour();

      const existing = await client.get(startKey);
      client.multi({
        pipeline: false,
      });

      if (existing && existing != hourStart) {
        client.rename(destination, `${destination}:last`);
        client.rename(startKey, `${destination}:pstart`);
        client.set(startKey, hourStart);
      } else {
        client.set(startKey, hourStart);
      }

      client.zincrby(destination, 1, message);
      const res = await logRecent(client, name, message, serverity, client);
      if (res) {
        return;
      } else {
        continue;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  logRecent,
  logCommon,
  LOG_SEVERITY,
};
