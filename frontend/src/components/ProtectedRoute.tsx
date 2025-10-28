import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, authicated, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user && !authicated) {
        return <Navigate to="/auth" replace />
    }

    return <>{children}</>
}