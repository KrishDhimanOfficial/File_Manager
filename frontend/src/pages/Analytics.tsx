import { useMemo } from "react";
import { useFileManager } from "@/hooks/useFileManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { FileIcon, FolderIcon, HardDrive, TrendingUp, Clock, Database } from "lucide-react";
import { formatBytes, formatDate } from "@/lib/fileUtils";
import { motion } from "framer-motion";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

export default function Analytics() {
    const { allItems } = useFileManager();

    const stats = useMemo(() => {
        const totalallItems = allItems.filter(f => f.type === 'file').length;
        const totalFolders = allItems.filter(f => f.type === 'folder').length;
        const totalStorage = allItems.filter(f => f.type === 'file').reduce((acc, f) => acc + (f.size || 0), 0);

        // File type distribution
        const fileTypeMap = allItems
            .filter(f => f.type === 'file')
            .reduce((acc, f) => {
                const ext = f.extension || 'other';
                acc[ext] = (acc[ext] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

        const fileTypeData = Object.entries(fileTypeMap)
            .map(([type, count]: [string, number]) => ({
                name: type.toUpperCase(),
                value: count,
                percentage: ((count / totalallItems) * 100).toFixed(1)
            }))
            .sort((a, b) => b.value - a.value);

        // Recently uploaded allItems
        const recentallItems = [...allItems]
            .filter(f => f.type === 'file')
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);

        // Largest allItems
        const largestallItems = [...allItems]
            .filter(f => f.type === 'file')
            .sort((a, b) => (b.size || 0) - (a.size || 0))
            .slice(0, 5);

        // Upload activity over time (last 7 days)
        const today = new Date();

        const uploadActivity = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() - (6 - i));
            const dayStart = new Date(date.setHours(0, 0, 0, 0));
            const dayEnd = new Date(date.setHours(23, 59, 59, 999));

            const count = allItems.filter(f => {
                const created = new Date(f.createdAt).getTime();
                return created >= dayStart.getTime() && created <= dayEnd.getTime();
            }).length;

            return {
                date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                uploads: count
            };
        });

        // Storage by file type
        const storageByType = allItems
            .filter(f => f.type === 'file')
            .reduce((acc, f) => {
                const ext = f.extension || 'other';
                acc[ext] = (acc[ext] || 0) + (f.size || 0);
                return acc;
            }, {} as Record<string, number>);

        const storageData = Object.entries(storageByType)
            .map(([type, size]: [string, number]) => ({
                name: type.toUpperCase(),
                size: size,
                formatted: formatBytes(size)
            }))
            .sort((a, b) => b.size - a.size)
            .slice(0, 5);

        return {
            totalallItems,
            totalFolders,
            totalStorage,
            fileTypeData,
            recentallItems,
            largestallItems,
            uploadActivity,
            storageData
        };
    }, [allItems]);

    const statCards = [
        { title: "Total Files", value: stats.totalallItems, icon: FileIcon, description: "Files in storage" },
        { title: "Total Folders", value: stats.totalFolders, icon: FolderIcon, description: "Directory count" },
        { title: "Storage Used", value: formatBytes(stats.totalStorage), icon: HardDrive, description: "Total space occupied" },
        { title: "File Types", value: stats.fileTypeData.length, icon: Database, description: "Different formats" }
    ];

    return (
        <div className="space-y-6 p-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Analytics Dashboard</h1>
                <p className="text-muted-foreground">Monitor your file storage and usage patterns</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">{stat.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <Tabs defaultValue="distribution" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="distribution">File Distribution</TabsTrigger>
                    <TabsTrigger value="activity">Upload Activity</TabsTrigger>
                    <TabsTrigger value="storage">Storage Breakdown</TabsTrigger>
                </TabsList>

                <TabsContent value="distribution" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>File Types Distribution</CardTitle>
                                <CardDescription>Breakdown of files by format</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ChartContainer
                                    config={{
                                        value: {
                                            label: "allItems",
                                            color: "hsl(var(--primary))",
                                        },
                                    }}
                                    className="h-full"
                                >
                                    <PieChart>
                                        <Pie
                                            data={stats.fileTypeData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percentage }) => `${name} ${percentage}%`}
                                            outerRadius={80}
                                            fill="hsl(var(--primary))"
                                            dataKey="value"
                                        >
                                            {stats.fileTypeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                    </PieChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>File Count by Type</CardTitle>
                                <CardDescription>Number of allItems per format</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ChartContainer
                                    config={{
                                        value: {
                                            label: "Count",
                                            color: "hsl(var(--primary))",
                                        },
                                    }}
                                    className="h-full"
                                >
                                    <BarChart data={stats.fileTypeData}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis dataKey="name" className="text-xs" />
                                        <YAxis className="text-xs" />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload Activity (Last 7 Days)</CardTitle>
                            <CardDescription>Daily file upload trend</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ChartContainer
                                config={{
                                    uploads: {
                                        label: "Uploads",
                                        color: "hsl(var(--primary))",
                                    },
                                }}
                                className="h-full"
                            >
                                <LineChart data={stats.uploadActivity}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="date" className="text-xs" />
                                    <YAxis className="text-xs" />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Line
                                        type="monotone"
                                        dataKey="uploads"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={2}
                                        dot={{ fill: "hsl(var(--primary))", r: 4 }}
                                    />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="storage" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Storage by File Type</CardTitle>
                            <CardDescription>Space usage breakdown</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ChartContainer
                                config={{
                                    size: {
                                        label: "Size",
                                        color: "hsl(var(--primary))",
                                    },
                                }}
                                className="h-full"
                            >
                                <BarChart data={stats.storageData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis type="number" className="text-xs" />
                                    <YAxis dataKey="name" type="category" className="text-xs" />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="size" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Lists Section */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Recently Uploaded
                        </CardTitle>
                        <CardDescription>Your latest allItems</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats.recentallItems.map((file) => (
                                <div key={file.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">{file.name}</p>
                                            <p className="text-xs text-muted-foreground">{formatDate(new Date(file.createdAt))}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                                        {formatBytes(file.size || 0)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Largest allItems
                        </CardTitle>
                        <CardDescription>Top 5 by size</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats.largestallItems.map((file) => (
                                <div key={file.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">{file.name}</p>
                                            <p className="text-xs text-muted-foreground uppercase">{file.extension}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-semibold flex-shrink-0 ml-2">
                                        {formatBytes(file.size || 0)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}