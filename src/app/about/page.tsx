export default function AboutPage() {
  const tips = [
    { title: 'Master the ready position', body: 'Always return to the center of the court after each shot. A strong ready position with bent knees and racket up lets you react faster to any incoming ball.' },
    { title: 'Use your non-dominant hand', body: 'Your non-hitting hand is your guide. Point it toward the ball on groundstrokes and use it to toss consistently on your serve.' },
    { title: 'Watch the ball, not your opponent', body: 'Keep your eyes on the ball all the way through contact. Most errors come from looking up too early to see where your shot is going.' },
    { title: 'Play to your opponent\'s weakness', body: 'Identify whether your opponent struggles on the backhand or with high balls early in the match — then make it a pattern, not a coincidence.' },
    { title: 'Serve with a continental grip', body: 'The continental grip unlocks spin and power on your serve. It feels awkward at first but is the foundation of every advanced serve technique.' },
    { title: 'Control depth before direction', body: 'New players obsess over hitting angles. Experienced players first make sure the ball lands deep. Depth pushes opponents back and opens the court.' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Who we are */}
        <div className="card mb-8 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center text-brand-mid font-medium text-xl flex-shrink-0">
            EF
          </div>
          <div>
            <p className="text-brand-green text-xs font-medium tracking-wide mb-1">About the founder</p>
            <h2 className="text-xl font-medium mb-3">Esther Forrester</h2>
            <ul className="space-y-1.5 text-sm text-gray-600">
              {[
                'Former Division I collegiate player',
                'Running her own programs for kids for over 10 years, teaching for nearly 20',
                'Coached the Empire State Games and Tennis Europe',
                'Nationally ranked in the 30-and-over category',
                'Enjoys rollerblading, photography, and stand-up comedy',
                'Emphasizes smart play, tactics, and match readiness in every lesson',
              ].map(item => (
                <li key={item} className="flex gap-2">
                  <span className="text-brand-green mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* How we're different */}
        <div className="card mb-8">
          <h2 className="text-xl font-medium mb-3">How we're different</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Our training isn't just about drilling and perfecting technique — it's about becoming match ready.
            We push you out of your comfort zone and arm you with a winning recipe for real matches.
          </p>
          <div className="grid md:grid-cols-3 gap-3 mt-4">
            {['Strategic patterns', 'Return any shot', 'Match confidence'].map(f => (
              <div key={f} className="bg-brand-light rounded-lg px-4 py-3 text-brand-mid text-sm font-medium text-center">{f}</div>
            ))}
          </div>
        </div>

        {/* Tennis tips */}
        <p className="text-brand-green text-xs font-medium tracking-wide mb-1">From the coach</p>
        <h2 className="text-2xl font-medium mb-6">Tennis tips</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {tips.map(tip => (
            <div key={tip.title} className="card">
              <h3 className="font-medium text-sm mb-2">{tip.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{tip.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
