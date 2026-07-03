"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconActivity,
  IconAlertTriangle,
  IconBolt,
  IconBrandDiscord,
  IconChartAreaLine,
  IconDeviceDesktopAnalytics,
  IconGitBranch,
  IconLayoutDashboard,
} from "@tabler/icons-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: IconLayoutDashboard,
  },
  {
    title: "Devices",
    href: "/devices",
    icon: IconDeviceDesktopAnalytics,
  },
  {
    title: "Alerts",
    href: "/alerts",
    icon: IconAlertTriangle,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: IconChartAreaLine,
  },
  {
    title: "Architecture",
    href: "/architecture",
    icon: IconGitBranch,
  },
  {
    title: "Discord Bot",
    href: "/bot",
    icon: IconBrandDiscord,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Energy Monitor">
              <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <IconBolt />
              </span>
              <span className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold">Energy Monitor</span>
                <span className="truncate text-xs">Office Floor A</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    render={<Link href={item.href} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Integrations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="State API">
                  <IconActivity />
                  <span>State API</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>1</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Discord Bot"
                  render={<Link href="/bot" />}
                >
                  <IconBrandDiscord />
                  <span>Discord bot</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>8</SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Monitored equipment">
              <IconBolt />
              <span>15 live devices</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
