const https = require('https');

const postData = JSON.stringify({
  "keyword": "technology"
});

const options = {
  hostname: 'apply07.grants.gov',
  path: '/grantsws/rest/opportunities/search/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      console.log("RESPONSE:", data.substring(0, 1000)); // Log first 1000 chars
    } catch(e) {
      console.log(data);
    }
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(postData);
req.end();
