import { useEffect, useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Logout() {
    const { logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const [busy, setBusy] = useState(true)

    useEffect(() => {
        logout()
        setBusy(false)
        navigate('/', { replace: true })
    }, [logout, navigate])

    if (!busy) return null

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Logging out…</span>
        </div>
        </div>
    )
}
