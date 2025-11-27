'use client';

export default function RegionSelector({ regions, expansion, setExpansion }) {
  return (
    <div className="flex gap-4 mt-6">
      {Object.entries(regions).map(([k, v]) => (
        <button
          key={k}
          onClick={() => setExpansion(k)}
          className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
            expansion === k
              ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-2xl scale-105'
              : 'bg-white/20 backdrop-blur hover:bg-white/40'
          }`}
        >
          {v.name}
        </button>
      ))}
    </div>
  );
}
