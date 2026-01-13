"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  LayoutDashboard,
  Users,
  Car,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/clients", label: "Manage Clients", icon: Users },
  { href: "/admin/cars", label: "Manage Cars", icon: Car },
  { href: "/admin/repairs", label: "Manage Repairs", icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen flex text-white">
      {/* Background image */}
      <Image
        src="/workshop.bg.jpg"
        alt="Workshop background"
        fill
        priority
        className="object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex w-full">
        {/* Sidebar */}
        <aside className="w-[340px] bg-black/90 border-r border-red-700 relative">
          <div className="p-8 border-b border-red-700">
            <div className="flex items-center gap-4">
              <Wrench className="h-12 w-12 text-red-500" />
              <div>
                <h1 className="text-3xl font-extrabold text-white">AutoCare</h1>
                <p className="text-lg text-gray-300 font-semibold">
                  Admin Panel
                </p>
              </div>
            </div>
          </div>

          <nav className="p-8 space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-5 px-6 py-5 rounded-2xl transition text-2xl font-bold",
                    isActive
                      ? "bg-red-600 text-white shadow-xl"
                      : "text-gray-300 hover:bg-red-600/20 hover:text-white"
                  )}
                >
                  <Icon className="h-8 w-8" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-8 left-8 right-8">
            <Button
              variant="ghost"
              className="w-full justify-start text-2xl font-bold py-7 rounded-2xl text-gray-300 hover:bg-red-600/20 hover:text-white"
              asChild
            >
              <Link href="/login">
                <LogOut className="h-8 w-8 mr-5" />
                Logout
              </Link>
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-14 text-white">{children}</main>
      </div>
    </div>
  );
}


