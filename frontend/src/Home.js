import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate, Link as ReactRouterLink } from 'react-router-dom'

function Home() {
    const Navigate = useNavigate()
    const [data, setData] = useState([])

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

    return (
        <VStack bg='#EFEFF1' minW='1600px'>
           
        </VStack>
      )
    }
    
    export default Home