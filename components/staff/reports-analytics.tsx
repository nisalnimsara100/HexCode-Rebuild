"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-context"
import { database } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"
import { Download, FileText, Calendar, TrendingUp, CheckCircle, AlertCircle, Clock } from "lucide-react"

interface TicketItem {
  id: string
  title: string
  status: string
  priority: string
  dueDate: string
  assignedTo: {
    id: string
    name: string
  }
}

export function ReportsAnalytics() {
  const { userProfile } = useAuth()
  const [tickets, setTickets] = useState<TicketItem[]>([])

  useEffect(() => {
    if (!userProfile?.uid) return
    const ticketsRef = ref(database, 'tickets')
    const unsubscribe = onValue(ticketsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const userTickets = Object.entries(data)
          .map(([id, val]: [string, any]) => ({ id, ...val }))
          .filter((t: TicketItem) => t.assignedTo?.id === userProfile.uid)
        setTickets(userTickets)
      }
    })
    return () => unsubscribe()
  }, [userProfile?.uid])

  const generateReport = () => {
    const headers = ["Ticket ID", "Title", "Status", "Priority", "Due Date"]
    const rows = tickets.map(t => [t.id, t.title, t.status, t.priority, t.dueDate])

    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `staff_report_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const completedTickets = tickets.filter(t => t.status === 'closed').length
  const pendingTickets = tickets.filter(t => t.status !== 'closed').length
  const completionRate = tickets.length > 0 ? Math.round((completedTickets / tickets.length) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>
          <p className="text-gray-400">Generate and download your work reports</p>
        </div>
        <Button onClick={generateReport} className="bg-orange-600 hover:bg-orange-700 text-white">
          <Download className="w-4 h-4 mr-2" /> Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Assigned</p>
              <p className="text-3xl font-bold text-white mt-1">{tickets.length}</p>
            </div>
            <FileText className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="bg-gray-900 border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Completed</p>
              <p className="text-3xl font-bold text-green-500 mt-1">{completedTickets}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="bg-gray-900 border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Active/Pending</p>
              <p className="text-3xl font-bold text-orange-500 mt-1">{pendingTickets}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-orange-500 opacity-20" />
          </div>
        </Card>

        <Card className="bg-gray-900 border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Completion Rate</p>
              <p className="text-3xl font-bold text-purple-500 mt-1">{completionRate}%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-500 opacity-20" />
          </div>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {tickets.slice(0, 5).map(ticket => (
            <div key={ticket.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-500 mr-3" />
                <div>
                  <p className="font-medium text-white">{ticket.title}</p>
                  <p className="text-xs text-gray-400">Due: {ticket.dueDate}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${ticket.status === 'closed' ? 'bg-green-900/30 text-green-400' :
                    ticket.status === 'open' ? 'bg-orange-900/30 text-orange-400' :
                      'bg-blue-900/30 text-blue-400'
                  }`}>
                  {ticket.status}
                </span>
              </div>
            </div>
          ))}
          {tickets.length === 0 && (
            <p className="text-gray-500 text-center py-4">No recent activity found.</p>
          )}
        </div>
      </Card>
    </div>
  )
}