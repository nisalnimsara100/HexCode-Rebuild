# Firebase Client Projects Integration

This implementation provides real-time client project data fetching from Firebase Realtime Database, displaying projects in the tile format you specified. The data is automatically transformed from your Firebase structure to match your desired JSON format.

## 🚀 Features

- **Real-time Firebase Integration**: Fetches data directly from Firebase Realtime Database
- **Tile Format**: Displays projects in the exact format you specified in your JSON
- **Auto Data Transformation**: Converts Firebase data structure to your desired format
- **Progress Calculation**: Automatically calculates project progress based on roadmap phases
- **Team Member Display**: Shows team members with avatar initials
- **Technology Tags**: Displays project technologies as badges
- **Status & Priority**: Shows project status and priority with color coding
- **Responsive Design**: Works on desktop and mobile devices

## 📁 Files Created

### Components
- `components/client/firebase-client-projects-tiles.tsx` - Main tile component for client view
- `components/client/firebase-client-projects-example.tsx` - Example usage component
- `components/admin/firebase-admin-projects.tsx` - Admin view with stats and filters

### Hooks
- `hooks/use-firebase-client-projects.ts` - Custom hook for Firebase data fetching

### Test Pages
- `app/test-firebase-projects/page.tsx` - Test page for client view
- `app/admin-firebase-projects/page.tsx` - Test page for admin view

## 🔧 Usage

### For Client Dashboard

```tsx
import { FirebaseClientProjectsTiles } from '@/components/client/firebase-client-projects-tiles';

function ClientDashboard({ userEmail }: { userEmail: string }) {
  const handleProjectSelect = (project) => {
    console.log('Selected project:', project);
    // Navigate to project details or open modal
  };

  return (
    <FirebaseClientProjectsTiles
      userEmail={userEmail}
      onProjectSelect={handleProjectSelect}
      showRoadmap={true}
    />
  );
}
```

### For Admin Dashboard

```tsx
import { FirebaseAdminProjects } from '@/components/admin/firebase-admin-projects';

function AdminDashboard() {
  const handleProjectSelect = (project) => {
    console.log('Admin selected project:', project);
  };

  return (
    <FirebaseAdminProjects onProjectSelect={handleProjectSelect} />
  );
}
```

### Using the Hook Directly

```tsx
import { useFirebaseClientProjects } from '@/hooks/use-firebase-client-projects';

function MyComponent() {
  const { projects, loading, error, refreshProjects } = useFirebaseClientProjects(userEmail);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
}
```

## 📊 Data Format

The components transform your Firebase data into this format:

```json
{
  "email": "nisalnimsara100@gmail.com",
  "id": "project-1",
  "name": "Mobile Banking App",
  "description": "Secure mobile banking application with biometric authentication.",
  "startDate": "2023-09-01",
  "dueDate": "2023-12-15",
  "budget": 120000,
  "nextMilestone": "Project Completed",
  "progress": 100,
  "teamMembers": [
    { "id": "dk", "name": "David Kim", "role": "Project Manager" },
    { "id": "lw", "name": "Lisa Wong", "role": "Lead Developer" },
    { "id": "jm", "name": "James Miller", "role": "QA Engineer" }
  ],
  "technologies": ["React Native", "Firebase", "Node.js"],
  "roadmap": [
    {
      "id": "discovery",
      "title": "Discovery",
      "description": "Requirements gathering and planning",
      "status": "completed",
      "tasks": [
        { "id": "1", "title": "Requirements Analysis", "completed": true },
        { "id": "2", "title": "Stakeholder Interviews", "completed": true }
      ],
      "dependencies": [],
      "duration": "2 weeks",
      "priority": "high",
      "category": "design",
      "position": { "x": 200, "y": 150 },
      "color": "#8B5CF6",
      "radius": 40
    }
  ]
}
```

## 🎨 Styling

The components use:
- Tailwind CSS for styling
- Dark theme support
- Responsive design
- Orange accent color for branding
- Card-based layout

## 🔧 Configuration

### Firebase Database Structure

Make sure your Firebase Realtime Database has this structure:

```
/clients/{clientId}
  - email: string
  - projects: string[] (array of project IDs)

/projects/{projectId}
  - name: string
  - description: string
  - status: string
  - timeline: { startDate, expectedEndDate }
  - budget: { total, currency }
  - team: { projectManager, leadDeveloper, members[] }
  - technologies: string[]
  - roadmap: { phases: [...] }
```

### Test Emails

Based on your Firebase structure, these test emails should work:
- `john.doe@techstartup.com`
- `sarah.johnson@shopflow.com`
- `nisalnimsara100@gmail.com`

## 🚀 Getting Started

1. **Test the Implementation**:
   - Visit `/test-firebase-projects` for client view
   - Visit `/admin-firebase-projects` for admin view

2. **Integration**:
   - Replace your static JSON data usage with these components
   - Update your existing client dashboard to use `FirebaseClientProjectsTiles`
   - Update your admin dashboard to use `FirebaseAdminProjects`

3. **Customization**:
   - Modify the data transformation logic in the hook if needed
   - Adjust styling and layout as required
   - Add additional Firebase fields as needed

## 🔄 Data Transformation

The system automatically transforms Firebase data:
- **Progress**: Calculated from roadmap phase completion
- **Next Milestone**: Determined from incomplete phases
- **Team Members**: Converted from Firebase team structure
- **Roadmap**: Transformed to your specified format with positions, colors, etc.

## 📱 Responsive Features

- Mobile-friendly tile layout
- Responsive grid (1 column on mobile, 2 on desktop)
- Touch-friendly buttons and interactions
- Proper text wrapping and ellipsis

## 🎯 Next Steps

1. Test the components with your actual Firebase data
2. Integrate into your existing client and admin dashboards
3. Customize styling to match your exact design requirements
4. Add any additional fields or functionality as needed
5. Set up proper Firebase security rules for production

The implementation provides real-time data fetching while maintaining the exact tile format and structure you specified in your JSON example!