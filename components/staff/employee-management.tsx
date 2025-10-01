"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Star,
  MoreVertical,
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  status: "active" | "inactive" | "on-leave";
  skills: string[];
  avatar?: string;
  salary?: number;
  address?: string;
}

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    status: "active",
    skills: [],
    address: "",
  });

  const departments = [
    "Engineering",
    "Design",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
    "Operations",
  ];

  const skillsList = [
    "React",
    "Node.js",
    "Python",
    "Java",
    "Design",
    "Marketing",
    "Sales",
    "Project Management",
    "Data Analysis",
    "UI/UX",
  ];

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, selectedDepartment, selectedStatus]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      // In real implementation, fetch from Firebase
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockEmployees: Employee[] = [
        {
          id: "1",
          name: "John Smith",
          email: "john.smith@hexcode.com",
          phone: "+1 (555) 123-4567",
          position: "Senior Developer",
          department: "Engineering",
          hireDate: "2023-01-15",
          status: "active",
          skills: ["React", "Node.js", "Python"],
          avatar: "/placeholder-user.jpg",
        },
        {
          id: "2",
          name: "Sarah Johnson",
          email: "sarah.johnson@hexcode.com",
          phone: "+1 (555) 234-5678",
          position: "UI/UX Designer",
          department: "Design",
          hireDate: "2023-02-20",
          status: "active",
          skills: ["UI/UX", "Design"],
          avatar: "/placeholder-user.jpg",
        },
        {
          id: "3",
          name: "Mike Davis",
          email: "mike.davis@hexcode.com",
          phone: "+1 (555) 345-6789",
          position: "Project Manager",
          department: "Operations",
          hireDate: "2022-11-10",
          status: "on-leave",
          skills: ["Project Management", "Data Analysis"],
          avatar: "/placeholder-user.jpg",
        },
      ];
      setEmployees(mockEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment !== "all") {
      filtered = filtered.filter((employee) => employee.department === selectedDepartment);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((employee) => employee.status === selectedStatus);
    }

    setFilteredEmployees(filtered);
  };

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.position) {
      alert("Please fill in required fields");
      return;
    }

    const employee: Employee = {
      id: Date.now().toString(),
      name: newEmployee.name!,
      email: newEmployee.email!,
      phone: newEmployee.phone || "",
      position: newEmployee.position!,
      department: newEmployee.department || "Engineering",
      hireDate: new Date().toISOString().split("T")[0],
      status: (newEmployee.status as Employee["status"]) || "active",
      skills: newEmployee.skills || [],
      address: newEmployee.address || "",
    };

    // In real implementation, save to Firebase
    setEmployees([...employees, employee]);
    setIsAddModalOpen(false);
    setNewEmployee({
      name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      status: "active",
      skills: [],
      address: "",
    });
  };

  const handleDeleteEmployee = async (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      // In real implementation, delete from Firebase
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  const getStatusColor = (status: Employee["status"]) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "on-leave":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto"></div>
          <p className="text-gray-400">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
            Employee Management
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Manage your team members, their roles, and information.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-emerald-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Total Employees</p>
                <p className="text-2xl font-semibold text-white">{employees.length}</p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">Active</p>
                <p className="text-2xl font-semibold text-white">
                  {employees.filter((emp) => emp.status === "active").length}
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-400">On Leave</p>
                <p className="text-2xl font-semibold text-white">
                  {employees.filter((emp) => emp.status === "on-leave").length}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={employee.avatar || "/placeholder-user.jpg"}
                    alt={employee.name}
                    className="h-10 w-10 rounded-full bg-gray-600"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-white">{employee.name}</h3>
                    <p className="text-sm text-gray-400">{employee.position}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-400">
                  <Mail className="h-4 w-4 mr-2" />
                  {employee.email}
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Phone className="h-4 w-4 mr-2" />
                  {employee.phone}
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Briefcase className="h-4 w-4 mr-2" />
                  {employee.department}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <Badge className={getStatusColor(employee.status)}>
                  {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                </Badge>
                <span className="text-sm text-gray-400">
                  Joined {new Date(employee.hireDate).toLocaleDateString()}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-1">Skills</p>
                <div className="flex flex-wrap gap-1">
                  {employee.skills.slice(0, 3).map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="text-xs border-gray-600 text-gray-300"
                    >
                      {skill}
                    </Badge>
                  ))}
                  {employee.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                      +{employee.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => setEditingEmployee(employee)}
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-950"
                  onClick={() => handleDeleteEmployee(employee.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Employee Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={newEmployee.department}
                onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newEmployee.status}
                onValueChange={(value) => setNewEmployee({ ...newEmployee, status: value as Employee["status"] })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={newEmployee.address}
                onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEmployee} className="bg-emerald-600 hover:bg-emerald-700">
              Add Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}