import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Box, Button, Center, FormLabel, HStack, Heading, Input, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr, Select  } from '@chakra-ui/react'
import { InfoOutlineIcon } from '@chakra-ui/icons'

function Update() {
    
    // Hold current state of input form
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [resourceType, setResourceType] = useState('');
    const [specificResourceDesc, setSpecificResourceDesc] = useState('')
    const [contact, setContact] = useState('')
    const [newResourceType, setNewResourceType] = useState('')

    // Hold current state of tooltip
    const [updateTip, setUpdateTip] = useState(false)

   // Hold current state of the database
   const [data, setData] = useState([])
   const [resources, setResources] = useState([]);

    // Hold user data fetched from /user endpoint
    const [user, setUser] = useState([])

    // Hold form error messages to be displayed under each respective input field
    const [nameError, setNameError] = useState('');
    const [typeError, setTypeError] = useState('');
    const [resourceTypeError, setResourceTypeError] = useState('');
    const [contactError, setContactError] = useState('');
    const [specificResourceDescError, setSpecificResourceDescError] = useState('');
    const [newResourceTypeError, setNewResourceTypeError] = useState('');
    const [duplicateResourceError, setDuplicateResourceError] = useState('');

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


    // Pull selected user's ID from route
    const { id } = useParams();

    // Handles form submission
    const handleSubmit = async (event) => {
        // Prevents default window refresh
        event.preventDefault();

         // Form validation
         if (!name?.trim()) {
            setNameError('Name is required');
            return;
        } else {
            setNameError('');
        }

        if (!type?.trim()) {
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

        if (!contact?.trim()) {
            setContactError('Contact is required');
            return;
        } else {
            setContactError('');
        }

        if (!specificResourceDesc?.trim()) {
            setSpecificResourceDescError('Specific resource description is required');
            return;
        } else {
            setSpecificResourceDescError('');
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

        // Updates database if form is validated using current users ID with /update server endpoint
        axios.put('http://localhost:8081/update/'+id, { name, type, resourceType: finalResourceType, specificResourceDesc, contact })
        .then(res => {
            navigate('/');
        }).catch(err => console.log(err))
    }

    // Pulls current user when update page is loaded
    useEffect(() => {
        axios.get('http://localhost:8081/user/'+id)
        .then(res => {
                setUser(res.data)
                setName(res.data.name || '');
                setType(res.data.type || '');
                setResourceType(res.data.resource_id || '');
                setSpecificResourceDesc(res.data.specific_resource_desc || '');
                setContact(res.data.contact || '');
        })
        .catch(err => console.log(err));

        axios.get('http://localhost:8081/resources')
            .then(res => setResources(res.data))
            .catch(err => console.log(err));    
    }, []);

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
                isOpen={updateTip}
            >
                <InfoOutlineIcon
                mb='11px'
                onMouseEnter={() => setUpdateTip(true)}
                onMouseLeave={() => setUpdateTip(false)}
                onClick={() => setUpdateTip(!updateTip)}
                boxSize='16px'
                />
            </Tooltip>
        <Heading fontWeight='bold'>Update Partner</Heading>
        </HStack>
        {/* Current partner being edited table */}
        <TableContainer>
                <Table size='sm'>
                <Thead>
                        <Tr>
                            <Th color='black' fontSize='15px' fontWeight='normal'>ID  </Th>
                            <Th color='black' fontSize='15px' fontWeight='normal'>PARTNER NAME</Th>
                            <Th color='black' fontSize='15px' fontWeight='normal'>TYPE</Th>
                            <Th color='black' fontSize='15px' fontWeight='normal'>RESOURCE TYPE</Th>
                            <Th color='black' fontSize='15px' fontWeight='normal'>RESOURCE DESCRIPTION</Th>
                            <Th color='black'fontSize='15px' fontWeight='normal'>CONTACT</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>
                            {user.id}
                            </Td>
                            <Td>
                            {user.name}
                            </Td>
                            <Td>
                            {user.type}
                            </Td>
                            <Td>
                            {user.resource_type}
                            </Td>
                            <Td>
                            {user.specific_resource_desc}
                            </Td>
                            <Td>
                            {user.contact}
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>

            {/* Form Section */}
            <form onSubmit={handleSubmit}>
                <Box mb='5px'>
                    <FormLabel htmlFor=''>Name</FormLabel>
                    <Input type='text' placeholder='Enter Name' className='form-control' 
                    onChange={e => setName(e.target.value)} value={name}/>
                    <span className='text-danger'>{nameError}</span>
                </Box>
                <Box mb='5px'>
                    <FormLabel htmlFor=''>Type</FormLabel>
                    <Input type='text' placeholder='Enter Type' className='form-control' 
                     onChange={e => setType(e.target.value)} value={type}/>
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
                <FormLabel htmlFor=''>Specific Resource Description</FormLabel>
                        <Input type='text' placeholder='Enter Specific Resource Description' className='form-control'
                            onChange={e => setSpecificResourceDesc(e.target.value)} value={specificResourceDesc} />
                        <span className='text-danger'>{specificResourceDescError}</span>
                </Box>
                <Box mb='5px'>
                    <FormLabel htmlFor=''>Contact</FormLabel>
                    <Input type='text' placeholder='Enter Contact' className='form-control' 
                     onChange={e => setContact(e.target.value)} value={contact}/>
                     <span className='text-danger'>{contactError}</span>
                </Box>
                <HStack spacing='15px'>
                <Button bg='#3AED3A' color='black' borderRadius='3px' w='90px' h='40px' _hover onClick={handleSubmit}>Update</Button>
                <Button bg='white' color='black' borderColor='black' border='1px' borderRadius='3px' w='90px' h='40px' _hover onClick={() => navigate('/')}>Back</Button>
                </HStack>
            </form>
            </Box>
        </Center>
  )
}

export default Update