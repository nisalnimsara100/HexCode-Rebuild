"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/auth-context";
import { useSidebar } from "@/app/staff/layout";
import { database } from "@/lib/firebase";
import { onValue, ref } from "firebase/database";

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  current: boolean;
  badgeCount?: number;
  hasComments?: boolean;
}

const getNavigationByRole = (
  role: string,
  pathname: string,
  taskBadgeCount: number,
  hasTaskComments: boolean,
  ticketBadgeCount: number
): NavigationItem[] => {
  const baseNavigation = [
    { name: "Dashboard", href: "/staff/dashboard", icon: Home, current: pathname === "/staff/dashboard" || pathname === "/staff" || pathname.startsWith("/staff/dashboard") },
  ];

  if (role === "employee") {
    return [
      ...baseNavigation,
      { name: "My Projects", href: "/staff/projects", icon: FolderOpen, current: pathname === "/staff/projects" },
      {
        name: "My Tickets",
        href: "/staff/tickets",
        icon: Ticket,
        current: pathname === "/staff/tickets" || pathname.startsWith("/staff/tickets"),
        badgeCount: ticketBadgeCount,
      },
      {
        name: "Tasks",
        href: "/staff/tasks",
        icon: ClipboardList,
        current: pathname === "/staff/tasks" || pathname.startsWith("/staff/tasks"),
        badgeCount: taskBadgeCount,
        hasComments: hasTaskComments,
      },
      { name: "Settings", href: "/staff/settings", icon: Settings, current: pathname === "/staff/settings" },
    ];
  }

  // For admin and manager roles
  return [
    ...baseNavigation,
    // { name: "Employees", href: "/staff/employees", icon: Users, current: pathname === "/staff/employees" },
    { name: "Projects", href: "/staff/projects", icon: FolderOpen, current: pathname === "/staff/projects" },
    {
      name: "Tickets",
      href: "/staff/tickets",
      icon: Ticket,
      current: pathname === "/staff/tickets" || pathname.startsWith("/staff/tickets"),
      badgeCount: ticketBadgeCount,
    },
    {
      name: "Tasks",
      href: "/staff/tasks",
      icon: ClipboardList,
      current: pathname === "/staff/tasks" || pathname.startsWith("/staff/tasks"),
      badgeCount: taskBadgeCount,
      hasComments: hasTaskComments,
    },
    // { name: "Teams", href: "/staff/teams", icon: UserCheck, current: pathname === "/staff/teams" },
    // { name: "Reports", href: "/staff/reports", icon: BarChart3, current: pathname === "/staff/reports" },
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
  const router = useRouter();
  const { userProfile } = useAuth();
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const [taskBadgeCount, setTaskBadgeCount] = useState(0);
  const [hasTaskComments, setHasTaskComments] = useState(false);
  const [ticketBadgeCount, setTicketBadgeCount] = useState(0);



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

  useEffect(() => {
    if (!userProfile?.uid) {
      setTaskBadgeCount(0);
      setHasTaskComments(false);
      setTicketBadgeCount(0);
      return;
    }

    const tasksRef = ref(database, "staffdashboard/tasks");
    const ticketsRef = ref(database, "staffdashboard/tickets");
    const unsubscribeTasks = onValue(tasksRef, (snapshot) => {
      if (!snapshot.exists()) {
        setTaskBadgeCount(0);
        setHasTaskComments(false);
        return;
      }

      const taskList: Array<Record<string, any>> = Object.entries(snapshot.val() as Record<string, any>).map(([id, value]) => ({
        id,
        ...(value as Record<string, any>),
      }));

      const assignedTasks = taskList.filter((task: Record<string, any>) => {
        if (task.isArchived) {
          return false;
        }

        if (Array.isArray(task.assignedTo)) {
          return task.assignedTo.includes(userProfile.uid);
        }
        return task.assignedTo === userProfile.uid;
      });

      const activeTaskCount = assignedTasks.filter((task: Record<string, any>) => task.status !== "completed").length;
      const commentExists = assignedTasks.some(
        (task: Record<string, any>) => Array.isArray(task.comments) && task.comments.length > 0
      );

      setTaskBadgeCount(activeTaskCount);
      setHasTaskComments(commentExists);
    });

    const unsubscribeTickets = onValue(ticketsRef, (snapshot) => {
      if (!snapshot.exists()) {
        setTicketBadgeCount(0);
        return;
      }

      const ticketList: Array<Record<string, any>> = Object.entries(snapshot.val() as Record<string, any>).map(([id, value]) => ({
        id,
        ...(value as Record<string, any>),
      }));

      const assignedTickets = ticketList.filter((ticket: Record<string, any>) => {
        if (Array.isArray(ticket.assignedTo)) {
          return ticket.assignedTo.includes(userProfile.uid);
        }
        return ticket.assignedTo === userProfile.uid;
      });

      const activeTicketCount = assignedTickets.filter(
        (ticket: Record<string, any>) => !["closed", "completed"].includes(ticket.status)
      ).length;

      setTicketBadgeCount(activeTicketCount);
    });

    return () => {
      unsubscribeTasks();
      unsubscribeTickets();
    };
  }, [userProfile?.uid]);

  const navigation = getNavigationByRole(
    userProfile?.role || "employee",
    pathname,
    taskBadgeCount,
    hasTaskComments,
    ticketBadgeCount
  );

  const handleNavigate = (event: React.MouseEvent<HTMLAnchorElement>, href: string, closeMobile?: boolean) => {
    event.preventDefault();
    if (!href) return;

    const isDashboardHref = href === "/staff/dashboard";
    const alreadyOnTarget = isDashboardHref
      ? pathname === "/staff" || pathname === "/staff/dashboard" || pathname.startsWith("/staff/dashboard")
      : pathname === href || pathname.startsWith(`${href}/`);

    if (alreadyOnTarget) {
      if (closeMobile) setOpen(false);
      return;
    }

    router.push(href);
    if (closeMobile) setOpen(false);
  };

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
                                onClick={(event) => handleNavigate(event, item.href, true)}
                                className={classNames(
                                  (item.name === "Dashboard" && (pathname === "/staff/dashboard" || pathname === "/staff" || pathname.startsWith("/staff/dashboard"))) ||
                                    (item.name !== "Dashboard" && pathname === item.href)
                                    ? "bg-orange-700 text-white"
                                    : "text-gray-300 hover:text-white hover:bg-gray-800",
                                  "group flex items-center justify-between rounded-md p-2 text-sm leading-6 font-semibold"
                                )}
                              >
                                <div className="flex items-center gap-x-3">
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
                                </div>
                                {item.badgeCount && item.badgeCount > 0 ? (
                                  <div className="flex items-center gap-1">
                                    {item.hasComments && <span className="h-2 w-2 rounded-full bg-orange-400" />}
                                    <Badge className="h-5 min-w-5 px-1.5 text-[10px] bg-orange-600 hover:bg-orange-600 text-white border-0">
                                      {item.badgeCount}
                                    </Badge>
                                  </div>
                                ) : null}
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
                        onClick={(event) => handleNavigate(event, item.href)}
                        className={classNames(
                          (item.name === "Dashboard" && (pathname === "/staff/dashboard" || pathname === "/staff" || pathname.startsWith("/staff/dashboard"))) ||
                            (item.name !== "Dashboard" && pathname === item.href)
                            ? "bg-orange-700 text-white"
                            : "text-gray-300 hover:text-white hover:bg-gray-800",
                          "group flex items-center justify-between rounded-md p-2 text-sm leading-6 font-semibold",
                          collapsed ? "justify-center" : ""
                        )}
                        title={collapsed ? item.name : undefined}
                      >
                        <div className={classNames("flex items-center gap-x-3", collapsed ? "justify-center" : "")}> 
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
                        </div>
                        {!collapsed && item.badgeCount && item.badgeCount > 0 ? (
                          <div className="flex items-center gap-1">
                            {item.hasComments && <span className="h-2 w-2 rounded-full bg-orange-400" />}
                            <Badge className="h-5 min-w-5 px-1.5 text-[10px] bg-orange-600 hover:bg-orange-600 text-white border-0">
                              {item.badgeCount}
                            </Badge>
                          </div>
                        ) : null}
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