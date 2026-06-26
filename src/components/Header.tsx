import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: t('nav.home'), action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { label: t('nav.petitions'), action: () => navigate('/polls') },
    { label: t('nav.campaign'), action: () => handleScrollTo('campaigns') },
    { label: t('nav.aboutUs'), action: () => navigate('/team') },
    { label: t('nav.contact'), action: () => navigate('/help') },
  ];

  return (
    <header className="w-full px-6 lg:px-8 py-4 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div
          className="flex items-center gap-2.5 select-none cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-9 h-9 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="white" fillOpacity="0.3" />
              <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            गुनासो<span className="text-[#10B981]">.com</span>
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors bg-transparent border-0 cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          <Button
            variant="outline"
            className="border-[#10B981] text-[#10B981] hover:bg-[#10B981]/5 h-10 px-6 rounded-lg font-semibold text-sm shadow-none"
            onClick={() => (user ? navigate('/dashboard') : navigate('/login'))}
          >
            {user ? t('header.dashboard') : t('header.campaignBtn')}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
