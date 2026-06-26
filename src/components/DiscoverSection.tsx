import React from 'react';
import { Sprout, CloudRain, Tractor, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DiscoverSection = () => {
  const features = [
    {
      icon: Sprout,
      description: "Our platform is specially designed for Nepali farmers, with a simple interface that works in local languages and doesn't require technical expertise to use."
    },
    {
      icon: CloudRain,
      description: "Access hyper-local weather forecasting and climate insights specific to Nepal's diverse geographical regions, from the Terai plains to high mountain farms."
    },
    {
      icon: Tractor,
      description: "Get customized recommendations for traditional and modern farming techniques suited to your specific crops, soil conditions, and local agricultural practices."
    },
    {
      icon: Users,
      description: "Connect with a community of thousands of Nepali farmers sharing knowledge, trading tips, and collaborating to overcome common challenges together."
    }
  ];

  return (
    <section className="py-20 px-8 bg-white relative overflow-visible">
      {/* Floating dots decoration */}
      <div className="absolute top-20 left-10 w-32 h-32 opacity-20">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-600 rounded-full"
            style={{
              top: `${Math.floor(Math.random() * 100)}%`,
              left: `${Math.floor(Math.random() * 100)}%`,
              animation: `float ${5 + Math.random() * 10}s infinite ease-in-out ${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      <div className="absolute top-1/3 right-10 w-32 h-32 opacity-20">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-600 rounded-full"
            style={{
              top: `${Math.floor(Math.random() * 100)}%`,
              left: `${Math.floor(Math.random() * 100)}%`,
              animation: `float ${5 + Math.random() * 10}s infinite ease-in-out ${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              गुनासो.com: Made for Nepali Farmers
            </h2>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-gray-600 leading-relaxed pt-2">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg">
                Try गुनासो.com Free
              </Button>
            </div>
          </div>

          {/* Right Phone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-80 h-[640px] bg-foreground rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden relative">
                  {/* Phone Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-foreground rounded-b-2xl z-10"></div>

                  {/* App Interface */}
                  <div className="pt-12 px-6 h-full bg-gradient-to-br from-muted/20 to-primary/5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </div>

                    <div className="text-muted-foreground text-sm mb-2">Today's Update</div>
                    <div className="text-2xl font-bold text-foreground mb-6">Farm Dashboard</div>

                    {/* Weather Alert Card */}
                    <div className="bg-card rounded-2xl p-4 mb-4 shadow-sm">
                      <div className="text-sm font-medium text-foreground mb-1">Weather Alert</div>
                      <div className="text-xs text-muted-foreground">Light Rain Expected in Eastern Terai</div>
                      <div className="text-xs text-muted-foreground mt-2">Updated 20 min ago</div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-card rounded-2xl p-4 shadow-sm">
                        <div className="text-2xl font-bold text-primary">85%</div>
                        <div className="text-xs text-muted-foreground">Soil Moisture</div>
                      </div>
                      <div className="bg-card rounded-2xl p-4 shadow-sm">
                        <div className="text-2xl font-bold text-green-600">28°C</div>
                        <div className="text-xs text-muted-foreground">Temperature</div>
                      </div>
                    </div>

                    {/* Farm Status Cards */}
                    <div className="space-y-3">
                      <div className="bg-card rounded-2xl p-3 shadow-sm">
                        <div className="text-sm font-medium text-foreground">Rice Field Status</div>
                        <div className="text-xs text-muted-foreground">Healthy - 3 weeks to harvest</div>
                      </div>
                      <div className="bg-card rounded-2xl p-3 shadow-sm">
                        <div className="text-sm font-medium text-foreground">Market Prices</div>
                        <div className="text-xs text-green-600">Rice NPR 75/kg (+5%)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverSection;