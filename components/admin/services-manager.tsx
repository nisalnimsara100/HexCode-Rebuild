import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/loading-spinner"; // Assuming you have a loading spinner component
import { Globe, Smartphone, Cloud, Database, Shield, Zap } from "lucide-react";

interface Service {
  icon: JSX.Element;
  title: string;
  description: string;
  features: string[];
}

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newFeature, setNewFeature] = useState<string>("");

  // Fetch services from the database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://hexcode-website-897f4-default-rtdb.firebaseio.com//services.json");
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
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleEdit = (service: Service) => {
    setEditingService(service);
  };

  const handleSave = async () => {
    if (editingService) {
      try {
        // Update the service in Firebase
        const updatedServices = services.map((s) =>
          s.title === editingService.title ? editingService : s
        );

        await fetch("https://hexcode-website-897f4-default-rtdb.firebaseio.com//services.json", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedServices),
        });

        setServices(updatedServices);
        setEditingService(null);
      } catch (error) {
        console.error("Error updating service:", error);
      }
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

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner /> {/* Replace with your spinner component */}
        </div>
      ) : (
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
      )}
    </div>
  );
}