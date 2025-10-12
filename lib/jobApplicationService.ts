import { firestore, storage } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  serverTimestamp,
  doc,
  setDoc 
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";

export interface ApplicationData {
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
  
  // Education (simplified for storage)
  education: string; // JSON stringified array
  
  // Work Experience (simplified for storage)  
  workExperience: string; // JSON stringified array
  
  // Skills & Technologies (simplified for storage)
  technicalSkills: string; // JSON stringified array
  softSkills: string; // JSON stringified array
  languages: string; // JSON stringified array
  certifications: string; // JSON stringified array
  
  // Additional Information
  coverLetter: string;
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  websiteUrl: string;
  
  // References (simplified for storage)
  references: string; // JSON stringified array
  
  // Other
  howDidYouHear: string;
  additionalNotes: string;
  
  // Job Information
  jobTitle: string;
  department: string;
  jobLevel: string;
  jobId: number;
  
  // System fields
  cvUrl?: string;
  appliedAt?: any;
  status: "pending" | "reviewed" | "interview" | "rejected" | "hired";
}

export async function submitJobApplication(
  applicationData: Omit<ApplicationData, "appliedAt" | "status">,
  cvFile: File
): Promise<string> {
  try {
    // 1. Upload CV to Firebase Storage in careers/{department} folder
    const cvFileName = `${Date.now()}_${applicationData.firstName}_${applicationData.lastName}_CV.${cvFile.name.split('.').pop()}`;
    const cvStorageRef = ref(storage, `careers/${applicationData.department}/${cvFileName}`);
    
    const cvSnapshot = await uploadBytes(cvStorageRef, cvFile);
    const cvUrl = await getDownloadURL(cvSnapshot.ref);

    // 2. Prepare application data for Firestore
    const completeApplicationData: ApplicationData = {
      ...applicationData,
      cvUrl,
      appliedAt: serverTimestamp(),
      status: "pending"
    };

    // 3. Save application data to Firestore
    const applicationsRef = collection(firestore, "jobApplications");
    const docRef = await addDoc(applicationsRef, completeApplicationData);

    // 4. Optional: Save to department-specific collection for easier filtering
    const departmentApplicationsRef = collection(firestore, `departmentApplications/${applicationData.department}/applications`);
    await setDoc(doc(departmentApplicationsRef, docRef.id), completeApplicationData);

    return docRef.id;
  } catch (error) {
    console.error("Error submitting application:", error);
    throw new Error("Failed to submit application");
  }
}

export async function getApplicationsByDepartment(department: string) {
  try {
    const applicationsRef = collection(firestore, `departmentApplications/${department}/applications`);
    // You can add query filters here like orderBy, where, etc.
    return applicationsRef;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw new Error("Failed to fetch applications");
  }
}

export async function updateApplicationStatus(
  applicationId: string, 
  status: ApplicationData["status"],
  department: string
) {
  try {
    // Update in main collection
    const mainDocRef = doc(firestore, "jobApplications", applicationId);
    await setDoc(mainDocRef, { status, updatedAt: serverTimestamp() }, { merge: true });

    // Update in department collection
    const deptDocRef = doc(firestore, `departmentApplications/${department}/applications`, applicationId);
    await setDoc(deptDocRef, { status, updatedAt: serverTimestamp() }, { merge: true });

    return true;
  } catch (error) {
    console.error("Error updating application status:", error);
    throw new Error("Failed to update application status");
  }
}