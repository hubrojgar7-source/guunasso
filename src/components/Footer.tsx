import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();

  const navigateLinks = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Browse petitions', href: '/polls' },
    { label: 'Start a campaign', href: '/dashboard/polls/create' },
    { label: 'Success stories', href: '/success-stories' },
  ];

  const aboutLinks = [
    { label: 'Who we are', href: '/team' },
    { label: 'Our mission', href: '/social-impact' },
    { label: 'Blog', href: '/blog' },
    { label: 'FAQs', href: '/help' },
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
              Empowering citizens to raise their voice, start petitions, and drive
              meaningful change in their communities across Nepal.
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
            <h3 className="font-bold text-gray-900 mb-4 text-sm">Navigate</h3>
            <ul className="space-y-3">
              {navigateLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleLink(link.href)}
                    className="text-gray-500 hover:text-[#10B981] text-sm transition-colors bg-transparent border-0 cursor-pointer p-0"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm">About us</h3>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleLink(link.href)}
                    className="text-gray-500 hover:text-[#10B981] text-sm transition-colors bg-transparent border-0 cursor-pointer p-0"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                <a href="mailto:info@gunaso.com" className="text-gray-500 text-sm hover:text-[#10B981] transition-colors">
                  info@gunaso.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-gray-500 text-sm">+977 9868597841</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-gray-500 text-sm">Kathmandu, Nepal</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © Copyright {new Date().getFullYear()} गुनासो.com. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
