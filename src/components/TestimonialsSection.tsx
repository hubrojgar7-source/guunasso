import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    quote:
      'गुनासो.com helped our community get the attention of local officials. Within weeks, our road repair petition gained over 3,000 signatures and the municipality responded.',
    name: 'Wade Warren',
    role: 'Community Leader, Pokhara',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  },
  {
    quote:
      'I started a petition about school infrastructure in my district. The platform made it easy to share and track progress. Real change is possible when voices unite.',
    name: 'Sita Sharma',
    role: 'Teacher, Biratnagar',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
  },
  {
    quote:
      'As a youth activist, this platform gave me the tools to organize and amplify our demands. The transparency in vote counting builds trust among supporters.',
    name: 'Rajesh Thapa',
    role: 'Youth Activist, Kathmandu',
    image: 'https://images.unsplash.com/photo-1580130775562-0ef92da028bc?w=800&h=600&fit=crop',
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const testimonial = testimonials[current];

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section className="py-20 px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            Testimonial from{' '}
            <span className="text-[#10B981]">Gunaso User</span>
          </h2>

          <blockquote className="text-gray-600 text-base lg:text-lg leading-relaxed">
            "{testimonial.quote}"
          </blockquote>

          <div>
            <p className="font-bold text-gray-900">{testimonial.name}</p>
            <p className="text-gray-500 text-sm">{testimonial.role}</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-[#10B981] hover:text-[#10B981] transition-colors cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-[#10B981] hover:text-[#10B981] transition-colors cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
