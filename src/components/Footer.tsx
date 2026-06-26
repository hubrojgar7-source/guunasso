import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigateLinks = [
    { labelKey: 'footer.howItWorks', href: '#how-it-works' },
    { labelKey: 'footer.browsePetitions', href: '/polls' },
    { labelKey: 'footer.startCampaign', href: '/dashboard/polls/create' },
    { labelKey: 'footer.successStories', href: '/success-stories' },
  ];

  const aboutLinks = [
    { labelKey: 'footer.whoWeAre', href: '/team' },
    { labelKey: 'footer.ourMission', href: '/social-impact' },
    { labelKey: 'footer.blog', href: '/blog' },
    { labelKey: 'footer.faqs', href: '/help' },
  ];

  const handleLink = (href: string) => {
    if (href.startsWith('#')) {
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(href);
    }
  };

  return (
    <footer className="bg-gray-50 pt-16 pb-8 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#10B981] flex items-center justify-center">
                <span className="text-white font-bold text-sm">ग</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                गुनासो<span className="text-[#10B981]">.com</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, href: 'https://www.facebook.com/sanjok.gc.98' },
                { Icon: Twitter, href: '#' },
                { Icon: Instagram, href: '#' },
                { Icon: Linkedin, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center hover:bg-[#10B981] hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm">{t('footer.navigate')}</h3>
            <ul className="space-y-3">
              {navigateLinks.map((link) => (
                <li key={link.labelKey}>
                  <button
                    onClick={() => handleLink(link.href)}
                    className="text-gray-500 hover:text-[#10B981] text-sm transition-colors bg-transparent border-0 cursor-pointer p-0"
                  >
                    {t(link.labelKey)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm">{t('footer.aboutUs')}</h3>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.labelKey}>
                  <button
                    onClick={() => handleLink(link.href)}
                    className="text-gray-500 hover:text-[#10B981] text-sm transition-colors bg-transparent border-0 cursor-pointer p-0"
                  >
                    {t(link.labelKey)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm">{t('footer.contactUs')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                <a href="mailto:info@gunaso.com" className="text-gray-500 text-sm hover:text-[#10B981] transition-colors">
                  {t('footer.infoEmail')}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-gray-500 text-sm">{t('footer.phone')}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-gray-500 text-sm">{t('footer.address')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
