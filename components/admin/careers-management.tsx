import React, { useState, useEffect } from 'react';
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
  Briefcase
} from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<any>(null);

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

  useEffect(() => {
    fetchCareers();
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
          <p className="text-muted-foreground">Manage job openings and opportunities</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-sm">
            {careers.length} Open Positions
          </Badge>
          <Button onClick={() => setIsAddModalOpen(true)} disabled={saving}>
            <Plus className="w-4 h-4 mr-2" />
            Add Opportunity
          </Button>
        </div>
      </div>

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
    </div>
  );
}
