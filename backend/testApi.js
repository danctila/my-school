const axios = require('axios');

const runTests = async () => {
  const baseURL = 'http://localhost:8081';

  const endpoints = [
    { method: 'POST', url: '/login', data: { password: process.env.ADMIN_PASSWORD }, test: 'Login Test' },
    { method: 'POST', url: '/create', data: { name: 'Test Partner', type: 'Test Type', resource_id: 1, contact: 'test@example.com', specific_resource_desc: 'Test description' }, test: 'Create Test' },
    { method: 'GET', url: '/connections', test: 'Get Connections Test' },
    { method: 'GET', url: '/resources', test: 'Get Resources Test' },
    { method: 'GET', url: '/user/1', test: 'Get User By ID Test (1)' },
    { method: 'PUT', url: '/update/1', data: { name: 'Updated Test Partner', type: 'Updated Test Type', resource_id: 2, contact: 'updated@example.com', specific_resource_desc: 'Updated description' }, test: 'Update Test (1)' },
    { method: 'DELETE', url: '/delete/1', test: 'Delete Test (1)' },
    { method: 'POST', url: '/ask', data: { question: 'What is the purpose of the program?' }, test: 'Ask Test' }
  ];

  for (let endpoint of endpoints) {
    try {
      let response;
      if (endpoint.method === 'GET' || endpoint.method === 'DELETE') {
        response = await axios({ method: endpoint.method, url: `${baseURL}${endpoint.url}` });
      } else {
        response = await axios({ method: endpoint.method, url: `${baseURL}${endpoint.url}`, data: endpoint.data });
      }
      console.log(`${endpoint.test}: Success`);
    } catch (error) {
      if (error.response) {
        console.error(`${endpoint.test}: Failed with status code ${error.response.status}`);
      } else if (error.request) {
        console.error(`${endpoint.test}: No response received`);
      } else {
        console.error(`${endpoint.test}: Error - ${error.message}`);
      }
    }
  }
};

runTests();
