import React from 'react';
import {
  CloudRain,
  Wheat,
  BarChart2,
  LineChart
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Create a custom soil icon since it's not available in lucide-react
const SoilIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 19h20" />
    <path d="M4 15h16" />
    <path d="M6 11c1.5 0 3 .5 3 2-2 0-3 .5-3 2" />
    <path d="M10 11c1.5 0 3 .5 3 2-2 0-3 .5-3 2" />
    <path d="M14 11c1.5 0 3 .5 3 2-2 0-3 .5-3 2" />
    <path d="M18 11c1.5 0 3 .5 3 2-2 0-3 .5-3 2" />
  </svg>
);

const DifferenceSection = () => {
  const features = [
    {
      icon: SoilIcon,
      title: "Smart Soil Analysis",
      description: "Real-time soil health monitoring and recommendations tailored to your farm's specific soil composition."
    },
    {
      icon: CloudRain,
      title: "Precision Weather Forecasting",
      description: "Hyperlocal weather predictions to plan irrigation, planting, and harvesting with confidence."
    },
    {
      icon: Wheat,
      title: "Crop Disease Detection",
      description: "Early identification of crop diseases and pests through AI image analysis, saving crops before it's too late."
    },
    {
      icon: BarChart2,
      title: "Yield Prediction Tools",
      description: "Advanced analytics to forecast harvest yields and optimize crop planning for maximum productivity."
    },

    {
      icon: LineChart,
      title: "Farm Performance Tracking",
      description: "Monitor all aspects of your farm's performance with easy-to-understand reports and recommendations."
    }
  ];

  return (
    <section id="why-speakup" className="py-20 px-8 bg-blue-50 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose गुनासो.com?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            गुनासो.com combines cutting-edge technology with deep agricultural expertise to help Nepali
            farmers increase yields, reduce costs, and farm more sustainably.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow duration-300 border-0 bg-white">
              <CardContent className="p-0">
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div >
    </section >
  );
};

export default DifferenceSection;