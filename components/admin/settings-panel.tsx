import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Shield, Bell, Globe } from "lucide-react"

export function SettingsPanel() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Manage your website and admin preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="p-6 glass-effect">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-emerald-500" />
              Website Settings
            </h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input id="siteName" defaultValue="HexCode" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input id="siteUrl" defaultValue="https://hexcode.dev" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  defaultValue="Innovative software development company specializing in cutting-edge web applications and digital solutions."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input id="contactEmail" defaultValue="hello@hexcode.dev" />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card className="p-6 glass-effect">
            <h3 className="text-lg font-semibold mb-4">Content Management</h3>
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Hero Section</h4>
                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Hero Title</Label>
                  <Input id="heroTitle" defaultValue="Building the Future of Software" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Textarea
                    id="heroSubtitle"
                    defaultValue="We create innovative, scalable, and secure software solutions that transform businesses and drive digital innovation."
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Company Information</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Phone Number</Label>
                    <Input id="companyPhone" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyAddress">Address</Label>
                    <Input id="companyAddress" defaultValue="San Francisco, CA" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="p-6 glass-effect">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-emerald-500" />
              Security Settings
            </h3>
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Password Settings</h4>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Security Options</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch id="twoFactor" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="loginAlerts">Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                  </div>
                  <Switch id="loginAlerts" defaultChecked />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6 glass-effect">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-emerald-500" />
              Notification Preferences
            </h3>
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Email Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newContacts">New Contact Forms</Label>
                      <p className="text-sm text-muted-foreground">Get notified when someone submits a contact form</p>
                    </div>
                    <Switch id="newContacts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="projectUpdates">Project Updates</Label>
                      <p className="text-sm text-muted-foreground">Receive updates about project changes</p>
                    </div>
                    <Switch id="projectUpdates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weeklyReports">Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Get weekly analytics and activity reports</p>
                    </div>
                    <Switch id="weeklyReports" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
