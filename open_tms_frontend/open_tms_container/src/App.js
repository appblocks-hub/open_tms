import React from 'react'
import RouterMain from './navigation/RouterMain'
import { RouterProvider, createBrowserRouter, Link } from 'react-router-dom'

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

const router = createBrowserRouter([{ path: '*', Component: RouterMain }])

// 4️⃣ RouterProvider added
export default function App() {
  return <RouterProvider router={router} />
}
