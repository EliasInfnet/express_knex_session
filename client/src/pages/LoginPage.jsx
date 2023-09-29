import React from 'react'
import LoginForm from '../components/LoginForm'
import { Center, Container } from '@mantine/core'

function LoginPage() {

  return (
    <Container h={'100vh'}>
      <Center mt={'30%'} >
        <LoginForm />
      </Center>
    </Container>
  )
}

export default LoginPage