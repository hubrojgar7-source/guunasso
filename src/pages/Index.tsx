import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import PartnersSection from '@/components/PartnersSection';
import CampaignsSection from '@/components/CampaignsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BlogSection from '@/components/BlogSection';
import CTABanner from '@/components/CTABanner';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <PartnersSection />
      <CampaignsSection />
      <TestimonialsSection />
      <BlogSection />
      <CTABanner />
      <Footer />
    </div>
  );
};

export default Index;
