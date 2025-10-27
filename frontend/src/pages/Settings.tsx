import { useState } from 'react';
import { Moon, Sun, Grid3x3, List, HardDrive, Bell, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

const Settings = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [defaultView, setDefaultView] = useState('grid');

    const handleThemeToggle = (checked: boolean) => {
        setDarkMode(checked);
        document.documentElement.classList.toggle('dark', checked);
    };

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
                                <RadioGroup value={defaultView} onValueChange={setDefaultView}>
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
                    <Card>
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
                    </Card>

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
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Used Storage</span>
                                    <span className="font-medium">2.4 GB of 10 GB</span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2">
                                    <div
                                        className="bg-gradient-primary h-2 rounded-full transition-all"
                                        style={{ width: '24%' }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Privacy & Security */}
                    <Card>
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
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings