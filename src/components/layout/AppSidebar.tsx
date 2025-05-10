import React from "react";
import { NavLink } from "react-router-dom";
import { ChevronRight, Gauge, Image, Rocket, Zap } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent, 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Gauge,
  },
  {
    name: "Campaigns",
    href: "/campaigns",
    icon: Rocket,
  },
  {
    name: "Content",
    href: "/content",
    icon: Image,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: Zap,
  },
];

const AppSidebar = () => {
  return (
    <TooltipProvider>
      <Sidebar>
        <SidebarHeader className="flex items-center justify-center px-2 py-6">
          <div className="relative w-full flex justify-center">
            <div className="relative">
              <Rocket size={48} className="text-white transform -rotate-45" strokeWidth={2.5} />
              <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-white animate-pulse" />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-6">
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild className="w-full flex justify-center">
                          <NavLink
                            to={item.href}
                            className={({ isActive }) =>
                              isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                            }
                          >
                            <item.icon className="h-16 w-16 text-white" strokeWidth={2.5} />
                          </NavLink>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {item.name}
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
};

export default AppSidebar;
