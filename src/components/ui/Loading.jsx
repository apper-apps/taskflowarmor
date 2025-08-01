import React from "react";

const Loading = () => {
  return (
    <div className="flex-1 p-6">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48"></div>
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-32"></div>
        </div>

        {/* Kanban columns skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((col) => (
            <div key={col} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-24"></div>
                <div className="h-6 w-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"></div>
              </div>
              
              <div className="space-y-3">
                {[1, 2, 3].map((card) => (
                  <div key={card} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-3"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;