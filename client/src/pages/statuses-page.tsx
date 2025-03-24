import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/layout";
import { StatusBadge } from "@/components/ui/status-badge";
import { Status } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function StatusesPage() {
  const { data: statuses, isLoading } = useQuery<Status[]>({
    queryKey: ["/api/statuses"],
  });
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Status Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Current status of quiz infrastructure and services</p>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Service Status</h2>
          </div>
          <div className="p-5">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {statuses?.map(status => (
                  <StatusBadge
                    key={status.id}
                    color={status.color}
                    name={status.name}
                    description={status.description}
                  />
                ))}
                
                {(!statuses || statuses.length === 0) && (
                  <div className="col-span-2 py-8 text-center text-gray-500">
                    No status information available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
