"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { database, storage } from "@/lib/firebase";
import { ref, get, update } from "firebase/database";
import {
  ref as refStorage,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useAuth } from "@/components/auth/auth-context";
import { User, Save, Upload } from "lucide-react";

interface UserSettings {
  name: string;
  avatarUrl: string;
  id: string;
  timezone: string;
  timeFormat: "12h" | "24h";
}

export function SettingsPanel() {
  const { userProfile } = useAuth();
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const timezones = ["UTC", ...Intl.supportedValuesOf("timeZone")];

  const tabs = [{ id: "profile", label: "My Profile", icon: User }];

  useEffect(() => {
    if (userProfile?.uid) {
      fetchSettings();
    }
  }, [userProfile]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      if (!userProfile?.uid) return;

      const userRef = ref(database, `users/${userProfile.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        setUserSettings({
          id: userProfile.uid,
          name: data.name || userProfile.name || "",
          avatarUrl: data.profilePicture || userProfile.profilePicture || "",
          timezone: data.timezone || "America/New_York",
          timeFormat: data.timeFormat || "12h",
        });
      } else {
        setUserSettings({
          id: userProfile.uid,
          name: userProfile.name || "",
          avatarUrl: userProfile.profilePicture || "",
          timezone: "America/New_York",
          timeFormat: "12h",
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching settings:", error);
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userProfile?.uid) return;

    try {
      setUploading(true);

      // Create a reference to the storage location
      const timestamp = Date.now();
      const ext = file.name.split(".").pop() || "jpg";
      const filename = `${userProfile.uid}-${timestamp}.${ext}`;
      const storageRef = refStorage(storage, `staff_pic/${filename}`);

      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update User Profile in Firebase with the new URL
      await update(ref(database, `users/${userProfile.uid}`), {
        profilePicture: downloadURL,
      });

      // Update local state
      setUserSettings((prev) =>
        prev ? { ...prev, avatarUrl: downloadURL } : null,
      );

      console.log("Profile picture updated:", downloadURL);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const saveUserSettings = async () => {
    if (!userSettings || !userProfile?.uid) return;

    try {
      setSaving(true);
      await update(ref(database, `users/${userProfile.uid}`), {
        name: userSettings.name,
        timezone: userSettings.timezone,
        timeFormat: userSettings.timeFormat,
      });
      console.log("User settings saved:", userSettings);
    } catch (error) {
      console.error("Error saving user settings:", error);
    } finally {
      setSaving(false);
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
          <p className="mt-1 text-sm text-gray-400">Manage your preferences.</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="bg-gray-800 border-gray-700 w-auto inline-flex">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="data-[state=active]:bg-emerald-600"
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Profile Settings
              </h3>

              {userSettings && (
                <div className="space-y-6">
                  {/* Photo Section */}
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-24 w-24 border-2 border-gray-700">
                      <AvatarImage
                        src={
                          userSettings.avatarUrl ||
                          userProfile?.profilePicture ||
                          "/placeholder-user.jpg"
                        }
                        className="object-cover"
                      />
                      <AvatarFallback className="text-xl">
                        {userSettings.name?.charAt(0) ||
                          userProfile?.name?.charAt(0) ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-2">
                      <Label
                        htmlFor="photo-upload"
                        className="cursor-pointer inline-block"
                      >
                        <div
                          className={`flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {uploading ? "Uploading..." : "Change Photo"}
                        </div>
                        <Input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                      </Label>
                      <p className="text-xs text-gray-400">
                        Upload a new profile picture. Old one will be replaced.
                      </p>
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Name Input */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={userSettings.name || ""}
                      onChange={(e) =>
                        setUserSettings({
                          ...userSettings,
                          name: e.target.value,
                        })
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Timezone */}
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={userSettings.timezone}
                        onValueChange={(value) =>
                          setUserSettings({ ...userSettings, timezone: value })
                        }
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select timezone" />
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

                    {/* Time Format */}
                    <div className="space-y-2">
                      <Label htmlFor="timeFormat">Time Format</Label>
                      <Select
                        value={userSettings.timeFormat}
                        onValueChange={(value) =>
                          setUserSettings({
                            ...userSettings,
                            timeFormat: value as "12h" | "24h",
                          })
                        }
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                          <SelectItem value="24h">24 Hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Action Button */}
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
      </Tabs>
    </div>
  );
}
