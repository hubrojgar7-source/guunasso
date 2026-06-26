import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Resources using flat translation keys which is the recommended approach
const resources = {
  en: {
    translation: {
      // Common translations
      'common.language': 'Language',
      'common.english': 'English',
      'common.nepali': 'Nepali',
      'common.dashboard': 'Dashboard',
      'common.feed': 'Feed',
      'common.drPlant': 'Dr Plant',
      'common.data': 'Data',

      'common.transactions': 'Transactions',
      'common.weather': 'Weather',
      'common.pricing': 'Pricing',
      'common.settings': 'Settings',
      'common.help': 'Help',
      'common.signOut': 'Sign Out',
      'common.save': 'Save',
      'common.messaging': 'Messaging',
      'common.loading': 'Loading',
      
      // Messaging translations
      'messaging.description': 'Connect and chat with other users in real-time',
      'messaging.searchChats': 'Search chats',
      'messaging.recentChats': 'Recent Chats',
      'messaging.newChat': 'New Chat',
      'messaging.noChats': 'No chats found',
      'messaging.noChat': 'No chat selected',
      'messaging.selectChat': 'Select a chat from the list or start a new conversation',
      'messaging.startChat': 'Start New Chat',
      'messaging.typeMessage': 'Type a message...',
      'messaging.selectUser': 'Select User',
      'messaging.searchUsers': 'Search users',
      'messaging.noUsers': 'No users found',
      'messaging.noMessages': 'No messages yet. Start the conversation!',
      'messaging.allUsers': 'All Users',
      
      // Time periods
      'time.thisWeek': 'This Week',
      'time.lastWeek': 'Last Week',
      'time.thisMonth': 'This Month',
      'time.lastMonth': 'Last Month',
      'time.thisQuarter': 'This Quarter',
      
      // Data page
      'data.title': 'Dashboard Data Management',
      'data.description': 'Customize your dashboard charts with your own data',
      'data.revenue': 'Revenue',
      'data.complaintCategories': 'Complaint Categories',
      'data.petitionGrowth': 'Petition Growth',
      'data.customerSatisfaction': 'Customer Satisfaction',
      'data.targetVsReality': 'Target vs Reality',
      'data.trafficSources': 'Traffic Sources',
      'data.popularRoutes': 'Popular Routes',
      'data.editRevenueData': 'Edit Revenue Data',
      'data.editComplaintCategories': 'Edit Complaint Category Data',
      'data.editPetitionGrowth': 'Edit Petition Growth Data',
      'data.editCustomerSatisfaction': 'Edit Customer Satisfaction Data',
      'data.editTargetVsReality': 'Edit Target vs Reality Data',
      'data.editTrafficSources': 'Edit Traffic Sources Data',
      'data.editPopularRoutes': 'Edit Popular Routes Data',
      'data.value': 'Value',
      'data.count': 'Count',
      'data.routeName': 'Route Name',
      'data.bookings': 'Bookings',
      'data.loadError': 'Failed to load your chart data',
      'data.saveSuccess': 'Chart data saved successfully',
      'data.saveError': 'Failed to save chart data',
      
      // Days of the week
      'days.monday': 'Monday',
      'days.tuesday': 'Tuesday',
      'days.wednesday': 'Wednesday',
      'days.thursday': 'Thursday',
      'days.friday': 'Friday',
      'days.saturday': 'Saturday',
      'days.sunday': 'Sunday',
      
      // Chart titles
      'chart.totalRevenue': 'Total Revenue',
      'chart.onlineSales': 'Online Sales',
      'chart.offlineSales': 'Offline Sales',
      'chart.customerSatisfaction': 'Customer Satisfaction',
      'chart.targetVsReality': 'Target vs Reality',
      'chart.reality': 'Reality',
      'chart.target': 'Target',
      'chart.petitionGrowth': 'Petition Growth',
      'chart.complaintCategories': 'Complaint Categories',
      'chart.trafficSources': 'Traffic Sources',
      'chart.topComplaintCategories': 'Top Complaint Categories',
      'chart.lastMonth': 'Last Month',
      'chart.thisMonth': 'This Month',
      'chart.noDataAvailable': 'No data available',
      'chart.noDataMessage': 'Please add data to view the chart visualization',
      
      // Complaint categories
      'complaintCategories.infrastructure': 'Infrastructure',
      'complaintCategories.health': 'Health',
      'complaintCategories.education': 'Education',
      'complaintCategories.governance': 'Governance',
      'complaintCategories.other': 'Other',
      
      // Stats cards
      'stats.totalComplaints': 'TOTAL COMPLAINTS',
      'stats.resolvedComplaints': 'RESOLVED',
      'stats.activePetitions': 'ACTIVE PETITIONS',
      'stats.totalSignatures': 'TOTAL SIGNATURES',
      
      // Currency
      'currency.symbol': '$',
      'currency.code': 'USD',
      
      // Other common words
      'common.get': 'Get',
      'common.pro': 'Pro',
      'common.access': 'Get access to all features and benefits',
      
      // Dashboard components
      'dashboard.visitorInsights': 'Visitor Insights',
      'dashboard.loyalCustomers': 'Loyal Customers',
      'dashboard.newCustomers': 'New Customers',
      'dashboard.uniqueCustomers': 'Unique Customers',
      'dashboard.todaySales': 'Today\'s Sales',
      'dashboard.salesSummary': 'Summary of sales activity today',
      'dashboard.totalSales': 'Total Sales',
      'dashboard.totalOrder': 'Total Order',
      'dashboard.productSold': 'Product Sold',
      'dashboard.fromYesterday': 'from yesterday',
      'dashboard.export': 'Export',
      'dashboard.lastMonth': 'Last Month',
      'dashboard.thisMonth': 'This Month',
      'dashboard.last7Days': 'Last 7 Days',
      'dashboard.last30Days': 'Last 30 Days',
      'dashboard.last90Days': 'Last 90 Days',
      'dashboard.last7Months': 'Last 7 Months',
      'dashboard.last6Months': 'Last 6 Months',
      'dashboard.last12Months': 'Last 12 Months',
      'dashboard.thisYear': 'This Year',
      'dashboard.lastYear': 'Last Year',
      'dashboard.name': 'Name',
      'dashboard.popularity': 'Popularity',
      'dashboard.sales': 'Sales',
      'dashboard.realitySales': 'Reality Sales',
      'dashboard.targetSales': 'Target Sales',
      'dashboard.currentSeason': 'Current Season',
      'dashboard.lastSeason': 'Last Season',
      'dashboard.yearlyAverage': 'Yearly Average',
      'dashboard.distribution': 'Distribution',
      'dashboard.temperature': 'Temperature',
      'dashboard.exportPDF': 'Export PDF',
      'dashboard.12Months': '12 Months',
      'dashboard.6Months': '6 Months',
      'dashboard.30Days': '30 Days',
      'dashboard.7Days': '7 Days',
      
      // Transactions Section
      'transactions.title': 'Transactions',
      'transactions.seeAll': 'See All Transactions →',
      'transactions.summary': 'Recent activity and financial transactions',
      'transactions.type': 'Type',
      'transactions.vendor': 'Vendor',
      'transactions.amount': 'Amount',
      'transactions.date': 'Date',
      'transactions.status': 'Status',
      'transactions.completed': 'Completed',
      'transactions.pending': 'Pending',
      'transactions.fertilizer': 'Fertilizer Purchase',
      'transactions.seed': 'Seed Order',
      'transactions.equipment': 'Equipment Rental',
      'transactions.pesticide': 'Pesticide Purchase',
      
      // Farmers Section
      'farmers.title': 'Recent Farmers',
      'farmers.seeAll': 'SEE ALL FARMERS →',
      'farmers.summary': 'Top farmers by revenue this month',
      'farmers.name': 'Name',
      'farmers.email': 'Email',
      'farmers.location': 'Location',
      'farmers.revenue': 'Revenue',
      
      // Months
      'months.jan': 'Jan',
      'months.feb': 'Feb',
      'months.mar': 'Mar',
      'months.apr': 'Apr',
      'months.may': 'May',
      'months.jun': 'Jun',
      'months.jul': 'Jul',
      'months.aug': 'Aug',
      'months.sep': 'Sep',
      'months.oct': 'Oct',
      'months.nov': 'Nov',
      'months.dec': 'Dec',

      // Crop types
      'crops.wheat': 'Wheat',
      'crops.corn': 'Corn',
      'crops.rice': 'Rice',
      'crops.barley': 'Barley',
      'crops.others': 'Others',

      // Traffic sources
      'traffic.direct': 'Direct',
      'traffic.referral': 'Referral',
      'traffic.socialMedia': 'Social Media',
      'traffic.twitter': 'Twitter',

      // Products
      'products.homeDecor': 'Home Decor Range',
      'products.disneyBag': 'Disney Princess Pink Bag IB',
      'products.bathroomEssentials': 'Bathroom Essentials',
      'products.appleWatches': 'Apple Smartwatches',

      // ─── Header / Nav ──────────────────────────────────────────────────
      'nav.home': 'Home',
      'nav.petitions': 'Petitions',
      'nav.campaign': 'Campaign',
      'nav.aboutUs': 'About us',
      'nav.contact': 'Contact',
      'header.dashboard': 'Dashboard',
      'header.campaignBtn': 'Campaign',

      // ─── Hero ──────────────────────────────────────────────────────────
      'hero.makeBig': 'Make A Big',
      'hero.differenceBy': 'Difference By',
      'hero.smallEffort': 'Small Effort',
      'hero.description': 'Join thousands of citizens raising their voice for change. Start a petition, gather support, and hold those in power accountable — one signature at a time.',
      'hero.startPetition': 'Start Petition',
      'hero.browsePetitions': 'Browse Petitions',
      'hero.alt.schoolBoys': 'Nepali school children in a classroom',
      'hero.alt.villageChildren': 'Nepali children in a rural village',
      'hero.alt.mountainChildren': 'Nepali children in the mountains of Darchula',
      'hero.alt.schoolgirls': 'Nepali schoolgirls talking in class',
      'hero.alt.kathmanduStreet': 'People walking on a bustling Kathmandu street',
      'hero.alt.durbarSquare': 'Community at Kathmandu Durbar Square, Nepal',

      // ─── Partners ──────────────────────────────────────────────────────
      'partners.text': 'Over 100k Citizens From 77 Districts Use Our Platform',

      // ─── Campaigns ─────────────────────────────────────────────────────
      'campaigns.title': 'Our Recent Campaign',
      'campaigns.goal': 'Goal',
      'campaigns.signatures': 'signatures',
      'campaigns.daysLeft': 'days left',
      'campaigns.signNow': 'Sign Now',
      'campaigns.1.title': 'Clean drinking water for rural schools in Karnali',
      'campaigns.1.description': 'Thousands of students lack access to safe drinking water. Sign to demand immediate action.',
      'campaigns.2.title': 'Fix potholes on Kathmandu ring road sections',
      'campaigns.2.description': 'Daily commuters face dangerous road conditions. Help us reach the municipality.',
      'campaigns.3.title': 'Free health checkups for elderly in remote villages',
      'campaigns.3.description': 'Support our petition for mobile health camps in underserved communities.',

      // ─── Testimonials ──────────────────────────────────────────────────
      'testimonials.title': 'Testimonial from',
      'testimonials.gunasoUser': 'Gunaso User',
      'testimonials.1.quote': '"गुनासो.com helped our community get the attention of local officials. Within weeks, our road repair petition gained over 3,000 signatures and the municipality responded."',
      'testimonials.1.name': 'Wade Warren',
      'testimonials.1.role': 'Community Leader, Pokhara',
      'testimonials.2.quote': '"I started a petition about school infrastructure in my district. The platform made it easy to share and track progress. Real change is possible when voices unite."',
      'testimonials.2.name': 'Sita Sharma',
      'testimonials.2.role': 'Teacher, Biratnagar',
      'testimonials.3.quote': '"As a youth activist, this platform gave me the tools to organize and amplify our demands. The transparency in vote counting builds trust among supporters."',
      'testimonials.3.name': 'Rajesh Thapa',
      'testimonials.3.role': 'Youth Activist, Kathmandu',

      // ─── Blog ──────────────────────────────────────────────────────────
      'blog.title': 'Read Our Latest Blog',
      'blog.comments': 'comments',
      'blog.1.title': 'How to Start a Petition That Gets Results',
      'blog.1.category': 'Guide',
      'blog.1.author': 'Sanjok Gharti',
      'blog.2.title': '5 Petitions That Changed Nepal This Year',
      'blog.2.category': 'Impact',
      'blog.2.author': 'Sita Sharma',
      'blog.3.title': 'Your Rights as a Citizen: Speaking Up Matters',
      'blog.3.category': 'Rights',
      'blog.3.author': 'Rajesh Thapa',

      // ─── CTA Banner ────────────────────────────────────────────────────
      'cta.title1': 'Speaking Today',
      'cta.title2': 'Changing Tomorrow',
      'cta.description': 'Every signature counts. Join the movement for accountability, transparency, and real change in your community.',
      'cta.browsePetitions': 'Browse Petitions',
      'cta.startPetition': 'Start Petition',

      // ─── Footer ────────────────────────────────────────────────────────
      'footer.description': 'Empowering citizens to raise their voice, start petitions, and drive meaningful change in their communities across Nepal.',
      'footer.navigate': 'Navigate',
      'footer.howItWorks': 'How it works',
      'footer.browsePetitions': 'Browse petitions',
      'footer.startCampaign': 'Start a campaign',
      'footer.successStories': 'Success stories',
      'footer.aboutUs': 'About us',
      'footer.whoWeAre': 'Who we are',
      'footer.ourMission': 'Our mission',
      'footer.blog': 'Blog',
      'footer.faqs': 'FAQs',
      'footer.contactUs': 'Contact Us',
      'footer.infoEmail': 'info@gunaso.com',
      'footer.phone': '+977 9868597841',
      'footer.address': 'Kathmandu, Nepal',
      'footer.copyright': '© Copyright 2026 गुनासो.com. All Rights Reserved.',

      // ─── Dashboard Sidebar ─────────────────────────────────────────────
      'sidebar.petition': 'Petition',
      'sidebar.polls': 'Polls',
      'sidebar.busFare': 'Bus Fare',
      'sidebar.support': 'Support',
      'sidebar.supportDesc': 'Support our campaign for public grievance hearing and good governance.',
      'sidebar.contactUs': 'Contact Us',

      // ─── Dashboard Page ────────────────────────────────────────────────
      'dashboard.todayOverview': "Today's Overview",
      'dashboard.summaryToday': 'Summary of today\'s platform activity',
      'dashboard.viewReport': 'View Report',
      'dashboard.expenditure': 'Expenditure',
      'dashboard.revenue': 'Revenue',
      'dashboard.thisWeek': 'This Week',
      'dashboard.thisYear': 'This Year',
      'dashboard.thisMonth': 'This Month',
      'dashboard.recurrent': 'Recurrent',
      'dashboard.capital': 'Capital',
      'dashboard.financing': 'Financing',
      'dashboard.grants': 'Grants',
      'dashboard.otherReceipts': 'Other Receipts',
      'dashboard.reality': 'Reality',
      'dashboard.target': 'Target',
      'dashboard.minBudget': 'Ministry Budget (Rs. Bn)',
      'dashboard.fiscalYear': 'Fiscal Year 2024/25 Allocation',
      'dashboard.budgetCategories': 'Budget Categories',
      'dashboard.socialSecurity': 'Social Security',
      'dashboard.debtRepayment': 'Debt Repayment',
      'dashboard.other': 'Other',
      'dashboard.total': 'Total',
      'dashboard.ask': 'सोध्नुहोस्?',
      'dashboard.complaintsToday': 'Complaints Today',
      'dashboard.resolvedToday': 'Resolved Today',
      'dashboard.activePetitions': 'Active Petitions',
      'dashboard.totalSignatures': 'Total Signatures',

      // ─── Dashboard page titles ──────────────────────────────────────────
      'pageTitle.dashboard': 'Dashboard',
      'pageTitle.settings': 'Settings',
      'pageTitle.feed': 'Feed',
      'pageTitle.drSummarizer': 'Dr Summarizer',
      'pageTitle.data': 'Market Data',
      'pageTitle.pricing': 'Pricing',
      'pageTitle.help': 'Help Center',
      'pageTitle.complaints': 'Complaints',
      'pageTitle.petition': 'Petition / मागपत्र',
      'pageTitle.busFare': 'Bus Fare',
      'pageTitle.polls': 'Polls / मतदान',
      'pageTitle.messaging': 'Messaging',
      'pageTitle.weather': 'Weather',
      'pageTitle.transactions': 'Transactions',
    }
  },
  ne: {
    translation: {
      // Common translations
      'common.language': 'भाषा',
      'common.english': 'अंग्रेजी',
      'common.nepali': 'नेपाली',
      'common.dashboard': 'ड्यासबोर्ड',
      'common.data': 'बजार डाटा',
      'common.drSummarizer': 'Dr Summarizer',
      'common.messaging': 'सन्देश',

      'common.transactions': 'ट्रान्सफरहरू',
      'common.weather': 'मौसम',
      'common.pricing': 'मूल्य निर्धारण',
      'common.settings': 'सेटिङ्स',
      'common.help': 'मद्दत',
      'common.signOut': 'साइन आउट',
      'common.save': 'सुरक्षित गर्नुहोस्',
      'common.messaging': 'संदेशहरू',
      'common.loading': 'लोड गर्दै',
      
      // Messaging translations
      'messaging.description': 'अन्य उपभोक्ता सहकारी र वास्तविक समयमा चैट गर्नुहोस्',
      'messaging.searchChats': 'चैटहरू खोज्नुहोस्',
      'messaging.recentChats': 'हालैका चैटहरू',
      'messaging.newChat': 'नयाँ चैट',
      'messaging.noChats': 'कुनै चैट भेटिएन',
      'messaging.noChat': 'कुनै चैट चयन गरिएन',
      'messaging.selectChat': 'सूचीमा चैट चयन गर्नुहोस् वा नयाँ चैट सुरु गर्नुहोस्',
      'messaging.startChat': 'नयाँ चैट सुरु गर्नुहोस्',
      'messaging.typeMessage': 'संदेश प्रकार गर्नुहोस्...',
      'messaging.selectUser': 'उपभोक्ता चयन गर्नुहोस्',
      'messaging.searchUsers': 'उपभोक्ता खोज्नुहोस्',
      'messaging.noUsers': 'कुनै उपभोक्ता भेटिएन',
      'messaging.noMessages': 'कुनै संदेश भेटिएन। चैट सुरु गर्नुहोस्!',
      'messaging.allUsers': 'सबै उपभोक्ताहरू',
      
      // Time periods
      'time.thisWeek': 'यो हप्ता',
      'time.lastWeek': 'गत हप्ता',
      'time.thisMonth': 'यो महिना',
      'time.lastMonth': 'गत महिना',
      'time.thisQuarter': 'यो त्रैमासिक',
      
      // Data page
      'data.title': 'ड्यासबोर्ड डाटा व्यवस्थापन',
      'data.description': 'आफ्नो ड्यासबोर्ड चार्टहरू आफ्नै डाटा सँग अनुकूलन गर्नुहोस्',
      'data.revenue': 'आम्दानी',
      'data.complaintCategories': 'गुनासो श्रेणीहरू',
      'data.petitionGrowth': 'मागपत्र वृद्धि',
      'data.customerSatisfaction': 'ग्राहक सन्तुष्टि',
      'data.targetVsReality': 'लक्ष्य बनाम वास्तविकता',
      'data.trafficSources': 'ट्राफिक स्रोतहरू',
      'data.popularRoutes': 'लोकप्रिय मार्गहरू',
      'data.editRevenueData': 'आम्दानी डाटा सम्पादन गर्नुहोस्',
      'data.editComplaintCategories': 'गुनासो श्रेणी डाटा सम्पादन गर्नुहोस्',
      'data.editPetitionGrowth': 'मागपत्र वृद्धि डाटा सम्पादन गर्नुहोस्',
      'data.editCustomerSatisfaction': 'ग्राहक सन्तुष्टि डाटा सम्पादन गर्नुहोस्',
      'data.editTargetVsReality': 'लक्ष्य बनाम वास्तविकता डाटा सम्पादन गर्नुहोस्',
      'data.editTrafficSources': 'ट्राफिक स्रोतहरू डाटा सम्पादन गर्नुहोस्',
      'data.editPopularRoutes': 'लोकप्रिय मार्गहरू डाटा सम्पादन गर्नुहोस्',
      'data.value': 'मान',
      'data.count': 'गणना',
      'data.routeName': 'मार्ग नाम',
      'data.bookings': 'बुकिङ',
      'data.loadError': 'तपाईंको चार्ट डाटा लोड गर्न असफल',
      'data.saveSuccess': 'चार्ट डाटा सफलतापूर्वक सुरक्षित गरियो',
      'data.saveError': 'चार्ट डाटा सुरक्षित गर्न असफल',
      
      // Days of the week
      'days.monday': 'सोमबार',
      'days.tuesday': 'मंगलबार',
      'days.wednesday': 'बुधबार',
      'days.thursday': 'बिहिबार',
      'days.friday': 'शुक्रबार',
      'days.saturday': 'शनिबार',
      'days.sunday': 'आइतबार',
      
      // Chart titles
      'chart.totalRevenue': 'कुल राजस्व',
      'chart.onlineSales': 'अनलाइन बिक्री',
      'chart.offlineSales': 'अफलाइन बिक्री',
      'chart.customerSatisfaction': 'ग्राहक सन्तुष्टि',
      'chart.targetVsReality': 'लक्ष्य बनाम वास्तविकता',
      'chart.petitionGrowth': 'मागपत्र वृद्धि',
      'chart.complaintCategories': 'गुनासो श्रेणीहरू',
      'chart.trafficSources': 'ट्राफिक स्रोतहरू',
      'chart.topProducts': 'शीर्ष उत्पादनहरू',
      'chart.noDataAvailable': 'कुनै डाटा उपलब्ध छैन',
      'chart.noDataMessage': 'चार्ट हेर्न कृपया डाटा थप्नुहोस्',
      
      // Complaint categories
      'complaintCategories.infrastructure': 'पूर्वाधार',
      'complaintCategories.health': 'स्वास्थ्य',
      'complaintCategories.education': 'शिक्षा',
      'complaintCategories.governance': 'सुशासन',
      'complaintCategories.other': 'अन्य',
      
      // Stats cards
      'stats.totalComplaints': 'कुल गुनासो',
      'stats.resolvedComplaints': 'समाधान गरियो',
      'stats.activePetitions': 'सक्रिय मागपत्र',
      'stats.totalSignatures': 'कुल हस्ताक्षर',
      
      // Currency
      'currency.symbol': 'रू',
      'currency.code': 'NPR',
      
      // Other common words
      'common.get': 'प्राप्त गर्नुहोस्',
      'common.pro': 'प्रो',
      'common.access': 'सबै सुविधाहरू र लाभहरूमा पहुँच प्राप्त गर्नुहोस्',
      
      // Dashboard components
      'dashboard.visitorInsights': 'आगन्तुक अन्तर्दृष्टि',
      'dashboard.loyalCustomers': 'नियमित ग्राहकहरू',
      'dashboard.newCustomers': 'नयाँ ग्राहकहरू',
      'dashboard.uniqueCustomers': 'विशिष्ट ग्राहकहरू',
      'dashboard.todaySales': 'आजको बिक्री',
      'dashboard.salesSummary': 'आज बिक्री गतिविधिको सारांश',
      'dashboard.totalSales': 'कुल बिक्री',
      'dashboard.totalOrder': 'कुल अर्डर',
      'dashboard.productSold': 'बिक्री भएको उत्पादन',
      'dashboard.fromYesterday': 'हिजोको तुलनामा',
      'dashboard.export': 'निर्यात गर्नुहोस्',
      'dashboard.lastMonth': 'पछिल्लो महिना',
      'dashboard.thisMonth': 'यो महिना',
      'dashboard.last7Days': 'पछिल्लो ७ दिन',
      'dashboard.last30Days': 'पछिल्लो ३० दिन',
      'dashboard.last90Days': 'पछिल्लो ९० दिन',
      'dashboard.last7Months': 'पछिल्लो ७ महिना',
      'dashboard.last6Months': 'पछिल्लो ६ महिना',
      'dashboard.last12Months': 'पछिल्लो १२ महिना',
      'dashboard.thisYear': 'यो वर्ष',
      'dashboard.lastYear': 'गत वर्ष',
      'dashboard.name': 'नाम',
      'dashboard.popularity': 'लोकप्रियता',
      'dashboard.sales': 'बिक्री',
      'dashboard.realitySales': 'वास्तविक बिक्री',
      'dashboard.targetSales': 'लक्ष्य बिक्री',
      'dashboard.currentSeason': 'हालको ऋतु',
      'dashboard.lastSeason': 'गत ऋतु',
      'dashboard.yearlyAverage': 'वार्षिक औसत',
      'dashboard.distribution': 'वितरण',
      'dashboard.temperature': 'तापक्रम',
      'dashboard.exportPDF': 'पिडिएफ निर्यात गर्नुहोस्',
      'dashboard.12Months': '१२ महिना',
      'dashboard.6Months': '६ महिना',
      'dashboard.30Days': '३० दिन',
      'dashboard.7Days': '७ दिन',
      
      // Transactions Section
      'transactions.title': 'कारोबारहरू',
      'transactions.seeAll': 'सबै कारोबारहरू हेर्नुहोस् →',
      'transactions.summary': 'हालैका गतिविधि र वित्तीय कारोबारहरू',
      'transactions.type': 'प्रकार',
      'transactions.vendor': 'विक्रेता',
      'transactions.amount': 'रकम',
      'transactions.date': 'मिति',
      'transactions.status': 'स्थिति',
      'transactions.completed': 'पूरा भयो',
      'transactions.pending': 'प्रक्रियामा',
      'transactions.fertilizer': 'मल खरिद',
      'transactions.seed': 'बीउ अर्डर',
      'transactions.equipment': 'उपकरण भाडा',
      'transactions.pesticide': 'कीटनाशक खरिद',
      
      // Farmers Section
      'farmers.title': 'हालका किसानहरू',
      'farmers.seeAll': 'सबै किसानहरू हेर्नुहोस् →',
      'farmers.summary': 'यस महिना राजस्वको आधारमा शीर्ष किसानहरू',
      'farmers.name': 'नाम',
      'farmers.email': 'इमेल',
      'farmers.location': 'स्थान',
      'farmers.revenue': 'राजस्व',
      
      // Months
      'months.jan': 'जनवरी',
      'months.feb': 'फेब्रुअरी',
      'months.mar': 'मार्च',
      'months.apr': 'अप्रिल',
      'months.may': 'मे',
      'months.jun': 'जुन',
      'months.jul': 'जुलाई',
      'months.aug': 'अगस्त',
      'months.sep': 'सेप्टेम्बर',
      'months.oct': 'अक्टोबर',
      'months.nov': 'नोभेम्बर',
      'months.dec': 'डिसेम्बर',

      // Crop types
      'crops.wheat': 'गहुँ',
      'crops.corn': 'मकै',
      'crops.rice': 'चामल',
      'crops.barley': 'जौ',
      'crops.others': 'अन्य',

      // Traffic sources
      'traffic.direct': 'प्रत्यक्ष',
      'traffic.referral': 'रेफरल',
      'traffic.socialMedia': 'सामाजिक संजाल',
      'traffic.twitter': 'ट्विटर',

      // Products
      'products.homeDecor': 'गृह सजावट रेन्ज',
      'products.disneyBag': 'डिज्नी प्रिन्सेस गुलाबी झोला',
      'products.bathroomEssentials': 'बाथरुम आवश्यकताहरू',
      'products.appleWatches': 'एप्पल स्मार्टघडीहरू',

      // ─── Header / Nav ──────────────────────────────────────────────────
      'nav.home': 'गृहपृष्ठ',
      'nav.petitions': 'मागपत्रहरू',
      'nav.campaign': 'अभियान',
      'nav.aboutUs': 'हाम्रो बारेमा',
      'nav.contact': 'सम्पर्क',
      'header.dashboard': 'ड्यासबोर्ड',
      'header.campaignBtn': 'अभियान',

      // ─── Hero ──────────────────────────────────────────────────────────
      'hero.makeBig': 'ठूलो परिवर्तन',
      'hero.differenceBy': 'गर्नुहोस् सानो',
      'hero.smallEffort': 'प्रयासले',
      'hero.description': 'परिवर्तनको लागि आवाज उठाउने हजारौं नागरिकहरूमा सामेल हुनुहोस्। मागपत्र सुरु गर्नुहोस्, समर्थन जुटाउनुहोस्, र जवाफदेही बनाउनुहोस् — एक हस्ताक्षरले।',
      'hero.startPetition': 'मागपत्र सुरु गर्नुहोस्',
      'hero.browsePetitions': 'मागपत्र हेर्नुहोस्',
      'hero.alt.schoolBoys': 'कक्षाकोठामा नेपाली विद्यार्थीहरू',
      'hero.alt.villageChildren': 'गाउँमा नेपाली बालबालिकाहरू',
      'hero.alt.mountainChildren': 'दार्चुलाका पहाडमा नेपाली बालबालिकाहरू',
      'hero.alt.schoolgirls': 'कक्षामा कुरा गर्दै नेपाली विद्यार्थीहरू',
      'hero.alt.kathmanduStreet': 'व्यस्त काठमाडौं सडकमा मानिसहरू',
      'hero.alt.durbarSquare': 'काठमाडौं दरबार स्क्वायरमा समुदाय, नेपाल',

      // ─── Partners ──────────────────────────────────────────────────────
      'partners.text': '७७ जिल्लाका १ लाख भन्दा बढी नागरिकले हाम्रो प्लेटफर्म प्रयोग गर्छन्',

      // ─── Campaigns ─────────────────────────────────────────────────────
      'campaigns.title': 'हाम्रो हालको अभियान',
      'campaigns.goal': 'लक्ष्य',
      'campaigns.signatures': 'हस्ताक्षर',
      'campaigns.daysLeft': 'दिन बाँकी',
      'campaigns.signNow': 'हस्ताक्षर गर्नुहोस्',
      'campaigns.1.title': 'कर्णालीका ग्रामीण विद्यालयहरूको लागि सफा पिउने पानी',
      'campaigns.1.description': 'हजारौं विद्यार्थीहरूसँग सुरक्षित पिउने पानीको पहुँच छैन। तत्काल कारबाहीको माग गर्न हस्ताक्षर गर्नुहोस्।',
      'campaigns.2.title': 'काठमाडौं रिङरोड खण्डहरूको खाल्डो मर्मत',
      'campaigns.2.description': 'दैनिक यात्रुहरू खतरनाक सडक अवस्थाको सामना गर्छन्। नगरपालिकासम्म पुग्न हामीलाई सहयोग गर्नुहोस्।',
      'campaigns.3.title': 'दुर्गम गाउँहरूमा वृद्धवृद्धाको लागि नि:शुल्क स्वास्थ्य जाँच',
      'campaigns.3.description': 'सेवा नपुगेका समुदायहरूमा मोबाइल स्वास्थ्य शिविरको लागि हाम्रो मागपत्रलाई समर्थन गर्नुहोस्।',

      // ─── Testimonials ──────────────────────────────────────────────────
      'testimonials.title': 'प्रशंसापत्र',
      'testimonials.gunasoUser': 'गुनासो प्रयोगकर्ता',
      'testimonials.1.quote': '"गुनासो.कमले हाम्रो समुदायलाई स्थानीय अधिकारीहरूको ध्यान आकर्षित गर्न मद्दत गर्यो। केही हप्तामा, हाम्रो सडक मर्मत मागपत्रले ३,००० भन्दा बढी हस्ताक्षर प्राप्त गर्यो र नगरपालिकाले प्रतिक्रिया दियो।"',
      'testimonials.1.name': 'वेड वारेन',
      'testimonials.1.role': 'समुदाय नेता, पोखरा',
      'testimonials.2.quote': '"मैले आफ्नो जिल्लामा विद्यालय पूर्वाधारको बारेमा मागपत्र सुरु गरें। प्लेटफर्मले साझेदारी र प्रगति ट्र्याक गर्न सजिलो बनायो। आवाज एकताबद्ध हुँदा वास्तविक परिवर्तन सम्भव छ।"',
      'testimonials.2.name': 'सीता शर्मा',
      'testimonials.2.role': 'शिक्षिका, विराटनगर',
      'testimonials.3.quote': '"एक युवा कार्यकर्ताको रूपमा, यो प्लेटफर्मले हाम्रा मागहरू संगठित र प्रवर्द्धन गर्न उपकरण दियो। मत गणनामा पारदर्शिताले समर्थकहरूमा विश्वास बढाउँछ।"',
      'testimonials.3.name': 'राजेश थापा',
      'testimonials.3.role': 'युवा कार्यकर्ता, काठमाडौं',

      // ─── Blog ──────────────────────────────────────────────────────────
      'blog.title': 'हाम्रो पछिल्लो ब्लग पढ्नुहोस्',
      'blog.comments': 'टिप्पणीहरू',
      'blog.1.title': 'परिणाम दिने मागपत्र कसरी सुरु गर्ने',
      'blog.1.category': 'गाइड',
      'blog.1.author': 'सञ्जोक घर्ती',
      'blog.2.title': 'यस वर्ष नेपाल परिवर्तन गर्ने ५ मागपत्रहरू',
      'blog.2.category': 'प्रभाव',
      'blog.2.author': 'सीता शर्मा',
      'blog.3.title': 'नागरिकको रूपमा तपाईंको अधिकार: बोल्नु महत्त्वपूर्ण छ',
      'blog.3.category': 'अधिकार',
      'blog.3.author': 'राजेश थापा',

      // ─── CTA Banner ────────────────────────────────────────────────────
      'cta.title1': 'आज बोल्दै',
      'cta.title2': 'भोलि परिवर्तन',
      'cta.description': 'प्रत्येक हस्ताक्षर मायने राख्छ। जवाफदेही, पारदर्शिता, र तपाईंको समुदायमा वास्तविक परिवर्तनको लागि आन्दोलनमा सामेल हुनुहोस्।',
      'cta.browsePetitions': 'मागपत्र हेर्नुहोस्',
      'cta.startPetition': 'मागपत्र सुरु गर्नुहोस्',

      // ─── Footer ────────────────────────────────────────────────────────
      'footer.description': 'नेपालभरका समुदायहरूमा आवाज उठाउन, मागपत्र सुरु गर्न, र अर्थपूर्ण परिवर्तन ल्याउन नागरिकहरूलाई सशक्त बनाउँदै।',
      'footer.navigate': 'नेभिगेट',
      'footer.howItWorks': 'यसले कसरी काम गर्छ',
      'footer.browsePetitions': 'मागपत्र हेर्नुहोस्',
      'footer.startCampaign': 'अभियान सुरु गर्नुहोस्',
      'footer.successStories': 'सफलताका कथाहरू',
      'footer.aboutUs': 'हाम्रो बारेमा',
      'footer.whoWeAre': 'हामी को हौं',
      'footer.ourMission': 'हाम्रो मिशन',
      'footer.blog': 'ब्लग',
      'footer.faqs': 'प्रायः सोधिने प्रश्नहरू',
      'footer.contactUs': 'सम्पर्क गर्नुहोस्',
      'footer.infoEmail': 'info@gunaso.com',
      'footer.phone': '+९७७ ९८६८५९७८४१',
      'footer.address': 'काठमाडौं, नेपाल',
      'footer.copyright': '© प्रतिलिपि अधिकार २०२६ गुनासो.कम। सर्वाधिकार सुरक्षित।',

      // ─── Dashboard Sidebar ─────────────────────────────────────────────
      'sidebar.petition': 'मागपत्र',
      'sidebar.polls': 'मतदान',
      'sidebar.busFare': 'बस भाडा',
      'sidebar.support': 'सहयोग / Support',
      'sidebar.supportDesc': 'सार्वजनिक गुनासो सुनुवाई र सुशासनको लागि हाम्रो अभियानलाई समर्थन गर्नुहोस्।',
      'sidebar.contactUs': 'हामीलाई सम्पर्क गर्नुहोस्',

      // ─── Dashboard Page ────────────────────────────────────────────────
      'dashboard.todayOverview': 'आजको सारांश',
      'dashboard.summaryToday': 'आजको प्लेटफर्म गतिविधिको सारांश',
      'dashboard.viewReport': 'प्रतिवेदन हेर्नुहोस्',
      'dashboard.expenditure': 'खर्च',
      'dashboard.revenue': 'राजस्व',
      'dashboard.thisWeek': 'यो हप्ता',
      'dashboard.thisYear': 'यो वर्ष',
      'dashboard.thisMonth': 'यो महिना',
      'dashboard.recurrent': 'पुनरावर्ती',
      'dashboard.capital': 'पुँजीगत',
      'dashboard.financing': 'वित्तपोषण',
      'dashboard.grants': 'अनुदान',
      'dashboard.otherReceipts': 'अन्य प्राप्ति',
      'dashboard.reality': 'वास्तविक',
      'dashboard.target': 'लक्ष्य',
      'dashboard.minBudget': 'मन्त्रालय बजेट (रु. अर्ब)',
      'dashboard.fiscalYear': 'आर्थिक वर्ष २०८१/८२ विनियोजन',
      'dashboard.budgetCategories': 'बजेट श्रेणीहरू',
      'dashboard.socialSecurity': 'सामाजिक सुरक्षा',
      'dashboard.debtRepayment': 'ऋण भुक्तानी',
      'dashboard.other': 'अन्य',
      'dashboard.total': 'जम्मा',
      'dashboard.ask': 'सोध्नुहोस्?',
      'dashboard.complaintsToday': 'आजको गुनासो',
      'dashboard.resolvedToday': 'आज समाधान',
      'dashboard.activePetitions': 'सक्रिय मागपत्र',
      'dashboard.totalSignatures': 'कुल हस्ताक्षर',

      // ─── Dashboard page titles ──────────────────────────────────────────
      'pageTitle.dashboard': 'ड्यासबोर्ड',
      'pageTitle.settings': 'सेटिङ्स',
      'pageTitle.feed': 'फिड',
      'pageTitle.drSummarizer': 'Dr Summarizer',
      'pageTitle.data': 'बजार डाटा',
      'pageTitle.pricing': 'मूल्य निर्धारण',
      'pageTitle.help': 'मद्दत केन्द्र',
      'pageTitle.complaints': 'गुनासोहरू',
      'pageTitle.petition': 'मागपत्र',
      'pageTitle.busFare': 'बस भाडा',
      'pageTitle.polls': 'मतदान',
      'pageTitle.messaging': 'सन्देश',
      'pageTitle.weather': 'मौसम',
      'pageTitle.transactions': 'कारोबार',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.MODE === 'development',
    interpolation: {
      escapeValue: false, // not needed for React
    },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    }
  });

// Ensure English is the default if nothing is stored
const stored = localStorage.getItem('i18nextLng');
if (!stored || stored === 'undefined') {
  localStorage.setItem('i18nextLng', 'en');
}

// Helper functions for number formatting
export const formatNumber = (number: number, language: string): string => {
  if (language.startsWith('ne')) {
    // Format for Nepali
    return new Intl.NumberFormat('ne-NP').format(number);
  }
  // Default format
  return new Intl.NumberFormat('en-US').format(number);
};

export const formatCurrency = (number: number, language: string): string => {
  if (language.startsWith('ne')) {
    // Format for Nepali (NPR)
    return `रू ${new Intl.NumberFormat('ne-NP').format(number)}`;
  }
  // Default format (USD)
  return `$${new Intl.NumberFormat('en-US').format(number)}`;
};

export default i18n; 