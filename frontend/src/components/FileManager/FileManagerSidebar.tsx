import { Home, FolderOpen, Folders, Settings as SettingsIcon, HardDrive, LogOut, BarChart3 } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { toast } from 'sonner';

const menuItems = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Files', url: '/files', icon: FolderOpen },
  { title: 'Folders', url: '/folders', icon: Folders },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Trash', url: '/trash', icon: FolderOpen },
  { title: 'Settings', url: '/settings', icon: SettingsIcon },
];

export const FileManagerSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const isCollapsed = state === 'collapsed';

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'bg-sidebar-accent text-sidebar-primary font-medium'
      : 'hover:bg-sidebar-accent/50 text-sidebar-foreground';

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <HardDrive className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">File Manager</span>
              <span className="text-xs text-muted-foreground">v1.0</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={getNavClassName({ isActive })}
                      >
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="space-y-2">
          {!isCollapsed && user && (
            <div className="text-sm text-muted-foreground mb-2 px-2">
              {/* {user.name} */}
            </div>
          )}
          <Button
            variant="ghost"
            size={isCollapsed ? 'icon' : 'default'}
            onClick={handleLogout}
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
