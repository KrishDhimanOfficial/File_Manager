import { useEffect, useState } from 'react'
import { Moon, Sun, Grid3x3, List, HardDrive, } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/AuthContext'
import { formatBytes } from "@/lib/fileUtils"
import { useFileManager } from '@/hooks/useFileManager'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

function mbToKB(mb: number): number {
    return mb * 1024; // 1 MB = 1024 KB
}

const Settings = () => {
    const { darkMode, setDarkMode, defaultView, setDefaultView } = useAuth()
    const { allItems } = useFileManager();
    const [maxUploadSize, setMaxUploadSize] = useState('25')
    const [customUploadSize, setCustomUploadSize] = useState('')
    const totalStorage = allItems.filter(f => f.type === 'file').reduce((acc, f) => acc + (f.size || 0), 0)

    const handleThemeToggle = (checked: boolean) => {
        setDarkMode(checked)
        document.documentElement.classList.toggle('dark', checked)
        localStorage.setItem('darkMode', checked.toString())
    }

    const handelDefaultView = (value: string) => {
        setDefaultView(value)
        localStorage.setItem('defaultView', value)
    }

    const percentage = (part: number, total: number) => ((part / total) * 100).toFixed(2)

    useEffect(() => {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDarkMode)
        document.documentElement.classList.toggle('dark', isDarkMode)

        setDefaultView(localStorage.getItem('defaultView') || 'grid')
    }, [setDefaultView, setDarkMode])

    useEffect(() => { localStorage.setItem('maxUploadSize', maxUploadSize) }, [maxUploadSize])
    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container mx-auto px-6 py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Settings</h1>
                    <p className="text-muted-foreground">Manage your file manager preferences</p>
                </div>

                <div className="space-y-6">
                    {/* Appearance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                                Appearance
                            </CardTitle>
                            <CardDescription>
                                Customize the look and feel of your file manager
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="dark-mode">Dark Mode</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Switch between light and dark themes
                                    </p>
                                </div>
                                <Switch
                                    id="dark-mode"
                                    checked={darkMode}
                                    onCheckedChange={handleThemeToggle}
                                />
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <Label>Default View</Label>
                                <RadioGroup value={defaultView} onValueChange={handelDefaultView}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="grid" id="grid" />
                                        <Label htmlFor="grid" className="flex items-center gap-2 cursor-pointer font-normal">
                                            <Grid3x3 className="h-4 w-4" />
                                            Grid View
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="list" id="list" />
                                        <Label htmlFor="list" className="flex items-center gap-2 cursor-pointer font-normal">
                                            <List className="h-4 w-4" />
                                            List View
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    {/* <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Notifications
                            </CardTitle>
                            <CardDescription>
                                Manage how you receive notifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="notifications">Enable Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive notifications for file operations
                                    </p>
                                </div>
                                <Switch
                                    id="notifications"
                                    checked={notifications}
                                    onCheckedChange={setNotifications}
                                />
                            </div>
                        </CardContent>
                    </Card> */}

                    {/* Storage */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <HardDrive className="h-5 w-5" />
                                Storage
                            </CardTitle>
                            <CardDescription>
                                View your storage usage and manage space
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Used Storage</span>
                                    <span className="font-medium">{formatBytes(totalStorage)} of {maxUploadSize}MB</span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2">
                                    <div
                                        className="bg-gradient-primary h-2 rounded-full transition-all"
                                        style={{ width: `${percentage(parseInt(totalStorage), mbToKB(parseInt(maxUploadSize)))}` }}
                                    />
                                </div>
                            </div>
                            {/* </div> */}
                            {/* </Card> */}
                            <Separator />

                            <div className="space-y-3">
                                <Label>Maximum Upload Size</Label>
                                <p className="text-sm text-muted-foreground">
                                    Set the maximum file size for uploads
                                </p>
                                <Select value={maxUploadSize} onValueChange={setMaxUploadSize}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select maximum size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5 MB</SelectItem>
                                        <SelectItem value="10">10 MB</SelectItem>
                                        <SelectItem value="25">25 MB</SelectItem>
                                        <SelectItem value="50">50 MB</SelectItem>
                                        <SelectItem value="100">100 MB</SelectItem>
                                        <SelectItem value="custom">Custom Size</SelectItem>
                                    </SelectContent>
                                </Select>

                                {maxUploadSize === 'custom' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="custom-size">Custom Size (MB)</Label>
                                        <Input
                                            id="custom-size"
                                            type="number"
                                            placeholder="Enter size in MB"
                                            value={customUploadSize}
                                            onChange={(e) => setCustomUploadSize(e.target.value)}
                                            min="1"
                                            max="500"
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Privacy & Security */}
                    {/* <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Privacy & Security
                            </CardTitle>
                            <CardDescription>
                                Manage your privacy and security settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="encryption">Encrypt Files</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Enable end-to-end encryption for stored files
                                    </p>
                                </div>
                                <Switch id="encryption" />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Add an extra layer of security
                                    </p>
                                </div>
                                <Switch id="two-factor" />
                            </div>
                        </CardContent>
                    </Card> */}
                </div>
            </div >
        </div >
    );
};

export default Settings