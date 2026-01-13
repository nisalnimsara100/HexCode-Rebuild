"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import {
  Upload,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  X,
  CheckCircle,
  Loader2,
  Sparkles,
  Plus,
  Trash2,
  GraduationCap,
  Award,
  Globe,
  Code
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CVParser, ParsedCVData } from "@/lib/cvParser"
import { type Career } from "@/components/careers/career-card"
import { database } from "@/lib/firebase"
import { ref, push, set } from "firebase/database"
import emailjs from '@emailjs/browser'


// Sri Lankan Universities Data
const SRI_LANKAN_UNIVERSITIES = [
  // State Universities
  "University of Colombo",
  "University of Peradeniya",
  "University of Kelaniya",
  "University of Sri Jayewardenepura",
  "University of Moratuwa",
  "University of Ruhuna",
  "Eastern University, Sri Lanka",
  "South Eastern University of Sri Lanka",
  "Wayamba University of Sri Lanka",
  "University of Jaffna",
  "Rajarata University of Sri Lanka",
  "Sabaragamuwa University of Sri Lanka",
  "Uva Wellassa University",
  "University of the Visual & Performing Arts",
  "Open University of Sri Lanka",

  // Private Universities & Institutes
  "SLIIT (Sri Lanka Institute of Information Technology)",
  "NSBM Green University",
  "Sri Lanka International Buddhist Academy",
  "APIIT Sri Lanka",
  "Informatics Institute of Technology (IIT)",
  "Horizon Campus",
  "KDU (General Sir John Kotelawala Defence University)",
  "ICBT Campus",
  "ANC Education",
  "Australian College of Business & Technology (ACBT)",
  "ESOFT Metro Campus",
  "National Institute of Business Management (NIBM)",
  "CMS College of Science and Commerce",
  "HNDE/HND Institutes",
  "Other"
]

// Degree Programs
const DEGREE_PROGRAMS = [
  // Computer Science & IT
  "Bachelor of Computer Science",
  "Bachelor of Information Technology",
  "Bachelor of Software Engineering",
  "Bachelor of Computer Engineering",
  "Bachelor of Information Systems",
  "Bachelor of Cyber Security",
  "Bachelor of Data Science",
  "Bachelor of Artificial Intelligence",

  // Engineering
  "Bachelor of Civil Engineering",
  "Bachelor of Mechanical Engineering",
  "Bachelor of Electrical Engineering",
  "Bachelor of Electronic Engineering",
  "Bachelor of Chemical Engineering",
  "Bachelor of Materials Engineering",
  "Bachelor of Production Engineering",

  // Business & Management
  "Bachelor of Business Administration",
  "Bachelor of Management",
  "Bachelor of Commerce",
  "Bachelor of Accounting & Finance",
  "Bachelor of Marketing",
  "Bachelor of Human Resource Management",
  "Bachelor of International Business",

  // Science
  "Bachelor of Science",
  "Bachelor of Applied Sciences",
  "Bachelor of Mathematics",
  "Bachelor of Physics",
  "Bachelor of Chemistry",
  "Bachelor of Biology",
  "Bachelor of Environmental Science",

  // Arts & Social Sciences
  "Bachelor of Arts",
  "Bachelor of Social Sciences",
  "Bachelor of Psychology",
  "Bachelor of Mass Communication",
  "Bachelor of Journalism",
  "Bachelor of English",
  "Bachelor of Political Science",

  // Other Programs
  "Bachelor of Architecture",
  "Bachelor of Medicine",
  "Bachelor of Dental Surgery",
  "Bachelor of Pharmacy",
  "Bachelor of Nursing",
  "Bachelor of Law (LLB)",
  "Bachelor of Education",
  "Diploma Programs",
  "Higher National Diploma (HND)",
  "Certificate Programs",
  "Other"
]




type Education = {
  institution: string;
  customInstitution?: string;
  degree: string;
  customDegree?: string;
  fieldOfStudy: string;
  graduationYear: number;
  gpa?: string;
}

type WorkExperience = {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrentJob: boolean;
}

type Reference = {
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
}

type ApplicationFormData = {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  dateOfBirth: string;

  // Professional Information
  hasWorkExperience: boolean;
  yearsOfExperience: number;
  currentRole: string;
  expectedSalary: string;
  availabilityDate: string;

  // Education
  education: Education[];

  // Work Experience
  workExperience: WorkExperience[];

  // Skills & Technologies
  technicalSkills: string[];
  softSkills: string[];
  languages: string[];
  certifications: string[];

  // Additional Information
  coverLetter: string;
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  websiteUrl: string;

  // References
  references: Reference[];

  // Other
  howDidYouHear: string;
  additionalNotes: string;
}

interface JobApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedJob: Career | null;
}

export function EnhancedJobApplicationForm({ isOpen, onClose, selectedJob }: JobApplicationFormProps) {
  const { addToast } = useToast()

  const [formData, setFormData] = useState<ApplicationFormData>({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    dateOfBirth: "",

    // Professional Information
    hasWorkExperience: selectedJob?.level !== "Intern",
    yearsOfExperience: 0,
    currentRole: "",
    expectedSalary: "",
    availabilityDate: "",

    // Education
    education: [{
      institution: "",
      customInstitution: "",
      degree: "",
      customDegree: "",
      fieldOfStudy: "",
      graduationYear: new Date().getFullYear(),
      gpa: ""
    }],

    // Work Experience
    workExperience: [],

    // Skills & Technologies
    technicalSkills: [],
    softSkills: [],
    languages: ["English"],
    certifications: [],

    // Additional Information
    coverLetter: "",
    portfolioUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    websiteUrl: "",

    // References
    references: [],

    // Other
    howDidYouHear: "",
    additionalNotes: "",
  })

  // Helper to get initial state
  const getInitialFormData = (job: Career | null): ApplicationFormData => ({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    dateOfBirth: "",
    hasWorkExperience: job?.level !== "Intern",
    yearsOfExperience: 0,
    currentRole: "",
    expectedSalary: "",
    availabilityDate: "",
    education: [{
      institution: "",
      customInstitution: "",
      degree: "",
      customDegree: "",
      fieldOfStudy: "",
      graduationYear: new Date().getFullYear(),
      gpa: ""
    }],
    workExperience: [],
    technicalSkills: [],
    softSkills: [],
    languages: ["English"],
    certifications: [],
    coverLetter: "",
    portfolioUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    websiteUrl: "",
    references: [],
    howDidYouHear: "",
    additionalNotes: "",
  })

  // Reset form when selectedJob changes
  useEffect(() => {
    if (isOpen && selectedJob) {
      setFormData(getInitialFormData(selectedJob))
      setUploadedCV(null)
      setCurrentStep(1)
      setIsSubmitting(false)
    }
  }, [selectedJob, isOpen])

  const [uploadedCV, setUploadedCV] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAutoFilling, setIsAutoFilling] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [universitySearch, setUniversitySearch] = useState("")
  const [degreeSearch, setDegreeSearch] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: keyof ApplicationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      addToast("Invalid File Type", "Please upload a PDF or Word document.", "error")
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      addToast("File Too Large", "Please upload a file smaller than 5MB.", "error")
      return
    }

    setIsUploading(true)
    try {
      setUploadedCV(file)
      addToast("CV Uploaded Successfully", "Your CV has been uploaded. Click 'Auto Fill' to extract information.", "success")
    } catch (error) {
      addToast("Upload Failed", "Failed to upload CV. Please try again.", "error")
    } finally {
      setIsUploading(false)
    }
  }

  const handleAutoFill = async () => {
    if (!uploadedCV) {
      addToast("No CV Uploaded", "Please upload a CV first to use auto-fill.", "error")
      return
    }

    setIsAutoFilling(true)
    try {
      const parsedData = await CVParser.parseCV(uploadedCV)

      // Update form with parsed data
      setFormData(prev => ({
        ...prev,
        firstName: parsedData.firstName,
        lastName: parsedData.lastName,
        email: parsedData.email,
        phone: parsedData.phone,
        address: parsedData.address,
        city: parsedData.city,
        country: parsedData.country,
        yearsOfExperience: parsedData.yearsOfExperience,
        currentRole: parsedData.currentRole,
        education: parsedData.education,
        workExperience: parsedData.workExperience,
        technicalSkills: parsedData.technicalSkills,
        softSkills: parsedData.softSkills,
        languages: parsedData.languages,
        certifications: parsedData.certifications,
        portfolioUrl: parsedData.portfolioUrl,
        linkedinUrl: parsedData.linkedinUrl,
        githubUrl: parsedData.githubUrl,
        websiteUrl: parsedData.websiteUrl,
        hasWorkExperience: parsedData.workExperience.length > 0
      }))

      addToast("Auto-fill Complete", "Information extracted from CV. Please review and edit as needed.", "success")
    } catch (error) {
      addToast("Auto-fill Failed", "Failed to extract information from CV. Please fill manually.", "error")
    } finally {
      setIsAutoFilling(false)
    }
  }

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: "",
        customInstitution: "",
        degree: "",
        customDegree: "",
        fieldOfStudy: "",
        graduationYear: new Date().getFullYear(),
        gpa: ""
      }]
    }))
  }

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const addWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
        isCurrentJob: false
      }]
    }))
  }

  const removeWorkExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }))
  }

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: any) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((work, i) =>
        i === index ? { ...work, [field]: value } : work
      )
    }))
  }

  const addSkill = (type: 'technicalSkills' | 'softSkills' | 'languages' | 'certifications', skill: string) => {
    if (!skill.trim()) return

    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], skill.trim()]
    }))
  }

  const removeSkill = (type: 'technicalSkills' | 'softSkills' | 'languages' | 'certifications', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJob) return

    setIsSubmitting(true)
    try {
      if (!uploadedCV) {
        addToast("CV Required", "Please upload your CV to submit the application.", "error")
        setIsSubmitting(false) // Early exit needs this reset or rely on finally if I throw
        return
      }

      // 1. Upload CV Locally (to /api/upload)
      const cvFormData = new FormData();
      cvFormData.append("file", uploadedCV);

      const uploadRes = await fetch('/api/upload', {
        method: "POST",
        body: cvFormData
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload CV.");
      }

      const uploadData = await uploadRes.json();
      // Construct absolute URL
      const cvUrl = `${window.location.origin}${uploadData.path}`;

      // 2. Save Application to Firebase
      const applicationRef = ref(database, 'applications');
      const newApplication = {
        jobId: selectedJob.id.toString(), // Ensure string ID
        jobTitle: selectedJob.title,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        dateOfBirth: formData.dateOfBirth,
        hasWorkExperience: formData.hasWorkExperience,
        yearsOfExperience: formData.yearsOfExperience,
        currentRole: formData.currentRole,
        education: formData.education,
        workExperience: formData.workExperience,
        technicalSkills: formData.technicalSkills,
        softSkills: formData.softSkills,
        linkedinUrl: formData.linkedinUrl,
        portfolioUrl: formData.portfolioUrl,
        cvUrl: cvUrl,
        appliedAt: new Date().toISOString(),
        status: 'pending'
      };

      await push(applicationRef, newApplication);

      // 3. Send Email Notification via EmailJS
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_id";
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_id";
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "public_key";

      if (serviceId !== "service_id") {
        // Format complex arrays into readable strings
        const educationString = formData.education.map(edu =>
          `${edu.degree} in ${edu.fieldOfStudy} at ${edu.institution} (${edu.graduationYear})`
        ).join("\n") || "N/A";

        const workString = formData.workExperience.map(work =>
          `${work.position} at ${work.company} (${work.startDate} - ${work.endDate})\n${work.description}`
        ).join("\n\n") || "N/A";

        const referenceString = formData.references.map(ref =>
          `${ref.name} (${ref.position} at ${ref.company}) - ${ref.email} / ${ref.phone}`
        ).join("\n") || "N/A";

        const emailParams = {
          // Job Info
          job_title: selectedJob.title,
          job_department: selectedJob.department,

          // Personal Info
          candidate_name: `${formData.firstName} ${formData.lastName}`,
          candidate_email: formData.email,
          phone: formData.phone,
          address: formData.address,
          location: `${formData.city}, ${formData.country}`,
          dob: formData.dateOfBirth,

          // Professional Summary
          current_role: formData.currentRole || "N/A",
          years_experience: formData.yearsOfExperience || "0",
          expected_salary: formData.expectedSalary || "N/A",
          availability_date: formData.availabilityDate || "N/A",

          // Skills
          tech_skills: formData.technicalSkills.join(", ") || "N/A",
          soft_skills: formData.softSkills.join(", ") || "N/A",
          languages: formData.languages.join(", ") || "N/A",
          certifications: formData.certifications.join(", ") || "N/A",

          // Long Form Data
          education_details: educationString,
          work_history: workString,
          references_list: referenceString,
          cover_letter: formData.coverLetter || "N/A",
          additional_notes: formData.additionalNotes || "N/A",

          // Links
          linkedin: formData.linkedinUrl || "N/A",
          portfolio: formData.portfolioUrl || "N/A",
          github: formData.githubUrl || "N/A",
          website: formData.websiteUrl || "N/A",
          cv_link: cvUrl
        };

        console.log("Sending email with params:", emailParams); // Debug log

        await emailjs.send(
          serviceId,
          templateId,
          emailParams,
          publicKey
        );
      } else {
        console.warn("EmailJS not configured. Email not sent.");
      }

      addToast("Application Submitted", "Your application has been submitted successfully! We'll be in touch soon.", "success")

      onClose()
      // Reset form could go here
    } catch (error: any) {
      console.error("Application submission error:", error)
      const errorMessage = error?.message || "Failed to submit application. Please try again.";
      addToast("Submission Failed", errorMessage, "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedJob) return null

  const stepTitles = [
    "CV & Personal",
    "Education",
    "Skills",
    "Review"
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[92vw] max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-3 sm:p-4">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-lg font-bold truncate">
                Apply for {selectedJob.title}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {selectedJob.department} • {selectedJob.level} • {selectedJob.type}
              </DialogDescription>
            </div>
          </div>

          {/* Progress Steps - Mobile Friendly */}
          <div className="mt-4 mb-4">
            {/* Desktop Progress */}
            <div className="hidden sm:flex items-center justify-center gap-2">
              {stepTitles.map((title, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${index + 1 <= currentStep
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                    {index + 1}
                  </div>
                  <span className={`ml-1 text-xs font-medium hidden md:inline max-w-24 truncate ${index + 1 <= currentStep
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-500 dark:text-gray-400'
                    }`}>
                    {title.split(' ')[0]}
                  </span>
                  {index < stepTitles.length - 1 && (
                    <div className={`ml-1 w-8 h-0.5 ${index + 1 < currentStep
                      ? 'bg-emerald-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                      }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Progress */}
            <div className="sm:hidden space-y-2">
              <div className="flex items-center justify-center gap-1">
                {stepTitles.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded-full max-w-16 ${index + 1 <= currentStep
                      ? 'bg-emerald-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                  />
                ))}
              </div>
              <div className="text-center">
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Step {currentStep}: {stepTitles[currentStep - 1]}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="w-full overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-3 w-full">
            {/* Step 1: CV Upload & Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-3 w-full">
                {/* CV Upload Section */}
                <Card className="p-3 sm:p-4 bg-gradient-to-br from-emerald-50 to-transparent dark:from-emerald-950/20 border-emerald-200 dark:border-emerald-800 w-full">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-emerald-500" />
                      <h3 className="text-lg font-semibold">CV/Resume Upload</h3>
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                      <div className="w-full">
                        <Input
                          type="file"
                          ref={fileInputRef}
                          accept=".pdf,.doc,.docx"
                          onChange={handleCVUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="w-full border-dashed border-2 h-12 text-sm min-w-0"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              <span className="hidden sm:inline">Uploading...</span>
                              <span className="sm:hidden">Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              <span className="hidden sm:inline">{uploadedCV ? "Change CV/Resume" : "Upload CV/Resume"}</span>
                              <span className="sm:hidden">{uploadedCV ? "Change CV" : "Upload CV"}</span>
                            </>
                          )}
                        </Button>
                      </div>

                      {uploadedCV && (
                        <Button
                          type="button"
                          onClick={handleAutoFill}
                          disabled={isAutoFilling}
                          className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                        >
                          {isAutoFilling ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              <span className="hidden sm:inline">Extracting...</span>
                              <span className="sm:hidden">Extracting...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              <span className="hidden sm:inline">Auto Fill Form</span>
                              <span className="sm:hidden">Auto Fill</span>
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    {uploadedCV && (
                      <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>Uploaded: {uploadedCV.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setUploadedCV(null)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Personal Information */}
                <Card className="p-3 sm:p-4 w-full">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                  </div>

                  <div className="space-y-3 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      <div className="space-y-2 min-w-0">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                          placeholder="Enter your first name"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2 min-w-0">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                          placeholder="Enter your last name"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      <div className="space-y-2 min-w-0">
                        <Label htmlFor="email">Email Address *</Label>
                        <div className="relative w-full">
                          <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                            placeholder="your.email@example.com"
                            className="pl-10 w-full"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 min-w-0">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <div className="relative w-full">
                          <Phone className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            required
                            placeholder="+94 77 123 4567"
                            className="pl-10 w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      <div className="space-y-2 min-w-0">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="Street address"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2 min-w-0">
                        <Label htmlFor="city">City *</Label>
                        <div className="relative w-full">
                          <MapPin className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            required
                            placeholder="Colombo, Kandy, Galle, etc."
                            className="pl-10 w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      <div className="space-y-2 min-w-0">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <div className="relative w-full">
                          <Calendar className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            className="pl-10 w-full"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 min-w-0">
                        <Label htmlFor="availabilityDate">Available Start Date</Label>
                        <div className="relative w-full">
                          <Calendar className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                          <Input
                            id="availabilityDate"
                            type="date"
                            value={formData.availabilityDate}
                            onChange={(e) => handleInputChange('availabilityDate', e.target.value)}
                            className="pl-10 w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Step 2: Education & Experience */}
            {currentStep === 2 && (
              <div className="space-y-3">
                {/* Education Section */}
                <Card className="p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-emerald-500" />
                      <h3 className="text-lg font-semibold">Education</h3>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addEducation}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {formData.education.map((edu, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">Education {index + 1}</h4>
                          {formData.education.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEducation(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Institution *</Label>
                              <Select
                                value={edu.institution}
                                onValueChange={(value) => {
                                  updateEducation(index, 'institution', value)
                                  if (value !== 'Other') {
                                    updateEducation(index, 'customInstitution', '')
                                  }
                                  setUniversitySearch('') // Reset search when selection is made
                                }}
                                onOpenChange={(open) => {
                                  if (!open) setUniversitySearch('') // Reset search when dropdown closes
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select university/institute" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                  <div className="p-2">
                                    <Input
                                      placeholder="Search universities..."
                                      value={universitySearch}
                                      onChange={(e) => setUniversitySearch(e.target.value)}
                                      className="mb-2"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                  {SRI_LANKAN_UNIVERSITIES
                                    .filter(uni =>
                                      universitySearch === '' || uni.toLowerCase().includes(universitySearch.toLowerCase())
                                    )
                                    .map((university) => (
                                      <SelectItem key={university} value={university}>
                                        {university}
                                      </SelectItem>
                                    ))
                                  }
                                </SelectContent>
                              </Select>
                              {edu.institution === 'Other' && (
                                <Input
                                  value={edu.customInstitution || ''}
                                  onChange={(e) => updateEducation(index, 'customInstitution', e.target.value)}
                                  placeholder="Enter university/institute name"
                                  required
                                />
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label>Degree Program *</Label>
                              <Select
                                value={edu.degree}
                                onValueChange={(value) => {
                                  updateEducation(index, 'degree', value)
                                  if (value !== 'Other') {
                                    updateEducation(index, 'customDegree', '')
                                  }
                                  setDegreeSearch('') // Reset search when selection is made
                                }}
                                onOpenChange={(open) => {
                                  if (!open) setDegreeSearch('') // Reset search when dropdown closes
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select degree program" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                  <div className="p-2">
                                    <Input
                                      placeholder="Search degree programs..."
                                      value={degreeSearch}
                                      onChange={(e) => setDegreeSearch(e.target.value)}
                                      className="mb-2"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                  {DEGREE_PROGRAMS
                                    .filter(degree =>
                                      degreeSearch === '' || degree.toLowerCase().includes(degreeSearch.toLowerCase())
                                    )
                                    .map((degree) => (
                                      <SelectItem key={degree} value={degree}>
                                        {degree}
                                      </SelectItem>
                                    ))
                                  }
                                </SelectContent>
                              </Select>
                              {edu.degree === 'Other' && (
                                <Input
                                  value={edu.customDegree || ''}
                                  onChange={(e) => updateEducation(index, 'customDegree', e.target.value)}
                                  placeholder="Enter degree program"
                                  required
                                />
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Field of Study</Label>
                              <Input
                                value={edu.fieldOfStudy}
                                onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                                placeholder="e.g., Computer Science, Engineering"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Graduation Year</Label>
                              <Input
                                type="number"
                                value={edu.graduationYear}
                                onChange={(e) => updateEducation(index, 'graduationYear', parseInt(e.target.value))}
                                placeholder="2024"
                                min="1950"
                                max="2030"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>GPA/Class (Optional)</Label>
                              <Input
                                value={edu.gpa || ''}
                                onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                                placeholder="3.5/4.0 or First Class, etc."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Work Experience Section - Conditional */}
                {(selectedJob?.level !== "Intern" || formData.hasWorkExperience) && (
                  <Card className="p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-lg font-semibold">Work Experience</h3>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addWorkExperience}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>

                    {formData.workExperience.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No work experience added yet. Click "Add Experience" to start.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {formData.workExperience.map((work, index) => (
                          <div key={index} className="border rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">Experience {index + 1}</h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeWorkExperience(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Company *</Label>
                                  <Input
                                    value={work.company}
                                    onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                                    placeholder="Company name"
                                    required
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Position *</Label>
                                  <Input
                                    value={work.position}
                                    onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                                    placeholder="Job title"
                                    required
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Start Date</Label>
                                  <Input
                                    type="date"
                                    value={work.startDate}
                                    onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>End Date</Label>
                                  <Input
                                    type="date"
                                    value={work.endDate}
                                    onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                                    disabled={work.isCurrentJob}
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`current-job-${index}`}
                                    checked={work.isCurrentJob}
                                    onCheckedChange={(checked) => updateWorkExperience(index, 'isCurrentJob', checked)}
                                  />
                                  <Label htmlFor={`current-job-${index}`}>This is my current job</Label>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                  value={work.description}
                                  onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                                  placeholder="Describe your role, responsibilities, and achievements..."
                                  rows={3}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                )}

                {/* Professional Information */}
                <Card className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-lg font-semibold">Professional Information</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Years of Experience</Label>
                        <Input
                          type="number"
                          value={formData.yearsOfExperience}
                          onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || 0)}
                          min="0"
                          max="50"
                          placeholder="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Current/Recent Role</Label>
                        <Input
                          value={formData.currentRole}
                          onChange={(e) => handleInputChange('currentRole', e.target.value)}
                          placeholder="Your current or most recent position"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expected Salary (LKR)</Label>
                        <Input
                          value={formData.expectedSalary}
                          onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                          placeholder="e.g., 100,000 - 150,000"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Step 3: Skills & Additional Info */}
            {currentStep === 3 && (
              <div className="space-y-3">
                {/* Skills Section */}
                <Card className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-lg font-semibold">Skills & Technologies</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Technical Skills */}
                    <div>
                      <Label className="text-sm font-medium">Technical Skills</Label>
                      <p className="text-xs text-muted-foreground mb-2">Add programming languages, frameworks, tools, etc.</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.technicalSkills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1">
                            {skill}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSkill('technicalSkills', index)}
                              className="ml-2 h-4 w-4 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a technical skill..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              const input = e.target as HTMLInputElement
                              addSkill('technicalSkills', input.value)
                              input.value = ''
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Soft Skills */}
                    <div>
                      <Label className="text-sm font-medium">Soft Skills</Label>
                      <p className="text-xs text-muted-foreground mb-2">Add communication, leadership, problem-solving skills, etc.</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.softSkills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="px-3 py-1">
                            {skill}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSkill('softSkills', index)}
                              className="ml-2 h-4 w-4 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a soft skill..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              const input = e.target as HTMLInputElement
                              addSkill('softSkills', input.value)
                              input.value = ''
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Languages */}
                    <div>
                      <Label className="text-sm font-medium">Languages</Label>
                      <p className="text-xs text-muted-foreground mb-2">Languages you can speak</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.languages.map((language, index) => (
                          <Badge key={index} variant="default" className="px-3 py-1">
                            {language}
                            {language !== "English" && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSkill('languages', index)}
                                className="ml-2 h-4 w-4 p-0"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a language..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              const input = e.target as HTMLInputElement
                              addSkill('languages', input.value)
                              input.value = ''
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <Label className="text-sm font-medium">Certifications</Label>
                      <p className="text-xs text-muted-foreground mb-2">Professional certifications, licenses, etc.</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1">
                            {cert}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSkill('certifications', index)}
                              className="ml-2 h-4 w-4 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a certification..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              const input = e.target as HTMLInputElement
                              addSkill('certifications', input.value)
                              input.value = ''
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Additional Information */}
                <Card className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-lg font-semibold">Additional Information</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Cover Letter</Label>
                      <Textarea
                        value={formData.coverLetter}
                        onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                        placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Portfolio URL</Label>
                          <Input
                            type="url"
                            value={formData.portfolioUrl}
                            onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                            placeholder="https://yourportfolio.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>LinkedIn Profile</Label>
                          <Input
                            type="url"
                            value={formData.linkedinUrl}
                            onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                            placeholder="https://linkedin.com/in/yourprofile"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>GitHub Profile</Label>
                          <Input
                            type="url"
                            value={formData.githubUrl}
                            onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                            placeholder="https://github.com/yourusername"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Personal Website</Label>
                          <Input
                            type="url"
                            value={formData.websiteUrl}
                            onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>How did you hear about us?</Label>
                      <Select
                        value={formData.howDidYouHear}
                        onValueChange={(value) => handleInputChange('howDidYouHear', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="job-board">Job Board</SelectItem>
                          <SelectItem value="company-website">Company Website</SelectItem>
                          <SelectItem value="social-media">Social Media</SelectItem>
                          <SelectItem value="referral">Employee Referral</SelectItem>
                          <SelectItem value="recruiter">Recruiter</SelectItem>
                          <SelectItem value="career-fair">Career Fair</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Additional Notes</Label>
                      <Textarea
                        value={formData.additionalNotes}
                        onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                        placeholder="Any additional information you'd like to share..."
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-3">
                <Card className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-lg font-semibold">Review Your Application</h3>
                  </div>

                  <div className="space-y-6">
                    {/* Personal Information Summary */}
                    <div>
                      <h4 className="font-medium mb-3">Personal Information</h4>
                      <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                        <p><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</p>
                        <p><span className="font-medium">Email:</span> {formData.email}</p>
                        <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                        <p><span className="font-medium">Location:</span> {formData.city}, {formData.country}</p>
                      </div>
                    </div>

                    {/* Education Summary */}
                    {formData.education.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Education</h4>
                        <div className="space-y-3">
                          {formData.education.map((edu, index) => (
                            <div key={index} className="bg-muted/50 rounded-lg p-4 text-sm">
                              <p className="font-medium">{edu.degree} in {edu.fieldOfStudy}</p>
                              <p>{edu.institution} ({edu.graduationYear})</p>
                              {edu.gpa && <p>GPA: {edu.gpa}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Work Experience Summary */}
                    {formData.workExperience.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Work Experience</h4>
                        <div className="space-y-3">
                          {formData.workExperience.map((work, index) => (
                            <div key={index} className="bg-muted/50 rounded-lg p-4 text-sm">
                              <p className="font-medium">{work.position} at {work.company}</p>
                              <p>{work.startDate} - {work.isCurrentJob ? 'Present' : work.endDate}</p>
                              {work.description && <p className="mt-2 text-muted-foreground">{work.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills Summary */}
                    <div>
                      <h4 className="font-medium mb-3">Skills & Technologies</h4>
                      <div className="space-y-3">
                        {formData.technicalSkills.length > 0 && (
                          <div>
                            <p className="text-sm font-medium">Technical Skills:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {formData.technicalSkills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">{skill}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {formData.softSkills.length > 0 && (
                          <div>
                            <p className="text-sm font-medium">Soft Skills:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {formData.softSkills.map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CV Upload Status */}
                    <div>
                      <h4 className="font-medium mb-3">CV/Resume</h4>
                      <div className="bg-muted/50 rounded-lg p-4">
                        {uploadedCV ? (
                          <div className="flex items-center gap-2 text-sm text-emerald-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>CV Uploaded: {uploadedCV.name}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-red-600">
                            <X className="w-4 h-4" />
                            <span>No CV uploaded - Please go back to step 1 to upload your CV</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col gap-3 pt-4 border-t">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex gap-3 flex-1">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="flex-1 sm:flex-initial"
                    >
                      Previous
                    </Button>
                  )}

                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      className="flex-1 sm:flex-initial bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                    >
                      <span className="hidden sm:inline">Next Step</span>
                      <span className="sm:hidden">Next</span>
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting || !uploadedCV}
                      className="flex-1 sm:flex-initial bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          <span className="hidden sm:inline">Submitting Application...</span>
                          <span className="sm:hidden">Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span className="hidden sm:inline">Submit Application</span>
                          <span className="sm:hidden">Submit</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}