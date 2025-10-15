import React from "react";

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce delay-0"></div>
        <div className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
        <div className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce delay-400"></div>
        <div className="w-4 h-4 bg-emerald-500 rounded-full animate-bounce delay-600"></div>
      </div>
    </div>
  )
}

// Add the following CSS to your global styles or a CSS module:
// .animate-bounce {
//   animation: bounce 1.5s infinite;
// }
// .delay-0 { animation-delay: 0s; }
// .delay-200 { animation-delay: 0.2s; }
// .delay-400 { animation-delay: 0.4s; }
// .delay-600 { animation-delay: 0.6s; }
// @keyframes bounce {
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-10px); }
// }
