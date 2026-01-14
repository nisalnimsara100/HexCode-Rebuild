"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { firestore as db, auth } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Mail,
  Clock,
  Globe,
  Key,
  Users,
  Building,
  Save,
  Upload,
  Trash2,
  Plus,
  Edit3,
  AlertTriangle,
  CheckCircle,
  Info,
  Moon,
  Sun,
  Monitor,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
} from "lucide-react";

interface UserSettings {
  id: string;
  theme: "light" | "dark" | "system";
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
    sound: boolean;
  };
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  profileVisibility: "public" | "private" | "team";
}

interface SystemSettings {
  companyName: string;
  companyLogo: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  workingHours: {
    start: string;
    end: string;
    timezone: string;
  };
  features: {
    timeTracking: boolean;
    projectManagement: boolean;
    ticketSystem: boolean;
    reporting: boolean;
    teamManagement: boolean;
  };
  security: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSymbols: boolean;
    };
    sessionTimeout: number;
    twoFactorAuth: boolean;
    ipWhitelist: string[];
  };
  emailSettings: {
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
}

interface Department {
  id: string;
  name: string;
  description: string;
  manager: string;
  memberCount: number;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
  description: string;
  userCount: number;
}

export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState("profile");
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState({ name: "", description: "", manager: "" });
  const [newRole, setNewRole] = useState({ name: "", description: "", permissions: [] as string[] });

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
  ];

  const timezones = [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Australia/Sydney",
  ];

  const availablePermissions = [
    "view_dashboard",
    "manage_employees",
    "manage_projects",
    "manage_tickets",
    "manage_teams",
    "view_reports",
    "manage_settings",
    "admin_access",
    "create_users",
    "delete_users",
    "manage_roles",
    "manage_departments",
  ];

  const teamMembers = [
    { id: "1", name: "John Smith" },
    { id: "2", name: "Sarah Johnson" },
    { id: "3", name: "Mike Davis" },
    { id: "4", name: "Emily Chen" },
    { id: "5", name: "Alex Rodriguez" },
  ];

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    // { id: 'notifications', label: 'Notifications', icon: Bell },
    // { id: 'security', label: 'Security', icon: Shield },
    // { id: 'preferences', label: 'Preferences', icon: Globe },
    // { id: 'appearance', label: 'Appearance', icon: Palette },
    // { id: 'system', label: 'System Settings', icon: Settings },
    // { id: 'departments', label: 'Departments', icon: Building },
    // { id: 'roles', label: 'Roles & Permissions', icon: Key },
    // { id: 'database', label: 'Database', icon: Database },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      // In real implementation, fetch from Firebase
      // const userSettingsRef = doc(db, "userSettings", auth.currentUser?.uid || "current-user");
      // const systemSettingsRef = doc(db, "systemSettings", "default");
      // const departmentsRef = collection(db, "departments");
      // const rolesRef = collection(db, "roles");

      // Mock data for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUserSettings: UserSettings = {
        id: "current-user",
        theme: "dark",
        notifications: {
          email: true,
          push: true,
          desktop: false,
          sound: true,
        },
        language: "en",
        timezone: "America/New_York",
        dateFormat: "MM/dd/yyyy",
        timeFormat: "12h",
        profileVisibility: "team",
      };

      const mockSystemSettings: SystemSettings = {
        companyName: "HexCode Solutions",
        companyLogo: "/placeholder-logo.png",
        companyEmail: "info@hexcode.com",
        companyPhone: "+1 (555) 123-4567",
        companyAddress: "123 Tech Street, San Francisco, CA 94105",
        workingHours: {
          start: "09:00",
          end: "17:00",
          timezone: "America/New_York",
        },
        features: {
          timeTracking: true,
          projectManagement: true,
          ticketSystem: true,
          reporting: true,
          teamManagement: true,
        },
        security: {
          passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSymbols: false,
          },
          sessionTimeout: 8,
          twoFactorAuth: false,
          ipWhitelist: [],
        },
        emailSettings: {
          smtpHost: "smtp.gmail.com",
          smtpPort: 587,
          smtpUsername: "",
          smtpPassword: "",
          fromEmail: "noreply@hexcode.com",
          fromName: "HexCode Solutions",
        },
      };

      const mockDepartments: Department[] = [
        {
          id: "1",
          name: "Engineering",
          description: "Software development and technical infrastructure",
          manager: "John Smith",
          memberCount: 18,
        },
        {
          id: "2",
          name: "Design",
          description: "UI/UX design and creative services",
          manager: "Emily Chen",
          memberCount: 8,
        },
        {
          id: "3",
          name: "Marketing",
          description: "Marketing campaigns and brand management",
          manager: "Sarah Johnson",
          memberCount: 12,
        },
        {
          id: "4",
          name: "Sales",
          description: "Business development and client relations",
          manager: "Mike Davis",
          memberCount: 9,
        },
      ];

      const mockRoles: Role[] = [
        {
          id: "1",
          name: "Administrator",
          description: "Full system access and management capabilities",
          permissions: availablePermissions,
          userCount: 2,
        },
        {
          id: "2",
          name: "Project Manager",
          description: "Manage projects, teams, and assignments",
          permissions: [
            "view_dashboard",
            "manage_projects",
            "manage_tickets",
            "manage_teams",
            "view_reports",
          ],
          userCount: 5,
        },
        {
          id: "3",
          name: "Team Lead",
          description: "Lead team members and oversee daily operations",
          permissions: [
            "view_dashboard",
            "manage_projects",
            "manage_tickets",
            "view_reports",
          ],
          userCount: 8,
        },
        {
          id: "4",
          name: "Employee",
          description: "Basic access to assigned tasks and projects",
          permissions: [
            "view_dashboard",
            "view_reports",
          ],
          userCount: 32,
        },
      ];

      setUserSettings(mockUserSettings);
      setSystemSettings(mockSystemSettings);
      setDepartments(mockDepartments);
      setRoles(mockRoles);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveUserSettings = async () => {
    if (!userSettings) return;

    try {
      setSaving(true);

      // In real implementation, save to Firebase
      // await updateDoc(doc(db, "userSettings", userSettings.id), userSettings);

      // Mock save
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("User settings saved:", userSettings);
    } catch (error) {
      console.error("Error saving user settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const saveSystemSettings = async () => {
    if (!systemSettings) return;

    try {
      setSaving(true);

      // In real implementation, save to Firebase
      // await updateDoc(doc(db, "systemSettings", "default"), systemSettings);

      // Mock save
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("System settings saved:", systemSettings);
    } catch (error) {
      console.error("Error saving system settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const addDepartment = async () => {
    if (!newDepartment.name.trim()) return;

    try {
      const department: Department = {
        id: Date.now().toString(),
        name: newDepartment.name,
        description: newDepartment.description,
        manager: newDepartment.manager,
        memberCount: 0,
      };

      // In real implementation, save to Firebase
      // await addDoc(collection(db, "departments"), department);

      setDepartments([...departments, department]);
      setIsAddDepartmentOpen(false);
      setNewDepartment({ name: "", description: "", manager: "" });
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  const addRole = async () => {
    if (!newRole.name.trim()) return;

    try {
      const role: Role = {
        id: Date.now().toString(),
        name: newRole.name,
        description: newRole.description,
        permissions: newRole.permissions,
        userCount: 0,
      };

      // In real implementation, save to Firebase
      // await addDoc(collection(db, "roles"), role);

      setRoles([...roles, role]);
      setIsAddRoleOpen(false);
      setNewRole({ name: "", description: "", permissions: [] });
    } catch (error) {
      console.error("Error adding role:", error);
    }
  };

  const deleteDepartment = async (id: string) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        // In real implementation, delete from Firebase
        // await deleteDoc(doc(db, "departments", id));

        setDepartments(departments.filter(d => d.id !== id));
      } catch (error) {
        console.error("Error deleting department:", error);
      }
    }
  };

  const deleteRole = async (id: string) => {
    if (confirm("Are you sure you want to delete this role?")) {
      try {
        // In real implementation, delete from Firebase
        // await deleteDoc(doc(db, "roles", id));

        setRoles(roles.filter(r => r.id !== id));
      } catch (error) {
        console.error("Error deleting role:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
            Settings
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Manage your preferences and system configuration.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-1 bg-gray-800 border-gray-700">
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="data-[state=active]:bg-emerald-600">
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-medium text-white mb-4">Profile Settings</h3>

              {userSettings && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="text-lg">U</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Upload className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                      <p className="text-sm text-gray-400 mt-1">JPG, PNG up to 5MB</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select
                        value={userSettings.theme}
                        onValueChange={(value) =>
                          setUserSettings({ ...userSettings, theme: value as UserSettings["theme"] })
                        }
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">
                            <div className="flex items-center">
                              <Sun className="h-4 w-4 mr-2" />
                              Light
                            </div>
                          </SelectItem>
                          <SelectItem value="dark">
                            <div className="flex items-center">
                              <Moon className="h-4 w-4 mr-2" />
                              Dark
                            </div>
                          </SelectItem>
                          <SelectItem value="system">
                            <div className="flex items-center">
                              <Monitor className="h-4 w-4 mr-2" />
                              System
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={userSettings.language}
                        onValueChange={(value) =>
                          setUserSettings({ ...userSettings, language: value })
                        }
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={userSettings.timezone}
                        onValueChange={(value) =>
                          setUserSettings({ ...userSettings, timezone: value })
                        }
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timezones.map((tz) => (
                            <SelectItem key={tz} value={tz}>
                              {tz}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeFormat">Time Format</Label>
                      <Select
                        value={userSettings.timeFormat}
                        onValueChange={(value) =>
                          setUserSettings({ ...userSettings, timeFormat: value as "12h" | "24h" })
                        }
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                          <SelectItem value="24h">24 Hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profileVisibility">Profile Visibility</Label>
                      <Select
                        value={userSettings.profileVisibility}
                        onValueChange={(value) =>
                          setUserSettings({ ...userSettings, profileVisibility: value as UserSettings["profileVisibility"] })
                        }
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2" />
                              Public
                            </div>
                          </SelectItem>
                          <SelectItem value="team">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              Team Only
                            </div>
                          </SelectItem>
                          <SelectItem value="private">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-2" />
                              Private
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={saveUserSettings}
                      disabled={saving}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-medium text-white mb-4">Notification Preferences</h3>

              {userSettings && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-gray-400">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={userSettings.notifications.email}
                        onCheckedChange={(checked) =>
                          setUserSettings({
                            ...userSettings,
                            notifications: { ...userSettings.notifications, email: checked }
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base">Push Notifications</Label>
                        <p className="text-sm text-gray-400">Receive push notifications on mobile devices</p>
                      </div>
                      <Switch
                        checked={userSettings.notifications.push}
                        onCheckedChange={(checked) =>
                          setUserSettings({
                            ...userSettings,
                            notifications: { ...userSettings.notifications, push: checked }
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base">Desktop Notifications</Label>
                        <p className="text-sm text-gray-400">Show desktop notifications in browser</p>
                      </div>
                      <Switch
                        checked={userSettings.notifications.desktop}
                        onCheckedChange={(checked) =>
                          setUserSettings({
                            ...userSettings,
                            notifications: { ...userSettings.notifications, desktop: checked }
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base">Sound Notifications</Label>
                        <p className="text-sm text-gray-400">Play sound for notifications</p>
                      </div>
                      <Switch
                        checked={userSettings.notifications.sound}
                        onCheckedChange={(checked) =>
                          setUserSettings({
                            ...userSettings,
                            notifications: { ...userSettings.notifications, sound: checked }
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={saveUserSettings}
                      disabled={saving}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-medium text-white mb-4">Company Information</h3>

              {systemSettings && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={systemSettings.companyName}
                        onChange={(e) =>
                          setSystemSettings({ ...systemSettings, companyName: e.target.value })
                        }
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyEmail">Company Email</Label>
                      <Input
                        id="companyEmail"
                        type="email"
                        value={systemSettings.companyEmail}
                        onChange={(e) =>
                          setSystemSettings({ ...systemSettings, companyEmail: e.target.value })
                        }
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyPhone">Company Phone</Label>
                      <Input
                        id="companyPhone"
                        value={systemSettings.companyPhone}
                        onChange={(e) =>
                          setSystemSettings({ ...systemSettings, companyPhone: e.target.value })
                        }
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyAddress">Company Address</Label>
                    <Textarea
                      id="companyAddress"
                      value={systemSettings.companyAddress}
                      onChange={(e) =>
                        setSystemSettings({ ...systemSettings, companyAddress: e.target.value })
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                      rows={3}
                    />
                  </div>

                  <Separator className="bg-gray-700" />

                  <div>
                    <h4 className="text-base font-medium text-white mb-4">Feature Settings</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(systemSettings.features).map(([feature, enabled]) => (
                        <div key={feature} className="flex items-center justify-between">
                          <Label className="capitalize">
                            {feature.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                          <Switch
                            checked={enabled}
                            onCheckedChange={(checked) =>
                              setSystemSettings({
                                ...systemSettings,
                                features: { ...systemSettings.features, [feature]: checked }
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={saveSystemSettings}
                      disabled={saving}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-medium text-white mb-4">Security Settings</h3>

              {systemSettings && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-base font-medium text-white mb-4">Password Policy</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="minLength">Minimum Length</Label>
                        <Input
                          id="minLength"
                          type="number"
                          value={systemSettings.security.passwordPolicy.minLength}
                          onChange={(e) =>
                            setSystemSettings({
                              ...systemSettings,
                              security: {
                                ...systemSettings.security,
                                passwordPolicy: {
                                  ...systemSettings.security.passwordPolicy,
                                  minLength: parseInt(e.target.value)
                                }
                              }
                            })
                          }
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                        <Input
                          id="sessionTimeout"
                          type="number"
                          value={systemSettings.security.sessionTimeout}
                          onChange={(e) =>
                            setSystemSettings({
                              ...systemSettings,
                              security: {
                                ...systemSettings.security,
                                sessionTimeout: parseInt(e.target.value)
                              }
                            })
                          }
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {Object.entries(systemSettings.security.passwordPolicy)
                        .filter(([key]) => key !== 'minLength')
                        .map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <Label className="capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </Label>
                            <Switch
                              checked={value as boolean}
                              onCheckedChange={(checked) =>
                                setSystemSettings({
                                  ...systemSettings,
                                  security: {
                                    ...systemSettings.security,
                                    passwordPolicy: {
                                      ...systemSettings.security.passwordPolicy,
                                      [key]: checked
                                    }
                                  }
                                })
                              }
                            />
                          </div>
                        ))}
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-400">Require 2FA for all users</p>
                    </div>
                    <Switch
                      checked={systemSettings.security.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        setSystemSettings({
                          ...systemSettings,
                          security: { ...systemSettings.security, twoFactorAuth: checked }
                        })
                      }
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={saveSystemSettings}
                      disabled={saving}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Departments */}
        <TabsContent value="departments" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-white">Departments</h3>
              <p className="text-sm text-gray-400">Manage organizational departments</p>
            </div>
            <Button
              onClick={() => setIsAddDepartmentOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map((dept) => (
              <Card key={dept.id} className="bg-gray-800 border-gray-700">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{dept.name}</h4>
                      <p className="text-sm text-gray-400 mt-1">{dept.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteDepartment(dept.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Manager:</span>
                      <span className="text-white">{dept.manager}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Members:</span>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                        {dept.memberCount}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Roles */}
        <TabsContent value="roles" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-white">User Roles</h3>
              <p className="text-sm text-gray-400">Manage user roles and permissions</p>
            </div>
            <Button
              onClick={() => setIsAddRoleOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </div>

          <div className="space-y-4">
            {roles.map((role) => (
              <Card key={role.id} className="bg-gray-800 border-gray-700">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{role.name}</h4>
                      <p className="text-sm text-gray-400 mt-1">{role.description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {role.userCount} users
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRole(role.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-400 mb-2">Permissions:</h5>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission) => (
                        <Badge
                          key={permission}
                          variant="outline"
                          className="text-xs border-gray-600 text-gray-300"
                        >
                          {permission.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Department Modal */}
      <Dialog open={isAddDepartmentOpen} onOpenChange={setIsAddDepartmentOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deptName">Department Name</Label>
              <Input
                id="deptName"
                value={newDepartment.name}
                onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter department name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deptDescription">Description</Label>
              <Textarea
                id="deptDescription"
                value={newDepartment.description}
                onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter department description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deptManager">Manager</Label>
              <Select
                value={newDepartment.manager}
                onValueChange={(value) => setNewDepartment({ ...newDepartment, manager: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.name}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDepartmentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addDepartment} className="bg-emerald-600 hover:bg-emerald-700">
              Add Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Role Modal */}
      <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name</Label>
              <Input
                id="roleName"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter role name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleDescription">Description</Label>
              <Textarea
                id="roleDescription"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter role description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {availablePermissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={permission}
                      checked={newRole.permissions.includes(permission)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewRole({
                            ...newRole,
                            permissions: [...newRole.permissions, permission]
                          });
                        } else {
                          setNewRole({
                            ...newRole,
                            permissions: newRole.permissions.filter(p => p !== permission)
                          });
                        }
                      }}
                      className="rounded border-gray-600 bg-gray-700"
                    />
                    <Label htmlFor={permission} className="text-sm">
                      {permission.replace(/_/g, ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addRole} className="bg-emerald-600 hover:bg-emerald-700">
              Add Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}