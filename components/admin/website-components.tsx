// Website Management Components with Firebase Integration - Fixed Version

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { database } from '@/lib/firebase';
import { ref, onValue, set } from 'firebase/database';
import { 
  Globe, 
  Smartphone, 
  Cloud, 
  Database as DatabaseIcon, 
  Shield, 
  Zap,
  Eye,
  EyeOff,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Star,
  TrendingUp,
  Users,
  Award,
  Settings,
  BarChart3,
  CheckCircle,
  Code,
  Package,
  DollarSign,
  FileText,
  ExternalLink,
  Github,
  Loader2
} from 'lucide-react';

// Types
interface Service {
  id?: string;
  title: string;
  description: string;
  features: string[];
  category?: string;
  isActive?: boolean;
}

interface PricingPackage {
  id?: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  popular: boolean;
  isActive?: boolean;
}

interface Stat {
  id?: string;
  title: string;
  value: string;
  description: string;
  isEditing?: boolean;
}

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
  url?: string;
  githubUrl?: string;
  isActive: boolean;
  order: number;
  client?: string;
  completedDate: string;
}

// Website Overview Component
export function WebsiteOverview() {
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch services
        const servicesResponse = await fetch("https://hexcode-website-897f4-default-rtdb.firebaseio.com/services.json");
        const servicesData = await servicesResponse.json();
        if (servicesData && Array.isArray(servicesData)) {
          setServices(servicesData);
        }

        // Fetch packages
        const packagesResponse = await fetch("https://hexcode-website-897f4-default-rtdb.firebaseio.com/pricingPackages.json");
        const packagesData = await packagesResponse.json();
        if (packagesData && Array.isArray(packagesData)) {
          setPackages(packagesData);
        }

        // Fetch stats from Firebase Realtime Database
        const statsRef = ref(database, 'analytics/overview/list');
        onValue(statsRef, (snapshot) => {
          const statsData = snapshot.val();
          if (statsData && Array.isArray(statsData)) {
            setStats(statsData);
          }
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="text-muted-foreground">Loading website data...</p>
        </div>
      </div>
    );
  }

  const activeServices = services.filter(s => s.isActive !== false).length;
  const activePackages = packages.filter(p => p.isActive !== false).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">Website Management Overview</h2>
        <p className="text-blue-100">Manage your website content, services, and portfolio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Globe className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeServices}</p>
              <p className="text-sm text-muted-foreground">Active Services</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activePackages}</p>
              <p className="text-sm text-muted-foreground">Pricing Packages</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <FileText className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">Portfolio Projects</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.length}</p>
              <p className="text-sm text-muted-foreground">Website Stats</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Website Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Services data synchronized</p>
              <p className="text-xs text-muted-foreground">{services.length} services loaded from Firebase</p>
            </div>
            <Badge variant="outline" className="text-xs">services</Badge>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Pricing packages updated</p>
              <p className="text-xs text-muted-foreground">{packages.length} packages available</p>
            </div>
            <Badge variant="outline" className="text-xs">packages</Badge>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Analytics connected</p>
              <p className="text-xs text-muted-foreground">Real-time stats monitoring active</p>
            </div>
            <Badge variant="outline" className="text-xs">analytics</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Services Management with Working CRUD
export function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [newService, setNewService] = useState<Service>({
    title: '',
    description: '',
    features: [],
    category: '',
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  const iconOptions = [
    { icon: <Globe className="w-5 h-5" />, name: 'Globe' },
    { icon: <Smartphone className="w-5 h-5" />, name: 'Smartphone' },
    { icon: <Cloud className="w-5 h-5" />, name: 'Cloud' },
    { icon: <DatabaseIcon className="w-5 h-5" />, name: 'Database' },
    { icon: <Shield className="w-5 h-5" />, name: 'Shield' },
    { icon: <Zap className="w-5 h-5" />, name: 'Zap' }
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://hexcode-website-897f4-default-rtdb.firebaseio.com/services.json");
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        const servicesWithIcons = data.map((service: any, index: number) => ({
          ...service,
          id: service.id || index.toString(),
          icon: iconOptions[index % iconOptions.length].icon,
          isActive: service.isActive !== false
        }));
        setServices(servicesWithIcons);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveServicesToFirebase = async (updatedServices: Service[]) => {
    setSaving(true);
    try {
      // Remove icon from data before saving (icon is added dynamically, not stored)
      const sanitizedServices = updatedServices.map(service => {
        const { icon, ...serviceData } = service as any;
        return serviceData;
      });
      
      const response = await fetch("https://hexcode-website-897f4-default-rtdb.firebaseio.com/services.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedServices)
      });
      
      if (response.ok) {
        await fetchServices(); // Refresh data
        return true;
      }
      throw new Error('Failed to save');
    } catch (error) {
      console.error("Error saving services:", error);
      alert("Failed to save services. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleAddService = async () => {
    if (!newService.title.trim() || !newService.description.trim()) {
      alert("Please fill in required fields");
      return;
    }

    const service: Service = {
      ...newService,
      id: Date.now().toString(),
      features: newService.features.filter(f => f.trim() !== ''),
    };

    const updatedServices = [...services, service];
    const success = await saveServicesToFirebase(updatedServices);
    
    if (success) {
      setIsAddModalOpen(false);
      setNewService({ title: '', description: '', features: [], category: '', isActive: true });
    }
  };

  const handleEditService = async () => {
    if (!selectedService) return;

    const updatedServices = services.map(s => 
      s.id === selectedService.id ? { ...selectedService, features: selectedService.features.filter(f => f.trim() !== '') } : s
    );
    
    const success = await saveServicesToFirebase(updatedServices);
    
    if (success) {
      setIsEditModalOpen(false);
      setSelectedService(null);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    const updatedServices = services.filter(s => s.id !== id);
    await saveServicesToFirebase(updatedServices);
  };

  const toggleServiceStatus = async (id: string) => {
    const updatedServices = services.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    );
    await saveServicesToFirebase(updatedServices);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Services Management</h2>
          <p className="text-muted-foreground">Manage your website services and offerings</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} disabled={saving}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <Card key={service.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="p-2 bg-emerald-500/10 rounded-lg flex-shrink-0">
                    {iconOptions[index % iconOptions.length].icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{service.title}</CardTitle>
                    <Badge variant={service.isActive ? "default" : "secondary"} className="text-xs mt-1">
                      {service.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleServiceStatus(service.id!)}
                    disabled={saving}
                  >
                    {service.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedService(service);
                      setIsEditModalOpen(true);
                    }}
                    disabled={saving}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteService(service.id!)}
                    disabled={saving}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{service.description}</p>
              {service.features && service.features.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Features:</h4>
                  <div className="space-y-1">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground truncate">{feature}</span>
                      </div>
                    ))}
                    {service.features.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{service.features.length - 3} more features
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Service Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  value={newService.title}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  placeholder="Enter service title"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newService.category || ''}
                  onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                  placeholder="Enter category"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                placeholder="Enter service description"
                rows={3}
              />
            </div>
            <div>
              <Label>Features (one per line)</Label>
              <Textarea
                value={newService.features.join('\n')}
                onChange={(e) => setNewService({ 
                  ...newService, 
                  features: e.target.value.split('\n').filter(f => f.trim()) 
                })}
                placeholder="Enter features, one per line"
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={newService.isActive !== false}
                onCheckedChange={(checked) => setNewService({ ...newService, isActive: checked })}
              />
              <Label>Active Service</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleAddService} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Add Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Service Title *</Label>
                  <Input
                    id="edit-title"
                    value={selectedService.title}
                    onChange={(e) => setSelectedService({ ...selectedService, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Input
                    id="edit-category"
                    value={selectedService.category || ''}
                    onChange={(e) => setSelectedService({ ...selectedService, category: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={selectedService.description}
                  onChange={(e) => setSelectedService({ ...selectedService, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label>Features (one per line)</Label>
                <Textarea
                  value={selectedService.features.join('\n')}
                  onChange={(e) => setSelectedService({ 
                    ...selectedService, 
                    features: e.target.value.split('\n').filter(f => f.trim()) 
                  })}
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={selectedService.isActive !== false}
                  onCheckedChange={(checked) => setSelectedService({ ...selectedService, isActive: checked })}
                />
                <Label>Active Service</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleEditService} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {saving && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center space-x-3">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Saving changes...</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Price Packages Management with Working CRUD
export function PricePackagesManagement() {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPackage, setNewPackage] = useState<PricingPackage>({
    name: '',
    price: '',
    description: '',
    features: [],
    popular: false,
    isActive: true
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://hexcode-website-897f4-default-rtdb.firebaseio.com/pricingPackages.json");
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        const packagesWithIds = data.map((pkg, index) => ({
          ...pkg,
          id: pkg.id || index.toString(),
          isActive: pkg.isActive !== false
        }));
        setPackages(packagesWithIds);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePackagesToFirebase = async (updatedPackages: PricingPackage[]) => {
    setSaving(true);
    try {
      const response = await fetch("https://hexcode-website-897f4-default-rtdb.firebaseio.com/pricingPackages.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPackages)
      });
      
      if (response.ok) {
        await fetchPackages();
        return true;
      }
      throw new Error('Failed to save');
    } catch (error) {
      console.error("Error saving packages:", error);
      alert("Failed to save packages. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleAddPackage = async () => {
    if (!newPackage.name.trim() || !newPackage.price.trim() || !newPackage.description.trim()) {
      alert("Please fill in required fields");
      return;
    }

    const packageToAdd: PricingPackage = {
      ...newPackage,
      id: Date.now().toString(),
      features: newPackage.features.filter(f => f.trim() !== '')
    };

    const updatedPackages = [...packages, packageToAdd];
    const success = await savePackagesToFirebase(updatedPackages);
    
    if (success) {
      setIsAddModalOpen(false);
      setNewPackage({
        name: '',
        price: '',
        description: '',
        features: [],
        popular: false,
        isActive: true
      });
    }
  };

  const handleUpdatePackage = async (index: number, updatedPackage: PricingPackage) => {
    const updatedPackages = [...packages];
    updatedPackages[index] = { ...updatedPackage, features: updatedPackage.features.filter(f => f.trim() !== '') };
    await savePackagesToFirebase(updatedPackages);
  };

  const handleDeletePackage = async (index: number) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    const updatedPackages = packages.filter((_, i) => i !== index);
    await savePackagesToFirebase(updatedPackages);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="text-muted-foreground">Loading pricing packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Price Packages Management</h2>
          <p className="text-muted-foreground">Manage your pricing plans and packages</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} disabled={saving}>
          <Plus className="w-4 h-4 mr-2" />
          Add Package
        </Button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg, index) => (
          <PricingPackageCard
            key={pkg.id || index}
            package={pkg}
            index={index}
            onUpdate={handleUpdatePackage}
            onDelete={handleDeletePackage}
            saving={saving}
          />
        ))}
      </div>

      {/* Add Package Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Package</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Package Name *</Label>
                <Input
                  id="name"
                  value={newPackage.name}
                  onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                  placeholder="e.g., Starter, Professional"
                />
              </div>
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  value={newPackage.price}
                  onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                  placeholder="e.g., $99, Custom"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newPackage.description}
                onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                placeholder="Package description"
                rows={3}
              />
            </div>
            <div>
              <Label>Features (one per line)</Label>
              <Textarea
                value={newPackage.features.join('\n')}
                onChange={(e) => setNewPackage({ 
                  ...newPackage, 
                  features: e.target.value.split('\n').filter(f => f.trim()) 
                })}
                placeholder="Enter features, one per line"
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newPackage.popular}
                  onCheckedChange={(checked) => setNewPackage({ ...newPackage, popular: checked })}
                />
                <Label>Popular Package</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newPackage.isActive !== false}
                  onCheckedChange={(checked) => setNewPackage({ ...newPackage, isActive: checked })}
                />
                <Label>Active Package</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleAddPackage} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Add Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {saving && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center space-x-3">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Saving changes...</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Pricing Package Card Component
function PricingPackageCard({ 
  package: pkg, 
  index, 
  onUpdate, 
  onDelete, 
  saving 
}: { 
  package: PricingPackage;
  index: number;
  onUpdate: (index: number, pkg: PricingPackage) => void;
  onDelete: (index: number) => void;
  saving: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPackage, setEditedPackage] = useState<PricingPackage>(pkg);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    setEditedPackage(pkg);
  }, [pkg]);

  const handleSave = () => {
    onUpdate(index, editedPackage);
    setIsEditing(false);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setEditedPackage({
        ...editedPackage,
        features: [...editedPackage.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (featureIndex: number) => {
    setEditedPackage({
      ...editedPackage,
      features: editedPackage.features.filter((_, i) => i !== featureIndex)
    });
  };

  return (
    <Card className={`relative ${pkg.popular ? 'ring-2 ring-blue-500' : ''}`}>
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-blue-500 text-white px-3 py-1">
            <Star className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editedPackage.name}
                  onChange={(e) => setEditedPackage({ ...editedPackage, name: e.target.value })}
                  className="text-center font-bold"
                />
                <div className="flex items-center justify-center space-x-1">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <Input
                    value={editedPackage.price.replace('$', '')}
                    onChange={(e) => setEditedPackage({ ...editedPackage, price: `$${e.target.value}` })}
                    className="text-center font-bold w-20"
                  />
                </div>
              </div>
            ) : (
              <div>
                <CardTitle className="text-xl">{pkg.name}</CardTitle>
                <div className="flex items-center justify-center mt-2">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  <span className="text-2xl font-bold">{pkg.price.replace('$', '')}</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex space-x-1">
            {isEditing ? (
              <>
                <Button variant="ghost" size="sm" onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={saving}>
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} disabled={saving}>
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(index)} disabled={saving}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isEditing ? (
          <Textarea
            value={editedPackage.description}
            onChange={(e) => setEditedPackage({ ...editedPackage, description: e.target.value })}
            className="text-center resize-none"
            rows={2}
          />
        ) : (
          <p className="text-center text-muted-foreground">{pkg.description}</p>
        )}

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Features:</h4>
          <div className="space-y-1">
            {(isEditing ? editedPackage.features : pkg.features).map((feature, featureIndex) => (
              <div key={featureIndex} className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                {isEditing ? (
                  <div className="flex items-center space-x-1 flex-1">
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const updatedFeatures = [...editedPackage.features];
                        updatedFeatures[featureIndex] = e.target.value;
                        setEditedPackage({ ...editedPackage, features: updatedFeatures });
                      }}
                      className="text-sm h-8"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(featureIndex)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-muted-foreground">{feature}</span>
                )}
              </div>
            ))}
            
            {isEditing && (
              <div className="flex space-x-1">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add new features"
                  className="text-sm h-8"
                  onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                />
                <Button variant="outline" size="sm" onClick={addFeature} className="h-8">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <Switch
                checked={editedPackage.popular}
                onCheckedChange={(checked) => setEditedPackage({ ...editedPackage, popular: checked })}
              />
              <Label className="text-sm">Popular</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={editedPackage.isActive !== false}
                onCheckedChange={(checked) => setEditedPackage({ ...editedPackage, isActive: checked })}
              />
              <Label className="text-sm">Active</Label>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Website Stats Management
export function WebsiteStats() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const defaultStats = [
    { title: "Projects Completed", value: "20+", description: "Successful software projects delivered" },
    { title: "Happy Clients", value: "10+", description: "Businesses we've helped grow" },
    { title: "Years Experience", value: "2+", description: "Years of software development expertise" },
    { title: "Uptime", value: "99%", description: "Average application uptime" },
    { title: "Technologies", value: "15+", description: "Modern tech stack mastery" },
    { title: "Secure", value: "100%", description: "Security-first development approach" }
  ];

  useEffect(() => {
    const statsRef = ref(database, 'analytics/overview/list');
    const unsubscribe = onValue(statsRef, (snapshot) => {
      const data = snapshot.val();
      if (data && Array.isArray(data)) {
        setStats(data);
      } else {
        setStats(defaultStats);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveStatsToFirebase = async () => {
    setSaving(true);
    try {
      const statsRef = ref(database, 'analytics/overview/list');
      await set(statsRef, stats);
      alert("Stats saved successfully!");
    } catch (error) {
      console.error("Error saving stats:", error);
      alert("Failed to save stats. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const updateStat = (index: number, field: keyof Stat, value: string) => {
    const updatedStats = [...stats];
    (updatedStats[index] as any)[field] = value;
    setStats(updatedStats);
  };

  const addStat = () => {
    const newStat: Stat = {
      title: "New Stat",
      value: "0",
      description: "New statistic description"
    };
    setStats([...stats, newStat]);
  };

  const deleteStat = (index: number) => {
    if (confirm("Are you sure you want to delete this statistic?")) {
      const updatedStats = stats.filter((_, i) => i !== index);
      setStats(updatedStats);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="text-muted-foreground">Loading website statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Website Statistics</h2>
          <p className="text-muted-foreground">Manage your website performance metrics and stats</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={addStat} variant="outline" disabled={saving}>
            <Plus className="w-4 h-4 mr-2" />
            Add Stat
          </Button>
          <Button onClick={saveStatsToFirebase} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <BarChart3 className="w-5 h-5 text-emerald-500" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteStat(index)}
                disabled={saving}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <Input
                value={stat.value}
                onChange={(e) => updateStat(index, 'value', e.target.value)}
                className="text-2xl font-bold text-center"
                placeholder="Value"
              />
              
              <Input
                value={stat.title}
                onChange={(e) => updateStat(index, 'title', e.target.value)}
                className="font-medium text-center"
                placeholder="Title"
              />
              
              <Textarea
                value={stat.description}
                onChange={(e) => updateStat(index, 'description', e.target.value)}
                className="text-sm text-muted-foreground text-center resize-none"
                rows={2}
                placeholder="Description"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Placeholder components for other sections
export function PortfolioManagement() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Portfolio Management</h2>
          <p className="text-muted-foreground">Manage your portfolio projects and showcases</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>
      
      <div className="text-center py-20">
        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Portfolio Management</h3>
        <p className="text-muted-foreground">Portfolio management features coming soon...</p>
      </div>
    </div>
  );
}

export function ContentManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Content Management</h2>
        <p className="text-muted-foreground">Manage website content, pages, and media</p>
      </div>
      
      <div className="text-center py-20">
        <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Content Management</h3>
        <p className="text-muted-foreground">Content management features coming soon...</p>
      </div>
    </div>
  );
}

export function WebsiteSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Website Settings</h2>
        <p className="text-muted-foreground">Configure website settings and preferences</p>
      </div>
      
      <div className="text-center py-20">
        <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Website Settings</h3>
        <p className="text-muted-foreground">Settings panel coming soon...</p>
      </div>
    </div>
  );
}