const express = require("express");
const cors = require('cors');
const VWS = require('./VWS/VWS');

const PORT = process.env.PORT || 3001;

let serverAccessKey = '';
let serverSecretKey = '';

const util = VWS.util();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const CheckKey = (VWSKey) => {
  //If Key Already Exist
  //  Break process
  if( serverAccessKey && serverSecretKey) {
    return;
  }

  const decode = util.decodeKey(VWSKey);

  const result = JSON.parse(decode);

  serverAccessKey = result.serverAccessKey;
  serverSecretKey = result.serverSecretKey;
};

app.post('/api/', (request, response) => {
  const body = request.body;

  if ( body['VWSKey'] ) {
    CheckKey(body['VWSKey']);
  } else {
    const error = {
      result_code: 'Unauthorized',
      transaction_id: 'None',
    };

    response.status(401).send(error);
  }

  CheckKey(body['VWSKey']);

  delete body['VWSKey'];

  const client = VWS.client({
    'serverAccessKey': serverAccessKey,
    'serverSecretKey': serverSecretKey,
  });

  client.addTarget(body, (error, result) => {
    if (error) {
        if(result.result_code == 'Fail') {
          response.status(500).send(result);
        }

        response.status(400).send(result);
    } else {
      if(result.result_code == 'TargetCreated') {
        response.status(201).send(result);
      }
    }
  });
});

app.put('/api/:targetId', (request, response) => {
  const targetId = request.params['targetId'];
  const body = request.body;

  if ( body['VWSKey'] ) {
    CheckKey(body['VWSKey']);
  } else {
    const error = {
      result_code: 'Unauthorized',
      transaction_id: 'None',
    };

    response.status(401).send(error);
  }

  CheckKey(body['VWSKey']);

  delete body['VWSKey'];

  const client = VWS.client({
    'serverAccessKey': serverAccessKey,
    'serverSecretKey': serverSecretKey,
  });

  client.updateTarget(targetId, body, (error, result) => {
    if (error) {
      if (result.result_code == 'Fail') {
        response.status(500).send(result);
      }

      response.status(400).send(result);
    } else {
      if (result.result_code == 'Success') {
        response.status(200).send(result);
      }
    }
  });
});

app.delete('/api/:targetId', (request, response) => {
  const targetId = request.params['targetId'];
  const body = request.body;

  if ( body['VWSKey'] ) {
    CheckKey(body['VWSKey']);
  } else {
    const error = {
      result_code: 'Unauthorized',
      transaction_id: 'None',
    };

    response.status(401).send(error);
  }


  const client = VWS.client({
    'serverAccessKey': serverAccessKey,
    'serverSecretKey': serverSecretKey,
  });

  client.deleteTarget(targetId, (error, result) => {
    if (error) {
      if (result.result_code == 'Fail') {
        response.status(500).send(result);
      }

      response.status(400).send(result);
    } else {
      if (result.result_code == 'Success') {
        response.status(200).send(result);
      }
    }
  });
});