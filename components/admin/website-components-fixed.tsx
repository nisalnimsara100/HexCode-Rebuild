// Website Management Components with Firebase Integration - Fixed Version

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { database } from '@/lib/firebase';
import { ref, onValue, set, get } from 'firebase/database';
import { uploadProfileImage, createImagePreview, validateImageFile } from '@/lib/imageUpload';
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
  Calendar,
  Loader2,
  Tag,
  Image as ImageIcon
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
  image?: string;
  images?: string[]; // Support both formats
  technologies: string[];
  category: string;
  url?: string;
  githubUrl?: string;
  isActive: boolean;
  order: number;
  client?: string;
  completedDate: string;
}

// Define the type for items
interface Item {
  id: number;
  title: string;
  description: string;
  image: string;
  previews: string[];
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
  const [newFeature, setNewFeature] = useState('');
  const [uploading, setUploading] = useState(false);

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
              <Label>Features</Label>
              <div className="space-y-1">
                {newService.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const updatedFeatures = [...newService.features];
                        updatedFeatures[index] = e.target.value;
                        setNewService({ ...newService, features: updatedFeatures });
                      }}
                      placeholder="Enter feature"
                      className="text-sm h-8"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updatedFeatures = newService.features.filter((_, i) => i !== index);
                        setNewService({ ...newService, features: updatedFeatures });
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex space-x-1">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add new feature"
                    className="text-sm h-8"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newFeature.trim()) {
                        setNewService({ ...newService, features: [...newService.features, newFeature.trim()] });
                        setNewFeature('');
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (newFeature.trim()) {
                        setNewService({ ...newService, features: [...newService.features, newFeature.trim()] });
                        setNewFeature('');
                      }
                    }}
                    className="h-8"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
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
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                // Note: resetImageUpload not available in this component scope
              }}
              disabled={saving || uploading}
            >
              Cancel
            </Button>
            <Button onClick={handleAddService} disabled={saving || uploading}>
              {(saving || uploading) ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {uploading ? 'Uploading...' : saving ? 'Saving...' : 'Add Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loading Overlay */}
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
  const [newFeature, setNewFeature] = useState('');
  const [uploading, setUploading] = useState(false);

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
    // Validate required fields
    const requiredFields = [
      { value: newPackage.name.trim(), name: 'name' },
      { value: newPackage.price.trim(), name: 'price' },
      { value: newPackage.description.trim(), name: 'description' }
    ];
    
    const missingFields = requiredFields.filter(field => !field.value);
    
    if (missingFields.length > 0) {
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
            <div>
              <Label htmlFor="package-name">Package Name</Label>
              <Input
                id="package-name"
                value={newPackage.name}
                onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                placeholder="Enter package name"
              />
            </div>
            <div>
              <Label htmlFor="package-price">Price</Label>
              <Input
                id="package-price"
                type="number" // Restrict input to numbers only
                value={newPackage.price}
                onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                placeholder="Enter package price"
              />
            </div>
            <div>
              <Label htmlFor="package-description">Description</Label>
              <Textarea
                id="package-description"
                value={newPackage.description}
                onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                placeholder="Enter package description"
                rows={3}
              />
            </div>
            <div>
              <Label>Features</Label>
              <div className="space-y-1">
                {newPackage.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const updatedFeatures = [...newPackage.features];
                        updatedFeatures[index] = e.target.value;
                        setNewPackage({ ...newPackage, features: updatedFeatures });
                      }}
                      placeholder="Enter feature"
                      className="text-sm h-8"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updatedFeatures = newPackage.features.filter((_, i) => i !== index);
                        setNewPackage({ ...newPackage, features: updatedFeatures });
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex space-x-1">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add new feature"
                    className="text-sm h-8"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newFeature.trim()) {
                        setNewPackage({ ...newPackage, features: [...newPackage.features, newFeature.trim()] });
                        setNewFeature('');
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (newFeature.trim()) {
                        setNewPackage({ ...newPackage, features: [...newPackage.features, newFeature.trim()] });
                        setNewFeature('');
                      }
                    }}
                    className="h-8"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={newPackage.popular}
                onCheckedChange={(checked) => setNewPackage({ ...newPackage, popular: checked })}
              />
              <Label>Popular</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={newPackage.isActive}
                onCheckedChange={(checked) => setNewPackage({ ...newPackage, isActive: checked })}
              />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPackage}>
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
}): JSX.Element {
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

  const renderHeader = () => {
    return (
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
    );
  };

  const renderContent = () => {
    return (
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
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newFeature.trim()) {
                        addFeature();
                      }
                    }}
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
      );
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
        
        {renderHeader()}

        {renderContent()}
      </Card>
    );
  }

// Stats Edit Card Component
function StatEditCard({ stat, index, onUpdate, onDelete }: {
  stat: Stat;
  index: number;
  onUpdate: (index: number, field: keyof Stat, value: string) => void;
  onDelete: (index: number) => void;
}) {
  return (
    <Card key={index} className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="text-sm text-muted-foreground">Stat #{index + 1}</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(index)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-3">
        <Input
          value={stat.value}
          onChange={(e) => onUpdate(index, 'value', e.target.value)}
          className="text-2xl font-bold text-center"
          placeholder="Value"
        />
        
        <Input
          value={stat.title}
          onChange={(e) => onUpdate(index, 'title', e.target.value)}
          className="font-medium text-center"
          placeholder="Title"
        />
        
        <Textarea
          value={stat.description}
          onChange={(e) => onUpdate(index, 'description', e.target.value)}
          className="text-sm text-muted-foreground text-center resize-none"
          rows={2}
          placeholder="Description"
        />
      </div>
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
          <StatEditCard
            key={index}
            stat={stat}
            index={index}
            onUpdate={updateStat}
            onDelete={deleteStat}
          />
        ))}
      </div>
    </div>
  );
}

// Utility function to normalize image paths
const normalizeImagePath = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it starts with /projects/, it means the database path, return as is (Next.js serves from public)
  if (imagePath.startsWith('/projects/')) {
    return imagePath;
  }
  
  // If it starts with /images/projects/, convert to /projects/
  if (imagePath.startsWith('/images/projects/')) {
    return imagePath.replace('/images/projects/', '/projects/');
  }
  
  // Handle paths that start with just /
  if (imagePath.startsWith('/') && !imagePath.startsWith('/projects/')) {
    return `/projects${imagePath}`;
  }
  
  // If it's just a filename, add the /projects/ prefix
  if (!imagePath.startsWith('/')) {
    return `/projects/${imagePath}`;
  }
  
  return imagePath;
};

// Utility function for safe date formatting
const formatProjectDate = (dateString: string): string => {
  if (!dateString) return 'No date';
  
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid date';
  }
};

// Portfolio Management with Full CRUD Operations
export function PortfolioManagement() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [newProject, setNewProject] = useState<Partial<PortfolioProject>>({
    title: '',
    description: '',
    image: '',
    technologies: [],
    category: '',
    url: '',
    githubUrl: '',
    isActive: true,
    order: 0,
    client: '',
    completedDate: new Date().toISOString().split('T')[0]
  });
  const [newTechnology, setNewTechnology] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editImageFiles, setEditImageFiles] = useState<File[]>([]);
  const [editImagePreviews, setEditImagePreviews] = useState<string[]>([]);
  
  // Category management state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // Enhanced modal state - similar to project management
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [newItem, setNewItem] = useState<Item>({
    id: 0,
    title: '',
    description: '',
    image: '',
    previews: [],
  });
  const [items, setItems] = useState<Item[]>([]);
  const [newItemImageFiles, setNewItemImageFiles] = useState<File[]>([]);
  const [newItemImagePreviews, setNewItemImagePreviews] = useState<string[]>([]);
  const [editItemImageFiles, setEditItemImageFiles] = useState<File[]>([]);
  const [editItemImagePreviews, setEditItemImagePreviews] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Utility function to reset image uploads
  const resetImageUpload = () => {
    setImageFiles([]);
    setImagePreviews([]);
  };

  useEffect(() => {
    const projectsRef = ref(database, 'allProjects');
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const projectsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          // Ensure isActive has a default value
          isActive: data[key].isActive !== undefined ? data[key].isActive : true
        }));
        // Sort by order or creation date
        projectsArray.sort((a, b) => (a.order || 0) - (b.order || 0));
        console.log('Portfolio projects loaded:', projectsArray.length);
        setProjects(projectsArray);
      } else {
        console.log('No projects found in allProjects collection');
        setProjects([]);
      }
      
      // Log the raw Firebase data for debugging
      console.log('Raw Firebase data:', data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Extract categories from both projects and Firebase categories collection
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch categories from Firebase categories collection
        const categoriesRef = ref(database, 'projectCategories');
        const firebaseCategories: string[] = [];
        
        const snapshot = await get(categoriesRef);
        if (snapshot.exists()) {
          Object.values(snapshot.val()).forEach((cat: any) => {
            if (cat.name && cat.isActive !== false) {
              firebaseCategories.push(cat.name);
            }
          });
        }

        // Extract categories from existing projects
        const projectCategories = projects
          .map(project => project.category)
          .filter((category): category is string => Boolean(category && category.trim()))
          .filter((category, index, array) => array.indexOf(category) === index) // Remove duplicates
          .sort(); // Sort alphabetically

        // Always include default categories
        const defaultCategories = ['Web App', 'Mobile App', 'Desktop App', 'API', 'Other'];
        
        // Combine all categories and remove duplicates
        const allCategories = [...new Set([...defaultCategories, ...projectCategories, ...firebaseCategories])].sort();
        
        setCategories(allCategories);
        console.log('Categories loaded from all sources:', allCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to default categories if fetch fails
        const defaultCategories = ['Web App', 'Mobile App', 'Desktop App', 'API', 'Other'];
        setCategories(defaultCategories);
      }
    };

    fetchCategories();
  }, [projects]); // Re-run when projects change to pick up new categories

  const saveProjectToFirebase = async (projectData: Partial<PortfolioProject>, projectId?: string) => {
    setSaving(true);
    try {
      // Generate a more unique ID to prevent duplicates
      const uniqueId = projectId || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const projectRef = ref(database, `allProjects/${uniqueId}`);
      
      // Ensure the project has the correct ID
      const projectWithId = { ...projectData, id: uniqueId };
      
      await set(projectRef, projectWithId);
      return true;
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Refactor the handleAddProject method
  const handleAddProject = async () => {
    const validateInputs = () => {
      if (!newProject.title?.trim() || !newProject.description?.trim()) {
        alert("Please fill in required fields (title and description)");
        return false;
      }
      return true;
    };

    const saveProject = async () => {
      const projectImages = await uploadImagesIfNeeded(imageFiles);
      if (!projectImages) return;

      const allImages = combineImages(newProject, projectImages);

      const projectToAdd = {
        ...newProject,
        images: allImages,
        image: allImages.length > 0 ? allImages[0] : undefined,
        technologies: newProject.technologies?.filter(tech => tech.trim() !== '') || [],
        order: projects.length,
        createdAt: new Date().toISOString()
      };

      const success = await saveProjectToFirebase(projectToAdd);
      if (success) {
        resetAddProjectState();
      }
    };

    if (validateInputs()) {
      await saveProject();
    }
  };

  const handleEditProject = async () => {
    if (!selectedProject) return;

    let newImages: string[] = [];
    
    // Upload new images if files are selected
    if (editImageFiles.length > 0) {
      const uploadedImageUrls = await uploadProjectImages();
      if (uploadedImageUrls.length > 0) {
        newImages = uploadedImageUrls;
      } else {
        alert("Failed to upload new images. Please try again.");
        return;
      }
    }
    
    // Combine existing images with new images
    const existingImages = selectedProject.images || [];
    if (selectedProject.image && !existingImages.length) {
      existingImages.push(selectedProject.image);
    }
    const allImages = [...existingImages, ...newImages];

    const updatedProject = {
      ...selectedProject,
      images: allImages,
      image: allImages.length > 0 ? allImages[0] : undefined, // Keep backward compatibility
      technologies: selectedProject.technologies.filter(tech => tech.trim() !== ''),
      updatedAt: new Date().toISOString()
    };

    const success = await saveProjectToFirebase(updatedProject, selectedProject.id);
    
    if (success) {
      setIsEditModalOpen(false);
      setSelectedProject(null);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setSaving(true);
    try {
      const projectRef = ref(database, `allProjects/${projectId}`);
      await set(projectRef, null);
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleProjectStatus = async (projectId: string, currentStatus: boolean) => {
    setSaving(true);
    try {
      const projectRef = ref(database, `allProjects/${projectId}/isActive`);
      await set(projectRef, !currentStatus);
    } catch (error) {
      console.error("Error updating project status:", error);
      alert("Failed to update project status.");
    } finally {
      setSaving(false);
    }
  };

  const addTechnology = (technologies: string[], setTechnologies: (techs: string[]) => void) => {
    if (newTechnology.trim() && !technologies.includes(newTechnology.trim())) {
      setTechnologies([...technologies, newTechnology.trim()]);
      setNewTechnology('');
    }
  };

  const removeTechnology = (technologies: string[], setTechnologies: (techs: string[]) => void, index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index));
  };

  const handleImageSelection = async (files: FileList | null, setImageFiles: Function, setImagePreviews: Function) => {
    if (!files) return;
    const fileArray = Array.from(files);
    setImageFiles(fileArray);
    const previewArray = fileArray.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewArray);
  };

  const handleImageSelect = (files: FileList | null) => {
    handleImageSelection(files, setImageFiles, setImagePreviews);
  };

  const handleEditImageSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        alert(`File ${file.name}: ${validation.error}`);
        continue;
      }

      newFiles.push(file);
      try {
        const preview = await createImagePreview(file);
        newPreviews.push(preview);
      } catch (error) {
        console.error('Error creating image preview:', error);
        newPreviews.push('');
      }
    }

    setEditImageFiles([...editImageFiles, ...newFiles]);
    setEditImagePreviews([...editImagePreviews, ...newPreviews]);
  };

  const uploadProjectImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];

    setUploading(true);
    const uploadedUrls: string[] = [];
    
    try {
      for (const file of imageFiles) {
        // Create a unique filename for each image
        const timestamp = Date.now() + Math.random();
        const fileExtension = file.name.split('.').pop();
        const fileName = `project_${timestamp}.${fileExtension}`;
        
        // Create form data for this file
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', fileName);
        formData.append('folder', 'projects');
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const result = await response.json();
        // The API returns /images/projects/filename.jpg, but we want to store /projects/filename.jpg
        uploadedUrls.push(result.path.replace('/images/projects/', '/projects/'));
      }

      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
      return [];
    } finally {
      setUploading(false);
    }
  };

  // Function to upload images if needed
  const uploadImagesIfNeeded = async (files: File[]): Promise<string[]> => {
    if (!files.length) return [];

    try {
      setUploading(true);
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          // Simulate image upload logic
          const uploadUrl = `/projects/${file.name}`; // Replace with actual upload logic
          return uploadUrl;
        })
      );
      return uploadedUrls;
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
      return [];
    } finally {
      setUploading(false);
    }
  };

  // Function to combine new and existing images
  const combineImages = (project: Partial<PortfolioProject>, newImages: string[]): string[] => {
    const existingImages = project.images || [];
    return [...existingImages, ...newImages];
  };

  // Function to reset the add project state
  const resetAddProjectState = () => {
    setNewProject({
      title: '',
      description: '',
      image: '',
      technologies: [],
      category: '',
      url: '',
      githubUrl: '',
      isActive: true,
      order: 0,
      client: '',
      completedDate: new Date().toISOString().split('T')[0]
    });
    resetImageUpload();
    setIsAddModalOpen(false);
  };

  // Category management functions
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    if (categories.includes(newCategoryName.trim())) {
      alert('Category already exists');
      return;
    }

    const categoryToAdd = newCategoryName.trim();
    
    try {
      // Save category to Firebase categories collection to persist it
      const categoryRef = ref(database, `projectCategories/${categoryToAdd.replace(/[.#$[\]]/g, '_')}`);
      await set(categoryRef, {
        name: categoryToAdd,
        createdAt: new Date().toISOString(),
        isActive: true
      });

      // Update local categories immediately
      const updatedCategories = [...categories, categoryToAdd].sort();
      setCategories(updatedCategories);
      setNewCategoryName('');
      setShowAddCategory(false);
      
      // Set the new category as selected in the appropriate project
      if (isEditModalOpen && selectedProject) {
        setSelectedProject(prev => prev ? { ...prev, category: categoryToAdd } : null);
      } else {
        setNewProject(prev => ({ ...prev, category: categoryToAdd }));
      }
      
      console.log('New category added and saved to Firebase:', categoryToAdd);
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');
    }
  };

  const handleEditCategory = async (oldCategory: string, newCategory: string) => {
    if (!newCategory.trim()) {
      alert('Please enter a category name');
      return;
    }

    if (oldCategory === newCategory.trim()) {
      return; // No change needed
    }

    if (categories.includes(newCategory.trim())) {
      alert('Category already exists');
      return;
    }

    try {
      // Update all projects that use this category directly in Firebase
      const projectsToUpdate = projects.filter(project => project.category === oldCategory);
      
      if (projectsToUpdate.length > 0) {
        for (const project of projectsToUpdate) {
          // Update project directly in Firebase using existing ID
          const projectRef = ref(database, `allProjects/${project.id}`);
          await set(projectRef, { ...project, category: newCategory.trim() });
        }
      }

      // Update local categories immediately
      const updatedCategories = categories
        .map(cat => cat === oldCategory ? newCategory.trim() : cat)
        .sort();
      setCategories(updatedCategories);

      console.log('Category updated:', oldCategory, 'to', newCategory.trim());
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryToDelete: string) => {
    if (!confirm(`Are you sure you want to delete the category "${categoryToDelete}"? This will remove the category from all projects using it.`)) {
      return;
    }

    try {
      // Update all projects that use this category directly in Firebase
      const projectsToUpdate = projects.filter(project => project.category === categoryToDelete);
      
      if (projectsToUpdate.length > 0) {
        for (const project of projectsToUpdate) {
          // Update project directly in Firebase using existing ID
          const projectRef = ref(database, `allProjects/${project.id}`);
          await set(projectRef, { ...project, category: '' });
        }
      }

      // Update local categories immediately
      const updatedCategories = categories.filter(cat => cat !== categoryToDelete);
      setCategories(updatedCategories);

      console.log('Category deleted:', categoryToDelete);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const handleEditModalOpen = (project: PortfolioProject) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    if (
      isEditModalOpen &&
      selectedProject &&
      !categories.includes(selectedProject.category || '')
    ) {
      setSelectedProject((prev) => {
        if (prev && prev.category !== '') {
          return { ...prev, category: '' };
        }
        return prev; // Avoid unnecessary updates
      });
    }
  }, [isEditModalOpen, selectedProject, categories]);

  // Migration function to fix duplicate project IDs in database
  const fixDuplicateProjectIds = async () => {
    if (!confirm('This will fix duplicate project IDs in the database. This action cannot be undone. Continue?')) {
      return;
    }

    try {
      setSaving(true);
      const projectsRef = ref(database, 'allProjects');
      const snapshot = await get(projectsRef);
      
      if (!snapshot.exists()) {
        alert('No projects found in database');
        return;
      }

      const projectsData = snapshot.val();
      const projectEntries = Object.entries(projectsData);
      const seenIds = new Set<string>();
      const duplicates: Array<{key: string, project: any}> = [];

      // Find duplicates
      projectEntries.forEach(([key, project]: [string, any]) => {
        if (project.id && seenIds.has(project.id)) {
          duplicates.push({key, project});
        } else if (project.id) {
          seenIds.add(project.id);
        }
      });

      console.log('Found duplicate projects:', duplicates);

      if (duplicates.length === 0) {
        alert('No duplicate project IDs found');
        return;
      }

      // Fix duplicates by assigning new unique IDs
      for (const {key, project} of duplicates) {
        const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newProjectRef = ref(database, `allProjects/${newId}`);
        
        // Create new project with unique ID
        await set(newProjectRef, { ...project, id: newId });
        
        // Delete old duplicate
        const oldProjectRef = ref(database, `allProjects/${key}`);
        await set(oldProjectRef, null);
        
        console.log(`Fixed duplicate: ${project.id} -> ${newId}`);
      }

      alert(`Fixed ${duplicates.length} duplicate project IDs`);
    } catch (error) {
      console.error('Error fixing duplicate IDs:', error);
      alert('Failed to fix duplicate IDs');
    } finally {
      setSaving(false);
    }
  };

  const renderEditModal = () => {
    if (!selectedProject) return null;

    const addTechnologyToEdit = () => {
      if (newTechnology.trim() && !selectedProject.technologies.includes(newTechnology.trim())) {
        setSelectedProject({
          ...selectedProject,
          technologies: [...selectedProject.technologies, newTechnology.trim()]
        });
        setNewTechnology('');
      }
    };

    const removeTechnologyFromEdit = (index: number) => {
      setSelectedProject({
        ...selectedProject,
        technologies: selectedProject.technologies.filter((_, i) => i !== index)
      });
    };

    return (
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Project Title *</Label>
                  <Input
                    id="edit-title"
                    value={selectedProject.title}
                    onChange={(e) => setSelectedProject({ ...selectedProject, title: e.target.value })}
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <div className="flex gap-2">
                    <Select 
                      value={selectedProject.category || ''} 
                      onValueChange={(value) => setSelectedProject({ ...selectedProject, category: value })}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddCategory(true)}
                      disabled={saving}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {/* Add New Category */}
                  {showAddCategory && (
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Enter new category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddCategory}
                        disabled={!newCategoryName.trim()}
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowAddCategory(false);
                          setNewCategoryName('');
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={selectedProject.description}
                  onChange={(e) => setSelectedProject({ ...selectedProject, description: e.target.value })}
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>

              {/* Current Project Images */}
              <div>
                <Label>Project Images</Label>
                <div className="space-y-4">
                  {/* Current Images Display */}
                  {(selectedProject.images && selectedProject.images.length > 0) || selectedProject.image ? (
                    <div className="mb-4">
                      <Label className="text-sm font-medium">Current Images</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {/* Show existing images */}
                        {selectedProject.images && selectedProject.images.length > 0 ? (
                          selectedProject.images.map((image, index) => (
                            <div key={index} className="relative">
                              <div className="w-full h-32 bg-muted rounded-lg overflow-hidden border">
                                <img
                                  src={normalizeImagePath(image)}
                                  alt={`Project ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    console.error('Image load error:', image);
                                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                                  }}
                                />
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => {
                                  const updatedImages = selectedProject.images?.filter((_, i) => i !== index) || [];
                                  setSelectedProject({
                                    ...selectedProject,
                                    images: updatedImages,
                                    image: updatedImages.length > 0 ? updatedImages[0] : ''
                                  });
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))
                        ) : selectedProject.image ? (
                          <div className="relative">
                            <div className="w-full h-32 bg-muted rounded-lg overflow-hidden border">
                              <img
                                src={normalizeImagePath(selectedProject.image)}
                                alt="Project"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error('Image load error:', selectedProject.image);
                                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                                }}
                              />
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0"
                              onClick={() => {
                                setSelectedProject({
                                  ...selectedProject,
                                  image: '',
                                  images: []
                                });
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {/* Add New Images */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleEditImageSelect(e.target.files)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditImageFiles([]);
                          setEditImagePreviews([]);
                        }}
                        disabled={editImageFiles.length === 0}
                      >
                        Clear
                      </Button>
                    </div>
                    
                    {/* New Images Preview */}
                    {editImagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {editImagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <div className="w-full h-32 bg-muted rounded-lg overflow-hidden border border-green-200">
                              <img
                                src={preview}
                                alt={`New ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0"
                              onClick={() => {
                                const newFiles = editImageFiles.filter((_, i) => i !== index);
                                const newPreviews = editImagePreviews.filter((_, i) => i !== index);
                                setEditImageFiles(newFiles);
                                setEditImagePreviews(newPreviews);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <Badge className="absolute bottom-1 left-1 text-xs bg-green-500">
                              New
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <Label>Technologies</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add technology (e.g. React, Node.js)"
                      value={newTechnology}
                      onChange={(e) => setNewTechnology(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTechnologyToEdit()}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTechnologyToEdit}
                      disabled={!newTechnology.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTechnologyFromEdit(index)}
                            className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="edit-client">Client</Label>
                <Input
                  id="edit-client"
                  value={selectedProject.client || ''}
                  onChange={(e) => setSelectedProject({ ...selectedProject, client: e.target.value })}
                  placeholder="Client name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-url">Project URL</Label>
                  <Input
                    id="edit-url"
                    type="url"
                    value={selectedProject.url || ''}
                    onChange={(e) => setSelectedProject({ ...selectedProject, url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-github">GitHub URL</Label>
                  <Input
                    id="edit-github"
                    type="url"
                    value={selectedProject.githubUrl || ''}
                    onChange={(e) => setSelectedProject({ ...selectedProject, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-date">Completion Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={selectedProject.completedDate || ''}
                    onChange={(e) => setSelectedProject({ ...selectedProject, completedDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-order">Display Order</Label>
                  <Input
                    id="edit-order"
                    type="number"
                    value={selectedProject.order || 0}
                    onChange={(e) => setSelectedProject({ ...selectedProject, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    checked={selectedProject.isActive !== false}
                    onCheckedChange={(checked) => setSelectedProject({ ...selectedProject, isActive: checked })}
                  />
                  <Label>Active Project</Label>
                </div>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span className="text-sm text-blue-700">Uploading images...</span>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditModalOpen(false);
                setEditImageFiles([]);
                setEditImagePreviews([]);
              }}
              disabled={saving || uploading}
            >
              Cancel
            </Button>
            <Button onClick={handleEditProject} disabled={saving || uploading}>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const renderNewModal = () => (
    <Dialog open={isNewModalOpen} onOpenChange={setIsNewModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Title and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-title">Title *</Label>
              <Input
                id="new-title"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="Enter item title"
              />
            </div>
            <div>
              <Label htmlFor="new-category">Category</Label>
              <div className="flex space-x-2">
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: string, index: number) => (
                      <SelectItem key={index} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddCategory(!showAddCategory)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {showAddCategory && (
                <div className="mt-2 p-3 border rounded-lg space-y-2">
                  <Input
                    placeholder="New category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleAddCategory}>
                      Add Category
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setShowAddCategory(false);
                        setNewCategoryName('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="new-description">Description *</Label>
            <Textarea
              id="new-description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              placeholder="Enter item description"
              rows={3}
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label htmlFor="new-image">Upload Images</Label>
            <Input
              id="new-image"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleNewItemImageSelect(e.target.files)}
            />
            {newItemImagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {newItemImagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImagePreview(index, false)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Upload multiple images (Max 10MB each, JPEG, PNG, GIF, WebP supported)
            </p>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span className="text-sm text-blue-700">Uploading images...</span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              setIsNewModalOpen(false);
              resetNewItemForm();
            }}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button onClick={handleAddItem} disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Reset form helper function
  const resetNewItemForm = () => {
    setNewItem({ id: 0, title: '', description: '', image: '', previews: [] });
    setSelectedCategory('');
    setNewItemImageFiles([]);
    setNewItemImagePreviews([]);
    setShowAddCategory(false);
    setNewCategoryName('');
  };

  // Reset edit form helper function
  const resetEditItemForm = () => {
    setSelectedItem(null);
    setEditItemImageFiles([]);
    setEditItemImagePreviews([]);
  };

  // Enhanced add item with validation and image upload
  const handleAddItem = async () => {
    if (!newItem.title.trim() || !newItem.description.trim()) {
      alert('Please fill in all required fields (title and description).');
      return;
    }

    try {
      // Simulate image upload (in real app, you'd upload to server)
      const imageUrls = newItemImageFiles.map((file, index) => 
        `/uploads/items/${Date.now()}_${index}_${file.name}`
      );

      const newItemToAdd: Item = {
        ...newItem,
        id: Date.now(),
        previews: imageUrls,
        image: imageUrls.length > 0 ? imageUrls[0] : '',
      };

      // Add category if selected
      if (selectedCategory) {
        (newItemToAdd as any).category = selectedCategory;
      }

      const updatedItems = [...items, newItemToAdd];
      setItems(updatedItems);
      
      // Reset form and close modal
      resetNewItemForm();
      setIsNewModalOpen(false);
      
      alert('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Please try again.');
    }
  };

  // Enhanced edit item
  const handleEditItem = async () => {
    if (!selectedItem) return;

    if (!selectedItem.title.trim() || !selectedItem.description.trim()) {
      alert('Please fill in all required fields (title and description).');
      return;
    }

    try {
      // Simulate new image upload if any
      let newImageUrls: string[] = [];
      if (editItemImageFiles.length > 0) {
        newImageUrls = editItemImageFiles.map((file, index) => 
          `/uploads/items/${Date.now()}_${index}_${file.name}`
        );
      }

      // Combine existing and new images
      const allImages = [...(selectedItem.previews || []), ...newImageUrls];

      const updatedItem: Item = {
        ...selectedItem,
        previews: allImages,
        image: allImages.length > 0 ? allImages[0] : selectedItem.image,
      };

      const updatedItems = items.map(item => 
        item.id === selectedItem.id ? updatedItem : item
      );
      setItems(updatedItems);
      
      // Reset form and close modal
      resetEditItemForm();
      setIsEditItemModalOpen(false);
      
      alert('Item updated successfully!');
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item. Please try again.');
    }
  };

  // Enhanced delete item with confirmation
  const handleDeleteItem = (id: number) => {
    const itemToDelete = items.find(item => item.id === id);
    if (!itemToDelete) return;

    if (confirm(`Are you sure you want to delete "${itemToDelete.title}"?`)) {
      const updatedItems = items.filter((item) => item.id !== id);
      setItems(updatedItems);
      alert('Item deleted successfully!');
    }
  };

  // Open edit modal
  const handleEditItemModalOpen = (item: Item) => {
    setSelectedItem(item);
    setSelectedCategory((item as any).category || '');
    setIsEditItemModalOpen(true);
  };

  // Image validation helper function
  const validateImageFile = (file: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' };
    }
    
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size too large. Maximum size is 10MB.' };
    }
    
    return { isValid: true, error: null };
  };

  // Image preview helper function
  const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle new item image selection
  const handleNewItemImageSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        alert(`File ${file.name}: ${validation.error}`);
        continue;
      }

      newFiles.push(file);
      try {
        const preview = await createImagePreview(file);
        newPreviews.push(preview);
      } catch (error) {
        console.error('Error creating image preview:', error);
        newPreviews.push('');
      }
    }

    setNewItemImageFiles([...newItemImageFiles, ...newFiles]);
    setNewItemImagePreviews([...newItemImagePreviews, ...newPreviews]);
  };

  // Handle edit item image selection
  const handleEditItemImageSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        alert(`File ${file.name}: ${validation.error}`);
        continue;
      }

      newFiles.push(file);
      try {
        const preview = await createImagePreview(file);
        newPreviews.push(preview);
      } catch (error) {
        console.error('Error creating image preview:', error);
        newPreviews.push('');
      }
    }

    setEditItemImageFiles([...editItemImageFiles, ...newFiles]);
    setEditItemImagePreviews([...editItemImagePreviews, ...newPreviews]);
  };

  // Remove image preview
  const removeImagePreview = (index: number, isEdit: boolean = false) => {
    if (isEdit) {
      const newFiles = editItemImageFiles.filter((_, i) => i !== index);
      const newPreviews = editItemImagePreviews.filter((_, i) => i !== index);
      setEditItemImageFiles(newFiles);
      setEditItemImagePreviews(newPreviews);
    } else {
      const newFiles = newItemImageFiles.filter((_, i) => i !== index);
      const newPreviews = newItemImagePreviews.filter((_, i) => i !== index);
      setNewItemImageFiles(newFiles);
      setNewItemImagePreviews(newPreviews);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="text-muted-foreground">Loading portfolio projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Portfolio Management</h2>
          <p className="text-muted-foreground">Manage your portfolio projects and showcases</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setIsAddModalOpen(true)} disabled={saving}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
          <Button onClick={() => setIsNewModalOpen(true)} disabled={saving} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
          <Button onClick={fixDuplicateProjectIds} disabled={saving} variant="destructive" size="sm">
            Fix Duplicate IDs
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{projects.length}</p>
              <p className="text-sm text-muted-foreground">Total Projects</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{projects.filter(p => p.isActive).length}</p>
              <p className="text-sm text-muted-foreground">Active Projects</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Code className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {[...new Set(projects.flatMap(p => p.technologies))].length}
              </p>
              <p className="text-sm text-muted-foreground">Technologies</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Users className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {projects.filter(p => p.client).length}
              </p>
              <p className="text-sm text-muted-foreground">Client Projects</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Management Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Category Management</h3>
            <p className="text-sm text-muted-foreground">Manage your project categories</p>
          </div>
          <Button
            onClick={() => setShowAddCategory(true)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>

        {/* Add Category Modal */}
        {showAddCategory && (
          <div className="mb-4 p-4 border rounded-lg bg-muted/5">
            <div className="space-y-3">
              <Input
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddCategory} 
                  disabled={!newCategoryName.trim()}
                  size="sm"
                >
                  Add Category
                </Button>
                <Button 
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryName('');
                  }} 
                  variant="outline" 
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((category, index) => (
            <div key={index} className="group">
              {editingCategory === category ? (
                <div className="flex gap-1 p-2 border rounded-lg">
                  <Input
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleEditCategory(category, editCategoryName);
                        setEditingCategory(null);
                        setEditCategoryName('');
                      } else if (e.key === 'Escape') {
                        setEditingCategory(null);
                        setEditCategoryName('');
                      }
                    }}
                    className="h-8 text-sm"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => {
                      handleEditCategory(category, editCategoryName);
                      setEditingCategory(null);
                      setEditCategoryName('');
                    }}
                  >
                    ✓
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-2"
                    onClick={() => {
                      setEditingCategory(null);
                      setEditCategoryName('');
                    }}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                  <span className="text-sm font-medium">{category}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        setEditingCategory(category);
                        setEditCategoryName(category);
                      }}
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-destructive"
                      onClick={() => handleDeleteCategory(category)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No categories available. Add your first category to get started.</p>
          </div>
        )}
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <Card key={project.id ? `${project.id}-${index}` : `project-${index}-${Date.now()}`} className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
            {/* Project Image with Overlays */}
            <div className="aspect-video bg-muted relative">
              {(() => {
                // Handle both image formats: single image string or images array
                const imageUrl = project.image || (project.images && project.images[0]);
                
                if (imageUrl) {
                  return (
                    <img 
                      src={normalizeImagePath(imageUrl)} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                      }}
                    />
                  );
                } else {
                  return null;
                }
              })()}
              <div className={`flex items-center justify-center h-full ${project.image || (project.images && project.images[0]) ? 'hidden fallback-icon' : ''}`}>
                <FileText className="w-12 h-12 text-muted-foreground" />
              </div>
              
              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <Badge 
                  variant={project.isActive ? "default" : "secondary"} 
                  className="shadow-sm backdrop-blur-sm bg-opacity-90"
                >
                  {project.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              {/* Quick Actions - Always Visible with Better Contrast */}
              <div className="absolute top-3 right-3 flex space-x-1 opacity-90 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleProjectStatus(project.id, project.isActive)}
                  disabled={saving}
                  className="h-9 w-9 p-0 bg-white/95 hover:bg-white shadow-md backdrop-blur-sm border border-gray-200/50 text-gray-700 hover:text-gray-900"
                  title={project.isActive ? "Deactivate Project" : "Activate Project"}
                >
                  {project.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedProject(project);
                    setIsEditModalOpen(true);
                  }}
                  disabled={saving}
                  className="h-9 w-9 p-0 bg-white/95 hover:bg-white shadow-md backdrop-blur-sm border border-gray-200/50 text-blue-600 hover:text-blue-700"
                  title="Edit Project"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteProject(project.id)}
                  disabled={saving}
                  className="h-9 w-9 p-0 shadow-md backdrop-blur-sm bg-red-500/90 hover:bg-red-500 text-white border border-red-400/50"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Project Content */}
            <div className="p-4 space-y-3">
              {/* Title and Category */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold leading-tight line-clamp-2">{project.title}</h3>
                {project.category && (
                  <Badge variant="outline" className="text-xs w-fit">
                    {project.category}
                  </Badge>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {project.description}
              </p>
              
              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 4).map((tech, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs px-2 py-1">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 4 && (
                      <Badge variant="secondary" className="text-xs px-2 py-1">
                        +{project.technologies.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              {/* Project Details */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                {project.client && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="w-3 h-3 mr-2 flex-shrink-0" />
                    <span className="truncate">{project.client}</span>
                  </div>
                )}
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span>{formatProjectDate(project.completedDate)}</span>
                </div>
              </div>
              
              {/* Action Links */}
              {(project.url || project.githubUrl) && (
                <div className="flex space-x-2 pt-2">
                  {project.url && (
                    <Button variant="outline" size="sm" asChild className="flex-1 h-8">
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Demo
                      </a>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button variant="outline" size="sm" asChild className="flex-1 h-8">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-3 h-3 mr-1" />
                        Code
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Add Project Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-title">Project Title *</Label>
                <Input
                  id="project-title"
                  value={newProject.title || ''}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="Enter project title"
                />
              </div>
              <div>
                <Label htmlFor="project-category">Category</Label>
                <div className="flex gap-2">
                  <Select value={newProject.category || ''} onValueChange={(value) => setNewProject({ ...newProject, category: value })}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddCategory(true)}
                    disabled={saving}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {/* Add New Category */}
                {showAddCategory && (
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Enter new category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddCategory}
                      disabled={!newCategoryName.trim()}
                    >
                      Add
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAddCategory(false);
                        setNewCategoryName('');
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="project-description">Description *</Label>
              <Textarea
                id="project-description"
                value={newProject.description || ''}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Enter project description"
                rows={3}
              />
            </div>

            <div>
              <Label>Project Image</Label>
              <div className="space-y-4">

                
                {/* Image Previews Section */}
                {(imagePreviews.length > 0 || newProject.image || (newProject.images && newProject.images.length > 0)) && (
                  <div className="mb-4">
                    <Label className="text-sm font-medium">Image Preview{imagePreviews.length > 1 || (newProject.images && newProject.images.length > 1) ? 's' : ''}</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {/* Show uploaded file previews */}
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <div className="w-full h-32 bg-muted rounded-lg overflow-hidden border">
                            <img 
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => {
                              const newFiles = imageFiles.filter((_, i) => i !== index);
                              const newPreviews = imagePreviews.filter((_, i) => i !== index);
                              setImageFiles(newFiles);
                              setImagePreviews(newPreviews);
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                      {/* Show existing project images if any */}
                      {newProject.images && newProject.images.map((image, index) => (
                        <div key={`existing-${index}`} className="relative">
                          <div className="w-full h-32 bg-muted rounded-lg overflow-hidden border">
                            <img 
                              src={normalizeImagePath(image)}
                              alt={`Existing ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => {
                              const newImages = newProject.images?.filter((_, i) => i !== index) || [];
                              setNewProject({ ...newProject, images: newImages });
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                      {/* Show single image if using old format */}
                      {newProject.image && !newProject.images && (
                        <div className="relative">
                          <div className="w-full h-32 bg-muted rounded-lg overflow-hidden border">
                            <img 
                              src={normalizeImagePath(newProject.image)}
                              alt="Project image"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => {
                              setNewProject({ ...newProject, image: '' });
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* File Upload */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="project-image-file">Upload Image</Label>
                    <Input
                      id="project-image-file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleImageSelect(e.target.files);
                      }}
                      multiple
                      disabled={uploading}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports JPEG, PNG, GIF, WebP (max 5MB)
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="project-image-url">Or Image URL</Label>
                    <Input
                      id="project-image-url"
                      value={newProject.image || ''}
                      onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      disabled={imageFiles.length > 0}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Direct link to an image online
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="project-client">Client</Label>
              <Input
                id="project-client"
                value={newProject.client || ''}
                onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                placeholder="Client name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="project-url">Demo URL</Label>
                <Input
                  id="project-url"
                  value={newProject.url || ''}
                  onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                  placeholder="https://demo-url.com"
                />
              </div>
              <div>
                <Label htmlFor="project-github">GitHub URL</Label>
                <Input
                  id="project-github"
                  value={newProject.githubUrl || ''}
                  onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                  placeholder="https://github.com/user/repo"
                />
              </div>
              <div>
                <Label htmlFor="project-date">Completed Date</Label>
                <Input
                  id="project-date"
                  type="date"
                  value={newProject.completedDate || ''}
                  onChange={(e) => setNewProject({ ...newProject, completedDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Technologies</Label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {newProject.technologies?.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {tech}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => removeTechnology(
                          newProject.technologies || [],
                          (techs) => setNewProject({ ...newProject, technologies: techs }),
                          index
                        )}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    placeholder="Add technology (e.g., React, Node.js)"
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addTechnology(
                          newProject.technologies || [],
                          (techs) => setNewProject({ ...newProject, technologies: techs })
                        );
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addTechnology(
                        newProject.technologies || [],
                        (techs) => setNewProject({ ...newProject, technologies: techs })
                      );
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={newProject.isActive !== false}
                onCheckedChange={(checked) => setNewProject({ ...newProject, isActive: checked })}
              />
              <Label>Active Project</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                resetImageUpload();
              }}
              disabled={saving || uploading}
            >
              Cancel
            </Button>
            <Button onClick={handleAddProject} disabled={saving || uploading}>
              {(saving || uploading) ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {uploading ? 'Uploading...' : saving ? 'Saving...' : 'Add Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Modal */}
      {renderEditModal()}

      {/* Items Management Section */}
      <div className="space-y-4">
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Items Collection</h3>
          
          {/* Items Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{items.length}</p>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Tag className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{categories.length}</p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {items.reduce((total, item) => total + (item.previews?.length || 0), 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Images</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Items Grid */}
          {items.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Items Yet</h3>
                <p className="text-muted-foreground mb-4">Start by adding your first item with images and categories</p>
                <Button onClick={() => setIsNewModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Item
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
                  {/* Item Images */}
                  <div className="aspect-video bg-muted relative">
                    {item.previews && item.previews.length > 0 ? (
                      <div className="relative w-full h-full">
                        <img
                          src={item.previews[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        {item.previews.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            +{item.previews.length - 1} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}

                    {/* Hover Overlay with Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEditItemModalOpen(item)}
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  {/* Item Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                        {(item as any).category && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {(item as any).category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>

                    {/* Image Gallery Preview */}
                    {item.previews && item.previews.length > 1 && (
                      <div className="flex space-x-1 overflow-x-auto pb-2">
                        {item.previews.slice(1, 4).map((preview, index) => (
                          <img
                            key={index}
                            src={preview}
                            alt={`${item.title} ${index + 2}`}
                            className="w-12 h-12 object-cover rounded border flex-shrink-0"
                          />
                        ))}
                        {item.previews.length > 4 && (
                          <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">
                            +{item.previews.length - 4}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEditItemModalOpen(item)}
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:border-red-200"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Item Modal */}
      {renderNewModal()}

      {/* Edit Item Modal */}
      <Dialog open={isEditItemModalOpen} onOpenChange={setIsEditItemModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              {/* Title and Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Title *</Label>
                  <Input
                    id="edit-title"
                    value={selectedItem.title}
                    onChange={(e) => setSelectedItem({ ...selectedItem, title: e.target.value })}
                    placeholder="Enter item title"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <div className="flex space-x-2">
                    <Select
                      value={selectedCategory}
                      onValueChange={(value) => setSelectedCategory(value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: string, index: number) => (
                          <SelectItem key={index} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddCategory(!showAddCategory)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {showAddCategory && (
                    <div className="mt-2 p-3 border rounded-lg space-y-2">
                      <Input
                        placeholder="New category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={handleAddCategory}>
                          Add Category
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setShowAddCategory(false);
                            setNewCategoryName('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={selectedItem.description}
                  onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
                  placeholder="Enter item description"
                  rows={3}
                />
              </div>

              {/* Existing Images */}
              {selectedItem.previews && selectedItem.previews.length > 0 && (
                <div>
                  <Label>Current Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {selectedItem.previews.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Current ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedPreviews = selectedItem.previews.filter((_, i) => i !== index);
                            setSelectedItem({ ...selectedItem, previews: updatedPreviews });
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Images */}
              <div>
                <Label htmlFor="edit-new-images">Add New Images</Label>
                <Input
                  id="edit-new-images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleEditItemImageSelect(e.target.files)}
                />
                {editItemImagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {editItemImagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`New Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-green-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImagePreview(index, true)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                          New
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Add new images (Max 10MB each, JPEG, PNG, GIF, WebP supported)
                </p>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span className="text-sm text-blue-700">Updating images...</span>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditItemModalOpen(false);
                resetEditItemForm();
              }}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button onClick={handleEditItem} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loading Overlay */}
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