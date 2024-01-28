import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate, Link as ReactRouterLink } from 'react-router-dom'

function Home() {
    const Navigate = useNavigate()
    const [data, setData] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [nameAZFilter, setnameAZFilter] = useState(false)
    const [nameZAFilter, setnameZAFilter] = useState(false)
    const [IDIncFilter, setIDIncFilter] = useState(false)
    const [IDDecFilter, setIDDecFilter] = useState(false)
    const [filter, setFilter] = useState(true)

    const handleDelete = (id) => {
        axios.delete('http://localhost:8081/delete/'+id)
        .then(res => Navigate('/'))
        .catch(err => console.log(err))
        window.location.reload()
    
    }

    useEffect(()=> {
        axios.get('http://localhost:8081/')
        .then(res => setData(res.data))
        .catch(err => console.log(err))
    }, [])

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

    return (
        <VStack bg='#EFEFF1' minW='1600px'>
           <HStack>
            <Text mt='60px' mb='130px' fontSize='32px' fontWeight='bold' color='#7C3AED'>MySchool{" "}</Text>
            <Text mt='60px' mb='130px' fontSize='32px'>Career & Technical Partner Program</Text>
        </HStack>
            <HStack justifyContent='space-between' py='10px' w='1500px'> { /* search and filter */ }
                <HStack>
                    <Text my='0px' fontWeight='bold' fontSize='24px'>SEARCH:</Text>
                    <Input borderRadius='5px' bg='white' w='300px' type='text' placeholder='Search here...' onChange={e => {setSearchTerm(e.target.value)}}></Input>
                </HStack>
                <HStack>
                    <Text my='0px'fontWeight='bold' fontSize='24px'>FILTER:</Text>
                    <Button borderRadius='5px' value='0' bg={filter ? '#3AED3A': 'white'} _hover onClick={handleCheckbox.bind(this)}>NONE</Button>{/*no filter = filter 0*/}
                    <Button borderRadius='5px' value='1' bg={nameAZFilter ? '#3AED3A': 'white'} _hover checked={nameAZFilter} onClick={handleCheckbox.bind(this)}>NAME A-Z</Button>{/*Name A-Z = filter 1*/}
                    <Button borderRadius='5px'value='2' bg={nameZAFilter ? '#3AED3A': 'white'} _hover checked={nameZAFilter} onClick={handleCheckbox.bind(this)}>NAME Z-A</Button>{/*Name Z-A = filter 2*/}
                    <Button borderRadius='5px' value='3' bg={IDIncFilter ? '#3AED3A': 'white'} _hover checked={IDIncFilter} onClick={handleCheckbox.bind(this)}>ID INC</Button>{/*ID INC = filter 3*/}
                    <Button borderRadius='5px'value='4' bg={IDDecFilter ? '#3AED3A': 'white'} _hover checked={IDDecFilter} onClick={handleCheckbox.bind(this)}>ID DEC</Button>{/*ID DEC = filter 4*/}
                </HStack>
            </HStack>
        </VStack>
      )
    }
    
    export default Home