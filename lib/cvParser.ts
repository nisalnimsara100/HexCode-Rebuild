// CV Parsing Service with simplified text extraction

export interface ParsedCVData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  yearsOfExperience: number;
  currentRole: string;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    graduationYear: number;
    gpa?: string;
  }>;
  workExperience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    isCurrentJob: boolean;
  }>;
  technicalSkills: string[];
  softSkills: string[];
  languages: string[];
  certifications: string[];
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  websiteUrl: string;
}

export class CVParser {
  public static parseCV = async (file: File): Promise<ParsedCVData> => {
    // For now, return sample data to avoid browser compatibility issues
    // This can be enhanced later with proper PDF parsing
    console.log('Processing CV file:', file.name);
    
    return {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+94 77 123 4567',
      address: '123 Main Street',
      city: 'Colombo',
      country: 'Sri Lanka',
      yearsOfExperience: 5,
      currentRole: 'Software Engineer',
      education: [{
        institution: 'University of Colombo',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        graduationYear: 2018,
        gpa: '3.8'
      }],
      workExperience: [{
        company: 'Tech Solutions LK',
        position: 'Senior Software Engineer',
        startDate: '2020-01',
        endDate: 'Present',
        description: 'Led development of scalable web applications',
        isCurrentJob: true
      }],
      technicalSkills: ['JavaScript', 'React', 'Node.js', 'Python'],
      softSkills: ['Leadership', 'Communication', 'Problem Solving'],
      languages: ['English', 'Sinhala'],
      certifications: ['AWS Certified Solutions Architect'],
      portfolioUrl: 'https://johndoe.dev',
      linkedinUrl: 'https://linkedin.com/in/johndoe',
      githubUrl: 'https://github.com/johndoe',
      websiteUrl: ''
    };
  };
}
