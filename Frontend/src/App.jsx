import React from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { LoginScreen } from './Screens/LoginScreen/LoginScreen'
import { RegisterScreen } from './Screens/RegisterScreen/RegisterScreen'
import { HomeScreen } from './Screens/HomeScreen/HomeScreen'
import { ResetPasswordScreen } from './Screens/ResetPasswordScreen/ResetPasswordScreen'
import { ForgotPasswordScreen } from './Screens/ForgotPasswordScreen/ForgotPasswordScreen'


const App = () => {
  return (
    <Routes>
      <Route
        path='/login'
        element={<LoginScreen />}
      />
      <Route
        path='/register'
        element={<RegisterScreen />}
      />
      <Route
        path='/home'
        element={<HomeScreen />}
      />
      <Route
        path='/'
        element={<LoginScreen />}
      />
      <Route
        path='/forgot-password'
        element={<ForgotPasswordScreen />}
      />
      <Route
        path='/reset-password'
        element={<ResetPasswordScreen />}
      />
      <Route
        path='/*'
        element={<Navigate to={'/home'} />}
      />
    </Routes>
  )
}

export default App