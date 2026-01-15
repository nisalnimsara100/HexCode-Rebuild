"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-context"
import { database } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"
import { Download, FileText, Calendar, TrendingUp, CheckCircle, AlertCircle, Clock, Users } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ReportsAnalytics() {
  const { userProfile } = useAuth()

  // Data States
  const [tickets, setTickets] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [selectedStaffId, setSelectedStaffId] = useState<string>("all")

  // Fetch Data
  useEffect(() => {
    // 1. Users
    const usersRef = ref(database, 'users')
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const userList = Object.entries(data).map(([uid, val]: [string, any]) => ({
          uid,
          name: val.name || "Unknown",
          role: val.role || "guest", // Default to guest, not staff
          department: val.department || "Unassigned"
        }))
          // User requested "only detect the staff role". 
          // Strict filter: Role must be 'staff' specifically. 
          // Also excluding 'Unknown' names as requested previously.
          .filter(u => u.role === 'staff' && u.name !== 'Unknown');

        setUsers(userList)
      }
    })

    // 2. Tickets
    const ticketsRef = ref(database, 'tickets')
    onValue(ticketsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        setTickets(Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })))
      } else {
        setTickets([])
      }
    })

    // 3. Projects
    const projectsRef = ref(database, 'staffdashboard/projects')
    onValue(projectsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        setProjects(Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })))
      } else {
        setProjects([])
      }
    })
  }, [])

  // Derived Data
  const reportData = useMemo(() => {
    let filteredTickets = tickets
    let filteredProjects = projects

    if (selectedStaffId !== 'all') {
      filteredTickets = tickets.filter(t => t.assignedTo === users.find(u => u.uid === selectedStaffId)?.name) // Assuming Ticket stores name. If UID update later.
      // Filter projects where user is in team
      filteredProjects = projects.filter(p => p.team && p.team.includes(selectedStaffId))
    }

    // Metrics
    const completedTickets = filteredTickets.filter(t => t.status === 'closed').length
    const activeTickets = filteredTickets.filter(t => t.status !== 'closed').length

    // Calculate Hours (Tickets actualHours + Projects assumed logic or simple sum)
    const ticketHours = filteredTickets.reduce((acc, t) => acc + (Number(t.actualHours) || 0), 0)

    // For projects we don't have per-user hours yet, so we'll just sum project logged hours if available OR 0
    // If filtering by specific user, relying on tickets is more accurate for "logged hours" unless projects track it.
    const totalHours = ticketHours // + projectHours if available

    const totalTasks = filteredTickets.length
    const completionRate = totalTasks > 0 ? Math.round((completedTickets / totalTasks) * 100) : 0

    // Active Staff Count (Since 'users' state is already strictly filtered to 'staff' role)
    const activeStaffCount = users.length

    return {
      completedTickets,
      activeTickets,
      totalHours,
      completionRate,
      activeStaffCount,
      filteredTickets,
      filteredProjects
    }
  }, [selectedStaffId, tickets, projects, users])

  const generateExcelReport = () => {
    // We create a CSV that Excel opens nicely
    let csvContent = "data:text/csv;charset=utf-8,";

    if (selectedStaffId === 'all') {
      // Summary Report
      csvContent += "Staff Name,Role,Total Tickets,Completed,Pending,Hours Logged\n";
      users.forEach(u => {
        const userTickets = tickets.filter(t => t.assignedTo === u.name); // Mapping by name as per TicketSystem
        const completed = userTickets.filter(t => t.status === 'closed').length;
        const pending = userTickets.length - completed;
        const hours = userTickets.reduce((acc, t) => acc + (Number(t.actualHours) || 0), 0);

        csvContent += `${u.name},${u.role},${userTickets.length},${completed},${pending},${hours}\n`;
      });
      csvContent += `\nTotal Active Staff,${reportData.activeStaffCount}\n`;
    } else {
      // Detailed Single User Report
      const staffName = users.find(u => u.uid === selectedStaffId)?.name || "Staff";
      csvContent += `Report for: ${staffName}\n\n`;

      csvContent += "SECTION: Active Projects\n";
      csvContent += "Project Title,Status,Priority,Due Date\n";
      reportData.filteredProjects.forEach(p => {
        csvContent += `${p.title},${p.status},${p.priority},${p.endDate}\n`;
      });

      csvContent += "\nSECTION: Tickets & Tasks\n";
      csvContent += "Ticket Title,Priority,Status,Hours Logged,Due Date\n";
      reportData.filteredTickets.forEach(t => {
        csvContent += `${t.title},${t.priority},${t.status},${t.actualHours},${t.dueDate}\n`;
      });

      csvContent += `\nTOTALS:,${reportData.totalHours} Hours,${reportData.completedTickets} Completed Tasks\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const fileName = selectedStaffId === 'all'
      ? `HexCode_Staff_Report_ALL_${new Date().toISOString().split('T')[0]}.csv`
      : `HexCode_Report_${users.find(u => u.uid === selectedStaffId)?.name}_${new Date().toISOString().split('T')[0]}.csv`;

    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Staff Analytics & Reports</h2>
          <p className="text-gray-400">Generate insights on team performance and productivity.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
            <SelectTrigger className="w-[200px] bg-gray-900 border-gray-800 text-white">
              <SelectValue placeholder="Select Staff" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800 text-white">
              <SelectItem value="all">All Staff</SelectItem>
              {users.map(u => (
                <SelectItem key={u.uid} value={u.uid}>{u.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={generateExcelReport} className="bg-orange-600 hover:bg-orange-700 text-white whitespace-nowrap">
            <Download className="w-4 h-4 mr-2" /> Download Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-[#1a1f2e] border-gray-800 p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between z-10 relative">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Hours Logged</p>
              <h3 className="text-4xl font-bold text-white mt-2">{reportData.totalHours}h</h3>
              <p className="text-xs text-green-400 mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> Based on ticket logs
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-all" />
        </Card>

        <Card className="bg-[#1a1f2e] border-gray-800 p-6 relative overflow-hidden group hover:border-green-500/30 transition-all">
          <div className="flex items-center justify-between z-10 relative">
            <div>
              <p className="text-sm font-medium text-gray-400">Tasks Completed</p>
              <h3 className="text-4xl font-bold text-white mt-2">{reportData.completedTickets}</h3>
              <p className="text-xs text-green-400 mt-2 flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" /> {reportData.completionRate}% Completion Rate
              </p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-500/5 rounded-full blur-xl group-hover:bg-green-500/10 transition-all" />
        </Card>

        <Card className="bg-[#1a1f2e] border-gray-800 p-6 relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between z-10 relative">
            <div>
              <p className="text-sm font-medium text-gray-400">Active Staff</p>
              <h3 className="text-4xl font-bold text-white mt-2">{selectedStaffId === 'all' ? reportData.activeStaffCount : 1}</h3>
              <p className="text-xs text-purple-400 mt-2">
                {selectedStaffId === 'all' ? 'Full Capacity' : 'Selected User'}
              </p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-all" />
        </Card>
      </div>

      <Card className="bg-[#1a1f2e] border-gray-800 p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          {selectedStaffId === 'all' ? 'Recent Global Activity' : 'User Activity Log'}
        </h3>
        <div className="space-y-4">
          {reportData.filteredTickets.slice(0, 5).map(ticket => (
            <div key={ticket.id} className="flex justify-between items-center p-4 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-gray-700 transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${ticket.priority === 'critical' ? 'bg-red-500/20 text-red-500' :
                  ticket.priority === 'high' ? 'bg-orange-500/20 text-orange-500' :
                    ticket.priority === 'medium' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-gray-500/20 text-gray-500'
                  }`}>
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-white">{ticket.title}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                    <span>Due: {ticket.dueDate || 'N/A'}</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full" />
                    <span>{Number(ticket.actualHours)}h logged</span>
                    {selectedStaffId === 'all' && (
                      <>
                        <span className="w-1 h-1 bg-gray-600 rounded-full" />
                        <span className="text-blue-400">{ticket.assignedTo}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <span className={`text-xs px-2.5 py-1 rounded-full capitalize font-medium ${ticket.status === 'closed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                  ticket.status === 'open' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}>
                  {ticket.status}
                </span>
              </div>
            </div>
          ))}
          {reportData.filteredTickets.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No activity data available.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Performance Overview Chart Placeholder - Could implement Recharts later if requested */}
      <Card className="bg-[#1a1f2e] border-gray-800 p-6 min-h-[300px] flex flex-col justify-center items-center text-center">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8 text-gray-600" />
        </div>
        <h3 className="text-white font-medium">Performance Metrics</h3>
        <p className="text-gray-400 text-sm mt-2 max-w-sm">
          detailed breakdown of productivity metrics and project completion rates will appear here.
        </p>
      </Card>
    </div>
  )
}