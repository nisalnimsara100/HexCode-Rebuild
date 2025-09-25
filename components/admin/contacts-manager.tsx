import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Mail, Phone, Calendar, Search, Filter } from "lucide-react"

export function ContactsManager() {
  const contacts = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@techstart.com",
      company: "TechStart Inc.",
      project: "E-commerce Platform",
      budget: "$15,000 - $50,000",
      status: "New",
      date: "2024-01-15",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael@digitalsolutions.com",
      company: "Digital Solutions Co.",
      project: "Mobile App",
      budget: "$50,000 - $100,000",
      status: "Contacted",
      date: "2024-01-14",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily@innovatelab.com",
      company: "InnovateLab",
      project: "Custom Software",
      budget: "$100,000+",
      status: "In Discussion",
      date: "2024-01-13",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-500 text-white"
      case "Contacted":
        return "bg-yellow-500 text-white"
      case "In Discussion":
        return "bg-emerald-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="space-y-6">
      {/* Contacts List */}
      <div className="space-y-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className="p-6 glass-effect hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold">{contact.name}</h3>
                  <Badge className={getStatusColor(contact.status)}>{contact.status}</Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{contact.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{contact.date}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Company:</span> {contact.company}
                  </div>
                  <div>
                    <span className="font-medium">Project:</span> {contact.project}
                  </div>
                  <div>
                    <span className="font-medium">Budget:</span> {contact.budget}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-1" />
                  Reply
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
