import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const campaigns = [
  {
    id: 1,
    titleKey: 'campaigns.1.title',
    descriptionKey: 'campaigns.1.description',
    image: 'https://images.unsplash.com/photo-1541959833400-049d37f98ccd?w=600&h=400&fit=crop',
    goal: 10000,
    raised: 7200,
    daysLeft: 24,
    supporters: ['A', 'B', 'C'],
  },
  {
    id: 2,
    titleKey: 'campaigns.2.title',
    descriptionKey: 'campaigns.2.description',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&h=400&fit=crop',
    goal: 5000,
    raised: 4100,
    daysLeft: 18,
    supporters: ['D', 'E', 'F'],
  },
  {
    id: 3,
    titleKey: 'campaigns.3.title',
    descriptionKey: 'campaigns.3.description',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop',
    goal: 8000,
    raised: 2800,
    daysLeft: 31,
    supporters: ['G', 'H', 'I'],
  },
];

const CampaignsSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section id="campaigns" className="py-20 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-14">
          {t('campaigns.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => {
            const progress = Math.round((campaign.raised / campaign.goal) * 100);

            return (
              <article
                key={campaign.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={campaign.image}
                    alt={t(campaign.titleKey)}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 line-clamp-2">
                    {t(campaign.titleKey)}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2 flex-1">
                    {t(campaign.descriptionKey)}
                  </p>

                  <div className="mb-3">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#10B981] rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500 mb-5">
                    <span>
                      {t('campaigns.goal')} <span className="font-semibold text-gray-700">{campaign.goal.toLocaleString()}</span> {t('campaigns.signatures')}
                    </span>
                    <span>{campaign.daysLeft} {t('campaigns.daysLeft')}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex -space-x-2">
                      {campaign.supporters.map((letter, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-[#10B981]/20 border-2 border-white flex items-center justify-center text-xs font-semibold text-[#10B981]"
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => navigate('/polls')}
                      className="bg-[#10B981] hover:bg-[#059669] text-white h-10 px-5 text-sm rounded-lg border-0 shadow-none"
                    >
                      {t('campaigns.signNow')}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CampaignsSection;
