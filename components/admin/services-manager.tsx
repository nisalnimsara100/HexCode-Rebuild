import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, Eye, Plus, Search, Globe, Smartphone, Cloud, Database, Shield, Zap, ArrowRight } from "lucide-react";

interface Service {
  icon: JSX.Element;
  title: string;
  description: string;
  features: string[];
  color: string;
}

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Web Development",
      description: "Modern, responsive web applications built with the latest technologies and best practices.",
      features: ["React & Next.js", "Progressive Web Apps", "E-commerce Solutions", "CMS Development"],
      color: "emerald",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Development",
      description: "Native and cross-platform mobile applications that deliver exceptional user experiences.",
      features: ["React Native", "iOS & Android", "App Store Optimization", "Mobile UI/UX"],
      color: "blue",
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and deployment solutions for modern applications.",
      features: ["AWS & Azure", "DevOps & CI/CD", "Microservices", "Container Orchestration"],
      color: "purple",
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Backend Development",
      description: "Robust, secure, and scalable backend systems and APIs for your applications.",
      features: ["RESTful APIs", "GraphQL", "Database Design", "Real-time Systems"],
      color: "orange",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Security & Testing",
      description: "Comprehensive security audits and automated testing to ensure your software is bulletproof.",
      features: ["Security Audits", "Automated Testing", "Performance Testing", "Code Reviews"],
      color: "red",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Consulting",
      description: "Strategic technology consulting to help you make informed decisions about your tech stack.",
      features: ["Architecture Review", "Technology Strategy", "Code Optimization", "Team Training"],
      color: "green",
    },
  ]);

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newFeature, setNewFeature] = useState<string>("");

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

  return (
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
  );
}