import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Globe, Smartphone, Cloud, Database, Shield, Zap, Check, ArrowRight, Trash, Plus, Save, Star, Edit3, Package, DollarSign, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface Service {
  icon: JSX.Element;
  title: string;
  description: string;
  features: string[];
}

interface Package {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular: boolean;
}

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newFeature, setNewFeature] = useState<string>("");
  const [packages, setPackages] = useState<Package[]>([]);
  const [originalPackages, setOriginalPackages] = useState<Package[]>([]);
  const [savingStates, setSavingStates] = useState<{ [key: number]: boolean }>({});
  const [editingPackage, setEditingPackage] = useState<number | null>(null);
  const [newFeatureInputs, setNewFeatureInputs] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define a separate state to track edits for each package
  const [editStates, setEditStates] = useState<{ [key: number]: boolean }>({});

  const predefinedPackages: Package[] = [
    {
      name: "Starter",
      price: "$5,000",
      description: "Perfect for small businesses and startups",
      features: [
        "Responsive Web Application",
        "Basic SEO Optimization",
        "Contact Form Integration",
        "3 Months Support",
        "Mobile Responsive Design",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$15,000",
      description: "Ideal for growing businesses",
      features: [
        "Custom Web Application",
        "Advanced SEO & Analytics",
        "Payment Integration",
        "User Authentication",
        "6 Months Support",
        "Performance Optimization",
        "Third-party Integrations",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large-scale applications",
      features: [
        "Full-scale Application",
        "Custom Architecture",
        "Advanced Security",
        "Scalable Infrastructure",
        "12 Months Support",
        "DevOps & CI/CD",
        "Team Training",
        "24/7 Monitoring",
      ],
      popular: false,
    },
  ];

  // Fetch services from the database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("https://hexcode-website-897f4-default-rtdb.firebaseio.com/services.json");
        const data = await response.json();

        // Map the fetched data to include icons
        const servicesWithIcons = data.map((service: any, index: number) => {
          const icons = [
            <Globe className="w-8 h-8" />,
            <Smartphone className="w-8 h-8" />,
            <Cloud className="w-8 h-8" />,
            <Database className="w-8 h-8" />,
            <Shield className="w-8 h-8" />,
            <Zap className="w-8 h-8" />,
          ];

          return {
            ...service,
            icon: icons[index] || <Globe className="w-8 h-8" />, // Default icon if index exceeds
          };
        });

        setServices(servicesWithIcons);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleEdit = (service: Service) => {
    setEditingService(service);
  };

  const handleSave = () => {
    if (editingService) {
      setServices((prevServices) =>
        prevServices.map((s) => (s.title === editingService.title ? editingService : s))
      );
      setEditingService(null);
    }
  };

  const handleAddFeature = () => {
    if (editingService && newFeature.trim()) {
      setEditingService((prev) =>
        prev ? { ...prev, features: [...prev.features, newFeature.trim()] } : prev
      );
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (feature: string) => {
    if (editingService) {
      setEditingService((prev) =>
        prev ? { ...prev, features: prev.features.filter((f) => f !== feature) } : prev
      );
    }
  };

  // Fetch packages from Firebase
  useEffect(() => {
    fetchPackagesFromFirebase();
  }, []);

  // Firebase CRUD Operations
  const fetchPackagesFromFirebase = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://hexcode-website-897f4-default-rtdb.firebaseio.com/pricingPackages.json");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        setPackages(data);
        setOriginalPackages(data);
      } else {
        // If no data exists, initialize with predefined packages
        setPackages(predefinedPackages);
        setOriginalPackages(predefinedPackages);
        // Save predefined packages to Firebase
        await updateAllPackagesInFirebase(predefinedPackages);
      }
    } catch (error) {
      console.error("Error fetching packages from Firebase:", error);
      setError("Failed to load pricing packages from database");
      // Fallback to predefined packages
      setPackages(predefinedPackages);
      setOriginalPackages(predefinedPackages);
    } finally {
      setLoading(false);
    }
  };

  const updateAllPackagesInFirebase = async (packagesData: Package[]) => {
    try {
      await fetch("https://hexcode-website-897f4-default-rtdb.firebaseio.com/pricingPackages.json", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(packagesData),
      });
    } catch (error) {
      console.error("Error updating all packages in Firebase:", error);
    }
  };

  const updatePackageInFirebase = async (index: number, packageData: Package) => {
    try {
      await fetch(`https://hexcode-website-897f4-default-rtdb.firebaseio.com/pricingPackages/${index}.json`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(packageData),
      });
      
      // Update original packages to reflect saved state
      const newOriginal = [...originalPackages];
      newOriginal[index] = {...packageData};
      setOriginalPackages(newOriginal);
      
      return true;
    } catch (error) {
      console.error("Error updating package in Firebase:", error);
      return false;
    }
  };

  const deletePackageFromFirebase = async (index: number) => {
    try {
      // Get current packages, remove the one at index, and update Firebase
      const updatedPackages = packages.filter((_, i) => i !== index);
      await updateAllPackagesInFirebase(updatedPackages);
      
      // Update local state
      setPackages(updatedPackages);
      setOriginalPackages(updatedPackages);
      
      return true;
    } catch (error) {
      console.error("Error deleting package from Firebase:", error);
      return false;
    }
  };

  const addPackageToFirebase = async (newPackage: Package) => {
    try {
      const updatedPackages = [...packages, newPackage];
      await updateAllPackagesInFirebase(updatedPackages);
      
      // Update local state
      setPackages(updatedPackages);
      setOriginalPackages(updatedPackages);
      
      return true;
    } catch (error) {
      console.error("Error adding package to Firebase:", error);
      return false;
    }
  };

  const handleAddPricingPackage = async () => {
    const newPackage: Package = {
      name: "New Package",
      price: "$0",
      description: "Description of the new package",
      features: ["Feature 1", "Feature 2"],
      popular: false,
    };
    
    const success = await addPackageToFirebase(newPackage);
    if (!success) {
      alert("Failed to add package. Please try again.");
    }
  };

  const handleRemovePricingPackage = async (index: number) => {
    if (confirm("Are you sure you want to delete this package? This action cannot be undone.")) {
      const success = await deletePackageFromFirebase(index);
      if (!success) {
        alert("Failed to delete package. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-16">
      <div className="text-center space-y-4 mb-16">
        <h3 className="text-4xl lg:text-5xl font-bold text-balance">Services Section</h3>
        {/* <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
          Choose the package that best fits your project requirements and budget.
        </p> */}
      </div>
      {/* Services Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <Card
            key={index}
            className="p-8 glass-effect hover:shadow-xl transition-all duration-300 group border-border/50 hover:border-emerald-500/30"
          >
            <div className="space-y-6">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                {service.icon}
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-emerald-500">Key Features:</h4>
                <ul className="list-disc pl-5">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant="outline"
                className="mt-4"
                onClick={() => handleEdit(service)}
              >
                Edit
              </Button>
            </div>
          </Card>
        ))}

        {editingService && (
          <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Service</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={editingService?.title || ""}
                  onChange={(e) =>
                    setEditingService((prev) => (prev ? { ...prev, title: e.target.value } : prev))
                  }
                  placeholder="Service Title"
                />
                <Textarea
                  value={editingService?.description || ""}
                  onChange={(e) =>
                    setEditingService((prev) => (prev ? { ...prev, description: e.target.value } : prev))
                  }
                  placeholder="Service Description"
                />
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-emerald-500">Key Features:</h4>
                  <ul className="list-disc pl-5">
                    {editingService?.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{feature}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFeature(feature)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add new feature"
                    />
                    <Button onClick={handleAddFeature}>Add</Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingService(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-medium">
              <Package className="w-4 h-4" />
              Pricing Management
            </div>
            <h3 className="text-4xl lg:text-5xl font-bold text-balance">
              Edit Pricing Plans
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create and manage your pricing packages with our intuitive editor
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
                <p className="text-muted-foreground">Loading pricing packages...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                <div>
                  <p className="text-red-600 font-medium">{error}</p>
                  <Button 
                    onClick={fetchPackagesFromFirebase}
                    className="mt-4"
                    variant="outline"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Packages Grid */}
          {!loading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {packages.map((pkg, index) => {
              const hasEdits = JSON.stringify(pkg) !== JSON.stringify(originalPackages[index]);
              const isEditing = editingPackage === index;
              const isSaving = savingStates[index];

              return (
                <Card
                  key={index}
                  className={`group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                    pkg.popular 
                      ? "border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20 scale-105" 
                      : "border border-border/50 hover:border-emerald-200"
                  } ${
                    isEditing ? "ring-2 ring-emerald-500 ring-offset-2" : ""
                  }`}
                >

                  
                  {/* Popular Badge */}
                  {pkg.popular && (
                    <div className="absolute -top-0 left-0 right-0">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold py-2 px-4 text-center relative">
                        <Star className="w-4 h-4 inline mr-2" />
                        Most Popular Choice
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-emerald-600"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={`p-8 space-y-6 relative z-10 ${pkg.popular ? 'pt-16' : ''}`}>
                    {/* Header Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-emerald-500" />
                          <Label className="text-sm font-medium text-muted-foreground">Package Name</Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingPackage(isEditing ? null : index)}
                          className="h-8 w-8 p-0 hover:bg-emerald-50"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <Input
                        value={pkg.name}
                        onChange={(e) => {
                          const updatedPackages = [...packages];
                          updatedPackages[index].name = e.target.value;
                          setPackages(updatedPackages);
                          setEditStates((prev) => ({ ...prev, [index]: true }));
                        }}
                        className="text-xl font-bold text-center border-0 bg-transparent focus:bg-white/50 transition-all"
                        placeholder="Enter plan name"
                      />
                    </div>

                    {/* Price Section */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                        <Label className="text-sm font-medium text-muted-foreground">Price</Label>
                      </div>
                      <Input
                        value={pkg.price}
                        onChange={(e) => {
                          const updatedPackages = [...packages];
                          updatedPackages[index].price = e.target.value;
                          setPackages(updatedPackages);
                          setEditStates((prev) => ({ ...prev, [index]: true }));
                        }}
                        className="text-3xl font-bold text-center bg-emerald-50/50 border-emerald-200 focus:bg-emerald-50"
                        placeholder="$0"
                      />
                    </div>

                    {/* Description Section */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-500" />
                        <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                      </div>
                      <Textarea
                        value={pkg.description}
                        onChange={(e) => {
                          const updatedPackages = [...packages];
                          updatedPackages[index].description = e.target.value;
                          setPackages(updatedPackages);
                          setEditStates((prev) => ({ ...prev, [index]: true }));
                        }}
                        className="text-center text-muted-foreground min-h-20 resize-none border-dashed focus:border-solid"
                        placeholder="Describe this package..."
                      />
                    </div>

                    {/* Features Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <Label className="text-sm font-medium text-muted-foreground">Features ({pkg.features.length})</Label>
                        </div>
                      </div>
                      
                      <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-200">
                        {pkg.features.map((feature, idx) => (
                          <div key={idx} className="group flex items-center gap-2 p-2 rounded-lg hover:bg-emerald-50/50 transition-colors">
                            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <Input
                              value={feature}
                              onChange={(e) => {
                                const updatedPackages = [...packages];
                                updatedPackages[index].features[idx] = e.target.value;
                                setPackages(updatedPackages);
                                setEditStates((prev) => ({ ...prev, [index]: true }));
                              }}
                              className="border-0 bg-transparent focus:bg-white/70 text-sm flex-1"
                              placeholder="Enter feature"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedPackages = [...packages];
                                updatedPackages[index].features.splice(idx, 1);
                                setPackages(updatedPackages);
                                setEditStates((prev) => ({ ...prev, [index]: true }));
                              }}
                              className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-all"
                            >
                              <Trash className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                        
                        {/* Add New Feature */}
                        <div className="flex items-center gap-2 p-2 border-2 border-dashed border-emerald-200 rounded-lg hover:border-emerald-400 hover:bg-emerald-50/30 transition-all">
                          <Plus className="w-4 h-4 text-emerald-500" />
                          <Input
                            value={newFeatureInputs[index] || ''}
                            onChange={(e) => setNewFeatureInputs({ ...newFeatureInputs, [index]: e.target.value })}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && newFeatureInputs[index]?.trim()) {
                                const updatedPackages = [...packages];
                                updatedPackages[index].features.push(newFeatureInputs[index].trim());
                                setPackages(updatedPackages);
                                setNewFeatureInputs({ ...newFeatureInputs, [index]: '' });
                                setEditStates((prev) => ({ ...prev, [index]: true }));
                              }
                            }}
                            className="border-0 bg-transparent text-sm placeholder:text-emerald-400"
                            placeholder="Add new feature and press Enter"
                          />
                          <Button
                            onClick={() => {
                              if (newFeatureInputs[index]?.trim()) {
                                const updatedPackages = [...packages];
                                updatedPackages[index].features.push(newFeatureInputs[index].trim());
                                setPackages(updatedPackages);
                                setNewFeatureInputs({ ...newFeatureInputs, [index]: '' });
                                setEditStates((prev) => ({ ...prev, [index]: true }));
                              }
                            }}
                            size="sm"
                            className="h-8 w-8 p-0 bg-emerald-500 hover:bg-emerald-600"
                            disabled={!newFeatureInputs[index]?.trim()}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                      {/* Popular Toggle */}
                      <Button
                        variant={pkg.popular ? "default" : "outline"}
                        onClick={async () => {
                          const updatedPackages = packages.map((p, idx) => ({
                            ...p,
                            popular: idx === index ? !p.popular : false,
                          }));
                          setPackages(updatedPackages);
                          
                          // Save all packages to Firebase to maintain consistency
                          await updateAllPackagesInFirebase(updatedPackages);
                          setOriginalPackages(updatedPackages);
                        }}
                        className={`w-full transition-all duration-300 ${
                          pkg.popular 
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700" 
                            : "hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300"
                        }`}
                      >
                        <Star className={`w-4 h-4 mr-2 ${pkg.popular ? 'fill-current' : ''}`} />
                        {pkg.popular ? 'Remove from Popular' : 'Mark as Popular'}
                      </Button>

                      {/* Save Button */}
                      <Button
                        onClick={async () => {
                          setSavingStates({ ...savingStates, [index]: true });
                          const success = await updatePackageInFirebase(index, packages[index]);

                          if (success) {
                            console.log("Package updated successfully");
                            setEditStates((prev) => ({ ...prev, [index]: false }));
                          } else {
                            alert("Failed to save changes. Please try again.");
                          }

                          setSavingStates({ ...savingStates, [index]: false });
                        }}
                        disabled={!editStates[index] || savingStates[index]} // Button is disabled if no edits or currently saving
                        className={`w-full transition-all duration-300 ${
                          savingStates[index]
                            ? "opacity-50 cursor-not-allowed bg-gray-400"
                            : editStates[index]
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl"
                            : "opacity-50 cursor-not-allowed bg-gray-400"
                        }`}
                      >
                        {savingStates[index] ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2 " />
                            Save Changes
                          </>
                        )}
                      </Button>

                      {/* Delete Button */}
                      <Button
                        variant="destructive"
                        onClick={() => handleRemovePricingPackage(index)}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300"
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Remove Package
                      </Button>
                    </div>
                  </div>

                  {/* Floating Edit Indicator */}
                  {hasEdits && (
                    <div className="absolute top-4 right-4 z-20">
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse shadow-lg">
                        <div className="w-3 h-3 bg-orange-400 rounded-full animate-ping absolute"></div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}

            {/* Add New Package Card */}
            <Card className="p-8 border-2 border-dashed border-emerald-300 hover:border-emerald-500 transition-all duration-300 flex items-center justify-center min-h-[600px] group cursor-pointer"
                  onClick={handleAddPricingPackage}>
              <div className="text-center space-y-4 opacity-60 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <Plus className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-emerald-600">Add New Package</h3>
                  <p className="text-sm text-muted-foreground mt-2">Create a new pricing plan</p>
                </div>
              </div>
            </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}