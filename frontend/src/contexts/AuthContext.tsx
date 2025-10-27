import Fetch from '@/hooks/Fetch'
import Cookies from 'js-cookie'
import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
    user: string | null
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
    signup: (email: string, password: string, name: string) => Promise<{ success: boolean; message?: string }>
    logout: () => void
    isLoading: boolean
}

function isTokenExpired(token: string | null): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const currentTime = Math.floor(Date.now() / 1000)

        return payload.exp < currentTime;
    } catch (error) {
        return true // Treat invalid tokens as expired
    }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    async function handleRefreshToken() {
        const response = await Fetch.get('/auth/refresh')
        setUser(response.accessToken)
        Cookies.set('fileManager_token', response.accessToken, { secure: true, sameSite: 'Strict' })
    }

    useEffect(() => {
        const storedToken = Cookies.get('fileManager_token')

        if (isTokenExpired(storedToken)) handleRefreshToken()
        else setUser(storedToken)

        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string) => {
        const response = await Fetch.post('/auth/login', { email, password })
        setUser(response.accessToken)
        Cookies.set('fileManager_token', response.accessToken, { secure: true, sameSite: 'Strict' })
        return response
    }

    const signup = async (email: string, password: string, name: string) => {
        const response = await Fetch.post('/auth/signup', { email, password, name })
        Cookies.set('fileManager_token', response.accessToken, { secure: true, sameSite: 'Strict' })
        setUser(response.accessToken)
        return response
    }

    const logout = async () => {
        setUser(null)
        Cookies.remove('fileManager_token')
        await Fetch.get('/auth/logout')
    }

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}