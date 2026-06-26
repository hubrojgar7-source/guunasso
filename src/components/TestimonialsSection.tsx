import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const testimonials = [
  {
    quoteKey: 'testimonials.1.quote',
    nameKey: 'testimonials.1.name',
    roleKey: 'testimonials.1.role',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  },
  {
    quoteKey: 'testimonials.2.quote',
    nameKey: 'testimonials.2.name',
    roleKey: 'testimonials.2.role',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
  },
  {
    quoteKey: 'testimonials.3.quote',
    nameKey: 'testimonials.3.name',
    roleKey: 'testimonials.3.role',
    image: 'https://images.unsplash.com/photo-1580130775562-0ef92da028bc?w=800&h=600&fit=crop',
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const { t } = useTranslation();
  const testimonial = testimonials[current];

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section className="py-20 px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            {t('testimonials.title')}{' '}
            <span className="text-[#10B981]">{t('testimonials.gunasoUser')}</span>
          </h2>

          <blockquote className="text-gray-600 text-base lg:text-lg leading-relaxed">
            {t(testimonial.quoteKey)}
          </blockquote>

          <div>
            <p className="font-bold text-gray-900">{t(testimonial.nameKey)}</p>
            <p className="text-gray-500 text-sm">{t(testimonial.roleKey)}</p>
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
            alt={t(testimonial.nameKey)}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
