import { Loader2, BookOpen, FileText, Link as LinkIcon, Code2 } from 'lucide-react';

export const Loading = ({ type = 'default', text = 'Loading...' }) => {
  const renderLoadingContent = () => {
    switch (type) {
      case 'lesson':
        return (
          <div className="w-full max-w-3xl mx-auto">
            { /* Lesson Card Skeleton */}
            <div className="card bg-base-200 shadow-lg animate-pulse">
              <div className="card-body gap-6">
                {/* Title Skeleton */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-base-300"></div>
                  <div className="h-9 bg-base-300 rounded w-3/4"></div>
                </div>
                
                {/* Description Skeleton */}
                <div className="space-y-3">
                  <div className="h-6 bg-base-300 rounded w-5/6"></div>
                  <div className="h-6 bg-base-300 rounded w-4/6"></div>
                </div>
                
                {/* Content Sections Skeleton */}
                <div className="space-y-6 py-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <div className="h-7 bg-base-300 rounded w-1/4"></div>
                      <div className="h-6 bg-base-300 rounded w-full"></div>
                      <div className="h-6 bg-base-300 rounded w-5/6"></div>
                    </div>
                  ))}
                </div>
                
                {/* Resources Skeleton */}
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 bg-base-300 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Loading Indicators */}
            <div className="mt-8">
              <div className="flex justify-center items-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <BookOpen className="w-8 h-8 animate-spin text-primary" />
                    <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-success"></div>
                  </div>
                  <span className="text-sm">Content</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <FileText className="w-8 h-8 animate-bounce text-primary" />
                    <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-warning"></div>
                  </div>
                  <span className="text-sm">Resources</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <LinkIcon className="w-8 h-8 animate-pulse text-primary" />
                    <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-info"></div>
                  </div>
                  <span className="text-sm">Links</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'editor':
        return (
          <div className="w-full max-w-4xl mx-auto">
            {/* Editor Skeleton */}
            <div className="card bg-base-200 shadow-lg animate-pulse">
              <div className="card-body gap-6">
                {/* Toolbar Skeleton */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-12 h-12 rounded bg-base-300"></div>
                    ))}
                  </div>
                  <div className="w-32 h-12 rounded bg-base-300"></div>
                </div>
                
                {/* Editor Content Skeleton */}
                <div className="h-96 bg-base-300 rounded relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Code2 className="w-16 h-16 text-base-content/20 animate-pulse" />
                  </div>
                  {/* Simulated cursor */}
                  <div className="absolute top-4 left-4 w-3 h-7 bg-primary animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Loading Progress */}
            <div className="mt-8">
              <div className="flex items-center gap-4 justify-center">
                <div className="loading loading-ring loading-lg text-primary"></div>
                <div className="flex flex-col">
                  <span className="text-lg font-medium">{text}</span>
                  <progress className="progress progress-primary w-72"></progress>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card bg-base-200 shadow-lg animate-pulse">
                <div className="card-body gap-4">
                  <div className="h-8 bg-base-300 rounded w-full"></div>
                  <div className="space-y-2">
                    <div className="h-6 bg-base-300 rounded w-5/6"></div>
                    <div className="h-6 bg-base-300 rounded w-4/6"></div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-12 bg-base-300 rounded w-32"></div>
                    <div className="h-12 bg-base-300 rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
        
      default:
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Loader2 className="w-16 h-16 animate-spin text-primary" />
              <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-success animate-ping"></div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-medium">{text}</span>
              <progress className="progress progress-primary w-72 mt-2"></progress>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {renderLoadingContent()}
    </div>
  );
}; 