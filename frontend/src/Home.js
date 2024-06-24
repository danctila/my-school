import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link as ReactRouterLink } from 'react-router-dom'
import { Box, Button, HStack, Text, VStack, Input, Divider, TableContainer, Table, Thead, Tr, Th, Tbody, Td, UnorderedList, ListItem, Tooltip, IconButton, Select, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { InfoOutlineIcon, ChevronDownIcon  } from "@chakra-ui/icons";
import { FaCommentDots } from 'react-icons/fa';

function Home() {
    const Navigate = useNavigate()
    const [data, setData] = useState([])
    const [resources, setResources] = useState([]);
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedResourceType, setSelectedResourceType] = useState('');
    const [nameAZFilter, setnameAZFilter] = useState(false)
    const [nameZAFilter, setnameZAFilter] = useState(false)
    const [IDIncFilter, setIDIncFilter] = useState(false)
    const [IDDecFilter, setIDDecFilter] = useState(false)
    const [filter, setFilter] = useState(true)
    const [searchTip, setSearchTip] = useState(false);
    const [filterTip, setFilterTip] = useState(false);
    const [actionTip, setActionTip] = useState(false);
    const [backupTip, setBackupTip] = useState(false);
    const [resultsTip, setResultsTip] = useState(false);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const aiSectionRef = useRef(null);
    const [isPulsing, setIsPulsing] = useState(false);

    useEffect(() => {
        // Check if logged in
        const loggedIn = sessionStorage.getItem('loggedIn');
        if (!loggedIn) {
            Navigate('/login');
        } else {
            axios.get('http://localhost:8081/connections')
                .then(res => setData(res.data.sort((a, b) => a.id - b.id)))
                .catch(err => console.log(err));
            axios.get('http://localhost:8081/resources')
                .then(res => setResources(res.data))
                .catch(err => console.log(err));
        }
    }, [Navigate]);

    const handleDelete = (id) => {
        axios.delete('http://localhost:8081/delete/'+id)
        .then(res => Navigate('/'))
        .catch(err => console.log(err))
        window.location.reload()
    }

    const handleCheckbox = (checkbox) => {
        if(checkbox.target.value === '1'){
            setnameAZFilter(true)
            setnameZAFilter(false)
            setIDIncFilter(false)
            setIDDecFilter(false)
            setFilter(false)
            setData(data.sort((a, b) => a.name.localeCompare(b.name)))
        } else if(checkbox.target.value === '2') {
            setnameAZFilter(false)
            setnameZAFilter(true)
            setIDIncFilter(false)
            setIDDecFilter(false)
            setFilter(false)
            setData(data.sort((a, b) => a.name.localeCompare(b.name)).reverse())
        }
        else if(checkbox.target.value === '3') {
            setnameAZFilter(false)
            setnameZAFilter(false)
            setIDIncFilter(true)
            setIDDecFilter(false)
            setFilter(false)
            setData(data.sort((a, b) => a.id - b.id))
        }
        else if(checkbox.target.value === '4') {
            setnameAZFilter(false)
            setnameZAFilter(false)
            setIDIncFilter(false)
            setIDDecFilter(true)
            setFilter(false)
            setData(data.sort((a, b) => b.id - a.id))
        } else {
            setnameAZFilter(false)
            setnameZAFilter(false)
            setIDIncFilter(false)
            setIDDecFilter(false)
            setFilter(true)
            setData(data.sort((a, b) => a.id - b.id))
        }
     }

     const downloadBackup = () => {
        let stringData = data.map(item => `${item.name}, ${item.type}, ${item.ResourceType}, ${item.ResourceDesc}, ${item.contact}`);
        let csvContent = stringData.join('\n\n')
        let element = document.createElement('a')
        let file = new Blob([csvContent], {type: 'text/plain'})
        element.href = URL.createObjectURL(file)
        element.download = 'backup.txt'
        element.click()
     }

     const handleQuestionSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/ask', { question })
            .then(res => setAnswer(res.data.answer))
            .catch(err => console.error(err));
    };

    const scrollToAISection = () => {
        if (aiSectionRef.current) {
            aiSectionRef.current.scrollIntoView({ behavior: 'smooth' });
            setIsPulsing(true);
            setTimeout(() => setIsPulsing(false), 3000);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('loggedIn');
        Navigate('/login');
    };

    const handleResourceTypeChange = (resourceType) => {
        setSelectedResourceType(resourceType);
        if (resourceType === '') {
            axios.get('http://localhost:8081/connections')
                .then(res => setData(res.data.sort((a, b) => a.id - b.id)))
                .catch(err => console.log(err));
        } else {
            axios.get(`http://localhost:8081/connections?resourceType=${resourceType}`)
                .then(res => setData(res.data.filter(item => item.ResourceType === resourceType).sort((a, b) => a.id - b.id)))
                .catch(err => console.log(err));
        }
    };

    return (
        <VStack bg='#EFEFF1' minW='1600px'>
            <HStack w='100%' m='0' pl='20px' pt='20px'>
                <Button onClick={handleLogout} borderRadius='5px' w='120px' h='40px' color='white' bg='#7C3AED' _hover>Logout</Button>
            </HStack>
            <HStack>
                <Text mt='60px' mb='130px' fontSize='32px' fontWeight='bold' color='#7C3AED'>MySchool{" "}</Text>
                <Text mt='60px' mb='130px' fontSize='32px'>Career & Technical Partner Program</Text>
            </HStack>
            <HStack justifyContent='space-between' py='10px' w='1500px'> { /* search and filter */ }
                <HStack>
                <Tooltip
                bg="#7C3AED"
                color="white"
                hasArrow
                label="Search ID number, name, type, resources, and contact"
                placement="top-start"
                isOpen={searchTip}
              >
                <InfoOutlineIcon
                  onMouseEnter={() => setSearchTip(true)}
                  onMouseLeave={() => setSearchTip(false)}
                  onClick={() => setSearchTip(!searchTip)}
                />
              </Tooltip>
                    <Text my='0px' fontWeight='bold' fontSize='24px'>SEARCH:</Text>
                    <Input borderRadius='5px' bg='white' w='300px' type='text' placeholder='Search here...' onChange={e => {setSearchTerm(e.target.value)}}></Input>
                </HStack>
                <HStack>
                <Tooltip
                bg="#7C3AED"
                color="white"
                hasArrow
                label="Only one filtering category can be used at once"
                placement="top-start"
                isOpen={filterTip}
              >
                <InfoOutlineIcon
                  onMouseEnter={() => setFilterTip(true)}
                  onMouseLeave={() => setFilterTip(false)}
                  onClick={() => setFilterTip(!filterTip)}
                />
              </Tooltip>
                    <Text my='0px'fontWeight='bold' fontSize='24px'>FILTER:</Text>
                    <Button borderRadius='5px' value='0' bg={filter ? '#3AED3A': 'white'} _hover onClick={handleCheckbox.bind(this)}>NONE</Button>{/*no filter = filter 0*/}
                    <Button borderRadius='5px' value='1' bg={nameAZFilter ? '#3AED3A': 'white'} _hover checked={nameAZFilter} onClick={handleCheckbox.bind(this)}>NAME A-Z</Button>{/*Name A-Z = filter 1*/}
                    <Button borderRadius='5px'value='2' bg={nameZAFilter ? '#3AED3A': 'white'} _hover checked={nameZAFilter} onClick={handleCheckbox.bind(this)}>NAME Z-A</Button>{/*Name Z-A = filter 2*/}
                    <Button borderRadius='5px' value='3' bg={IDIncFilter ? '#3AED3A': 'white'} _hover checked={IDIncFilter} onClick={handleCheckbox.bind(this)}>ID INC</Button>{/*ID INC = filter 3*/}
                    <Button borderRadius='5px'value='4' bg={IDDecFilter ? '#3AED3A': 'white'} _hover checked={IDDecFilter} onClick={handleCheckbox.bind(this)}>ID DEC</Button>{/*ID DEC = filter 4*/}
                </HStack>
            </HStack>
            <TableContainer w='1510px' bg='white' borderRadius='8px' border='2px' borderColor='#DEDDE2'>
                 <HStack pt='15px' px='35px' w='100%' justifyContent='space-between' >
                <HStack>
                <Tooltip
                bg="#7C3AED"
                color="white"
                hasArrow
                label='Only results that have been validated to include the current search terms will be displayed'
                placement="top-start"
                isOpen={resultsTip}
            >
                <InfoOutlineIcon
                mb='-2'
                onMouseEnter={() => setResultsTip(true)}
                onMouseLeave={() => setResultsTip(false)}
                onClick={() => setResultsTip(!resultsTip)}
                boxSize='16px'
                />
            </Tooltip>
                    <Text my='0px' h='30px' fontWeight='bold' fontSize='24px'>Results:</Text>
                </HStack>
                    <Button borderRadius='5px'  my='0px' w='80px' h='40px' as={ReactRouterLink} to='/create' bg='#3AED3A' _hover >Add+</Button>
                </HStack>
                <Divider borderColor='black' h='1px' w='1505px' orientation='horizontal'/>
                <Table size='sm'>
                    <Thead>
                        <Tr>
                            <Th color='black' fontSize='20px' fontWeight='normal' w='10%'>ID</Th>
                            <Th color='black' fontSize='20px' fontWeight='normal' w='20%'>PARTNER NAME</Th>
                            <Th color='black' fontSize='20px' fontWeight='normal' w='20%'>TYPE</Th>
                            <Th color='black' fontSize='20px' fontWeight='normal' w='20%'>
                                <Menu>
                                    <MenuButton as={Button} fontSize='20px' fontWeight='normal' py='0' px='3' rightIcon={<ChevronDownIcon  />}  bg='white'>
                                        {selectedResourceType || 'RESOURCES'}
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem onClick={() => handleResourceTypeChange('')}>All</MenuItem>
                                        {resources.map((resource) => (
                                            <MenuItem key={resource.ResourceId} onClick={() => handleResourceTypeChange(resource.ResourceType)}>
                                                {resource.ResourceType}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </Menu>
                            </Th>
                            <Th color='black' fontSize='20px' fontWeight='normal' w='20%'>CONTACT</Th>
                            <Th color='black' fontSize='20px' fontWeight='normal' w='10%'>
                                <Tooltip
                                    bg="#7C3AED"
                                    color="white"
                                    hasArrow
                                    label="Removing cannot be reversed and does not require a confirmation"
                                    placement="top-start"
                                    isOpen={actionTip}
                                >
                                    <InfoOutlineIcon
                                    onMouseEnter={() => setActionTip(true)}
                                    onMouseLeave={() => setActionTip(false)}
                                    onClick={() => setActionTip(!actionTip)}
                                    mb='1'
                                    boxSize='16px'
                                    />
                                </Tooltip> ACTION</Th>
                        </Tr>
                    </Thead>
                    <Tbody >
                    {data.filter((data) => {
                        if (searchTerm === '') {
                            return data
                        }
                        else if (String(data.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
                        data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        data.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        data.ResourceDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        data.contact.toLowerCase().includes(searchTerm.toLowerCase())) {
                                return data;
                        }
                    }).map((data, i) => (
                        <Tr color='black' key={i}>
                                <Td fontSize='14px' w='10%'>{data.id}</Td>
                                <Td fontSize='14px' w='20%'>{data.name}</Td>
                                <Td fontSize='14px' w='20%'>{data.type}</Td>
                                <Td fontSize='14px' w='20%'>{data.ResourceDesc}</Td>
                                <Td fontSize='14px' w='20%'>{data.contact}</Td>
                                <Td w='10%'> 
                                    <Button fontSize='14px' fontWeight='normal' mx='2px' color='white' borderRadius='3px' w='70px' h='30px' bg='#3A77ED' as={ReactRouterLink} to={`/update/${data.id}`} _hover>UPDATE</Button>
                                    <Button fontSize='14px' fontWeight='normal' mx='2px' color='white' borderRadius='3px' w='70px' h='30px' bg='#ED3A3A' onClick={() => handleDelete(data.id)} _hover>REMOVE</Button>
                                </Td>
                            </Tr>
                    ))}
                    </Tbody>
                </Table>
            </TableContainer>

            {/* Backup Section */}
            <HStack w='1500px' justifyContent='left' mt='60px'>
            <Tooltip
                bg="#7C3AED"
                color="white"
                hasArrow
                label='Downloads a .txt file named "Backup" containing the current state of the table'
                placement="top-start"
                isOpen={backupTip}
            >
                <InfoOutlineIcon
                mb='11px'
                onMouseEnter={() => setBackupTip(true)}
                onMouseLeave={() => setBackupTip(false)}
                onClick={() => setBackupTip(!backupTip)}
                boxSize='16px'
                />
            </Tooltip>
                <Text fontSize='24px' fontWeight='bold' mb='15px'>Backup</Text>
            </HStack>
            <Box p='15px' w='1500px' bg='white' borderRadius='8px' border='2px' borderColor='#DEDDE2'>
                <Text fontSize='20px' fontWeight='normal'>Download a current copy of all table values to a text file:</Text>
                <Button borderRadius='5px' onClick={downloadBackup} w='160px' h='40px' color='white' bg='#7C3AED' _hover>Download Backup</Button>
            </Box>

            {/* Help & Instructions Section */}
            <HStack w='1500px' justifyContent='left' mt='60px'>
                <Text fontSize='24px' fontWeight='bold' mb='15px'>Help & Instructions</Text>
            </HStack>
            <Box p='15px' w='1500px' bg='white' borderRadius='8px' border='2px' borderColor='#DEDDE2' mb='50px'>
                <Text fontSize='20px' fontWeight='normal' mb='0px'>ID Numbers:</Text>
                <UnorderedList>
                    <ListItem fontWeight='normal' fontSize='16px'>
                    ID numbers are added on a cumulative basis
                    </ListItem>
                    <ListItem fontWeight='normal' fontSize='16px'>
                    ID numbers of added entries are based on the running total of the table
                    </ListItem>
                    <ListItem fontWeight='normal' fontSize='16px'>
                    EX: There are 40 entries and 1 is deleted. If 1 entry is added. The new entry added has an ID number of 41.
                    </ListItem>
                </UnorderedList>
            </Box>
            
            {/* AI Help Section */}
            <HStack w='1500px' justifyContent='left' >
                <Text fontSize='24px' fontWeight='bold' mb='15px' color='#7C3AED'>MySchool AI Assistant</Text>
            </HStack>
            <Box p='15px' w='1500px' bg='white' borderRadius='8px' border='2px' borderColor='#DEDDE2' mb='150px' ref={aiSectionRef} style={{
                    transition: 'box-shadow 0.5s ease-in-out',
                    boxShadow: isPulsing ? '0 0 20px 5px rgba(124, 58, 237, 0.7)' : 'none',
                }}>
                <form onSubmit={handleQuestionSubmit}>
                    <Text fontSize='20px' fontWeight='normal' mb='0px'>Ask a question:</Text>
                    <Input
                        type='text'
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder='Type your question here...'
                        mb='10px'
                    />
                    <Button type='submit' borderRadius='5px' w='160px' h='40px' color='white' bg='#7C3AED' _hover>Submit</Button>
                </form>
                {answer && (
                    <Box mt='20px'>
                        <Text fontSize='20px' fontWeight='normal'>Answer:</Text>
                        <Text fontSize='16px'>{answer}</Text>
                    </Box>
                )}
            </Box>
              {/* Chat Bubble */}
              <Box position="fixed" bottom="20px" right="20px">
              <Tooltip label="Need Help?" placement="top-start" bg="#7C3AED" color="white" hasArrow>
                <IconButton
                    icon={<FaCommentDots />}
                    colorScheme="purple"
                    borderRadius="50%"
                    size="lg"
                    onClick={scrollToAISection}
                    aria-label="Chat with AI"
                >
                    MS AI
                </IconButton>
                </Tooltip>
            </Box>
        </VStack>
      )
    }
    
    export default Home