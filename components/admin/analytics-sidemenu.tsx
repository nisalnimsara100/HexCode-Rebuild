import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AnalyticsSideMenu() {
  const menuItems = [
    { name: "Overview", link: "/admin/analytics/overview" },
    { name: "Visitors", link: "/admin/analytics/visitors" },
    { name: "Projects", link: "/admin/analytics/projects" },
    { name: "Contacts", link: "/admin/analytics/contacts" },
  ];

  return (
    <Card className="p-6 glass-effect">
      <h3 className="text-lg font-semibold mb-4">Analytics Menu</h3>
      <div className="space-y-3">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <a href={item.link} className="font-medium">
              {item.name}
            </a>
          </div>
        ))}
      </div>
    </Card>
  );
}