import { Badge } from "@/components/ui/badge";

export function ServiceHeader() {
  return (
    <header className="bg-card border-b border-border p-4 h-20 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Badge className="bg-emerald-500 text-white">Live</Badge>
      </div>
    </header>
  );
}