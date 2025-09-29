import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "../ui/input";

export function ServicesManagerHeader() {
  return (
    <header className="bg-card border-b border-border p-4 h-20 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-foreground">Services Manager</h1>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search services..." className="pl-10" />
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>
    </header>
  );
}