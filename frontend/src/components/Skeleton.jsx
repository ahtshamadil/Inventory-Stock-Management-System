// Skeleton loader components for better UX

export const SkeletonCard = () => (
  <div className="glass-effect rounded-2xl p-5 animate-pulse">
    <div className="h-48 bg-white/10 rounded-xl mb-4" />
    <div className="h-4 bg-white/10 rounded w-3/4 mb-3" />
    <div className="h-3 bg-white/10 rounded w-1/2 mb-2" />
    <div className="h-3 bg-white/10 rounded w-2/3 mb-4" />
    <div className="flex gap-2">
      <div className="h-10 bg-white/10 rounded-lg flex-1" />
      <div className="h-10 bg-white/10 rounded-lg w-10" />
      <div className="h-10 bg-white/10 rounded-lg w-10" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="glass-effect rounded-2xl overflow-hidden animate-pulse">
    <div className="h-12 bg-white/10 border-b border-white/5" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 border-b border-white/5">
        <div className="w-12 h-12 bg-white/10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded w-1/3" />
          <div className="h-3 bg-white/10 rounded w-1/4" />
        </div>
        <div className="h-6 bg-white/10 rounded w-20" />
      </div>
    ))}
  </div>
);

export const SkeletonStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="glass-effect rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 bg-white/10 rounded w-24" />
            <div className="h-8 bg-white/10 rounded w-16" />
          </div>
          <div className="w-14 h-14 bg-white/10 rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonChart = () => (
  <div className="glass-effect rounded-2xl p-6 animate-pulse">
    <div className="h-5 bg-white/10 rounded w-32 mb-6" />
    <div className="h-64 bg-white/10 rounded-xl" />
  </div>
);

export const SkeletonDashboard = () => (
  <div className="space-y-6">
    <SkeletonStats />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonChart />
      <SkeletonChart />
    </div>
    <SkeletonTable rows={5} />
  </div>
);
