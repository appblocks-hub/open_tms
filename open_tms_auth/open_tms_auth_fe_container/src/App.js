import React from 'react'
import RouterMain from './navigation/RouterMain'
import { Routes, Route, Link } from 'react-router-dom'

export const Home = () => {
  return (
    <>
      <h1>Home</h1>
      <Link to={'/auth'}>Auth</Link>
    </>
  )
}

export const NoMatch = () => {
  return (
    <>
      <p>There's nothing here!</p>
    </>
  )
}

const App = () => {
  return (
    <div className='min-h-screen w-full'>
      <RouterMain />
    </div>
  )
}

export default App
