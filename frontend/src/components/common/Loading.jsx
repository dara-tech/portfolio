import { Loader2, BookOpen, FileText, Link as LinkIcon, Code2 } from 'lucide-react';

export const Loading = ({ type = 'default', text = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: {
      icon: 'w-8 h-8',
      text: 'text-sm',
      progress: 'w-48',
    },
    md: {
      icon: 'w-12 h-12',
      text: 'text-base',
      progress: 'w-64',
    },
    lg: {
      icon: 'w-16 h-16',
      text: 'text-lg',
      progress: 'w-72',
    },
  };

  const renderLoadingContent = () => {
    switch (type) {
      case 'lesson':
        return (
          <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card bg-base-200 shadow-lg animate-pulse">
              <div className="card-body gap-4 sm:gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-base-300"></div>
                  <div className="h-6 sm:h-9 bg-base-300 rounded w-3/4"></div>
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="h-4 sm:h-6 bg-base-300 rounded w-5/6"></div>
                  <div className="h-4 sm:h-6 bg-base-300 rounded w-4/6"></div>
                </div>
                
                <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2 sm:space-y-3">
                      <div className="h-5 sm:h-7 bg-base-300 rounded w-1/4"></div>
                      <div className="h-4 sm:h-6 bg-base-300 rounded w-full"></div>
                      <div className="h-4 sm:h-6 bg-base-300 rounded w-5/6"></div>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 sm:h-16 bg-base-300 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-8">
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
                <div className="flex flex-col items-center gap-1 sm:gap-2">
                  <div className="relative">
                    <BookOpen className={`${sizeClasses[size].icon} animate-spin text-primary`} />
                    <div className="absolute top-0 right-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-success"></div>
                  </div>
                  <span className="text-xs sm:text-sm">Content</span>
                </div>
                <div className="flex flex-col items-center gap-1 sm:gap-2">
                  <div className="relative">
                    <FileText className={`${sizeClasses[size].icon} animate-bounce text-primary`} />
                    <div className="absolute top-0 right-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-warning"></div>
                  </div>
                  <span className="text-xs sm:text-sm">Resources</span>
                </div>
                <div className="flex flex-col items-center gap-1 sm:gap-2">
                  <div className="relative">
                    <LinkIcon className={`${sizeClasses[size].icon} animate-pulse text-primary`} />
                    <div className="absolute top-0 right-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-info"></div>
                  </div>
                  <span className="text-xs sm:text-sm">Links</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'editor':
        return (
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card bg-base-200 shadow-lg animate-pulse">
              <div className="card-body gap-4 sm:gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-8 h-8 sm:w-12 sm:h-12 rounded bg-base-300"></div>
                    ))}
                  </div>
                  <div className="w-24 sm:w-32 h-8 sm:h-12 rounded bg-base-300"></div>
                </div>
                
                <div className="h-64 sm:h-96 bg-base-300 rounded relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Code2 className={`${sizeClasses[size].icon} text-base-content/20 animate-pulse`} />
                  </div>
                  <div className="absolute top-4 left-4 w-2 h-5 sm:w-3 sm:h-7 bg-primary animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-8">
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                <div className="loading loading-ring loading-lg text-primary"></div>
                <div className="flex flex-col items-center sm:items-start">
                  <span className={`${sizeClasses[size].text} font-medium`}>{text}</span>
                  <progress className={`progress progress-primary ${sizeClasses[size].progress}`}></progress>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'grid':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card bg-base-200 shadow-lg animate-pulse">
                <div className="card-body gap-3 sm:gap-4">
                  <div className="h-6 sm:h-8 bg-base-300 rounded w-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 sm:h-6 bg-base-300 rounded w-5/6"></div>
                    <div className="h-4 sm:h-6 bg-base-300 rounded w-4/6"></div>
                  </div>
                  <div className="flex justify-between items-center mt-3 sm:mt-4">
                    <div className="h-8 sm:h-12 bg-base-300 rounded w-24 sm:w-32"></div>
                    <div className="h-8 sm:h-12 bg-base-300 rounded w-8 sm:w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
        
      default:
        return (
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="relative">
              <Loader2 className={`${sizeClasses[size].icon} animate-spin text-primary`} />
              <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-success animate-ping"></div>
            </div>
            <div className="flex flex-col items-center">
              <span className={`${sizeClasses[size].text} font-medium`}>{text}</span>
              <progress className={`progress progress-primary ${sizeClasses[size].progress} mt-2`}></progress>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      {renderLoadingContent()}
    </div>
  );
}; 