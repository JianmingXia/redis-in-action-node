const crypto = require('crypto');

function currentTimestamp(isMsec = false) {
  if (isMsec) {
    return Date.now();
  } else {
    return Math.floor(Date.now() / 1000);
  }
}

function currentHour() {
  return new Date().getHours();
}

function getHash(str) {
  const md5 = crypto.createHash('md5');
  md5.update(str);
  return md5.digest('hex');
}

function sleep(time = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

module.exports = {
  currentTimestamp,
  currentHour,
  getHash,
  sleep,
};
