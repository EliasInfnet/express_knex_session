import { Button, Center, Container, Group, Stack, Title } from '@mantine/core'
import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { api } from '../api/api'
import { useNavigate } from 'react-router-dom'

function DashboardPage() {

  const { user } = useContext(AppContext)

  const navigate = useNavigate()

  const checkLoggedUser = async () => {
    try {
      const res = await api.get('checkLoggedUser')
      console.log(res.data)
    } catch (error) {
      console.log(error.message)
    }
  }

  const logout = async () => {
    try {
      const res = await api.get('logout')
      navigate('/')
      console.log(res.data)
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <Container h={'100vh'}>
      <Center h={'100vh'} >
        <Stack>
          <Title mx={'auto'}>{user?.username}</Title>
          <Group>
            <Button variant='light' onClick={checkLoggedUser}>Check logged user</Button>
            <Button variant='default' onClick={logout}>Logout</Button>
          </Group>
        </Stack>
      </Center>
    </Container>
  )
}

export default DashboardPage