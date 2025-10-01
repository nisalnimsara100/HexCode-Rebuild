"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Card className="p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-white mb-6">Access Denied</h2>
        <p className="text-slate-400 mb-6">
          You do not have permission to access this page.
        </p>
        <Button asChild variant="outline" className="w-full border-orange-600 text-orange-300 hover:bg-orange-700/20">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </Card>
    </div>
  );
}