"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ClientAuthModal } from "@/components/client/client-auth-modal"
import { usePathname } from "next/navigation"

const navigation = [
	{ name: "Home", href: "/" },
	{ name: "Services", href: "/services" },
	{ name: "Projects", href: "/projects" },
  { name: "Careers", href: "/careers" },
	{ name: "Contact", href: "/contact" },
	{ name: "About", href: "/about" },
	// { name: "Employee Portal", href: "/employee" },
	// { name: "Staff Admin", href: "/staff" },
	// { name: "Setup Data", href: "/setup" },
]

export function Navigation() {
	const [isOpen, setIsOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)
	const [showAuthModal, setShowAuthModal] = useState(false)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const pathname = usePathname()

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20)
		}
		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	useEffect(() => {
		// Check authentication status from localStorage
		const checkAuthStatus = () => {
			const storedProfile = localStorage.getItem('clientProfile');
			if (storedProfile) {
				try {
					const profile = JSON.parse(storedProfile);
					if (profile && profile.role === 'client') {
						setIsAuthenticated(true);
						setShowAuthModal(false);
					} else {
						setIsAuthenticated(false);
					}
				} catch (error) {
					console.error('Error parsing clientProfile:', error);
					localStorage.removeItem('clientProfile');
					setIsAuthenticated(false);
				}
			} else {
				setIsAuthenticated(false);
			}
		};

		// Initial check
		checkAuthStatus();

		// Listen for storage events (cross-tab synchronization)
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === 'clientProfile') {
				checkAuthStatus();
			}
		};

		window.addEventListener('storage', handleStorageChange);

		// Custom event listener for same-tab updates
		const handleAuthChange = () => {
			checkAuthStatus();
		};

		window.addEventListener('authStateChanged', handleAuthChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
			window.removeEventListener('authStateChanged', handleAuthChange);
		};
	}, [])

	// Prevent modal from opening if user is authenticated
	const handleGetStarted = () => {
		if (!isAuthenticated) {
			setShowAuthModal(true)
		}
	}

	return (
		<nav
			className={cn(
				"fixed top-0 w-full z-50 transition-all duration-500",
				scrolled ? "glass-effect shadow-lg backdrop-blur-md" : "bg-transparent",
			)}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<Link href="/" className="flex items-center space-x-3 group">
						<div className="relative w-8 h-8 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-300">
							<Image src="/images/hexcode-logo.png" alt="HexCode" fill className="object-contain" />
						</div>
						<span className="text-xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300">
							HexCode
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className={cn(
									"text-muted-foreground hover:text-emerald-500 transition-all duration-300 font-medium relative group",
									pathname === item.href && "text-emerald-500 font-semibold",
								)}
							>
								{item.name}
								<span
									className={cn(
										"absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full",
										pathname === item.href && "w-full",
									)}
								></span>
							</Link>
						))}
						{isAuthenticated ? (
							<Link href="/client/dashboard">
								<Button className="bg-emerald-500 hover:bg-emerald-600">Client Panel</Button>
							</Link>
						) : (
							<Button
								className="animate-pulse-glow hover-lift bg-emerald-500 hover:bg-emerald-600"
								onClick={handleGetStarted}
							>
								Get Started
							</Button>
						)}
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="hover-lift">
							{isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</Button>
					</div>
				</div>

				{isOpen && (
					<div className="md:hidden glass-effect rounded-lg mt-2 p-4 animate-fade-in-up">
						<div className="flex flex-col space-y-4">
							{navigation.map((item, index) => (
								<Link
									key={item.name}
									href={item.href}
									className="text-muted-foreground hover:text-emerald-500 transition-colors duration-200 font-medium hover-lift"
									onClick={() => setIsOpen(false)}
									style={{ animationDelay: `${index * 100}ms` }}
								>
									{item.name}
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
			{showAuthModal && <ClientAuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />}
		</nav>
	)
}
