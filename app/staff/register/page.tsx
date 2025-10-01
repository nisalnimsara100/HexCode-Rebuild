"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, User, AlertCircle } from "lucide-react";

export default function RegisterPage() {
	const { signUp } = useAuth();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			await signUp(email, password, { name, role: "employee" });
			router.push("/staff/login");
		} catch (err) {
			setError("Registration failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-900 via-gray-900 to-emerald-900 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<Card className="bg-emerald-800/50 backdrop-blur-sm border-emerald-700/50 shadow-2xl">
					<div className="flex items-center justify-center mb-4">
						<div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full">
							<User className="h-8 w-8 text-white" />
						</div>
					</div>
					<h2 className="text-2xl font-bold text-center mb-6 text-white">
						Employee Registration
					</h2>

					{error && (
						<Alert className="bg-red-500/10 border-red-500/50 text-red-400">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<form onSubmit={handleRegister} className="space-y-4">
						<div className="relative">
							<User className="absolute left-3 top-3 h-4 w-4 text-emerald-400" />
							<Input
								type="text"
								placeholder="Full Name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="pl-10 bg-emerald-700/50 border-emerald-600 text-white placeholder:text-emerald-400 focus:border-emerald-500"
								required
							/>
						</div>

						<div className="relative">
							<Mail className="absolute left-3 top-3 h-4 w-4 text-emerald-400" />
							<Input
								type="email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="pl-10 bg-emerald-700/50 border-emerald-600 text-white placeholder:text-emerald-400 focus:border-emerald-500"
								required
							/>
						</div>

						<div className="relative">
							<Lock className="absolute left-3 top-3 h-4 w-4 text-emerald-400" />
							<Input
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="pl-10 bg-emerald-700/50 border-emerald-600 text-white placeholder:text-emerald-400 focus:border-emerald-500"
								required
							/>
						</div>

						<Button
							type="submit"
							disabled={loading}
							className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium py-2.5 transition-all duration-200 disabled:opacity-50"
						>
							{loading ? (
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									<span>Registering...</span>
								</div>
							) : (
								"Register"
							)}
						</Button>
					</form>
				</Card>

				<div className="mt-6 text-center text-xs text-emerald-500">
					<p>HexCode Staff Portal © 2025</p>
					<p>For support, contact IT Department</p>
				</div>
			</div>
		</div>
	);
}