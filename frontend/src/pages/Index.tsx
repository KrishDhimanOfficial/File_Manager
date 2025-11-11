import { motion } from 'framer-motion';
import { HardDrive, FolderOpen, Upload, Shield, Zap} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card,  CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Index = () => {
    const navigate = useNavigate()

    const features = [
        {
            icon: FolderOpen,
            title: 'Organize Files',
            description: 'Create folders and organize your files with an intuitive interface',
        },
        {
            icon: Upload,
            title: 'Drag & Drop',
            description: 'Easily upload files with drag-and-drop functionality',
        },
        {
            icon: Shield,
            title: 'Secure Storage',
            description: 'Your files are stored securely with encryption',
        },
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Access and manage your files with incredible speed',
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-subtle">
            {/* Hero Section */}
            <div className="container mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <div className="flex justify-center mb-6">
                        <div className="p-6 rounded-2xl bg-gradient-primary shadow-elegant">
                            <HardDrive className="h-16 w-16 text-white" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                        Modern File Manager
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        A beautiful and powerful file management system built with React.
                        Organize, upload, and manage your files with ease.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button
                            size="lg"
                            onClick={() => navigate('/auth')}
                            className="shadow-elegant hover:shadow-xl transition-shadow"
                        >
                            Get Started
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => navigate('/files')}
                        >
                            Browse Files
                        </Button>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full hover:shadow-elegant transition-shadow">
                                <CardHeader>
                                    <div className="p-3 rounded-lg bg-primary/10 w-fit mb-2">
                                        <feature.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle>{feature.title}</CardTitle>
                                    <CardDescription>{feature.description}</CardDescription>
                                </CardHeader>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center bg-gradient-primary rounded-2xl p-12 shadow-elegant"
                >
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to organize your files?
                    </h2>
                    <p className="text-white/90 mb-6 max-w-xl mx-auto">
                        Start managing your files with our intuitive interface today
                    </p>
                    <Button
                        size="lg"
                        variant="secondary"
                        onClick={() => navigate('/files')}
                        className="shadow-lg hover:shadow-xl transition-shadow"
                    >
                        Start Managing Files
                    </Button>
                </motion.div>
            </div>
        </div>
    )
}

export default Index