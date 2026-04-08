import Link from 'next/link'

const reviews = [
  { name: 'Jamie', location: 'Brooklyn', quote: 'I love the classes with coach Esther. She\'s always so funny and she pushes me to do my best. I especially love her double dares. Then I try super hard.', type: 'Group lesson' },
  { name: 'Dara', location: 'Upper West Side', quote: 'Coach Esther and the staff at Brainiac Tennis are amazing. They are very patient and more than willing to work with kids who are hesitant. Our son Henry was very reluctant, and they made him feel comfortable.', type: 'Private lesson' },
  { name: 'Molly', location: 'Jersey City', quote: 'Coach Esther and her caring staff are the best teachers out there. They demand the very best from the kids and are very thorough but in a nurturing way.', type: 'Group lesson' },
  { name: 'Sam', location: 'DC Capitol area', quote: 'The match coaching sessions completely changed how I think on the court. Esther breaks down strategy in a way that just clicks. My win rate has improved dramatically.', type: 'Match coaching' },
  { name: 'Priya', location: 'Philadelphia', quote: 'We enrolled our daughter in the group program and she\'s gone from never picking up a racket to asking to play every weekend. The coaches are patient, encouraging, and genuinely fun.', type: 'Group lesson' },
  { name: 'Marcus', location: 'Brooklyn', quote: 'As an adult beginner I was nervous about taking lessons. Coach Leo made the whole experience fun and judgment-free. I\'m hooked on tennis now.', type: 'Private lesson' },
]

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <p className="text-brand-green text-xs font-medium tracking-wide mb-1">Testimonials</p>
        <h1 className="text-2xl font-medium mb-2">What people are saying</h1>
        <p className="text-gray-500 text-sm mb-8">Real reviews from students across NYC, DC, and Philadelphia.</p>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {reviews.map(r => (
            <div key={r.name} className="card flex flex-col justify-between">
              <div>
                <p className="text-brand-green text-sm mb-3">★★★★★</p>
                <p className="text-gray-600 text-sm leading-relaxed italic mb-4">"{r.quote}"</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{r.name} <span className="text-gray-400 font-normal">· {r.location}</span></p>
                <span className="bg-brand-light text-brand-mid text-xs px-2 py-0.5 rounded-full">{r.type}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-brand-dark rounded-xl p-8 text-center">
          <h3 className="text-white text-xl font-medium mb-2">Ready to write your own success story?</h3>
          <p className="text-white/60 text-sm mb-5">Book a lesson and experience BrainiacTennis for yourself.</p>
          <Link href="/book" className="btn-primary">Book a lesson</Link>
        </div>
      </div>
    </div>
  )
}
