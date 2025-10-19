import ClientProjectGraph from '@/components/client/client-project-graph';

// Simple integration example for existing client dashboard
export function ProjectGraphSection() {
  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Project Portfolio</h3>
          <p className="text-slate-400">Interactive project dependency visualization</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-lg">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-sm text-slate-300">Live Updates</span>
        </div>
      </div>
      
      <ClientProjectGraph 
        className="w-full h-[500px]"
        onProjectSelect={(project) => {
          console.log('Selected project:', project);
          // Handle project selection - could open detailed modal, update URL, etc.
        }}
      />
    </div>
  );
}