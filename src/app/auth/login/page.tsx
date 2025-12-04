import Login from '@/components/auth/login/login'
import React from 'react'

export const metadata = {
  title: 'Login - DURIO',
  description: 'Login to your Durio account to manage your daily tasks and stay organized.',
}

function LoginPage() {
  return (
    <Login />
  )
}

export default LoginPage