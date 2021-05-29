const host = 'vws.vuforia.com';

const client = (options) => {
  const https = require('https');
  const util = require(__dirname + '/utility')();

  const HttpsRequest = (httpsOptions, body, callback) => {
    const request = https.request(httpsOptions, response => {
      let data = '';

      response.setEncoding('utf-8');

      response.on('data', (chunks) => {
        data += chunks;
      });

      response.on('end', () => {
        try {
          const result = JSON.parse(data);

          if (response.statusCode === 200 || response.statusCode === 201) {
            callback(null, result);
          } else {
            const error = new Error(result.result_code);
            callback(error, result);
          }
        } catch (error) {
          callback(error, {});
        }
      });

      response.on('error', (error) => {
        callback(error);
      });
    });

    request.write(body);
    request.end();
  }

  const VWSRequest = (request, callback) => {
    request.accessKey = options.serverAccessKey;
    request.secretKey = options.serverSecretKey;
    request.timestamp = util.timestamp();

    const httpsOptions = {
      hostname: host,
      path: request.path,
      method: request.method,
      headers: {

          'Content-Length': Buffer.byteLength(request.body),
          'Content-Type': request.contentTypeHeader || request.type,
          'Authorization': util.createAuthorization(request),
          'Date': request.timestamp
      }
    }

    HttpsRequest(httpsOptions, request.body, callback);
  }

  const addTarget = (target, callback) => {
    const request = {
      'path': '/targets',
      'method': 'POST',
      'type': 'application/json',
      'body': JSON.stringify(target),
    }

    VWSRequest(request, callback);
  }

  const updateTarget = (targetId, target, callback) => {
    const request = {
      'path': '/targets/' + targetId,
      'method': 'PUT',
      'type': 'application/json',
      'body': JSON.stringify(target),
    }

    VWSRequest(request, callback);
  }

  const deleteTarget = (targetId, target, callback) => {
    const request = {
      'path': '/targets/' + targetId,
      'method': 'DELETE',
      'type': 'application/json',
      'body': '',
    }

    VWSRequest(request, callback);
  }

  return {
    'addTarget': addTarget,
    'updateTarget' : updateTarget,
    'deleteTarget' : deleteTarget,
  };
}

module.exports = client;