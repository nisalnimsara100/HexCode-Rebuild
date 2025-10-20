// Website Management Components with Firebase Integration

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { database } from '@/lib/firebase';
import { ref, onValue, set, push, remove } from 'firebase/database';
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
  PieChart,
  Calendar,
  Download,
  AlertCircle,
  CheckCircle,
  Code,
  Package,
  DollarSign,
  FileText,
  ExternalLink,
  Github
} from 'lucide-react';

// Types from existing services-manager.tsx
interface Service {
  id?: string;
  title: string;
  description: string;
  price?: string;
  features: string[];
  icon?: React.ReactNode;
  category?: string;
  isActive?: boolean;
  order?: number;
}

interface Package {
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
  icon?: React.ReactNode;
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

// Website Overview Component with Firebase data
export function WebsiteOverview() {
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from Firebase
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch services
        const servicesResponse = await fetch("https://hexcode-website-897f4-default-rtdb.firebaseio.com/services.json");
        const servicesData = await servicesResponse.json();
        if (servicesData) setServices(servicesData);

        // Fetch packages
        const packagesResponse = await fetch("https://hexcode-website-897f4-default-rtdb.firebaseio.com/pricingPackages.json");
        const packagesData = await packagesResponse.json();
        if (packagesData) setPackages(packagesData);

        // Fetch stats from Firebase Realtime Database
        const statsRef = ref(database, 'analytics/overview/list');
        onValue(statsRef, (snapshot) => {
          const statsData = snapshot.val();
          if (statsData) setStats(statsData);
        });

        // Mock portfolio projects for now
        setPortfolioProjects([
          {
            id: "1",
            title: "E-Commerce Platform",
            description: "Full-stack e-commerce solution",
            image: "/placeholder.jpg",
            technologies: ["React", "Node.js", "MongoDB"],
            category: "Web Development",
            isActive: true,
            order: 1,
            client: "TechCorp",
            completedDate: "2024-01-15"
          }
        ]);

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
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto"></div>
          <p className="text-muted-foreground">Loading website data...</p>
        </div>
      </div>
    );
  }

  const activeServices = services.filter(s => s.isActive !== false).length;
  const activeProjects = portfolioProjects.filter(p => p.isActive).length;
  const activePackages = packages.filter(p => p.isActive !== false).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-xl">
        <h2 className="text-3xl font-bold mb-2">Website Management Overview</h2>
        <p className="text-blue-100">Manage your website content, services, and portfolio</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Globe className="w-6 h-6 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold">{activeServices}</h3>
          <p className="text-sm text-muted-foreground">Active Services</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Package className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold">{activePackages}</h3>
          <p className="text-sm text-muted-foreground">Pricing Packages</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="text-2xl font-bold">{activeProjects}</h3>
          <p className="text-sm text-muted-foreground">Portfolio Projects</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-2xl font-bold">{stats.length}</h3>
          <p className="text-sm text-muted-foreground">Website Stats</p>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Website Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Services data loaded successfully</p>
              <p className="text-xs text-muted-foreground">Connected to Firebase database</p>
            </div>
            <Badge variant="outline" className="text-xs">system</Badge>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Pricing packages synchronized</p>
              <p className="text-xs text-muted-foreground">{packages.length} packages available</p>
            </div>
            <Badge variant="outline" className="text-xs">packages</Badge>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Analytics data connected</p>
              <p className="text-xs text-muted-foreground">Real-time stats monitoring</p>
            </div>
            <Badge variant="outline" className="text-xs">analytics</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Services Management with Firebase CRUD
export function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [newService, setNewService] = useState<Partial<Service>>({
    title: '',
    description: '',
    features: [],
    category: '',
    isActive: true
  });

  const iconOptions = [
    { icon: <Globe className="w-6 h-6" />, name: 'Globe' },
    { icon: <Smartphone className="w-6 h-6" />, name: 'Smartphone' },
    { icon: <Cloud className="w-6 h-6" />, name: 'Cloud' },
    { icon: <DatabaseIcon className="w-6 h-6" />, name: 'Database' },
    { icon: <Shield className="w-6 h-6" />, name: 'Shield' },
    { icon: <Zap className="w-6 h-6" />, name: 'Zap' }
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
        // Map services with icons
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
    try {
      // Remove icon from data before saving
      const sanitizedServices = updatedServices.map(({ icon, ...service }) => service);
      
      const response = await fetch("https://hexcode-website-897f4-default-rtdb.firebaseio.com/services.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedServices)
      });
      
      if (response.ok) {
        fetchServices(); // Refresh data
        return true;
      }
    } catch (error) {
      console.error("Error saving services:", error);
    }
    return false;
  };

  const handleAddService = async () => {
    if (!newService.title || !newService.description) return;

    const service: Service = {
      ...newService as Service,
      id: Date.now().toString(),
      features: newService.features || [],
      order: services.length + 1
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
      s.id === selectedService.id ? selectedService : s
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
    const success = await saveServicesToFirebase(updatedServices);
    
    if (!success) {
      alert("Failed to delete service. Please try again.");
    }
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto"></div>
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Services Management</h2>
          <p className="text-muted-foreground">Manage your website services and offerings</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    {service.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{service.title}</CardTitle>
                    <Badge variant={service.isActive ? "default" : "secondary"} className="text-xs mt-1">
                      {service.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleServiceStatus(service.id!)}
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
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteService(service.id!)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Features:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {service.features.length > 3 && (
                    <li className="text-xs text-muted-foreground">
                      +{service.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Service Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Service Title</Label>
                <Input
                  id="title"
                  value={newService.title || ''}
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newService.description || ''}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                placeholder="Enter service description"
                rows={3}
              />
            </div>
            <div>
              <Label>Features (one per line)</Label>
              <Textarea
                value={newService.features?.join('\n') || ''}
                onChange={(e) => setNewService({ ...newService, features: e.target.value.split('\n').filter(f => f.trim()) })}
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
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddService}>
              Add Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Service Title</Label>
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
                <Label htmlFor="edit-description">Description</Label>
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
                  onChange={(e) => setSelectedService({ ...selectedService, features: e.target.value.split('\n').filter(f => f.trim()) })}
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
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditService}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Price Packages Management with Firebase CRUD
export function PricePackagesManagement() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [originalPackages, setOriginalPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingStates, setSavingStates] = useState<{ [key: number]: boolean }>({});

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
        setOriginalPackages(packagesWithIds);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAllPackagesInFirebase = async (packagesData: Package[]) => {
    try {
      const response = await fetch("https://hexcode-website-897f4-default-rtdb.firebaseio.com/pricingPackages.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(packagesData)
      });
      return response.ok;
    } catch (error) {
      console.error("Error updating packages:", error);
      return false;
    }
  };

  const handleSavePackage = async (index: number) => {
    setSavingStates({ ...savingStates, [index]: true });
    
    try {
      const success = await updateAllPackagesInFirebase(packages);
      if (success) {
        setOriginalPackages([...packages]);
      } else {
        alert("Failed to save package. Please try again.");
      }
    } catch (error) {
      console.error("Error saving package:", error);
    } finally {
      setSavingStates({ ...savingStates, [index]: false });
    }
  };

  const handleAddPackage = async () => {
    const newPackage: Package = {
      id: Date.now().toString(),
      name: "New Package",
      price: "$0",
      description: "Description of the new package",
      features: ["Feature 1", "Feature 2"],
      popular: false,
      isActive: true
    };
    
    const updatedPackages = [...packages, newPackage];
    const success = await updateAllPackagesInFirebase(updatedPackages);
    
    if (success) {
      setPackages(updatedPackages);
      setOriginalPackages(updatedPackages);
    } else {
      alert("Failed to add package. Please try again.");
    }
  };

  const handleDeletePackage = async (index: number) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    const updatedPackages = packages.filter((_, i) => i !== index);
    const success = await updateAllPackagesInFirebase(updatedPackages);
    
    if (success) {
      setPackages(updatedPackages);
      setOriginalPackages(updatedPackages);
    } else {
      alert("Failed to delete package. Please try again.");
    }
  };

  const updatePackageField = (index: number, field: keyof Package, value: any) => {
    const updatedPackages = [...packages];
    (updatedPackages[index] as any)[field] = value;
    setPackages(updatedPackages);
  };

  const addFeature = (index: number, feature: string) => {
    if (feature.trim()) {
      const updatedPackages = [...packages];
      updatedPackages[index].features.push(feature.trim());
      setPackages(updatedPackages);
    }
  };

  const removeFeature = (pkgIndex: number, featureIndex: number) => {
    const updatedPackages = [...packages];
    updatedPackages[pkgIndex].features.splice(featureIndex, 1);
    setPackages(updatedPackages);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto"></div>
          <p className="text-muted-foreground">Loading pricing packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Price Packages Management</h2>
          <p className="text-muted-foreground">Manage your pricing plans and packages</p>
        </div>
        <Button onClick={handleAddPackage}>
          <Plus className="w-4 h-4 mr-2" />
          Add Package
        </Button>
      </div>

      {/* Packages Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((pkg, index) => {
          const hasEdits = JSON.stringify(pkg) !== JSON.stringify(originalPackages[index]);
          const isSaving = savingStates[index] || false;

          return (
            <Card key={index} className={`relative ${hasEdits ? 'ring-2 ring-emerald-500/50' : ''}`}>
              {pkg.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-emerald-500 text-white px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Input
                      value={pkg.name}
                      onChange={(e) => updatePackageField(index, 'name', e.target.value)}
                      className="text-xl font-bold text-center border-none bg-transparent p-0 h-auto"
                    />
                    <div className="flex items-center justify-center mt-2">
                      <DollarSign className="w-6 h-6 text-emerald-500" />
                      <Input
                        value={pkg.price.replace('$', '')}
                        onChange={(e) => updatePackageField(index, 'price', `$${e.target.value}`)}
                        className="text-3xl font-bold text-center border-none bg-transparent p-0 h-auto w-24"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePackage(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Textarea
                  value={pkg.description}
                  onChange={(e) => updatePackageField(index, 'description', e.target.value)}
                  className="text-center border-none bg-transparent resize-none"
                  rows={2}
                />

                <div className="space-y-2">
                  <h4 className="font-medium">Features:</h4>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <Input
                          value={feature}
                          onChange={(e) => {
                            const updatedPackages = [...packages];
                            updatedPackages[index].features[featureIndex] = e.target.value;
                            setPackages(updatedPackages);
                          }}
                          className="border-none bg-transparent p-0 h-auto text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFeature(index, featureIndex)}
                          className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add new feature"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addFeature(index, e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addFeature(index, input.value);
                        input.value = '';
                      }}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={pkg.popular}
                      onCheckedChange={(checked) => updatePackageField(index, 'popular', checked)}
                    />
                    <Label className="text-sm">Popular</Label>
                  </div>
                  
                  {hasEdits && (
                    <Button
                      onClick={() => handleSavePackage(index)}
                      disabled={isSaving}
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600"
                    >
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Website Stats with Firebase Integration
export function WebsiteStats() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultStats = [
    {
      title: "Projects Completed",
      value: "20+",
      description: "Successful software projects delivered",
      icon: <Code className="w-5 h-5" />
    },
    {
      title: "Happy Clients",
      value: "10+",
      description: "Businesses we've helped grow",
      icon: <Users className="w-5 h-5" />
    },
    {
      title: "Years Experience",
      value: "2+",
      description: "Years of software development expertise",
      icon: <Award className="w-5 h-5" />
    },
    {
      title: "Uptime",
      value: "99%",
      description: "Average application uptime",
      icon: <Zap className="w-5 h-5" />
    },
    {
      title: "Technologies",
      value: "15+",
      description: "Modern tech stack mastery",
      icon: <Globe className="w-5 h-5" />
    },
    {
      title: "Secure",
      value: "100%",
      description: "Security-first development approach",
      icon: <Shield className="w-5 h-5" />
    }
  ];

  useEffect(() => {
    const statsRef = ref(database, 'analytics/overview/list');
    onValue(statsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Map Firebase data back with icons
        const statsWithIcons = data.map((stat: any, index: number) => ({
          ...stat,
          icon: defaultStats[index]?.icon || <BarChart3 className="w-5 h-5" />
        }));
        setStats(statsWithIcons);
      } else {
        setStats(defaultStats);
      }
      setLoading(false);
    });
  }, []);

  const saveStatsToFirebase = async () => {
    try {
      // Remove icon from data before saving
      const sanitizedStats = stats.map(({ icon, ...stat }) => stat);
      
      const statsRef = ref(database, 'analytics/overview/list');
      await set(statsRef, sanitizedStats);
      
      alert("Stats saved successfully!");
    } catch (error) {
      console.error("Error saving stats:", error);
      alert("Failed to save stats. Please try again.");
    }
  };

  const updateStat = (index: number, field: keyof Stat, value: any) => {
    const updatedStats = [...stats];
    (updatedStats[index] as any)[field] = value;
    setStats(updatedStats);
  };

  const addStat = () => {
    const newStat: Stat = {
      title: "New Stat",
      value: "0",
      description: "New statistic description",
      icon: <BarChart3 className="w-5 h-5" />
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto"></div>
          <p className="text-muted-foreground">Loading website statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Website Statistics</h2>
          <p className="text-muted-foreground">Manage your website performance metrics and stats</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={addStat} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Stat
          </Button>
          <Button onClick={saveStatsToFirebase}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                {stat.icon}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteStat(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <Input
                value={stat.value}
                onChange={(e) => updateStat(index, 'value', e.target.value)}
                className="text-2xl font-bold text-center border-none bg-transparent p-0 h-auto"
                placeholder="Value"
              />
              
              <Input
                value={stat.title}
                onChange={(e) => updateStat(index, 'title', e.target.value)}
                className="font-medium text-center border-none bg-transparent p-0 h-auto"
                placeholder="Title"
              />
              
              <Textarea
                value={stat.description}
                onChange={(e) => updateStat(index, 'description', e.target.value)}
                className="text-sm text-muted-foreground text-center border-none bg-transparent resize-none"
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

// Portfolio Management (keeping existing structure)
export function PortfolioManagement() {
  // Using the existing portfolio management logic from the original file
  const [projects, setProjects] = useState<PortfolioProject[]>([
    {
      id: "1",
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with payment integration",
      image: "/placeholder.jpg",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      category: "Web Development",
      url: "https://example.com",
      githubUrl: "https://github.com/example",
      isActive: true,
      order: 1,
      client: "TechCorp",
      completedDate: "2024-01-15"
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Portfolio Management</h2>
          <p className="text-muted-foreground">Manage your portfolio projects and showcases</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button variant="secondary" size="sm">
                  <Edit3 className="w-3 h-3" />
                </Button>
                <Button variant="secondary" size="sm">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{project.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <Badge variant={project.isActive ? "default" : "secondary"}>
                  {project.isActive ? "Active" : "Inactive"}
                </Badge>
                <div className="flex space-x-1">
                  {project.url && (
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button variant="ghost" size="sm">
                      <Github className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Content Management and Website Settings (keeping existing)
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