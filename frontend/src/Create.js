import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Box, Button, Center, FormLabel, HStack, Heading, Input, Tooltip } from '@chakra-ui/react'
import { InfoOutlineIcon } from '@chakra-ui/icons'

function Create() {

    {/* Hold current state of input form */}
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [resources, setResources] = useState('')
    const [contact, setContact] = useState('')

     {/* Hold current state of tooltip */}
    const [createTip, setCreateTip] = useState(false)

    {/* Holds form error messages to be displayed under each respective input field */}
    const [nameError, setNameError] = useState('');
    const [typeError, setTypeError] = useState('');
    const [resourcesError, setResourcesError] = useState('');
    const [contactError, setContactError] = useState('');
    const [duplicateError, setDuplicateError] = useState('')

    {/*Holds current state of the database*/}
    const [data, setData] = useState([])
    
    {/* Used for route navigation */}
    const navigate = useNavigate()

    useEffect(()=> {
        axios.get('http://localhost:8081/')
        .then(res => setData(res.data))
        .catch(err => console.log(err))
    }, [])


    {/* Handles form submission */}
    const handleSubmit = (event) => {
        // Prevents default window refresh
        event.preventDefault();

         // Form validation
         if (!name.trim()) {
            setNameError('Name is required');
            return;
        } else {
            setNameError('');
        }

        if (!type.trim()) {
            setTypeError('Type is required');
            return;
        } else {
            setTypeError('');
        }

        if (!resources.trim()) {
            setResourcesError('Resources is required');
            return;
        } else {
            setResourcesError('');
        }

        if (!contact.trim()) {
            setContactError('Contact is required');
            return;
        } else {
            setContactError('');
        }

        // Validates partner name input for duplicates
        for(const element of data){
            if(element.name === name){
                setDuplicateError('Duplicate partner name')
                return
            } else {
                setDuplicateError('')
            }
        }

        // Adds to database if form is validated using current users ID with /create server endpoint
        axios.post('http://localhost:8081/create', {name, type, resources, contact})
        .then(res => {
            navigate('/');
        }).catch(err => console.log(err))
    }

  return (
    <Center display='flex' h='100vh' bg='#3A77ED' justifyContent='center' alignItems='center'>
        <Box w='50%' bg='white' borderRadius='8px' border='2px' borderColor='#DEDDE2' p='15px'>
            <HStack>
            <Tooltip
                
                bg="#7C3AED"
                color="white"
                hasArrow
                label='All data entry fields are required. Enter "n/a" to submit without a value'
                placement="top-start"
                isOpen={createTip}
            >
                <InfoOutlineIcon
                mb='11px'
                onMouseEnter={() => setCreateTip(true)}
                onMouseLeave={() => setCreateTip(false)}
                onClick={() => setCreateTip(!createTip)}
                boxSize='16px'
                />
            </Tooltip>
                <Heading fontWeight='bold'>Create Partner</Heading>
            </HStack>
            {/* Form Section */}
            <form onSubmit={handleSubmit}>
                    <Box mb='5px'>
                        <FormLabel htmlFor=''>Parter Name</FormLabel>
                        <Input type='text' placeholder='Enter Name' className='form-control' 
                        onChange={e => setName(e.target.value)}/>
                        <span className='text-danger'>{nameError}</span>
                        <span className='text-danger'>{duplicateError}</span>
                    </Box>
                    <Box mb='5px'>
                        <FormLabel htmlFor=''>Type</FormLabel>
                        <Input type='text' placeholder='Enter Type' className='form-control' 
                            onChange={e => setType(e.target.value)}/>
                        <span className='text-danger'>{typeError}</span>
                    </Box>
                    <Box mb='5px'>
                        <FormLabel htmlFor=''>Resources</FormLabel>
                        <Input type='text' placeholder='Enter Resources' className='form-control' 
                            onChange={e => setResources(e.target.value)}/>
                        <span className='text-danger'>{resourcesError}</span>
                    </Box>
                    <Box mb='5px'>
                        <FormLabel htmlFor=''>Contact</FormLabel>
                        <Input type='text' placeholder='Enter Contact' className='form-control' 
                            onChange={e => setContact(e.target.value)}/>
                        <span className='text-danger'>{contactError}</span>
                    </Box>
                    <HStack spacing='15px'>
                        <Button bg='#3AED3A' color='black' borderRadius='3px' w='90px' h='40px' _hover onClick={handleSubmit}>Create</Button>
                        <Button bg='white' color='black' borderColor='black' border='1px' borderRadius='3px' w='90px' h='40px' _hover onClick={() => navigate('/')}>Back</Button>
                    </HStack>
            </form>
        </Box>
    </Center>
  )
}

export default Create