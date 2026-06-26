import React from 'react';
import { Button } from '@/components/ui/button';
import { Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

const heroImages = [
  {
    src: '/hero/nepal-school-boys.jpg',
    alt: 'hero.alt.schoolBoys',
    className: 'col-start-1 row-start-1 h-28 sm:h-32',
  },
  {
    src: '/hero/nepal-village-children.jpg',
    alt: 'hero.alt.villageChildren',
    className: 'col-start-2 row-start-1 row-span-2 h-full min-h-[180px]',
  },
  {
    src: '/hero/nepal-mountain-children.jpg',
    alt: 'hero.alt.mountainChildren',
    className: 'col-start-3 row-start-1 h-28 sm:h-32',
  },
  {
    src: '/hero/nepal-schoolgirls.jpg',
    alt: 'hero.alt.schoolgirls',
    className: 'col-start-1 row-start-2 h-28 sm:h-32',
  },
  {
    src: '/hero/nepal-kathmandu-street.jpg',
    alt: 'hero.alt.kathmanduStreet',
    className: 'col-start-3 row-start-2 row-span-2 h-full min-h-[180px]',
  },
  {
    src: '/hero/nepal-durbar-square.jpg',
    alt: 'hero.alt.durbarSquare',
    className: 'col-start-1 row-start-3 h-28 sm:h-32',
  },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const handleCreatePetition = () => {
    if (user) {
      navigate('/dashboard/polls/create');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="relative bg-white pt-12 pb-20 px-6 lg:px-8 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M20 60 L20 30 L35 20 L35 50 Z' fill='%2310B981'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
        <div className="space-y-8">
          <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold text-gray-900 leading-[2.2] tracking-tight">
            {t('hero.makeBig')}<br />
            {t('hero.differenceBy')}<br />
            <span className="text-[#10B981]">{t('hero.smallEffort')}</span>
          </h1>

          <p className="text-gray-500 text-base lg:text-lg leading-relaxed max-w-lg">
            {t('hero.description')}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              onClick={handleCreatePetition}
              className="bg-[#10B981] hover:bg-[#059669] text-white font-semibold h-12 px-8 text-base rounded-lg border-0 shadow-none gap-2"
            >
              {t('hero.startPetition')}
              <Megaphone className="w-4 h-4" />
            </Button>
            <button
              onClick={() => navigate('/polls')}
              className="text-gray-700 hover:text-[#10B981] font-semibold text-sm transition-colors bg-transparent border-0 cursor-pointer underline-offset-4 hover:underline"
            >
              {t('hero.browsePetitions')}
            </button>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full max-w-md auto-rows-fr">
            {heroImages.map((image) => (
              <div
                key={image.src}
                className={`overflow-hidden rounded-lg ${image.className}`}
              >
                <img
                  src={image.src}
                  alt={t(image.alt)}
                  loading="eager"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
