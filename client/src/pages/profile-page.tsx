import { Layout } from "@/components/layout/layout";
import { ProfileForm } from "@/components/profile/profile-form";

export default function ProfilePage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
          <p className="mt-1 text-sm text-gray-600">Manage your account information and preferences</p>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Profile Information</h2>
          </div>
          <div className="p-5">
            <ProfileForm />
          </div>
        </div>
      </div>
    </Layout>
  );
}
