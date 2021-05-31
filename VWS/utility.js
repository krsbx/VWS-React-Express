const utility = () => {
  const crypto = require('crypto');

  const timestamp = () => {
    const now = new Date();

    return now.toUTCString();
  }

  const hashMD5 = (body) => {
    const md5Hex = crypto.createHash('md5').update(body).digest('hex');
  
    return md5Hex;
  }
  
  const hashHMAC = (key, sign) => {
    const HmacSHA1 = crypto.createHmac('sha1', key).update(sign).digest('base64');
  
    return HmacSHA1;
  }

  const createStringToSign = (request) => {
    const sign = request.method + '\n' +
    hashMD5(request.body) + '\n' +
    request.type + '\n' +
    request.timestamp + '\n' +
    request.path;

    return sign;
  }

  const createSignature = (request) => {
    const stringToSign = createStringToSign(request);
    const signature = hashHMAC(request.secretKey, stringToSign);

    return signature;
  }

  const createAuthorization = (request) => {
    const signature = createSignature(request);

    const authorization = 'VWS ' + request.accessKey + ':' + signature;

    return authorization;
  }

  const decodeKey = (VWSKey) => {
    const buffer = new Buffer.from(VWSKey, 'base64');

    return buffer.toString('utf8');
  }

  return {
    'timestamp' : timestamp,
    'hashHMAC' : hashHMAC,
    'hashMD5' : hashMD5,
    'createAuthorization' : createAuthorization,
    'decodeKey' : decodeKey,
  }
}

module.exports = utility;