import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Eye, Plus, Search } from "lucide-react";

export function ServicesManager() {
	const services = [
		{
			id: 1,
			title: "Web Development",
			category: "Development",
			status: "Live",
			features: [
				"React & Next.js",
				"Progressive Web Apps",
				"E-commerce Solutions",
				"CMS Development",
			],
		},
		{
			id: 2,
			title: "Mobile Development",
			category: "Development",
			status: "In Development",
			features: [
				"React Native",
				"iOS & Android",
				"App Store Optimization",
				"Mobile UI/UX",
			],
		},
		{
			id: 3,
			title: "Cloud Solutions",
			category: "Infrastructure",
			status: "Live",
			features: [
				"AWS & Azure",
				"DevOps & CI/CD",
				"Microservices",
				"Container Orchestration",
			],
		},
		{
			id: 4,
			title: "Backend Development",
			category: "Development",
			status: "Live",
			features: ["RESTful APIs", "GraphQL", "Database Design", "Real-time Systems"],
		},
		{
			id: 5,
			title: "Security & Testing",
			category: "Quality Assurance",
			status: "Live",
			features: [
				"Security Audits",
				"Automated Testing",
				"Performance Testing",
				"Code Reviews",
			],
		},
		{
			id: 6,
			title: "Consulting",
			category: "Strategy",
			status: "Live",
			features: [
				"Architecture Review",
				"Technology Strategy",
				"Code Optimization",
				"Team Training",
			],
		},
	];

	return (
		<div className="space-y-6">
			{/* Services List */}
			<div className="space-y-4">
				{services.map((service) => (
					<Card
						key={service.id}
						className="p-6 glass-effect hover:shadow-lg transition-all duration-300"
					>
						<div className="flex items-center justify-between">
							<div className="space-y-3">
								<div className="flex items-center space-x-3">
									<h3 className="text-lg font-semibold">{service.title}</h3>
									<Badge
										variant="outline"
										className="border-emerald-500 text-emerald-500"
									>
										{service.category}
									</Badge>
									<Badge
										variant={
											service.status === "Live" ? "default" : "secondary"
										}
										className={
											service.status === "Live"
												? "bg-emerald-500 text-white"
												: ""
										}
									>
										{service.status}
									</Badge>
								</div>

								<div className="flex items-center space-x-4 text-sm text-muted-foreground">
									<span>Features:</span>
									<div className="flex space-x-2">
										{service.features.map((feature) => (
											<Badge
												key={feature}
												variant="secondary"
												className="text-xs"
											>
												{feature}
											</Badge>
										))}
									</div>
								</div>
							</div>

							<div className="flex items-center space-x-2">
								<Button variant="outline" size="sm">
									<Eye className="w-4 h-4 mr-1" />
									View
								</Button>
								<Button variant="outline" size="sm">
									<Edit className="w-4 h-4 mr-1" />
									Edit
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="text-red-500 hover:text-red-600 bg-transparent"
								>
									<Trash2 className="w-4 h-4 mr-1" />
									Delete
								</Button>
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}