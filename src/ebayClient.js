const axios = require('axios');

const FINDING_API_URL = 'https://svcs.ebay.com/services/search/FindingService/v1';
const FINDING_API_VERSION = '1.0.0';

async function findingRequest(operationName, params) {
  const response = await axios.get(FINDING_API_URL, {
    params: {
      'OPERATION-NAME': operationName,
      'SERVICE-VERSION': FINDING_API_VERSION,
      'SECURITY-APPNAME': process.env.EBAY_APP_ID,
      'RESPONSE-DATA-FORMAT': 'JSON',
      ...params,
    },
    timeout: 10000,
  });
  return response.data;
}

module.exports = { findingRequest };
