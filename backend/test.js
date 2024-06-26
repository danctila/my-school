const axios = require('axios');

// Set the base URL for your API
const baseURL = 'http://localhost:8081';

// Function to handle API requests and log detailed errors
const apiRequest = async (method, url, data = null) => {
    try {
        const response = await axios({ method, url, data });
        return response.data;
    } catch (error) {
        console.error(`Error with ${method.toUpperCase()} request to ${url}:`);
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data: ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            console.error(`No response received: ${error.request}`);
        } else {
            console.error(`Error message: ${error.message}`);
        }
    }
};

// Test login
const testLogin = async () => {
    const data = await apiRequest('post', `${baseURL}/login`, { password: 'your_password' });
    console.log('Login Test:', data);
};

// Test creating a connection
const testCreate = async () => {
    const data = await apiRequest('post', `${baseURL}/create`, { name: 'Test Partner', type: 'Test Type', resource_id: 1, specific_resource_desc: 'Test Description', contact: 'test@example.com' });
    console.log('Create Test:', data);
};

// Test getting all connections
const testGetConnections = async () => {
    const data = await apiRequest('get', `${baseURL}/connections`);
    console.log('Get Connections Test:', data);
};

// Test getting all resources
const testGetResources = async () => {
    const data = await apiRequest('get', `${baseURL}/resources`);
    console.log('Get Resources Test:', data);
};

// Test getting a user by ID
const testGetUserByID = async () => {
    const data = await apiRequest('get', `${baseURL}/user/1`);
    console.log('Get User By ID Test (1):', data);
};

// Test updating a connection
const testUpdate = async () => {
    const data = await apiRequest('put', `${baseURL}/update/1`, { name: 'Updated Partner', type: 'Updated Type', resource_id: 2, specific_resource_desc: 'Updated Description', contact: 'updated@example.com' });
    console.log('Update Test (1):', data);
};

// Test deleting a connection
const testDelete = async () => {
    const data = await apiRequest('delete', `${baseURL}/delete/1`);
    console.log('Delete Test (1):', data);
};

// Test asking a question
const testAsk = async () => {
    const data = await apiRequest('post', `${baseURL}/ask`, { question: 'What is the purpose of the program?' });
    console.log('Ask Test:', data);
};

// Run all tests
const runTests = async () => {
    await testLogin();
    await testCreate();
    await testGetConnections();
    await testGetResources();
    await testGetUserByID();
    await testUpdate();
    await testDelete();
    await testAsk();
};

runTests();
