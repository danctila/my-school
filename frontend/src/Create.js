import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Box, Button, Center, FormLabel, HStack, Heading, Input, Tooltip, Select } from '@chakra-ui/react'
import { InfoOutlineIcon } from '@chakra-ui/icons'

function Create() {

    // Hold current state of input form
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [resourceType, setResourceType] = useState('');
    const [specificResourceDesc, setSpecificResourceDesc] = useState('');
    const [contact, setContact] = useState('')
    const [newResourceType, setNewResourceType] = useState('')

    // Hold current state of tooltip
    const [createTip, setCreateTip] = useState(false)

    // Holds form error messages to be displayed under each respective input field
    const [nameError, setNameError] = useState('');
    const [typeError, setTypeError] = useState('');
    const [resourceTypeError, setResourceTypeError] = useState('');
    const [specificResourceDescError, setSpecificResourceDescError] = useState('');
    const [contactError, setContactError] = useState('');
    const [newResourceTypeError, setNewResourceTypeError] = useState('');
    const [duplicateNameError, setDuplicateNameError] = useState('');
    const [duplicateResourceError, setDuplicateResourceError] = useState('');

    // Hold current state of the database
    const [data, setData] = useState([])
    const [resources, setResources] = useState([]);
    
    // Route navigation
    const navigate = useNavigate()

    useEffect(() => {
        axios.get('http://localhost:8081/connections')
            .then(res => setData(res.data))
            .catch(err => console.log(err));
        
        axios.get('http://localhost:8081/resources')
            .then(res => setResources(res.data))
            .catch(err => console.log(err));
    }, []);


    // Handle form submission
    const handleSubmit = async (event) => {
        // Prevent default window refresh
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

        if (resourceType === 'new' && !newResourceType.trim()) {
            setNewResourceTypeError('New resource type is required');
            return;
        } else {
            setNewResourceTypeError('');
        }

        if (!resourceType?.trim() && resourceType !== 'new') {
            setResourceTypeError('Resource type is required');
            return;
        } else {
            setResourceTypeError('');
        }

        if (!specificResourceDesc.trim()) {
            setSpecificResourceDescError('Specific resource description is required');
            return;
        } else {
            setSpecificResourceDescError('');
        }

        if (!contact.trim()) {
            setContactError('Contact is required');
            return;
        } else {
            setContactError('');
        }

        // Validates partner name input for duplicates
        for (const element of data) {
            if (element.name === name) {
                setDuplicateNameError('Duplicate partner name');
                return;
            } else {
                setDuplicateNameError('');
            }
        }

        let finalResourceType = resourceType;

        if (resourceType === 'new') {
            // Check for duplicate resource type
            const existingResource = resources.find(resource => resource.resource_type.toLowerCase() === newResourceType.toLowerCase());
            if (existingResource) {
                setDuplicateResourceError('Resource type already exists');
                return;
            } else {
                setDuplicateResourceError('');
            }

            // Add the new resource type to the database
            try {
                const res = await axios.post('http://localhost:8081/resources', { resourceType: newResourceType });
                finalResourceType = res.data.resource_id; // Assuming the response includes the new resource_id
            } catch (error) {
                console.error(error);
                return;
            }
        }
        
        // Adds to database if form is validated using current users ID with /create server endpoint
        axios.post('http://localhost:8081/create', { name, type, resourceType: finalResourceType, specificResourceDesc, contact })
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
                        <span className='text-danger'>{duplicateNameError}</span>
                    </Box>
                    <Box mb='5px'>
                        <FormLabel htmlFor=''>Type</FormLabel>
                        <Input type='text' placeholder='Enter Type' className='form-control' 
                            onChange={e => setType(e.target.value)}/>
                        <span className='text-danger'>{typeError}</span>
                    </Box>
                    <Box mb='5px'>
                    <FormLabel htmlFor=''>Resource Type</FormLabel>
                    <Select placeholder='Select Resource Type' className='form-control' 
                            value={resourceType} onChange={e => setResourceType(e.target.value)}>
                            <option value="new">New</option>
                            {resources.map(resource => (
                                <option key={resource.resource_id} value={resource.resource_id}>
                                    {resource.resource_type}
                                </option>
                            ))}
                        </Select>
                        <span className='text-danger'>{resourceTypeError}</span>
                    </Box>
                    {resourceType === 'new' && (
                        <Box mb='5px'>
                            <FormLabel htmlFor=''>New Resource Type</FormLabel>
                            <Input type='text' placeholder='Enter New Resource Type' className='form-control'
                                onChange={e => setNewResourceType(e.target.value)} value={newResourceType} />
                            <span className='text-danger'>{newResourceTypeError}</span>
                            <span className='text-danger'>{duplicateResourceError}</span>
                        </Box>
                    )}
                    <Box mb='5px'>
                        <FormLabel htmlFor=''>Resource Description</FormLabel>
                        <Input type='text' placeholder='Enter Resource Description' className='form-control'
                            onChange={e => setSpecificResourceDesc(e.target.value)} value={specificResourceDesc} />
                        <span className='text-danger'>{specificResourceDescError}</span>
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