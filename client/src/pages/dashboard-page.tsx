import { Layout } from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageHistogram } from "@/components/ui/language-histogram";
import { useAuth } from "@/hooks/use-auth";
import { Language, Quiz, QuizResult } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, CheckCircle, Loader2, PencilLine, Star } from "lucide-react";
import { Link } from "wouter";

export default function DashboardPage() {
  const { user } = useAuth();
  
  const { data: languages, isLoading: isLoadingLanguages } = useQuery<Language[]>({
    queryKey: ["/api/languages"],
  });
  
  const { data: quizzes, isLoading: isLoadingQuizzes } = useQuery<Quiz[]>({
    queryKey: ["/api/quizzes"],
  });
  
  const { data: results, isLoading: isLoadingResults } = useQuery<QuizResult[]>({
    queryKey: ["/api/user/results"],
  });
  
  const isLoading = isLoadingLanguages || isLoadingQuizzes || isLoadingResults;
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  // Calculate stats
  const quizzesTaken = results?.length || 0;
  const averageScore = results && results.length > 0
    ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length)
    : 0;
  const createdQuizzes = quizzes?.filter(quiz => quiz.createdBy === user?.id).length || 0;
  
  // Get recent quizzes with quiz name
  const recentQuizzes = results
    ?.slice()
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 3)
    .map(result => {
      const quiz = quizzes?.find(q => q.id === result.quizId);
      return {
        ...result,
        quizName: quiz?.name || "Unknown Quiz",
        category: quiz?.category || "Uncategorized",
      };
    });

    const languageData = [
      { id: 1, name: 'JavaScript', count: 10, percentage: 41.7 },
      { id: 2, name: 'Python', count: 8, percentage: 33.3 },
      { id: 3, name: 'Java', count: 6, percentage: 25.0 },
      // ... more languages
    ];
  
  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Welcome back! Here's an overview of your quiz activities.</p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Quizzes Taken</p>
                  <p className="text-2xl font-semibold mt-1">{quizzesTaken}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-primary">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-xs font-medium text-green-500 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" /> 12% increase
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Average Score</p>
                  <p className="text-2xl font-semibold mt-1">{averageScore}%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                  <Star className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-xs font-medium text-green-500 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" /> 5% increase
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Created Quizzes</p>
                  <p className="text-2xl font-semibold mt-1">{createdQuizzes}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                  <PencilLine className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-xs font-medium text-red-500 flex items-center">
                  <ArrowDown className="h-3 w-3 mr-1" /> No new quizzes
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Quizzes */}
        <Card>
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Recent Quizzes</h2>
            <p className="text-sm text-gray-600">Your most recently taken quizzes</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz Name</th>
                  <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentQuizzes?.map(quiz => (
                  <tr key={quiz.id}>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{quiz.quizName}</div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{quiz.category}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{quiz.score}%</div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(quiz.completedAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm font-medium">
                      <a href="#" className="text-primary hover:text-indigo-700 mr-3">View</a>
                      <a href="#" className="text-gray-600 hover:text-gray-900">Retry</a>
                    </td>
                  </tr>
                ))}
                
                {/* Show empty state if no quizzes */}
                {(!recentQuizzes || recentQuizzes.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-500">
                      No quizzes taken yet. Take a quiz to see your results here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 text-right">
            <Link href="/quizzes" className="text-sm font-medium text-primary hover:text-indigo-700">
              View all quizzes <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </Card>
        
        {/* Languages Histogram */}
        <Card>
          <CardContent className="p-5">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Programming Languages Distribution</h2>
            {languages && languages.length > 0 ? (
              <div className="h-72 w-full">
                <LanguageHistogram languages={languageData} />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">No language data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
