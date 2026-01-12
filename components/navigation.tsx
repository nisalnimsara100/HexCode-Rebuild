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

		checkAuthStatus();

		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === 'clientProfile') {
				checkAuthStatus();
			}
		};

		const handleAuthChange = () => {
			checkAuthStatus();
		};

		window.addEventListener('storage', handleStorageChange);
		window.addEventListener('authStateChanged', handleAuthChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
			window.removeEventListener('authStateChanged', handleAuthChange);
		};
	}, [])

	const handleGetStarted = () => {
		if (!isAuthenticated) {
			setShowAuthModal(true)
		}
	}

	return (
		<nav
			className={cn(
				"fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out",
				scrolled ? "py-2" : "py-3"
			)}
		>
			<div className="max-w-7xl mx-auto px-6">
				{/* Main header container */}
				<div className={cn(
					"relative backdrop-blur-xl bg-black/40 transition-all duration-500",
					scrolled ? "rounded-full shadow-2xl shadow-emerald-500/10" : "rounded-3xl shadow-xl"
				)}>
					<div className="relative flex justify-between items-center px-6 py-2.5">
						{/* Logo */}
						<Link href="/" className="flex items-center space-x-3 group relative z-10">
							<div className="relative w-9 h-9 transition-all duration-500 group-hover:scale-110 group-hover:rotate-180">
								<Image src="/images/hexcode-logo.png" alt="HexCode" fill className="object-contain" />
							</div>
							<span className="text-lg font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-emerald-400 transition-all duration-500">
								HexCode
							</span>
						</Link>

						{/* Desktop Navigation - Floating Pills */}
						<div className="hidden md:flex items-center gap-2">
							{navigation.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className="group relative"
								>
									<div className={cn(
										"px-4 py-1.5 rounded-full transition-all duration-300 relative overflow-hidden",
										pathname === item.href 
											? "bg-emerald-500/20 text-emerald-400" 
											: "text-gray-400 hover:text-emerald-300"
									)}>
										{/* Magnetic hover effect */}
										<div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
										
										{/* Active indicator */}
										{pathname === item.href && (
											<div className="absolute inset-0 border border-emerald-500/30 rounded-full animate-pulse-border" />
										)}
										
										<span className="relative z-10 text-sm font-medium tracking-wide">
											{item.name}
										</span>
									</div>
								</Link>
							))}
							
							{/* CTA Button with holographic effect */}
							{isAuthenticated ? (
								<Link href="/client/dashboard">
									<Button className="relative ml-2 px-5 py-1.5 text-sm rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 overflow-hidden group">
										<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
										<span className="relative z-10">Client Panel</span>
									</Button>
								</Link>
							) : (
								<Button
									onClick={handleGetStarted}
									className="relative ml-2 px-5 py-1.5 text-sm rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 overflow-hidden group shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
								>
									<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
									<span className="relative z-10 font-semibold">Get Started</span>
								</Button>
							)}
						</div>

						{/* Mobile menu button */}
						<div className="md:hidden">
							<Button 
								variant="ghost" 
								size="sm" 
								onClick={() => setIsOpen(!isOpen)}
								className="relative rounded-full hover:bg-emerald-500/10 transition-all duration-300"
							>
								<div className="relative z-10">
									{isOpen ? <X className="h-5 w-5 text-emerald-400" /> : <Menu className="h-5 w-5 text-emerald-400" />}
								</div>
							</Button>
						</div>
					</div>

					{/* Mobile menu */}
					{isOpen && (
						<div className="md:hidden px-6 pb-4 pt-2 space-y-2 animate-fade-in-up">
							{navigation.map((item, index) => (
								<Link
									key={item.name}
									href={item.href}
									onClick={() => setIsOpen(false)}
									className={cn(
										"block px-4 py-2.5 rounded-2xl transition-all duration-300",
										pathname === item.href
											? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
											: "text-gray-400 hover:bg-emerald-500/10 hover:text-emerald-300"
									)}
									style={{ animationDelay: `${index * 50}ms` }}
								>
									{item.name}
								</Link>
							))}
						</div>
					)}
				</div>
			</div>
			
			{showAuthModal && <ClientAuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />}
		</nav>
	)
}
