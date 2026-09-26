import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const TRANSLATIONS = {
  en: {
    // Nav
    dashboard: 'Dashboard',
    liveMap: 'Live Map',
    vehicles: 'Vehicles',
    routes: 'Routes',
    alerts: 'Alerts',
    fieldReports: 'Field Reports',
    analytics: 'Analytics',
    systemOnline: 'System Online',
    
    // Header & Global
    platformTitle: 'NER Logistics',
    platformSubtitle: 'Intelligence Platform',
    searchPlaceholder: 'Search districts, vehicles, NH...',
    emergencySos: 'Emergency SOS',
    logout: 'Logout',
    commandCenter: 'Command & Operations Center',
    commandSubtitle: 'Real-time 8-State NER Logistics, Fleet GPS & Disaster Intelligence Platform',
    liveSync: 'All Systems Online • Live Sync',
    updated: 'Updated',
    
    // Stat Cards
    activeVehicles: 'Active Fleet Vehicles',
    openAlerts: 'Active Emergency Alerts',
    blockedRoutes: 'Critical Route Disruptions',
    deliverySuccess: 'NER Delivery Success',
    trackFleet: 'Track Fleet',
    inspectAlerts: 'Inspect Alerts',
    viewGisMap: 'View GIS Map',
    supplyChain: 'Supply Chain',
    fromYesterday: 'from yesterday',
    
    // Quick Actions
    planRoute: 'Plan Route',
    aiPathfinding: 'AI Pathfinding Engine',
    liveTelematics: 'Live GPS Telematics',
    emergencyFeed: 'Emergency Feed',
    fieldReportForm: 'Officer Incident Form',
    liveAccessibility: 'Live Accessibility Map',
    
    // Charts & Feed
    regionalConnectivity: 'Regional Highway Connectivity Index',
    liveAiScore: 'Live AI Score',
    deepAnalytics: 'Deep Analytics',
    clickStateDrilldown: 'Click any state bar to drill down into highway logistics metrics',
    liveThreatFeed: 'Live Incident & Threat Feed',
    viewAll: 'View All',
    submitOfficerReport: 'Submit Officer Ground Report',
    
    // SOS Modal
    sosTitle: 'Emergency SOS & Response Console',
    sosSubtitle: 'Instantly contact nearest Police Station, SDRF/NDRF, and saved Family Contacts.',
    triggerSos: 'TRIGGER EMERGENCY SOS NOW',
    copyLocation: 'Copy Location',
    nearestPolice: 'Nearest Police & Disaster Response',
    savedFamily: 'Saved Family & Fleet Contacts',
    addFamily: 'Add Family',
    callStation: 'Call Station',
    dial112: 'Dial 112',
    stateControl: 'State Control Room',
    disasterMgmt: 'Disaster Management (SDMA)',
    
    // General Actions
    cancel: 'Cancel',
    save: 'Save',
    close: 'Close',
    optimizeRoute: 'Optimize Route',
    inspectDetails: 'Inspect Details →',
    acknowledge: 'Acknowledge',
    findAlternateRoute: 'Find Alternate Route'
  },

  hi: {
    // Nav
    dashboard: 'डैशबोर्ड',
    liveMap: 'लाइव मैप',
    vehicles: 'वाहन बेड़ा',
    routes: 'मार्ग मार्गदर्शिका',
    alerts: 'आपातकालीन अलर्ट',
    fieldReports: 'फील्ड रिपोर्ट',
    analytics: 'विश्लेषण (Analytics)',
    systemOnline: 'सिस्टम ऑनलाइन',
    
    // Header & Global
    platformTitle: 'पूर्वोत्तर रसद',
    platformSubtitle: 'खुफिया मंच',
    searchPlaceholder: 'जिले, वाहन, राष्ट्रीय राजमार्ग खोजें...',
    emergencySos: 'आपातकालीन SOS',
    logout: 'लॉग आउट',
    commandCenter: 'कमांड और परिचालन केंद्र',
    commandSubtitle: 'वास्तविक समय 8-राज्य पूर्वोत्तर क्षेत्र रसद और आपदा खुफिया मंच',
    liveSync: 'सभी सिस्टम ऑनलाइन • लाइव सिंक',
    updated: 'अद्यतन किया गया',
    
    // Stat Cards
    activeVehicles: 'सक्रिय बेड़ा वाहन',
    openAlerts: 'सक्रिय आपातकालीन अलर्ट',
    blockedRoutes: 'गंभीर मार्ग रुकावटें',
    deliverySuccess: 'वितरण सफलता दर',
    trackFleet: 'बेड़े को ट्रैक करें',
    inspectAlerts: 'अलर्ट जांचें',
    viewGisMap: 'GIS मानचित्र देखें',
    supplyChain: 'आपूर्ति श्रृंखला',
    fromYesterday: 'कल से',
    
    // Quick Actions
    planRoute: 'मार्ग की योजना बनाएं',
    aiPathfinding: 'AI मार्ग खोज इंजन',
    liveTelematics: 'लाइव GPS टेलीमैटिक्स',
    emergencyFeed: 'आपातकालीन फीड',
    fieldReportForm: 'अधिकारी घटना फॉर्म',
    liveAccessibility: 'लाइव पहुंच मानचित्र',
    
    // Charts & Feed
    regionalConnectivity: 'क्षेत्रीय राजमार्ग कनेक्टिविटी सूचकांक',
    liveAiScore: 'लाइव AI स्कोर',
    deepAnalytics: 'गहन विश्लेषण',
    clickStateDrilldown: 'राजमार्ग मेट्रिक्स देखने के लिए किसी भी राज्य बार पर क्लिक करें',
    liveThreatFeed: 'लाइव घटना और खतरा फीड',
    viewAll: 'सभी देखें',
    submitOfficerReport: 'ग्राउंड रिपोर्ट सबमिट करें',
    
    // SOS Modal
    sosTitle: 'आपातकालीन SOS और प्रतिक्रिया कंसोल',
    sosSubtitle: 'निकटतम पुलिस स्टेशन, SDRF/NDRF और सहेजे गए पारिवारिक संपर्कों से तुरंत संपर्क करें।',
    triggerSos: 'अब आपातकालीन SOS ट्रिगर करें',
    copyLocation: 'स्थान कॉपी करें',
    nearestPolice: 'निकटतम पुलिस और आपदा प्रतिक्रिया',
    savedFamily: 'सहेजे गए पारिवारिक संपर्क',
    addFamily: 'परिवार जोड़ें',
    callStation: 'स्टेशन को कॉल करें',
    dial112: '112 डायल करें',
    stateControl: 'राज्य नियंत्रण कक्ष',
    disasterMgmt: 'आपदा प्रबंधन (SDMA)',
    
    // General Actions
    cancel: 'रद्द करें',
    save: 'सहेजें',
    close: 'बंद करें',
    optimizeRoute: 'मार्ग अनुकूलित करें',
    inspectDetails: 'विवरण जांचें →',
    acknowledge: 'स्वीकार करें',
    findAlternateRoute: 'वैकल्पिक मार्ग खोजें'
  },

  as: {
    // Nav (Assamese)
    dashboard: 'ড্যাশবৰ্ড',
    liveMap: 'লাইভ মেপ',
    vehicles: 'বাহনসমূহ',
    routes: 'পথসমূহ',
    alerts: 'জৰুৰী সতৰ্কতা',
    fieldReports: 'ক্ষেত্ৰ প্ৰতিবেদন',
    analytics: 'বিশ্লেষণ',
    systemOnline: 'ব্যৱস্থা সক্ৰিয়',
    
    // Header & Global
    platformTitle: 'উত্তৰ-পূব লজিষ্টিকছ',
    platformSubtitle: 'ইন্টেলিজেন্স প্লেটফৰ্ম',
    searchPlaceholder: 'জিলা, বাহন, ৰাষ্ট্ৰীয় ঘাইপথ সন্ধান কৰক...',
    emergencySos: 'জৰুৰীকালীন SOS',
    logout: 'লগ আউট',
    commandCenter: 'কমাণ্ড আৰু অপাৰেচন চেণ্টাৰ',
    commandSubtitle: 'উত্তৰ-পূবৰ ৮ খন ৰাজ্যৰ সক্ৰিয় লজিষ্টিকছ আৰু দুৰ্যোগ তথ্য প্লেটফৰ্ম',
    liveSync: 'সকলো ব্যৱস্থা সক্ৰিয় • লাইভ সিংক',
    updated: 'আপডেট কৰা হ’ল',
    
    // Stat Cards
    activeVehicles: 'সক্ৰিয় বাহনৰ ফ্লিট',
    openAlerts: 'সক্ৰিয় জৰুৰী সতৰ্কতা',
    blockedRoutes: 'আৱদ্ধ পথসমূহ',
    deliverySuccess: 'সফল বিতৰণৰ হাৰ',
    trackFleet: 'ফ্লিট ট্ৰেক কৰক',
    inspectAlerts: 'সতৰ্কতা পৰীক্ষা কৰক',
    viewGisMap: 'GIS মেপ চাওক',
    supplyChain: 'যোগান শৃংখলা',
    fromYesterday: 'যোৱাকালিৰ পৰা',
    
    // Quick Actions
    planRoute: 'পথৰ পৰিকল্পনা কৰক',
    aiPathfinding: 'AI পথ সন্ধান ইঞ্জিন',
    liveTelematics: 'লাইভ GPS টেলেমেটিকছ',
    emergencyFeed: 'জৰুৰী ফিড',
    fieldReportForm: 'বিষয়াৰ ইনচিডেণ্ট ফৰ্ম',
    liveAccessibility: 'লাইভ এক্সেছিবিলিটী মেপ',
    
    // Charts & Feed
    regionalConnectivity: 'আঞ্চলিক ঘাইপথ সংযোগ সূচকাংক',
    liveAiScore: 'লাইভ AI স্ক’ৰ',
    deepAnalytics: 'গহীন বিশ্লেষণ',
    clickStateDrilldown: 'বিশদ তথ্য চাবলৈ যিকোনো ৰাজ্যত ক্লিক কৰক',
    liveThreatFeed: 'লাইভ ঘটনা আৰু ভাবুকি ফিড',
    viewAll: 'সকলো চাওক',
    submitOfficerReport: 'ক্ষেত্ৰ প্ৰতিবেদন জমা দিয়ক',
    
    // SOS Modal
    sosTitle: 'জৰুৰীকালীন SOS আৰু সঁহাৰি কনচোল',
    sosSubtitle: 'ওচৰৰ আৰক্ষী থানা, SDRF/NDRF আৰু পৰিয়ালৰ সৈতে ক্ষিপ্ৰ সম্পৰ্ক কৰক।',
    triggerSos: 'এতিয়াই SOS এৰক',
    copyLocation: 'স্থান কপি কৰক',
    nearestPolice: 'নিকটতম আৰক্ষী আৰু দুৰ্যোগ সঁহাৰি',
    savedFamily: 'সংৰক্ষিত পৰিয়ালৰ যোগাযোগ',
    addFamily: 'পৰিয়াল যোগ কৰক',
    callStation: 'থানালৈ কল কৰক',
    dial112: '১১২ নম্বৰত কল কৰক',
    stateControl: 'ৰাজ্যিক নিয়ন্ত্ৰণ কক্ষ',
    disasterMgmt: 'দুৰ্যোগ ব্যৱস্থাপনা (SDMA)',
    
    // General Actions
    cancel: 'বাতিল কৰক',
    save: 'সংৰক্ষণ কৰক',
    close: 'বন্ধ কৰক',
    optimizeRoute: 'পথ সূচল কৰক',
    inspectDetails: 'বিৱৰণ চাওক →',
    acknowledge: 'গ্ৰহণ কৰক',
    findAlternateRoute: 'বিকল্প পথ সন্ধান কৰক'
  },

  mni: {
    // Nav (Manipuri)
    dashboard: 'ড্যাশবোর্ড',
    liveMap: 'লাইভ ম্যাপ',
    vehicles: 'গাড়ীশিং',
    routes: 'লম্বীশিং',
    alerts: 'অচৌবা চপচাং',
    fieldReports: 'ফিল্ড রিপোর্ত',
    analytics: 'এনালাইটিক্স',
    systemOnline: 'সিষ্টেম ওনলাইন',
    
    // Header & Global
    platformTitle: 'অৱাং-নোংপোক লজিষ্টিক্স',
    platformSubtitle: 'ইন্টেলিজেন্স প্লেটফোর্ম',
    searchPlaceholder: 'ডিস্ট্রিক্ট, গাড়ী, হাইৱে থিবা...',
    emergencySos: 'ইমার্জেন্সী SOS',
    logout: 'লগ আউট',
    commandCenter: 'কমান্ড অমসুং ওপরেসন সেন্টার',
    commandSubtitle: 'নোংপোক থংবা রাজ্য ৮ গী লজিষ্টিক্স অমসুং লাইবক থীবা ঙাকথোকপগী প্লেটফোর্ম',
    liveSync: 'পুম্নমক ওনলাইন • লাইভ সিংক',
    updated: 'অনৌবা অপদেৎ',
    
    // Stat Cards
    activeVehicles: 'চৎলিবা গাড়ীশিং',
    openAlerts: 'ইমার্জেন্সী চপচাংশিং',
    blockedRoutes: 'থিংজিনখিবা লম্বাশিং',
    deliverySuccess: 'মাই পাকপা ডেলিভরী',
    trackFleet: 'গাড়ী থিবা',
    inspectAlerts: 'চপচাং য়েংবা',
    viewGisMap: 'GIS ম্যাপ য়েংবা',
    supplyChain: 'সপ্লাই চেন',
    fromYesterday: 'ঙরাংদগী',
    
    // Quick Actions
    planRoute: 'লম্বী শেম্বা',
    aiPathfinding: 'AI লম্বী থিবা ইঞ্জিন',
    liveTelematics: 'লাইভ GPS টেলেমেটিক্স',
    emergencyFeed: 'ইমার্জেন্সী ফিদ',
    fieldReportForm: 'অফিসার রিপোর্ত ফোর্ম',
    liveAccessibility: 'লাইভ এক্সেসিবিলিতী ম্যাপ',
    
    // Charts & Feed
    regionalConnectivity: 'রিজনেল হাইৱে কনেক্Function সূচক',
    liveAiScore: 'লাইভ AI স্কোর',
    deepAnalytics: 'অকুপ্পা এনালাইটিক্স',
    clickStateDrilldown: 'অকুপ্পা মরোলগীদমক রাজ্যদা ক্লিক তৌবীয়ু',
    liveThreatFeed: 'লাইভ থ্রেৎ অমসুং রিপোর্ত ফিদ',
    viewAll: 'পুম্নমক য়েংবা',
    submitOfficerReport: 'রিপোর্ত সাবমিৎ তৌবা',
    
    // SOS Modal
    sosTitle: 'ইমার্জেন্সী SOS অমসুং রেস্পোন্স কন্সোল',
    sosSubtitle: 'নাাক্নবা পুলিশ স্টেশন, SDRF/NDRF অমসুং ইমুংগী মীওইশিংগা পাওফাওনবীয়ু।',
    triggerSos: 'ইমার্জেন্সী SOS হৌদোকপা',
    copyLocation: 'লৈফম কোপী তৌবা',
    nearestPolice: 'নাক্নবা পুলিশ অমসুং ডিসাষ্টার রেস্পোন্স',
    savedFamily: 'সেভ তৌবা ইমুংগী ফোন নম্বরশিং',
    addFamily: 'ইমুংগী মীওই হাপচিনবা',
    callStation: 'station দা কোল তৌবা',
    dial112: '১১২ কোল তৌবা',
    stateControl: 'স্টেৎ কন্ট্রোল রুম',
    disasterMgmt: 'ডিজিটাল ডিসাষ্টার মেনেজমেন্ত',
    
    // General Actions
    cancel: 'কেন্সেল',
    save: 'সেভ তৌবা',
    close: 'থিংジンবা',
    optimizeRoute: 'লম্বী শেম্বা',
    inspectDetails: 'অকুপ্পা য়েংবা →',
    acknowledge: 'য়াবগা',
    findAlternateRoute: 'অতোপ্পা লম্বী থিবা'
  },

  nag: {
    // Nav (Nagamese)
    dashboard: 'Dashboard',
    liveMap: 'Live Map',
    vehicles: 'Gari Bilak',
    routes: 'Rasta Bilak',
    alerts: 'Emergency Alerts',
    fieldReports: 'Field Reports',
    analytics: 'Analytics',
    systemOnline: 'System Online',
    
    // Header & Global
    platformTitle: 'NER Logistics',
    platformSubtitle: 'Intelligence Platform',
    searchPlaceholder: 'District, Gari, Highway bicha...',
    emergencySos: 'Emergency SOS',
    logout: 'Logout',
    commandCenter: 'Command & Operations Center',
    commandSubtitle: 'Real-time 8-State North East Logistics & Emergency System',
    liveSync: 'All Systems Online • Live Sync',
    updated: 'Updated',
    
    // Stat Cards
    activeVehicles: 'Chali thaka Gari',
    openAlerts: 'Emergency Alerts',
    blockedRoutes: 'Bandh thaka Rasta',
    deliverySuccess: 'Delivery Success Rate',
    trackFleet: 'Gari Location Bicha',
    inspectAlerts: 'Alerts Chai Lobi',
    viewGisMap: 'Map Sawo',
    supplyChain: 'Supply Chain',
    fromYesterday: 'kaal pora',
    
    // Quick Actions
    planRoute: 'Rasta Plan Koribo',
    aiPathfinding: 'AI Route Finder',
    liveTelematics: 'Live GPS Tracking',
    emergencyFeed: 'Emergency Feed',
    fieldReportForm: 'Officer Incident Form',
    liveAccessibility: 'Live Accessibility Map',
    
    // Charts & Feed
    regionalConnectivity: 'Regional Highway Connectivity Index',
    liveAiScore: 'Live AI Score',
    deepAnalytics: 'Deep Analytics',
    clickStateDrilldown: 'Details sawo karne State te click koribo',
    liveThreatFeed: 'Live Incident & Danger Feed',
    viewAll: 'Sabai Sawo',
    submitOfficerReport: 'Ground Report Dibo',
    
    // SOS Modal
    sosTitle: 'Emergency SOS & Response Console',
    sosSubtitle: 'Police Station, SDRF/NDRF, aaru Family logote turante kotha koribo.',
    triggerSos: 'TRIGGER EMERGENCY SOS NOW',
    copyLocation: 'Location Copy Koribo',
    nearestPolice: 'Nearest Police & Disaster Help',
    savedFamily: 'Saved Family Contacts',
    addFamily: 'Family Add Koribo',
    callStation: 'Station te Call Koribo',
    dial112: 'Dial 112',
    stateControl: 'State Control Room',
    disasterMgmt: 'Disaster Management (SDMA)',
    
    // General Actions
    cancel: 'Cancel',
    save: 'Save Koribo',
    close: 'Bandh Koribo',
    optimizeRoute: 'Sahi Rasta Bicha',
    inspectDetails: 'Details Sawo →',
    acknowledge: 'Acknowledge',
    findAlternateRoute: 'Dusra Rasta Bicha'
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('ner_language') || 'en';
  });

  const changeLanguage = (langCode) => {
    if (TRANSLATIONS[langCode]) {
      setCurrentLanguage(langCode);
      localStorage.setItem('ner_language', langCode);
    }
  };

  const t = (key) => {
    const langDict = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
    return langDict[key] || TRANSLATIONS['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
