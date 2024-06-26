import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Center, FormLabel, HStack, Heading, Input, Select, Tooltip } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

function UpdateResources() {
    const [resources, setResources] = useState([]);
    const [resourceTypeToDelete, setResourceTypeToDelete] = useState('');
    const [newResourceType, setNewResourceType] = useState('');
    const [newOrExisting, setNewOrExisting] = useState('existing');
    const [selectedResource, setSelectedResource] = useState('');
    const [resourceTypeError, setResourceTypeError] = useState('');
    const [newResourceTypeError, setNewResourceTypeError] = useState('');
    const [duplicateError, setDuplicateError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8081/resources')
            .then(res => setResources(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleDelete = async (event) => {
        event.preventDefault();

        if (newOrExisting === 'new' && !newResourceType.trim()) {
            setNewResourceTypeError('New resource type is required');
            return;
        } else {
            setNewResourceTypeError('');
        }

        if (newOrExisting === 'existing' && !selectedResource.trim()) {
            setResourceTypeError('Existing resource type is required');
            return;
        } else {
            setResourceTypeError('');
        }

        if (newOrExisting === 'new') {
            const existingResource = resources.find(resource => resource.resource_type.toLowerCase() === newResourceType.toLowerCase());
            if (existingResource) {
                setDuplicateError('Resource type already exists');
                return;
            } else {
                setDuplicateError('');
            }
        }

        const replacementType = newOrExisting === 'new' ? newResourceType : selectedResource;
        const isNewResource = newOrExisting === 'new';

        try {
            await axios.delete(`http://localhost:8081/resources/${resourceTypeToDelete}`, {
                data: {
                    newResourceType: replacementType,
                    isNewResource
                }
            });
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Center display='flex' h='100vh' bg='#3A77ED' justifyContent='center' alignItems='center'>
            <Box w='50%' bg='white' borderRadius='8px' border='2px' borderColor='#DEDDE2' p='15px'>
                <HStack>
                    <Tooltip
                        bg="#7C3AED"
                        color="white"
                        hasArrow
                        label='Select a resource type to delete and provide a replacement'
                        placement="top-start"
                    >
                        <InfoOutlineIcon mb='11px' boxSize='16px' />
                    </Tooltip>
                    <Heading fontWeight='bold'>Update Resources</Heading>
                </HStack>
                <form onSubmit={handleDelete}>
                    <Box mb='5px'>
                        <FormLabel htmlFor='resourceTypeToDelete'>Resource Type to Delete</FormLabel>
                        <Select placeholder='Select Resource Type to Delete' onChange={e => setResourceTypeToDelete(e.target.value)}>
                            {resources.map(resource => (
                                <option key={resource.resource_id} value={resource.resource_id}>
                                    {resource.resource_type}
                                </option>
                            ))}
                        </Select>
                    </Box>
                    <Box mb='5px'>
                        <FormLabel htmlFor='newOrExisting'>Replacement Type</FormLabel>
                        <Select value={newOrExisting} onChange={e => setNewOrExisting(e.target.value)}>
                            <option value="existing">Existing</option>
                            <option value="new">New</option>
                        </Select>
                    </Box>
                    {newOrExisting === 'new' ? (
                        <Box mb='5px'>
                            <FormLabel htmlFor='newResourceType'>New Resource Type</FormLabel>
                            <Input type='text' placeholder='Enter New Resource Type' onChange={e => setNewResourceType(e.target.value)} />
                            <span className='text-danger'>{newResourceTypeError}</span>
                            <span className='text-danger'>{duplicateError}</span>
                        </Box>
                    ) : (
                        <Box mb='5px'>
                            <FormLabel htmlFor='selectedResource'>Existing Resource Type</FormLabel>
                            <Select placeholder='Select Replacement Resource Type' onChange={e => setSelectedResource(e.target.value)}>
                                {resources.map(resource => (
                                    <option key={resource.resource_id} value={resource.resource_type}>
                                        {resource.resource_type}
                                    </option>
                                ))}
                            </Select>
                            <span className='text-danger'>{resourceTypeError}</span>
                        </Box>
                    )}
                    <HStack spacing='15px'>
                        <Button bg='#3AED3A' color='black' borderRadius='3px' w='90px' h='40px' _hover onClick={handleDelete}>Replace</Button>
                        <Button bg='white' color='black' borderColor='black' border='1px' borderRadius='3px' w='90px' h='40px' _hover onClick={() => navigate('/')}>Back</Button>
                    </HStack>
                </form>
            </Box>
        </Center>
    );
}

export default UpdateResources;
