const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

      {/* CSS-animated gradient orbs (no JS runtime overhead) */}
      <div
        className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl animate-orb-1"
        style={{ willChange: 'transform' }}
      />

      <div
        className="absolute top-1/2 right-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-orb-2"
        style={{ willChange: 'transform' }}
      />

      <div
        className="absolute -bottom-20 left-1/3 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-orb-3"
        style={{ willChange: 'transform' }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
