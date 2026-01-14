"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Users,
  FolderOpen,
  Ticket,
  UserCheck,
  ClipboardList,
  BarChart3,
  Settings,
  Home,
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleUser
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";
import { useSidebar } from "@/app/staff/layout";

const getNavigationByRole = (role: string, pathname: string) => {
  const baseNavigation = [
    { name: "Dashboard", href: "/staff/dashboard", icon: Home, current: pathname === "/staff/dashboard" || pathname === "/staff" || pathname.startsWith("/staff/dashboard") },
  ];

  if (role === "employee") {
    return [
      ...baseNavigation,
      { name: "My Projects", href: "/staff/projects", icon: FolderOpen, current: pathname === "/staff/projects" },
      { name: "My Tickets", href: "/staff/tickets", icon: Ticket, current: pathname === "/staff/tickets" },
      // { name: "My Assignments", href: "/staff/assignments", icon: ClipboardList, current: pathname === "/staff/assignments" },
      { name: "Settings", href: "/staff/settings", icon: Settings, current: pathname === "/staff/settings" },
    ];
  }

  // For admin and manager roles
  return [
    ...baseNavigation,
    { name: "Employees", href: "/staff/employees", icon: Users, current: pathname === "/staff/employees" },
    { name: "Projects", href: "/staff/projects", icon: FolderOpen, current: pathname === "/staff/projects" },
    { name: "Tickets", href: "/staff/tickets", icon: Ticket, current: pathname === "/staff/tickets" },
    { name: "Teams", href: "/staff/teams", icon: UserCheck, current: pathname === "/staff/teams" },
    // { name: "Assignments", href: "/staff/assignments", icon: ClipboardList, current: pathname === "/staff/assignments" },
    { name: "Reports", href: "/staff/reports", icon: BarChart3, current: pathname === "/staff/reports" },
    { name: "Settings", href: "/staff/settings", icon: Settings, current: pathname === "/staff/settings" },
  ];
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface StaffSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function StaffSidebar({ open, setOpen }: StaffSidebarProps) {
  const pathname = usePathname();
  const { userProfile } = useAuth();
  const [localCollapsed, setLocalCollapsed] = useState(false);



  // Try to use context, fallback to local state
  let collapsed = localCollapsed;
  let toggleCollapsed = () => setLocalCollapsed(!localCollapsed);

  try {
    const sidebarContext = useSidebar();
    collapsed = sidebarContext.collapsed;
    toggleCollapsed = () => sidebarContext.setCollapsed(!sidebarContext.collapsed);
  } catch (error) {
    // Context not available, use local state
  }

  const navigation = getNavigationByRole(userProfile?.role || "employee", pathname);

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <Button
                      variant="ghost"
                      onClick={() => setOpen(false)}
                      className="text-white hover:text-white hover:bg-orange-600/20"
                    >
                      <span className="sr-only">Close sidebar</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </Button>
                  </div>
                </Transition.Child>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <Building2 className="h-8 w-8 text-orange-500" />
                    <span className="ml-2 text-xl font-bold text-white">
                      HexCode Staff
                    </span>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={classNames(
                                  (item.name === "Dashboard" && (pathname === "/staff/dashboard" || pathname === "/staff" || pathname.startsWith("/staff/dashboard"))) ||
                                    (item.name !== "Dashboard" && pathname === item.href)
                                    ? "bg-orange-700 text-white"
                                    : "text-gray-300 hover:text-white hover:bg-gray-800",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                )}
                              >
                                <item.icon
                                  className={classNames(
                                    (item.name === "Dashboard" && (pathname === "/staff/dashboard" || pathname === "/staff" || pathname.startsWith("/staff/dashboard"))) ||
                                      (item.name !== "Dashboard" && pathname === item.href)
                                      ? "text-white"
                                      : "text-gray-400 group-hover:text-white",
                                    "h-6 w-6 shrink-0"
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ${collapsed ? 'lg:w-20' : 'lg:w-72'}`}>
        <div className={`flex grow flex-col gap-y-5 overflow-y-auto bg-black pb-4 transition-all duration-300 ${collapsed ? 'px-3' : 'px-6'} border-r border-orange-500`}>
          <div className="flex h-16 shrink-0 items-center justify-between">
            <div className="flex items-center">
              <CircleUser className="h-8 w-8 text-orange-500" />
              {!collapsed && (
                <span className="ml-2 text-xl font-bold text-white">
                  HexCode Staff
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapsed}
              className="text-gray-400 hover:text-white hover:bg-orange-600/20 p-1"
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={classNames(
                          (item.name === "Dashboard" && (pathname === "/staff/dashboard" || pathname === "/staff" || pathname.startsWith("/staff/dashboard"))) ||
                            (item.name !== "Dashboard" && pathname === item.href)
                            ? "bg-orange-700 text-white"
                            : "text-gray-300 hover:text-white hover:bg-gray-800",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                          collapsed ? "justify-center" : ""
                        )}
                        title={collapsed ? item.name : undefined}
                      >
                        <item.icon
                          className={classNames(
                            (item.name === "Dashboard" && (pathname === "/staff/dashboard" || pathname === "/staff" || pathname.startsWith("/staff/dashboard"))) ||
                              (item.name !== "Dashboard" && pathname === item.href)
                              ? "text-white"
                              : "text-gray-400 group-hover:text-white",
                            "h-6 w-6 shrink-0"
                          )}
                          aria-hidden="true"
                        />
                        {!collapsed && item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}