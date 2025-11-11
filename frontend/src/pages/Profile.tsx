import { useEffect, useState } from 'react'
import { User, Mail, Save, Lock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Fetch from '@/hooks/Fetch'
import { useQuery } from '@tanstack/react-query'

const Profile = () => {
    const [user, setUser] = useState<any>({ name: '', email: '', password: '', currentPassword: '' })
    const [isLoading, setIsLoading] = useState(false)
    const { data: userData } = useQuery({
        queryKey: ['user'],
        queryFn: async () => await Fetch.get('/auth/user')
    })

    useEffect(() => {
        setUser({
            name: userData?.name,
            email: userData?.email,
        })
    }, [userData])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const result = await Fetch.put('/update/profile', user)
        if (result.success) {
            toast.success(result.message)
        } else {
            toast.error(result.message)
        }

        setIsLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container mx-auto px-6 py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Profile</h1>
                    <p className="text-muted-foreground">Manage your account information</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Account Information
                        </CardTitle>
                        <CardDescription>
                            Update your personal details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={user.name}
                                        onChange={(e) => setUser((prev: object) => ({ ...prev, name: e.target.value }))}
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={user.email}
                                        onChange={(e) => setUser((prev: object) => ({ ...prev, email: e.target.value }))}
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="currentPassword"
                                        type="password"
                                        placeholder="Enter current password"
                                        value={user.currentPassword}
                                        onChange={(e) => setUser((prev: object) => ({ ...prev, currentPassword: e.target.value }))} // Update the currentPassword state(e.target.value)}
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={user.password}
                                        onChange={(e) => setUser((prev: object) => ({ ...prev, password: e.target.value }))}
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Profile