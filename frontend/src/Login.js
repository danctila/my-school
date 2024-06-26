import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { VStack, Box, Input, Button, Text, Checkbox } from '@chakra-ui/react';

function Login() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Handle login request with /login server endpoint
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/login', { password });
            if (response.data.success) {
                sessionStorage.setItem('loggedIn', 'true'); 
                navigate('/');
            } else {
                setError('Invalid password');
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Invalid password');
            } else {
                setError('An error occurred');
            }
        }
    };

    return (
        <VStack bg='#EFEFF1' minW='1600px' h='100vh' justifyContent='center'>
            <Box p='15px' w='400px' bg='white' borderRadius='8px' border='2px' borderColor='#DEDDE2'>
                <Text fontSize='24px' fontWeight='bold' mb='15px'>Login</Text>
                <form onSubmit={handleLogin}>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Enter your password'
                        mb='10px'
                    />
                    <Checkbox isChecked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} mb='10px'>
                        Show Password
                    </Checkbox>
                    <Button type='submit' borderRadius='5px' w='100%' h='40px' color='white' bg='#7C3AED' _hover>Login</Button>
                </form>
                {error && (
                    <Box mt='20px'>
                        <Text fontSize='16px' color='red.500'>{error}</Text>
                    </Box>
                )}
            </Box>
        </VStack>
    );
}

export default Login;
