export default function GalleryPage() {
  const placeholders = Array.from({ length: 9 }, (_, i) => i + 1)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <p className="text-brand-green text-xs font-medium tracking-wide mb-1">Our programs</p>
        <h1 className="text-2xl font-medium mb-2">Gallery</h1>
        <p className="text-gray-500 text-sm mb-8">A look at BrainiacTennis in action across NYC, DC, and Philadelphia.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {placeholders.map(i => (
            <div key={i} className="aspect-square bg-brand-light rounded-xl flex flex-col items-center justify-center text-brand-mid">
              <svg className="w-8 h-8 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
              </svg>
              <p className="text-xs opacity-50">Photo {i}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-400 text-xs text-center mt-6">
          Replace placeholder tiles by uploading images to <code className="bg-gray-100 px-1 rounded">/public/gallery/</code> and updating this page.
        </p>
      </div>
    </div>
  )
}
