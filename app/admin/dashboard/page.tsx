import { redirect } from "next/navigation"

// Hidden for now. Keep this route disabled until the new dashboard is needed again.
// import { AdminDashboard } from "@/components/admin/new-admin-dashboard"

export default function AdminDashboardPage() {
  redirect("/admin")
}
