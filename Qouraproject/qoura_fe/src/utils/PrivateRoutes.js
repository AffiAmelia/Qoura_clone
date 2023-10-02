import { Navigate, Outlet } from 'react-router-dom'
const PrivateRoutes = () => {
    const auth = localStorage.getItem("userData")
    return (
        auth ? <Outlet /> : <Navigate to='/login' />
    )
}

export default PrivateRoutes