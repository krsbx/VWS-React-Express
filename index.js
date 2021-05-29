const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const VWS = require('./VWS/VWS');

const PORT = process.env.PORT || 3001;

const client = VWS.client({
  'serverAccessKey': 'yourServerKey',
  'serverSecretKey': 'yourSecretKey',
});

const app = express();

app.use(cors());
app.use(bodyParser({ limit: '50mb' }))
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.post('/api/', (request, response) => {
  const body = request.body;

  client.addTarget(body, (error, result) => {
    if (error) {
        if(result.result_code == 'Fail') {
          response.status(500).send(error);
        }

        response.status(400).send(error);
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

  client.updateTarget(targetId, body, (error, result) => {
    if (error) {
      if (result.result_code == 'Fail') {
        response.status(500).send(error);
      }
      response.status(400).send(error);
    } else {
      if (result.result_code == 'Success') {
        response.status(200).send(result);
      }
    }
  });
});

app.delete('/api/:targetId', (request, response) => {
  const targetId = request.params['targetId'];

  client.deleteTarget(targetId, (error, result) => {
    if (error) {
      if (result.result_code == 'Fail') {
        response.status(500).send(error);
      }
      response.status(400).send(error);
    } else {
      if (result.result_code == 'Success') {
        response.status(200).send(result);
      }
    }
  });
});