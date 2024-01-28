import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'
import { ChakraBaseProvider } from '@chakra-ui/react'
import theme from './Theme'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraBaseProvider theme={theme}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ChakraBaseProvider>
);
