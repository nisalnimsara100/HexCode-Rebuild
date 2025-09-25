import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function EnterpriseSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-balance mb-6">AI at the Heart of Your Enterprise</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground text-pretty">
              Seamlessly integrate AI into your enterprise with our open, scalable, and governed solutions. Our platform
              enables you to build intelligent applications that transform customer experiences, streamline operations,
              and accelerate innovation. Experience the power of your workflows, accelerate innovation, and gain a
              competitive edge by harnessing the power of artificial intelligence.
            </p>

            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Explore AI
            </Button>
          </div>

          <div className="relative">
            <Card className="bg-card/80 backdrop-blur border-border p-8 relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-32 h-32 bg-primary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="w-20 h-20 bg-primary/40 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-xl">AI</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2 text-primary">Enterprise AI Platform</h3>
                  <p className="text-muted-foreground">Intelligent solutions for modern businesses</p>
                </div>
              </div>

              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 left-4 w-16 h-16 border border-primary rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border border-accent rounded-full"></div>
                <div className="absolute top-1/2 left-8 w-8 h-8 border border-primary/50 rounded-full"></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
