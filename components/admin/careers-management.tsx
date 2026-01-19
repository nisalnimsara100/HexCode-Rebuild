import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { database } from '@/lib/firebase';
import { ref, onValue, set } from 'firebase/database';
import {
  Plus,
  Edit3,
  Trash2,
  Loader2,
  X,
  Code,
  Palette,
  Monitor,
  Target,
  DollarSign,
  Users,
  Zap,
  Star,
  TrendingUp,
  Briefcase,
  Download,
  FileText,
  Calendar,
  Search,
  CheckCircle,
  Eye,
  ExternalLink,
  Linkedin,
  Globe,
  AlertTriangle
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cvUrl: string;
  appliedAt: string;
  status: string;
  city?: string;
  country?: string;
  address?: string;
  yearsOfExperience?: string | number;
  currentRole?: string;
  expectedSalary?: string;
  availabilityDate?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  education?: any[];
  workExperience?: any[];
  technicalSkills?: string[];
  softSkills?: string[];
  isDuplicate?: boolean;
  [key: string]: any;
}

const getDepartmentIcon = (department: string) => {
  switch (department) {
    case "Engineering": return <Code className="w-4 h-4" />
    case "Design": return <Palette className="w-4 h-4" />
    case "Infrastructure": return <Monitor className="w-4 h-4" />
    case "Marketing": return <Target className="w-4 h-4" />
    case "Sales": return <DollarSign className="w-4 h-4" />
    case "HR": return <Users className="w-4 h-4" />
    case "IT": return <Zap className="w-4 h-4" />
    case "Leadership": return <Star className="w-4 h-4" />
    case "Data": return <TrendingUp className="w-4 h-4" />
    default: return <Briefcase className="w-4 h-4" />
  }
}

export function CareersManagement() {
  const [careers, setCareers] = useState<any[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [viewMode, setViewMode] = useState<'opportunities' | 'applications'>('opportunities');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<any>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [showDuplicates, setShowDuplicates] = useState(false);

  // Process applications to identify duplicates
  const { processedApplications, duplicateCount } = useMemo(() => {
    const sorted = [...applications].sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
    const seen = new Set();
    let count = 0;

    const processed = sorted.map(app => {
      // Create a unique key based on normalized email and job ID
      // This identifies multiple applications from the same person for the same job
      const key = `${app.email.toLowerCase().trim()}-${app.jobId}`;

      if (seen.has(key)) {
        count++;
        return { ...app, isDuplicate: true };
      }

      seen.add(key);
      return { ...app, isDuplicate: false };
    });

    return { processedApplications: processed, duplicateCount: count };
  }, [applications]);

  const filteredApplications = processedApplications.filter(app => showDuplicates || !app.isDuplicate);

  const [newCareer, setNewCareer] = useState({
    title: '',
    department: '',
    level: 'Senior',
    location: 'Remote / Kurunegala',
    type: 'Full-time',
    experience: '',
    salary: '',
    technologies: [''],
    description: '',
    requirements: [''],
    posted: new Date().toISOString()
  });

  const [newTech, setNewTech] = useState('');

  const departments = ["Engineering", "Design", "Infrastructure", "Marketing", "Sales", "HR", "IT", "Leadership", "Data"];
  const levels = ["Intern", "Associate", "Senior", "Lead", "Manager"];
  const types = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];

  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  useEffect(() => {
    fetchCareers();
    fetchApplications();
  }, []);

  const fetchCareers = () => {
    setLoading(true);
    const careersRef = ref(database, "careers");
    const unsubscribe = onValue(careersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const careersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
          technologies: Array.isArray(data[key].technologies) ? data[key].technologies : [],
          requirements: Array.isArray(data[key].requirements) ? data[key].requirements : []
        }));
        setCareers(careersArray);
      } else {
        setCareers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  };

  const fetchApplications = () => {
    const applicationsRef = ref(database, "applications");
    const unsubscribe = onValue(applicationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const appsArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...(value as any)
        })) as Application[];
        // Sort by date descending
        appsArray.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
        setApplications(appsArray);
      } else {
        setApplications([]);
      }
    });

    return () => unsubscribe();
  };

  const handleDownloadApplications = () => {
    // Filter duplicates for export as per user request
    const uniqueApplications = processedApplications.filter(app => !app.isDuplicate);

    if (uniqueApplications.length === 0) {
      alert("No valid applications to download");
      return;
    }

    const exportData = uniqueApplications.map(app => ({
      'Job Title': app.jobTitle,
      'Applicant Name': `${app.firstName} ${app.lastName}`,
      'Email': app.email,
      'Phone': app.phone,
      'Location': `${app.city}, ${app.country}`,
      'Experience': `${app.yearsOfExperience} years`,
      'Current Role': app.currentRole,
      'Expected Salary': app.expectedSalary,
      'Availability': app.availabilityDate,
      'Applied Date': new Date(app.appliedAt).toLocaleDateString(),
      'CV Link': app.cvUrl,
      'LinkedIn': app.linkedinUrl || 'N/A',
      'Portfolio': app.portfolioUrl || 'N/A'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applications");
    XLSX.writeFile(wb, "HexCode_Applications.xlsx");
  };

  // Delete Confirmation State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<'single' | 'all'>('single');
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);

  const handleDeleteApplicationClick = (e: React.MouseEvent, appId: string) => {
    e.stopPropagation();
    setDeleteTarget('single');
    setApplicationToDelete(appId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteAllClick = () => {
    setDeleteTarget('all');
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setSaving(true);
    try {
      if (deleteTarget === 'all') {
        const applicationsRef = ref(database, 'applications');
        await set(applicationsRef, null);
        // Note: Bulk deleting files via PHP script loop is risky/slow. 
        // For now, we clear the DB. Files might need manual cleanup or a bulk delete endpoint.
      } else if (applicationToDelete) {
        const app = applications.find(a => a.id === applicationToDelete);
        if (app && app.cvUrl) {
          await deleteCVFile(app.cvUrl);
        }
        const applicationRef = ref(database, `applications/${applicationToDelete}`);
        await set(applicationRef, null);
      }

      setIsDeleteModalOpen(false);
      setIsApplicationModalOpen(false); // Close details modal if open
      setSelectedApplication(null);
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCVFile = async (url: string) => {
    if (!url) return;
    try {
      const filename = url.split('/').pop();
      if (!filename) return;

      await fetch('/delete_cv.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename })
      });
    } catch (e) {
      console.error("Error deleting CV file:", e);
    }
  };

  const saveCareerToFirebase = async (careerData: any, careerId?: string) => {
    setSaving(true);
    try {
      const sanitizedCareer = {
        ...careerData,
        technologies: careerData.technologies.filter((tech: string) => tech.trim() !== ''),
        requirements: careerData.requirements.filter((req: string) => req.trim() !== ''),
        posted: careerData.posted || new Date().toISOString()
      };

      const finalCareerId = careerId || Date.now().toString();
      const careerRef = ref(database, `careers/${finalCareerId}`);
      await set(careerRef, sanitizedCareer);

      return true;
    } catch (error) {
      console.error("Error saving career:", error);
      alert("Failed to save career. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleAddCareer = async () => {
    if (!newCareer.title.trim() || !newCareer.description.trim()) {
      alert("Please fill in required fields");
      return;
    }

    const success = await saveCareerToFirebase(newCareer);

    if (success) {
      setIsAddModalOpen(false);
      setNewCareer({
        title: '',
        department: '',
        level: 'Senior',
        location: 'Remote / Kurunegala',
        type: 'Full-time',
        experience: '',
        salary: '',
        technologies: [''],
        description: '',
        requirements: [''],
        posted: new Date().toISOString()
      });
    }
  };

  const handleEditCareer = async () => {
    if (!selectedCareer) return;

    const success = await saveCareerToFirebase(selectedCareer, selectedCareer.id);

    if (success) {
      setIsEditModalOpen(false);
      setSelectedCareer(null);
    }
  };

  const handleDeleteCareer = async (careerId: string) => {
    if (!confirm("Are you sure you want to delete this opportunity?")) return;

    setSaving(true);
    try {
      const careerRef = ref(database, `careers/${careerId}`);
      await set(careerRef, null);
    } catch (error) {
      console.error("Error deleting career:", error);
      alert("Failed to delete career. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="text-muted-foreground">Loading job opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Careers Management</h2>
          <p className="text-muted-foreground">Manage job openings and applications</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-muted/50 p-1 rounded-lg border">
            <button
              onClick={() => setViewMode('opportunities')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'opportunities'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Opportunities
            </button>
            <button
              onClick={() => setViewMode('applications')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'applications'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Applications
              {applications.length > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] min-w-5 justify-center">
                  {applications.length}
                </Badge>
              )}
            </button>
          </div>

          {viewMode === 'opportunities' ? (
            <Button onClick={() => setIsAddModalOpen(true)} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Opportunity
            </Button>
          ) : (
            <div className="flex gap-2">
              {duplicateCount > 0 && (
                <Button
                  onClick={() => setShowDuplicates(!showDuplicates)}
                  variant={showDuplicates ? "secondary" : "outline"}
                  className="border-dashed"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {showDuplicates ? "Hide Duplicates" : `Show Duplicates (${duplicateCount})`}
                </Button>
              )}
              {applications.length > 0 && (
                <Button onClick={handleDeleteAllClick} variant="destructive" className="bg-red-600 hover:bg-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete All
                </Button>
              )}
              <Button onClick={handleDownloadApplications} variant="outline" className="border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-500">
                <Download className="w-4 h-4 mr-2" />
                Export to Excel
              </Button>
            </div>
          )}
        </div>
      </div>

      {viewMode === 'opportunities' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {careers.map((career) => (
            <Card key={career.id} className="relative overflow-hidden group">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{career.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="flex items-center gap-1.5">
                        {getDepartmentIcon(career.department)}
                        {career.department}
                      </Badge>
                      <Badge variant="outline">{career.level}</Badge>
                      <Badge variant="outline">{career.type}</Badge>
                      {career.posted && new Date().getTime() - new Date(career.posted).getTime() < 7 * 24 * 60 * 60 * 1000 && (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600">New</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCareer(career);
                        setIsEditModalOpen(true);
                      }}
                      disabled={saving}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCareer(career.id)}
                      disabled={saving}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {career.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Location</span>
                    <span className="font-medium">{career.location}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Salary</span>
                    <span className="font-medium text-emerald-600">{career.salary}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Experience</span>
                    <span className="font-medium">{career.experience}</span>
                  </div>
                </div>

                {career.technologies && career.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {career.technologies.slice(0, 4).map((tech: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs font-normal">
                        {tech}
                      </Badge>
                    ))}
                    {career.technologies.length > 4 && (
                      <Badge variant="secondary" className="text-xs font-normal">+{career.technologies.length - 4}</Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((app) => (
            <Card key={app.id} className={`relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer ${app.isDuplicate ? 'opacity-75 bg-muted/30 border-dashed' : ''}`} onClick={() => {
              setSelectedApplication(app);
              setIsApplicationModalOpen(true);
            }}>
              <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                {app.isDuplicate && (
                  <Badge variant="destructive" className="text-[10px] uppercase">Duplicate</Badge>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className={`h-6 w-6 rounded-full shadow-md ${!app.isDuplicate ? 'opacity-0 group-hover:opacity-100 transition-opacity' : ''}`}
                  onClick={(e) => handleDeleteApplicationClick(e, app.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base font-semibold">{app.firstName} {app.lastName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{app.jobTitle}</p>
                  </div>
                  {!app.isDuplicate && (
                    <Badge variant={app.status === 'pending' ? 'outline' : 'secondary'}>
                      {app.status || 'Received'}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span className="truncate">{app.yearsOfExperience}y Exp</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="truncate">{new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t mt-2">
                  <div className="flex items-center gap-2">
                    {app.cvUrl ? (
                      <div className="flex items-center text-xs text-blue-500" onClick={(e) => {
                        e.stopPropagation();
                        const url = app.cvUrl.startsWith('http') ? app.cvUrl : `/cvs/${app.cvUrl.split('/').pop()}`;
                        window.open(url, '_blank');
                      }}>
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        CV Available
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">No CV</span>
                    )}
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 text-xs ml-auto">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredApplications.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center text-muted-foreground border rounded-lg border-dashed">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 opacity-50" />
              </div>
              <p className="font-medium">No applications found</p>
              <p className="text-sm mt-1">{applications.length > 0 ? "All applications are hidden as duplicates" : "New applications will appear here"}</p>
            </div>
          )}
        </div>
      )}

      {/* Application Details Modal */}
      <Dialog open={isApplicationModalOpen} onOpenChange={setIsApplicationModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6 py-4">
              {/* Header Info */}
              <div className="flex flex-col md:flex-row justify-between gap-4 border-b pb-6">
                <div>
                  <h3 className="text-2xl font-bold">{selectedApplication.firstName} {selectedApplication.lastName}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <span className="font-medium text-foreground">{selectedApplication.jobTitle}</span>
                    <span>•</span>
                    <span>Applied on {new Date(selectedApplication.appliedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {selectedApplication.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {selectedApplication.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-muted-foreground" />
                      {selectedApplication.city}, {selectedApplication.country}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => window.open(selectedApplication.cvUrl, '_blank')} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download CV
                  </Button>
                  <div className="flex gap-2">
                    {selectedApplication.linkedinUrl && (
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => window.open(selectedApplication.linkedinUrl, '_blank')}
                        className="bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20 border border-[#0077b5]/20"
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="w-4 h-4" />
                      </Button>
                    )}
                    {selectedApplication.portfolioUrl && (
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => window.open(selectedApplication.portfolioUrl, '_blank')}
                        className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border border-purple-500/20"
                        title="Portfolio"
                      >
                        <Globe className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Professional Summary
                    </h4>
                    <div className="bg-muted/30 p-4 rounded-lg space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground">Current Role</div>
                        <div className="font-medium text-right">{selectedApplication.currentRole || 'N/A'}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground">Experience</div>
                        <div className="font-medium text-right">{selectedApplication.yearsOfExperience} Years</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground">Expected Salary</div>
                        <div className="font-medium text-right">{selectedApplication.expectedSalary || 'N/A'}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground">Availability</div>
                        <div className="font-medium text-right">{selectedApplication.availabilityDate || 'N/A'}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4" /> Skills & Expertise
                    </h4>
                    <div className="space-y-4">
                      {selectedApplication.technicalSkills && selectedApplication.technicalSkills.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Technical Skills</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedApplication.technicalSkills.map((skill: string, i: number) => (
                              <Badge key={i} variant="secondary">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedApplication.softSkills && selectedApplication.softSkills.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Soft Skills</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedApplication.softSkills.map((skill: string, i: number) => (
                              <Badge key={i} variant="outline">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {selectedApplication.education && selectedApplication.education.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" /> Education
                      </h4>
                      <div className="space-y-3">
                        {selectedApplication.education.map((edu: any, i: number) => (
                          <Card key={i} className="p-3 bg-muted/20">
                            <div className="font-medium">{edu.degree}</div>
                            <div className="text-sm text-muted-foreground">{edu.institution}</div>
                            <div className="text-xs text-muted-foreground mt-1">{edu.graduationYear}</div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedApplication.workExperience && selectedApplication.workExperience.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Work History
                      </h4>
                      <div className="space-y-3">
                        {selectedApplication.workExperience.map((work: any, i: number) => (
                          <Card key={i} className="p-3 bg-muted/20">
                            <div className="font-medium">{work.position}</div>
                            <div className="text-sm font-medium text-emerald-600">{work.company}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {work.startDate} - {work.endDate || 'Present'}
                            </div>
                            {work.description && (
                              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{work.description}</p>
                            )}
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedApplication.coverLetter && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Cover Letter / Note</h4>
                  <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedApplication.coverLetter}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsApplicationModalOpen(false)}>Close Details</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Opportunity</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label>Job Title *</Label>
                <Input
                  value={newCareer.title}
                  onChange={(e) => setNewCareer({ ...newCareer, title: e.target.value })}
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>
              <div>
                <Label>Department</Label>
                <Select
                  value={newCareer.department}
                  onValueChange={(val) => setNewCareer({ ...newCareer, department: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(d => (
                      <SelectItem key={d} value={d}>
                        <div className="flex items-center gap-2">
                          {getDepartmentIcon(d)}
                          {d}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Level</Label>
                  <Select
                    value={newCareer.level}
                    onValueChange={(val) => setNewCareer({ ...newCareer, level: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Type</Label>
                  <Select
                    value={newCareer.type}
                    onValueChange={(val) => setNewCareer({ ...newCareer, type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Salary Range</Label>
                <Input
                  value={newCareer.salary}
                  onChange={(e) => setNewCareer({ ...newCareer, salary: e.target.value })}
                  placeholder="e.g. $80k - $120k"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Location</Label>
                <Input
                  value={newCareer.location}
                  onChange={(e) => setNewCareer({ ...newCareer, location: e.target.value })}
                  placeholder="e.g. Remote / New York"
                />
              </div>
              <div>
                <Label>Experience</Label>
                <Input
                  value={newCareer.experience}
                  onChange={(e) => setNewCareer({ ...newCareer, experience: e.target.value })}
                  placeholder="e.g. 3-5 years"
                />
              </div>
              <div>
                <Label>Description *</Label>
                <Textarea
                  value={newCareer.description}
                  onChange={(e) => setNewCareer({ ...newCareer, description: e.target.value })}
                  rows={4}
                  placeholder="Job description..."
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <Label>Technologies (Comma separated or Add one by one)</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="Add technology tag..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newTech.trim()) {
                        setNewCareer({ ...newCareer, technologies: [...newCareer.technologies, newTech.trim()] });
                        setNewTech('');
                      }
                    }}
                  />
                  <Button type="button" onClick={() => {
                    if (newTech.trim()) {
                      setNewCareer({ ...newCareer, technologies: [...newCareer.technologies, newTech.trim()] });
                      setNewTech('');
                    }
                  }}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newCareer.technologies.map((tech, idx) => tech && (
                    <Badge key={idx} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                      {tech}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-500"
                        onClick={() => setNewCareer({
                          ...newCareer,
                          technologies: newCareer.technologies.filter((_, i) => i !== idx)
                        })}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCareer} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Create Opportunity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Opportunity</DialogTitle>
          </DialogHeader>
          {selectedCareer && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <Label>Job Title *</Label>
                  <Input
                    value={selectedCareer.title}
                    onChange={(e) => setSelectedCareer({ ...selectedCareer, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Department</Label>
                  <Select
                    value={selectedCareer.department}
                    onValueChange={(val) => setSelectedCareer({ ...selectedCareer, department: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(d => (
                        <SelectItem key={d} value={d}>
                          <div className="flex items-center gap-2">
                            {getDepartmentIcon(d)}
                            {d}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Level</Label>
                    <Select
                      value={selectedCareer.level}
                      onValueChange={(val) => setSelectedCareer({ ...selectedCareer, level: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={selectedCareer.type}
                      onValueChange={(val) => setSelectedCareer({ ...selectedCareer, type: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Salary Range</Label>
                  <Input
                    value={selectedCareer.salary}
                    onChange={(e) => setSelectedCareer({ ...selectedCareer, salary: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Location</Label>
                  <Input
                    value={selectedCareer.location}
                    onChange={(e) => setSelectedCareer({ ...selectedCareer, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Experience</Label>
                  <Input
                    value={selectedCareer.experience}
                    onChange={(e) => setSelectedCareer({ ...selectedCareer, experience: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Description *</Label>
                  <Textarea
                    value={selectedCareer.description}
                    onChange={(e) => setSelectedCareer({ ...selectedCareer, description: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <Label>Technologies</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      placeholder="Add technology tag..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newTech.trim()) {
                          setSelectedCareer({ ...selectedCareer, technologies: [...(selectedCareer.technologies || []), newTech.trim()] });
                          setNewTech('');
                        }
                      }}
                    />
                    <Button type="button" onClick={() => {
                      if (newTech.trim()) {
                        setSelectedCareer({ ...selectedCareer, technologies: [...(selectedCareer.technologies || []), newTech.trim()] });
                        setNewTech('');
                      }
                    }}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCareer.technologies && selectedCareer.technologies.map((tech: string, idx: number) => tech && (
                      <Badge key={idx} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                        {tech}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-500"
                          onClick={() => setSelectedCareer({
                            ...selectedCareer,
                            technologies: selectedCareer.technologies.filter((_: any, i: number) => i !== idx)
                          })}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCareer} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete {deleteTarget === 'all' ? 'ALL applications' : 'this application'}? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} disabled={saving}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              {deleteTarget === 'all' ? 'Delete All' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
}
