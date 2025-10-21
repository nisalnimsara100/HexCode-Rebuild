import { FirebaseClientProjectsExample } from '@/components/client/firebase-client-projects-example';

export default function TestFirebaseProjectsPage() {
  // Use the email from your Firebase database - based on your structure, this should be one of:
  // "john.doe@techstartup.com" or "sarah.johnson@shopflow.com"
  const testUserEmail = "john.doe@techstartup.com";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="py-8">
        <FirebaseClientProjectsExample userEmail={testUserEmail} />
      </div>
    </div>
  );
}