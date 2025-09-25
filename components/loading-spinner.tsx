export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-emerald-500/20 rounded-full animate-spin border-t-emerald-500"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-pulse border-t-emerald-400"></div>
      </div>
    </div>
  )
}
