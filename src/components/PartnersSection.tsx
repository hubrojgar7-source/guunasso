import React from 'react';
import { useTranslation } from 'react-i18next';

const partners = ['Slack', 'Netflix', 'Google', 'Airbnb', 'Uber'];

const PartnersSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-14 px-6 lg:px-8 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-600 text-sm sm:text-base mb-10 max-w-2xl mx-auto">
          {t('partners.text')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-16">
          {partners.map((name) => (
            <span
              key={name}
              className="text-xl sm:text-2xl font-bold text-gray-300 hover:text-gray-400 transition-colors select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
