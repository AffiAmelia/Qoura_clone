import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const BaseUser = () => {
    const auth = localStorage.getItem("userData")
    return (
        auth ? <Navigate to='/home' /> : <Outlet />
    )
}

export default BaseUser