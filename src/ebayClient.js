const axios = require('axios');

const FINDING_API_URL = 'https://svcs.ebay.com/services/search/FindingService/v1';
const FINDING_API_VERSION = '1.0.0';

function buildHeaders() {
  const appId = process.env.EBAY_APP_ID;
  if (!appId) throw Object.assign(new Error('EBAY_APP_ID is not configured'), { status: 500 });
  return {
    'X-EBAY-SOA-SERVICE-NAME': 'FindingService',
    'X-EBAY-SOA-SERVICE-VERSION': FINDING_API_VERSION,
    'X-EBAY-SOA-RESPONSE-DATA-FORMAT': 'JSON',
    'X-EBAY-SOA-REQUEST-DATA-FORMAT': 'JSON',
  };
}

async function findingRequest(operationName, params) {
  const response = await axios.get(FINDING_API_URL, {
    headers: buildHeaders(),
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
