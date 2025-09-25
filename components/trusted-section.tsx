export function TrustedSection() {
  const companies = ["TechCorp", "InnovateLab", "DataFlow", "CloudSync", "NextGen", "SmartSys"]

  return (
    <section className="py-16 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-muted-foreground text-lg">Trusted by the World's Best Enterprises</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {companies.map((company, index) => (
            <div key={index} className="flex items-center justify-center">
              <div className="text-muted-foreground hover:text-primary transition-colors cursor-pointer font-semibold text-lg">
                {company}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
