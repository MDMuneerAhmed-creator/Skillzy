import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useLogout } from "@workspace/api-client-react";
import { LayoutDashboard, FileText, History, Settings, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analyze", label: "Analyze Resume", icon: FileText },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Layout({ children, title }: { children: React.ReactNode; title?: string }) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const logoutMutation = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        logout();
        setLocation("/login");
      }
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-[100dvh] flex bg-black text-white" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-black border-r transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `} style={{ borderColor: "#333333" }}>
        <div className="flex items-center h-16 px-6 border-b" style={{ borderColor: "#333333" }}>
          <img src="/skillzy-logo.png" alt="Skillzy" className="h-8 w-8 mr-3" />
          <span className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            Skillzy
          </span>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem-5rem)]">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || location.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`
                    flex items-center px-4 py-3 rounded-md cursor-pointer transition-all duration-150
                    ${isActive
                      ? "bg-white text-black font-semibold"
                      : "text-white/70 hover:bg-white/8 hover:text-white"}
                  `}
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  <Icon className={`h-5 w-5 mr-3 flex-shrink-0 ${isActive ? "text-black" : "text-white/60"}`} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-black" style={{ borderColor: "#333333" }}>
          <div className="flex items-center">
            <Avatar className="h-9 w-9 mr-3 border" style={{ borderColor: "#333333" }}>
              <AvatarFallback className="bg-white/10 text-white text-xs font-bold" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                {user ? getInitials(user.fullName) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
              <p className="text-xs truncate" style={{ color: "#9CA3AF" }}>{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header
          className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b"
          style={{ backgroundColor: "#111111", borderColor: "#333333" }}
        >
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-2 -ml-2 text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            {title && (
              <h1
                className="text-xl font-bold text-white"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
              >
                {title}
              </h1>
            )}
          </div>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-white/10">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback
                      className="text-xs font-bold"
                      style={{ backgroundColor: "#1A1A1A", color: "#ffffff", border: "1px solid #333333" }}
                    >
                      {user ? getInitials(user.fullName) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount style={{ backgroundColor: "#1A1A1A", borderColor: "#333333" }}>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-white leading-none">{user?.fullName}</p>
                    <p className="text-xs leading-none" style={{ color: "#9CA3AF" }}>{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator style={{ backgroundColor: "#333333" }} />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer flex items-center w-full text-white hover:bg-white/10 no-underline">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator style={{ backgroundColor: "#333333" }} />
                <DropdownMenuItem
                  className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8" style={{ backgroundColor: "#000000" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
