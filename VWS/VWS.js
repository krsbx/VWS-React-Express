const VWS = () => {
  const client = require('./client');
  const util = require('./utility');

  return {
    'client': client,
    'util' : util
  };
}

module.exports = VWS();