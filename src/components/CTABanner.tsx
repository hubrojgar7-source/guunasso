import React from 'react';
import { Button } from '@/components/ui/button';
import { Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

const CTABanner = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const handleCreate = () => {
    if (user) {
      navigate('/dashboard/polls/create');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="relative py-20 px-6 lg:px-8 bg-[#10B981] overflow-hidden">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M15 45 Q30 20 45 45' stroke='white' stroke-width='3' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
          {t('cta.title1')}, {t('cta.title2')}
        </h2>
        <p className="text-white/80 text-base mb-8 max-w-xl mx-auto">
          {t('cta.description')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/polls')}
            className="border-white text-white bg-transparent hover:bg-white/10 h-12 px-8 rounded-lg font-semibold text-sm shadow-none"
          >
            {t('cta.browsePetitions')}
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-white text-[#10B981] hover:bg-gray-50 h-12 px-8 rounded-lg font-semibold text-sm border-0 shadow-none gap-2"
          >
            {t('cta.startPetition')}
            <Megaphone className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
