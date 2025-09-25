import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold text-foreground">GreenTech</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-1 cursor-pointer hover:text-primary transition-colors">
              <span>Products</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-1 cursor-pointer hover:text-primary transition-colors">
              <span>Solutions</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-1 cursor-pointer hover:text-primary transition-colors">
              <span>Resources</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <span className="cursor-pointer hover:text-primary transition-colors">Support</span>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Contact Us
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
        </div>
      </div>
    </header>
  )
}
