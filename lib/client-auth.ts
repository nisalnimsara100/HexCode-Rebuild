// Client-side authentication utility using localStorage
export interface ClientProfile {
  uid: string;
  email: string;
  name: string;
  company: string;
  phone?: string;
  profilePicture?: string;
  role: 'client';
  joinDate: string;
  projects?: string[];
}

// Authentication utility class
export class ClientAuth {
  private static readonly STORAGE_KEY = 'clientProfile';

  // Get current authenticated user
  static getCurrentUser(): ClientProfile | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      console.log('🔍 getCurrentUser - Raw localStorage data:', stored);
      
      if (stored) {
        const profile = JSON.parse(stored);
        console.log('🔍 getCurrentUser - Parsed profile:', profile);
        
        if (profile && profile.role === 'client') {
          console.log('✅ getCurrentUser - Valid client profile found:', profile);
          return profile;
        } else {
          console.log('❌ getCurrentUser - Invalid profile or not a client');
        }
      } else {
        console.log('❌ getCurrentUser - No data in localStorage');
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting current user:', error);
      this.clearUser();
      return null;
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Login user (demo/mock authentication)
  static async login(email: string, password: string): Promise<ClientProfile> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo validation - in real app this would be API call
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Create mock profile based on email
    const profile: ClientProfile = {
      uid: `client_${Date.now()}`,
      email: email,
      name: this.generateNameFromEmail(email),
      company: this.generateCompanyFromEmail(email),
      phone: '+1 (555) 123-4567',
      role: 'client',
      joinDate: new Date().toISOString().split('T')[0],
      projects: ['project_001', 'project_002']
    };

    // Store in localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
    
    // Dispatch auth change event
    this.dispatchAuthChange();

    return profile;
  }

  // Register user (demo/mock registration)
  static async register(userData: {
    email: string;
    password: string;
    name: string;
    company: string;
  }): Promise<ClientProfile> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo validation
    if (!userData.email || !userData.password || !userData.name) {
      throw new Error('All fields are required');
    }

    if (userData.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    // Create profile
    const profile: ClientProfile = {
      uid: `client_${Date.now()}`,
      email: userData.email,
      name: userData.name,
      company: userData.company || 'My Company',
      phone: '+1 (555) 123-4567',
      role: 'client',
      joinDate: new Date().toISOString().split('T')[0],
      projects: []
    };

    // Store in localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
    
    // Dispatch auth change event
    this.dispatchAuthChange();

    return profile;
  }

  // Google authentication
  static async loginWithGoogle(googleUser: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
  }): Promise<ClientProfile> {
    // Ensure we have a proper name
    let userName = googleUser.displayName;
    console.log('🔍 Initial displayName:', userName);
    
    if (!userName || userName.trim() === '' || userName === 'Anonymous') {
      // Fallback to generating name from email
      userName = this.generateNameFromEmail(googleUser.email);
      console.log('🔄 Generated name from email:', userName);
    }
    
    // Create profile from Google user data
    const profile: ClientProfile = {
      uid: googleUser.uid,
      email: googleUser.email,
      name: userName,
      company: this.generateCompanyFromEmail(googleUser.email),
      phone: '+1 (555) 123-4567',
      profilePicture: googleUser.photoURL || '',
      role: 'client',
      joinDate: new Date().toISOString().split('T')[0],
      projects: [] // New Google users start with no projects
    };

    // Store in localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
    
    // Immediately verify the storage
    const verification = localStorage.getItem(this.STORAGE_KEY);
    console.log('🔍 Google Storage verification - Just stored:', JSON.stringify(profile));
    console.log('🔍 Google Storage verification - Just retrieved:', verification);
    
    // Dispatch auth change event
    this.dispatchAuthChange();

    return profile;
  }

  // Logout user
  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.dispatchAuthChange();
  }

  // Clear user data (on error)
  static clearUser(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.dispatchAuthChange();
  }

  // Dispatch custom event for auth state changes
  private static dispatchAuthChange(): void {
    window.dispatchEvent(new CustomEvent('authStateChanged'));
  }

  // Helper: Generate name from email
  private static generateNameFromEmail(email: string): string {
    if (!email) return 'User';
    
    const username = email.split('@')[0];
    if (!username) return 'User';
    
    return username
      .replace(/[^a-zA-Z]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim() || 'User';
  }

  // Helper: Generate company from email domain
  private static generateCompanyFromEmail(email: string): string {
    const domain = email.split('@')[1];
    if (!domain) return 'Demo Company Inc.';
    
    const companyName = domain.split('.')[0];
    return companyName.charAt(0).toUpperCase() + companyName.slice(1) + ' Inc.';
  }
}

// Demo accounts for testing
export const DEMO_ACCOUNTS = [
  { email: 'john.doe@techstartup.com', password: 'password123' },
  { email: 'sarah.johnson@shopflow.com', password: 'password123' },
  { email: 'demo@client.com', password: 'password123' },
  { email: 'nisalnimsara100@gmail.com', password: 'password123' }
];