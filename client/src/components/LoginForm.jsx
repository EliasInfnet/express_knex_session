import React, { useContext } from 'react'
import { TextInput, Button, Group, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { api } from '../api/api';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

function LoginForm() {

  const { user, setUser } = useContext(AppContext)

  const navigate = useNavigate()

  const form = useForm({
    initialValues: {
      email: 'elias@gmail.com',
      password: '1234',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleSubmit = async (values) => {
    try {
      const res = await api.post('/login', {
        email: values.email,
        password: values.password
      })
      const loggedUser = res.data?.user
      console.log(loggedUser)
      if (loggedUser) {
        setUser(loggedUser)
        navigate('dashboard')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Box maw={340} mx="auto">
      <form autoSave='true' onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          size='lg'
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />

        <TextInput
          withAsterisk
          size='lg'
          label="password"
          placeholder="Enter password"
          {...form.getInputProps('password')}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}

export default LoginForm