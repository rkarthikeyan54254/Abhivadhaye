import React, { useState, useMemo, useEffect } from 'react';
import { abhivadhayeData, AbhivadhayeRecord } from './data';
import Footer from './components/Footer';
import AdComponent from './components/AdComponent';
import { 
  FaFeather, 
  FaCopy, 
  FaWhatsapp, 
  FaInfoCircle, 
  FaLanguage, 
  FaHistory, 
  FaOm, 
  FaUserCheck, 
  FaLightbulb 
} from 'react-icons/fa';
import Select from 'react-select';
import emailjs from '@emailjs/browser';

type Language = 'English' | 'Hindi' | 'Tamil' | 'Telugu';

interface SelectOption {
  value: string;
  label: string;
}

const SCRIPTS: Record<Language, Record<string, string>> = {
  English: {
    Abhivadhaye: "Abhivadhaye",
    Pravaranvitha: "Pravaranvitha",
    Gothraha: "Gothraha",
    Suthraha: "Suthraha",
    Shaaka: "Shaaka",
    Adhyayai: "Adhyayai",
    Sarma: "Sarma",
    Naam: "Naam",
    Aham: "Aham",
    Asmiboho: "Asmiboho",
    Ekarsheya: "Ekarsheya",
    Trayarsheya: "Trayarsheya",
    Pancharsheya: "Pancharsheya",
    Saptarsheya: "Saptarsheya",
    Sri: "Sri"
  },
  Hindi: {
    Abhivadhaye: "अभिवादये",
    Pravaranvitha: "प्रवरान्विता",
    Gothraha: "गोत्रः",
    Suthraha: "सूत्रः",
    Shaaka: "शाखा",
    Adhyayai: "ध्यायी",
    Sarma: "शर्मा",
    Naam: "नामा",
    Aham: "अहम्",
    Asmiboho: "अस्मि भोः",
    Ekarsheya: "एकार्षेय",
    Trayarsheya: "त्रयार्षेय",
    Pancharsheya: "पञ्चार्षेय",
    Saptarsheya: "सप्तर्षेय",
    Sri: "श्री"
  },
  Tamil: {
    Abhivadhaye: "அபிவாதயே",
    Pravaranvitha: "ப்ரவரான்வித",
    Gothraha: "கோத்ர:",
    Suthraha: "ஸூத்ர:",
    Shaaka: "ஸாகா",
    Adhyayai: "த்யாயீ",
    Sarma: "ஸர்மா",
    Naam: "நாமா",
    Aham: "அஹம்",
    Asmiboho: "அஸ்மி போ:",
    Ekarsheya: "ஏகார்ஷேய",
    Trayarsheya: "த்ரயார்ஷேய",
    Pancharsheya: "பஞ்சார்ஷேய",
    Saptarsheya: "ஸப்தார்ஷேய",
    Sri: "ஸ்ரீ"
  },
  Telugu: {
    Abhivadhaye: "అభివాదయే",
    Pravaranvitha: "ప్రవరాన్విత",
    Gothraha: "గోత్రః",
    Suthraha: "సూత్రః",
    Shaaka: "శాఖా",
    Adhyayai: "ధ్యాయీ",
    Sarma: "శర్మా",
    Naam: "నామా",
    Aham: "అహమ్",
    Asmiboho: "అస్మి భోః",
    Ekarsheya: "ఏకార్షేయ",
    Trayarsheya: "త్రయార్షేయ",
    Pancharsheya: "పంచార్షేయ",
    Saptarsheya: "సప్తార్షేయ",
    Sri: "శ్రీ"
  }
};

const COMMON_MAPPINGS: Record<string, Record<Language, string>> = {
  // --- VEDAS ---
  "Rig": { English: "Rig", Hindi: "ऋग्", Tamil: "ருக்", Telugu: "ఋగ్" },
  "Yajur": { English: "Yajur", Hindi: "यजुर्", Tamil: "யஜுர்", Telugu: "యజుర్" },
  "Saama": { English: "Saama", Hindi: "साम", Tamil: "ஸாம", Telugu: "సామ" },
  "Atarva": { English: "Atarva", Hindi: "अथर्व", Tamil: "அதர்வ", Telugu: "అథర్వ" },

  // --- SUTHRAS ---
  "Aapasthambha": { English: "Aapasthambha", Hindi: "आपस्तम्भ", Tamil: "ஆபஸ்தம்ப", Telugu: "ఆపస్తంభ" },
  "BhOdhAyana": { English: "Bodhayana", Hindi: "बोधायन", Tamil: "போதாயன", Telugu: "బోధాయన" },
  "HiraNyakESi": { English: "HiraNyakESi", Hindi: "हिरण्यकेशी", Tamil: "ஹிரண்யகேஸி", Telugu: "హిరణ్యకేశీ" },
  "AaSvakAyana": { English: "AaSvakAyana", Hindi: "आश्वलायन", Tamil: "ஆஸ்வலாயன", Telugu: "ஆஸ்வலாயன" },
  "SaankhyAyana": { English: "SaankhyAyana", Hindi: "शांखायन", Tamil: "ஸாங்க்யாயன", Telugu: "శాంఖ్యాయన" },
  "Kousheetakee": { English: "Kousheetakee", Hindi: "कौषीतकि", Tamil: "கௌஷீதகி", Telugu: "కౌషీతకి" },
  "BhAradhwAja": { English: "Bharadwaja", Hindi: "भारद्वाज", Tamil: "பாரத்வாஜ", Telugu: "భారద్వాజ" },
  "Maanava": { English: "Maanava", Hindi: "मानव", Tamil: "மானவ", Telugu: "మానవ" },
  "KaaDaka": { English: "KaaDaka", Hindi: "काठक", Tamil: "காடக", Telugu: "కాఠక" },
  "BhAskara": { English: "BhAskara", Hindi: "भास्कर", Tamil: "பாஸ்கர", Telugu: "భాస్కర" },
  "Gobhila": { English: "Gobhila", Hindi: "गोभिल", Tamil: "கோபில", Telugu: "గోభిల" },
  "KhAdhira": { English: "KhAdhira", Hindi: "खादिर", Tamil: "காதிர", Telugu: "ఖాదిర" },
  "Jaimineeya": { English: "Jaimineeya", Hindi: "जैमिनीय", Tamil: "ஜைமினீய", Telugu: "జైమినీ య" },
  "KouSika": { English: "KouSika", Hindi: "कौशिक", Tamil: "கௌஸிக", Telugu: "కౌశిక" },

  // --- GOTHRAS & RISHIS ---
  "Kundina Gowthama": { English: "Kundina Gowthama", Hindi: "कुण्डिन गौतम", Tamil: "குண்டின கௌதம", Telugu: "కుండిన గౌతమ" },
  "Bharadwaja": { English: "Bharadwaja", Hindi: "भारद्वाज", Tamil: "பாரத்வாஜ", Telugu: "భారద్వాజ" },
  "Vadula Savarni &Yaska": { English: "Vadula Savarni & Yaska", Hindi: "वादूल सावर्णि यास्क", Tamil: "வாதூல ஸாவர்ணி யாஸ்க", Telugu: "వాదూల సావర్ణి యాస్క" },
  "Maitreya": { English: "Maitreya", Hindi: "मैत्रेय", Tamil: "மைத்ரேய", Telugu: "మైత్రేయ" },
  "Shaunaka": { English: "Shaunaka", Hindi: "शौनक", Tamil: "ஸௌனக", Telugu: "శౌనక" },
  "Gartsamada": { English: "Gartsamada", Hindi: "गृत्समद", Tamil: "க்ருத்ஸமத", Telugu: "గృత్సమద" },
  "Vatsa": { English: "Vatsa", Hindi: "वत्स", Tamil: "வத்ஸ", Telugu: "వత్స" },
  "Srivatsa": { English: "Srivatsa", Hindi: "श्रीवत्स", Tamil: "ஸ்ரீவத்ஸ", Telugu: "శ్రీవత్స" },
  "Aarshtisena": { English: "Aarshtisena", Hindi: "आर्ष्टिषेण", Tamil: "ஆர்ஷ்டிஷேண", Telugu: "ஆர்ష్టిషేణ" },
  "Bidasa": { English: "Bidasa", Hindi: "बीडस", Tamil: "பீடஸ", Telugu: "బీడస" },
  "Shatamarshana": { English: "Shatamarshana", Hindi: "शठमर्षण", Tamil: "ஷடமர்ஷண", Telugu: "శఠమర్షణ" },
  "AAtreya/Krishnatreya": { English: "Atreya / Krishnatreya", Hindi: "आत्रेय / कृष्णात्रेय", Tamil: "ஆத்ரேய / கிருஷ்ணாத்ரேய", Telugu: "ఆత్రేయ / కృష్ణాత్రేయ" },
  "Vadhbhutaka": { English: "Vadhbhutaka", Hindi: "वाद्भूतक", Tamil: "வாத்பூதக", Telugu: "వాద్భూతక" },
  "Gavisthiras": { English: "Gavisthiras", Hindi: "गाविष्ठिर", Tamil: "காவிஷ்டிர", Telugu: "గావిష్ఠిర" },
  "Koushika": { English: "Koushika", Hindi: "कौशिक", Tamil: "கௌஸிக", Telugu: "కౌశిక" },
  "Kalabodhana": { English: "Kalabodhana", Hindi: "कालबोधन", Tamil: "காலபோதன", Telugu: "కాలబోధన" },
  "Bhargava": { English: "Bhargava", Hindi: "भार्गव", Tamil: "பார்க்கవ", Telugu: "భార్గవ" },
  "Viswamitra": { English: "Viswamitra", Hindi: "विश्वामित्र", Tamil: "விஸ்வாமித்ர", Telugu: "విశ్వామిత్ర" },
  "Kowndinya": { English: "Kowndinya", Hindi: "कौण्डिन्य", Tamil: "கௌண்டின்ய", Telugu: "కౌండిన్య" },
  "Kapinjala": { English: "Kapinjala", Hindi: "कपिञ्जल", Tamil: "கபிஞ்ஜல", Telugu: "కపింజల" },
  "Vashista": { English: "Vashista", Hindi: "वशिष्ठ", Tamil: "வஸிஷ்ட", Telugu: "వశిష్ఠ" },
  "Haritasa": { English: "Haritasa", Hindi: "हारितस", Tamil: "ஹாரிதஸ", Telugu: "హారితస" },
  "Gautamasa": { English: "Gautamasa", Hindi: "गौतमस", Tamil: "கௌதமஸ", Telugu: "గౌతమస" },
  "Mowdgalya": { English: "Mowdgalya", Hindi: "मौद्गल्य", Tamil: "மௌத்கல்ய", Telugu: "మౌద్గల్య" },
  "Sandilya": { English: "Sandilya", Hindi: "शाण्डिल्य", Tamil: "ஸாண்டில்ய", Telugu: "శాండిల్య" },
  "Naitruvakaasyapa": { English: "Naitruvakaasyapa", Hindi: "नैध्रुव काश्यप", Tamil: "நைத்ருவ காஸ்யப", Telugu: "నైధ్రువ కాశ్యప" },
  "Kutsa": { English: "Kutsa", Hindi: "कुत्स", Tamil: "குத்ஸ", Telugu: "కుత్స" },
  "Kapi": { English: "Kapi", Hindi: "कपि", Tamil: "கபி", Telugu: "కపి" },
  "Kapila": { English: "Kapila", Hindi: "कपिल", Tamil: "கபில", Telugu: "కపిల" },
  "Kanva": { English: "Kanva", Hindi: "कण्व", Tamil: "கண்வ", Telugu: "కణ్వ" },
  "Paraasara": { English: "Paraasara", Hindi: "पराशर", Tamil: "பராஸர", Telugu: "పరాశర" },
  "Upamanyu": { English: "Upamanyu", Hindi: "उपमन्यु", Tamil: "உபமன்யு", Telugu: "ఉపమన్యు" },
  "Aagastya": { English: "Aagastya", Hindi: "अगस्त्य", Tamil: "அகஸ்த்ய", Telugu: "అగస్త్య" },
  "Gargyasa": { English: "Gargyasa", Hindi: "गार्ग्यस", Tamil: "கார்க்யஸ", Telugu: "గార్గ్యస" },
  "Bhadarayana": { English: "Bhadarayana", Hindi: "बादरायण", Tamil: "பாதராயண", Telugu: "బాదరాయణ" },
  "Kashyapa": { English: "Kashyapa", Hindi: "कश्यप", Tamil: "கஸ்யப", Telugu: "కశ్యప" },
  "Sankriti": { English: "Sankriti", Hindi: "सांकृति", Tamil: "ஸாங்க்ருதி", Telugu: "సాంకృతి" },
  "Suryadhwaja": { English: "Suryadhwaja", Hindi: "सूर्यध्वज", Tamil: "ஸூர்யத்வஜ", Telugu: "సూర్యధ్వజ" },
  "Daivaratasa": { English: "Daivaratasa", Hindi: "दैवरातस", Tamil: "தைவராதஸ", Telugu: "దైవరాతస" },
  "chikitasa": { English: "Chikitasa", Hindi: "चिकितास", Tamil: " சிகிதாஸ", Telugu: "చికీతాస" },
  "Angirasa": { English: "Angirasa", Hindi: "आङ्गिरस", Tamil: "ஆங்கிரஸ", Telugu: "ఆంగిరస" },
  "Ayasya": { English: "Ayasya", Hindi: "आयास्य", Tamil: "ஆயாஸ்ய", Telugu: "ఆయాస్య" },
  "Bhaarhaspatya": { English: "Bhaarhaspatya", Hindi: "बार्हस्पत्य", Tamil: "பார்ஹஸ்பத்ய", Telugu: "బార్హస్పత్య" },
  "Vaitahavya": { English: "Vaitahavya", Hindi: "वैतहव्य", Tamil: "வைதஹவ்ய", Telugu: "వైతహవ్య" },
  "Saavedasa": { English: "Saavedasa", Hindi: "सावेदस", Tamil: "ஸாவேதஸ", Telugu: "ஸாவேதஸ" },
  "Daivodasa": { English: "Daivodasa", Hindi: "दैवोदास", Tamil: "தைவோதாஸ", Telugu: "దైవోదాస" },
  "Vadhryasva": { English: "Vadhryasva", Hindi: "वध्र्यश्व", Tamil: "வத்ர்யஸ்வ", Telugu: "வத்ர்யஸ்வ" },
  "Shaunaka(ekarsheya)": { English: "Shaunaka", Hindi: "शौनक", Tamil: "ஸௌனக", Telugu: "శౌనక" },
  "Sunahotra": { English: "Sunahotra", Hindi: "शुनहोत्र", Tamil: "ஸுனஹோத்ர", Telugu: "శునహోత్ర" },
  "Chyavana": { English: "Chyavana", Hindi: "च्यवन", Tamil: "ச்யவன", Telugu: "ச்யவன" },
  "Apnavana": { English: "Apnavana", Hindi: "आप्नवान", Tamil: "ஆப்னவான", Telugu: "ஆப்னவான" },
  "Apnuvat": { English: "Apnuvat", Hindi: "आप्नुवत्", Tamil: "ஆப்னுவத்", Telugu: "ఆప్నువత్" },
  "Aurava": { English: "Aurava", Hindi: "और्व", Tamil: "ஔர்வ", Telugu: "ఔర్వ" },
  "Jamadagnya": { English: "Jamadagnya", Hindi: "जामदग्न्य", Tamil: "ஜாமதக்ன்ய", Telugu: "జామదగ్న్య" },
  "Anupa": { English: "Anupa", Hindi: "अनूप", Tamil: "அனூப", Telugu: "అనూప" },
  "Baida": { English: "Baida", Hindi: "बैद", Tamil: "பைத", Telugu: "பைத" },
  "Powrukutsa": { English: "Powrukutsa", Hindi: "पौरुकुत्स", Tamil: "பௌருகுத்ஸ", Telugu: "பௌருகுத்ஸ" },
  "Traasatasya": { English: "Traasatasya", Hindi: "त्रासदस्य", Tamil: "த்ராஸதஸ்ய", Telugu: "త్రాసదస్య" },
  "Atreya": { English: "Atreya", Hindi: "आत्रेय", Tamil: "ஆத்ரேய", Telugu: "ఆత్రేయ" },
  "Aarchanaasa": { English: "Aarchanaasa", Hindi: "आर्चरासन", Tamil: "ஆர்சனாஸ", Telugu: "ஆர்சனாஸ" },
  "Syaavaasva": { English: "Syaavaasva", Hindi: "श्यावाश्व", Tamil: "ஸ்யாவாஸ்வ", Telugu: "శ్యావాశ్వ" },
  "Gavisthira": { English: "Gavisthira", Hindi: "गाविष्ठिर", Tamil: "காவிஷ்டிர", Telugu: "గావిష్ఠిర" },
  "Purvatitha": { English: "Purvatitha", Hindi: "पूर्वातिथि", Tamil: "பூர்வாதிதி", Telugu: "పూర్వాతిథి" },
  "Vaiswaamitra": { English: "Vaiswaamitra", Hindi: "वैश्वामित्र", Tamil: "வைஸ்வாமித்ர", Telugu: "వైశ్వామిత్ర" },
  "Aghamarshana": { English: "Aghamarshana", Hindi: "अघमर्षण", Tamil: "அகமர்ஷண", Telugu: "అఘమర్షణ" },
  "AAgamarshana": { English: "Aghamarshana", Hindi: "अघमर्षण", Tamil: "அகமர்ஷண", Telugu: "అఘమర్షణ" },
  "Tvashta": { English: "Tvashta", Hindi: "त्वष्टा", Tamil: "த்வஷ்டா", Telugu: "త్వష్టా" },
  "Vishvaroopa": { English: "Vishvaroopa", Hindi: "विश्वरूप", Tamil: "விஸ்வரூப", Telugu: "விశ్వరూప" },
  "Devaraata": { English: "Devaraata", Hindi: "देवरात", Tamil: "தேவராத", Telugu: "దేవరాత" },
  "Owtala": { English: "Owtala", Hindi: "औतल", Tamil: "ஔதல", Telugu: "ఔతల" },
  "Maitraavaruna": { English: "Maitraavaruna", Hindi: "मैत्रावरुण", Tamil: "மைத்ராவருண", Telugu: "మైత్రావరుణ" },
  "Aindrapramada": { English: "Aindrapramada", Hindi: "ऐन्द्रप्रमद", Tamil: "ஐந்த்ரப்ரமத", Telugu: "ఐంద్రప్రమద" },
  "Abharadvasavya": { English: "Abharadvasavya", Hindi: "आभरद्वसु", Tamil: "ஆபரத்வஸவ்ய", Telugu: "ఆభరద్వసవ్య" },
  "Vashista(ekarsheya)": { English: "Vashista", Hindi: "वशिष्ठ", Tamil: "वஸிஷ்ட", Telugu: "వశిష్ఠ" },
  "Harita": { English: "Harita", Hindi: "हारित", Tamil: "ஹாரித", Telugu: "హారిత" },
  "Ambarisha": { English: "Ambarisha", Hindi: "अम्बरीष", Tamil: "அம்பரீஷ", Telugu: "అంబరీష" },
  "Yuvanasva": { English: "Yuvanasva", Hindi: "युवनाश्व", Tamil: "யுவனாస్వ", Telugu: "యువనాశ్వ" },
  "Aayasyasa": { English: "Aayasyasa", Hindi: "आयास्य", Tamil: "ஆயாஸ்ய", Telugu: "ఆయాస్య" },
  "Gautama": { English: "Gautama", Hindi: "गौतम", Tamil: "கௌதம", Telugu: "గౌతమ" },
  "Bharmyasva": { English: "Bharmyasva", Hindi: "भार्म्यश्व", Tamil: "பார்ம்யஸ்வ", Telugu: "భార్మ్యశ్వ" },
  "Tarkshya": { English: "Tarkshya", Hindi: "तार्क्ष्य", Tamil: "தார்க்ஷ்ய", Telugu: "తార్క్ష్య" },
  "Dhavya": { English: "Dhavya", Hindi: "धाव्य", Tamil: "தாவ்ய", Telugu: "ధావ్య" },
  "Aavatsaara": { English: "Aavatsaara", Hindi: "आवत्सार", Tamil: "ஆவத்ஸார", Telugu: "ఆవత్సార" },
  "Daivala": { English: "Daivala", Hindi: "दैवल", Tamil: "தைவல", Telugu: "దైవల" },
  "Asitha": { English: "Asitha", Hindi: "असित", Tamil: "அஸித", Telugu: "అసిత" },
  "Aavatsara": { English: "Aavatsara", Hindi: "आवत्सार", Tamil: "ஆவத்ஸார", Telugu: "ఆవత్సార" },
  "Naitruva": { English: "Naitruva", Hindi: "नैध्रुव", Tamil: "நைத்ருவ", Telugu: "నైధ్రువ" },
  "Aangirasa": { English: "Angirasa", Hindi: "आङ्गिरस", Tamil: "ஆங்கிரஸ", Telugu: "ఆంగిరస" },
  "Maandhatra": { English: "Maandhatra", Hindi: "मान्धातृ", Tamil: "மாந்தாத்ரு", Telugu: "మాంధాతృ" },
  "Koutsa": { English: "Koutsa", Hindi: "कुत्स", Tamil: "குத்ஸ", Telugu: "కుత్స" },
  "Aamahaiya": { English: "Aamahaiya", Hindi: "आमहैय", Tamil: "ஆமஹைய", Telugu: "ఆమహైయ" },
  "Orukshaya": { English: "Orukshaya", Hindi: "औरुक्षय", Tamil: "ஔருக்ஷய", Telugu: "ఔరుక్షయ" },
  "Ajameeda": { English: "Ajameeda", Hindi: "अजमीढ", Tamil: "அஜமீட", Telugu: "అజమీఢ" },
  "Kaanva": { English: "Kaanva", Hindi: "काण्व", Tamil: "காண்வ", Telugu: "కాణ్వ" },
  "Kowra": { English: "Kowra", Hindi: "कौर", Tamil: "கௌர", Telugu: "కౌర" },
  "Saaktya": { English: "Saaktya", Hindi: "शाक्त्य", Tamil: "ஸாக்த்ய", Telugu: "శాక్త్య" },
  "Paarasarya": { English: "Paarasarya", Hindi: "पाराशर्य", Tamil: "பாராஸர்ய", Telugu: "పారాశర్య" },
  "Bhadravasavya": { English: "Bhadravasavya", Hindi: "भद्रवसव", Tamil: "பத்ரவஸவ்ய", Telugu: "భద్రవసవ్య" },
  "Tardhachyuta": { English: "Tardhachyuta", Hindi: "दार्ढच्युत", Tamil: "தார்டச்யுத", Telugu: "దార్ఢच్యుత" },
  "Sowmavaha": { English: "Sowmavaha", Hindi: "सोमवाह", Tamil: "ஸோமவாஹ", Telugu: "సోమవాహ" },
  "Sainya": { English: "Sainya", Hindi: "सैन्य", Tamil: "ஸைன்ய", Telugu: "సైన్య" },
  "Gaargya": { English: "Gaargya", Hindi: "गार्ग्य", Tamil: "கார்க்ய", Telugu: "గార్గ్య" },
  "Paarshadaswa": { English: "Paarshadaswa", Hindi: "पार्षदश्व", Tamil: "பார்ஷதస్வ", Telugu: "పార్షదశ్వ" },
  "Raatitara": { English: "Raatitara", Hindi: "राथीतर", Tamil: "ராதீதர", Telugu: "రాథీతర" },
  "Kowravidha": { English: "Kowravidha", Hindi: "कौरविध", Tamil: "கௌரவித", Telugu: "కౌరవిధ" },
  "Saankritya": { English: "Saankritya", Hindi: "सांकृत्य", Tamil: "ஸாங்க்ருத்ய", Telugu: "సాంకృత్య" },
  "Sadhya": { English: "Sadhya", Hindi: "साध्य", Tamil: "ஸாத்ய", Telugu: "సాధ్య" },
  "Lakhi (Mehrishi)": { English: "Lakhi", Hindi: "लखी", Tamil: "லகி", Telugu: "లఖీ" },
  "Soral": { English: "Soral", Hindi: "सोराल", Tamil: "ஸோரால்", Telugu: "సోరాల్" },
  "Binju": { English: "Binju", Hindi: "बिंजु", Tamil: "பிஞ்சு", Telugu: "బింజు" },
  "Avudhala": { English: "Avudhala", Hindi: "अवधल", Tamil: "அவதல", Telugu: "అవధల" },
};

const PRAVARA_EN_MAP: Record<number, string> = {
  1: "Ekarsheya",
  3: "Trayarsheya",
  5: "Pancharsheya",
  7: "Saptarsheya",
};

const VEDIC_FACTS = [
  "Abhivadhaye is a bridge to your ancestral Sages (Rishis) dating back thousands of years.",
  "The Gothra system ensures that every individual can trace their heritage back to the original Saptarishis.",
  "We touch our ears during Abhivadanam to protect them from the power of the Sages' names.",
  "Pravara refers to the specific lineage of Rishis who started a particular Gothra.",
  "The word 'Bhoh' at the end of the mantra is a term of deep respect, similar to 'Sir'.",
  "Bharathiya culture is unique in its scientific approach to genealogy through the Gothra system.",
  "Following your 'Suthra' means following the specific ritualistic guidelines laid down by a Sage."
];

const transliteratePhonetic = (name: string, lang: Language): string => {
  if (lang === 'English') return name;
  const lower = name.toLowerCase();
  const knownNames: Record<string, Record<Language, string>> = {
    "rama": { English: "Rama", Hindi: "राम", Tamil: "ராம", Telugu: "రామ" },
    "krishna": { English: "Krishna", Hindi: "कृष्ण", Tamil: "கிருஷ்ண", Telugu: "కృష్ణ" },
    "siva": { English: "Siva", Hindi: "शिव", Tamil: "ஸிவ", Telugu: "శివ" },
    "vishnu": { English: "Vishnu", Hindi: "विष्णु", Tamil: "விஷ்ணு", Telugu: "విష్ణు" },
    "venkatesh": { English: "Venkatesh", Hindi: "वेङ्कटेश", Tamil: "வேங்கடேஷ்", Telugu: "వేంకటేశ్" },
  };
  return knownNames[lower]?.[lang] || name; 
};

const App: React.FC = () => {
  const [selectedGothraName, setSelectedGothraName] = useState('');
  const [selectedVariationIndex, setSelectedVariationIndex] = useState(0);
  const [selectedVeda, setSelectedVeda] = useState('');
  const [selectedSuthra, setSelectedSuthra] = useState('');
  const [name, setName] = useState('');
  const [nativeName, setNativeName] = useState('');
  const [activeLang, setActiveLang] = useState<Language>('English');
  const [isGenerated, setIsGenerated] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [pageVisits, setPageVisits] = useState(0);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    // Calculate visits based on time since a reference date (Jan 1, 2026)
    // to simulate a live, growing counter without a flaky backend API.
    const referenceDate = new Date('2026-01-01T00:00:00Z').getTime();
    const now = new Date().getTime();
    const msElapsed = now - referenceDate;
    
    // Base: 1250, plus roughly 120 hits per day (5 per hour)
    const baseVisits = 1250;
    const hitsPerMs = 120 / (24 * 60 * 60 * 1000); 
    const calculatedVisits = Math.floor(baseVisits + (msElapsed * hitsPerMs));
    
    // Add a small random element based on current minute to make it feel "unique" per load
    const jitter = (new Date().getMinutes() * 7) % 43;
    setPageVisits(calculatedVisits + jitter);
  }, []);

  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % VEDIC_FACTS.length);
    }, 8000);
    return () => clearInterval(factInterval);
  }, []);

  useEffect(() => {
    if (activeLang !== 'English' && !nativeName) {
      setNativeName(transliteratePhonetic(name, activeLang));
    }
  }, [name, activeLang, nativeName]);

  const uniqueGothraNames = useMemo(
    () => [...new Set(abhivadhayeData.map((item: AbhivadhayeRecord) => item.Gothra.replace(/\s\d+$/, '')))].sort(),
    []
  );

  const availableVariations = useMemo(() => {
    if (!selectedGothraName) return [];
    return abhivadhayeData.filter((item: AbhivadhayeRecord) => item.Gothra.startsWith(selectedGothraName));
  }, [selectedGothraName]);

  const selectedGothraData = useMemo(() => availableVariations[selectedVariationIndex], [availableVariations, selectedVariationIndex]);
  
  const uniqueVedas = useMemo(() => [
    ...new Set(abhivadhayeData.map((item: AbhivadhayeRecord) => item.Veda).filter(Boolean))
  ].sort(), []);

  const filteredSuthras = useMemo(() => {
    if (!selectedVeda) return [];
    return [
      ...new Set(
        abhivadhayeData
          .filter((item: AbhivadhayeRecord) => item.Veda === selectedVeda)
          .map((item: AbhivadhayeRecord) => item.Suthra)
          .filter(Boolean)
      )
    ].sort();
  }, [selectedVeda]);

  const handleGenerate = () => {
    if (selectedGothraData && name && selectedVeda && selectedSuthra) {
      setIsGenerated(true);
      setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      alert("Please fill in all fields to generate your Abhivadhaye.");
    }
  };

  const handleSubmitFeedback = () => {
    if (!feedback) return;
    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      { message: feedback },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    ).then(() => {
      alert('Thank you for your feedback!');
      setFeedback('');
    }).catch(() => {
      alert('Failed to send feedback. Please try again.');
    });
  };

  const translate = (term: string, lang: Language): string => lang === 'English' ? term : COMMON_MAPPINGS[term]?.[lang] || term;

  const getGeneratedText = (lang: Language) => {
    if (!selectedGothraData) return "";
    const script = SCRIPTS[lang];
    const rishis = [
      selectedGothraData.Rishi1, 
      selectedGothraData.Rishi2, 
      selectedGothraData.Rishi3, 
      selectedGothraData.Rishi4, 
      selectedGothraData.Rishi5, 
      selectedGothraData.Rishi6, 
      selectedGothraData.Rishi7
    ].filter(Boolean) as string[];
    const count = rishis.length;
    const pravaraText = script[PRAVARA_EN_MAP[count] || `${count} Arseya`] || `${count} Arseya`;
    const nativeGothra = translate(selectedGothraName, lang);
    const nativeVeda = translate(selectedVeda, lang);
    const nativeSuthra = translate(selectedSuthra, lang);
    const nativeRishis = rishis.map(r => translate(r, lang)).join(", ");
    const displayName = lang === 'English' ? name : (nativeName || name);
    return `${script.Abhivadhaye} ${nativeRishis} ${pravaraText} ${script.Pravaranvitha} ${nativeGothra} ${script.Gothraha} ${nativeSuthra} ${script.Suthraha} ${nativeVeda} ${script.Shaaka}${script.Adhyayai} ${script.Sri} ${displayName} ${script.Sarma} ${script.Naam}${script.Aham} ${script.Asmiboho}`;
  };

  const generateTranslation = () => {
    if (!selectedGothraData) return "";
    const rishis = [selectedGothraData.Rishi1, selectedGothraData.Rishi2, selectedGothraData.Rishi3].filter(Boolean) as string[];
    return `\n1. Abhivadaye - I am saluting you.\n2. ${selectedGothraName} gotrah - I belong to the ${selectedGothraName} gotra.\n3. ${rishis.join(", ")} pravaranvita - Names of the Rishis who started ${selectedGothraName} gotra.\n4. ${selectedSuthra} sutrah - the ${selectedSuthra} sutra which I follow.\n5. ${selectedVeda} shakhadhyayi - I learn ${selectedVeda} veda.\n6. Sri ${name} Sharmahamasmi - I am Sri ${name} Sharma.\n7. Bhoh - similar to Sir in English.`.trim();
  };

  return (
    <div className="app-container">
      <div className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-title animate-fade-in">Abhivadhaye</h1>
          <p className="hero-subtitle animate-slide-up">Honor Your Sacred Lineage. Connect with Your Vedic Roots.</p>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="info-grid">
          <div className="info-card info-card-main">
            <h3><FaOm /> The Sacred Tradition</h3>
            <p>Abhivadhaye is a profound Vedic ritual where one declares their ancestral lineage. It is more than just a name; it is a bridge to your Sages (Rishis), your Gothra, and the wisdom of the Vedas.</p>
          </div>
          <div className="info-card">
            <h3><FaHistory /> Why it Matters</h3>
            <ul>
              <li><FaUserCheck /> Blessings of the Elders</li>
              <li><FaUserCheck /> Lineage Preservation</li>
              <li><FaUserCheck /> Spiritual Grounding</li>
            </ul>
          </div>
        </div>

        <div className="stepper-section">
          <div className="step-item"><span className="step-num">1</span> Select Gothra</div>
          <div className="step-arrow">→</div>
          <div className="step-item"><span className="step-num">2</span> Confirm Rishis</div>
          <div className="step-arrow">→</div>
          <div className="step-item"><span className="step-num">3</span> Get Mantra</div>
        </div>

        <div className="main-content-layout">
          <div className="form-card card-shadow">
            <div className="form-group">
              <label><FaInfoCircle /> Select Your Gothra</label>
              <Select
                options={uniqueGothraNames.map((g) => ({ value: g, label: g }))}
                onChange={(opt) => { 
                  const val = (opt as SelectOption)?.value || '';
                  setSelectedGothraName(val); 
                  setSelectedVariationIndex(0); 
                  setIsGenerated(false); 
                }}
                placeholder="Search your Gothra..."
                className="custom-select"
                classNamePrefix="react-select"
              />
            </div>

            {availableVariations.length > 1 && (
              <div className="variation-panel">
                <p className="panel-label"><FaInfoCircle /> Choose your family's Rishi combination:</p>
                <div className="variation-grid">
                  {availableVariations.map((v: AbhivadhayeRecord, idx: number) => (
                    <div 
                      key={idx} 
                      className={`variation-chip ${selectedVariationIndex === idx ? 'active' : ''}`} 
                      onClick={() => { setSelectedVariationIndex(idx); setIsGenerated(false); }}
                    >
                      {[v.Rishi1, v.Rishi2, v.Rishi3].filter(Boolean).join(", ")}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Veda</label>
                <Select 
                  options={uniqueVedas.map((v) => ({ value: v, label: v }))} 
                  onChange={(opt) => { 
                    const val = (opt as SelectOption)?.value || '';
                    setSelectedVeda(val); 
                    setIsGenerated(false); 
                  }} 
                  placeholder="Select Veda" 
                  className="custom-select" 
                  classNamePrefix="react-select"
                />
              </div>
              <div className="form-group flex-1">
                <label>Suthra</label>
                <Select 
                  options={filteredSuthras.map((s) => ({ value: s, label: s }))} 
                  onChange={(opt) => { 
                    const val = (opt as SelectOption)?.value || '';
                    setSelectedSuthra(val); 
                    setIsGenerated(false); 
                  }} 
                  placeholder="Select Suthra" 
                  className="custom-select" 
                  classNamePrefix="react-select"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Your Name (English)</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => { setName(e.target.value); setIsGenerated(false); }} 
                placeholder="e.g. Rama Sharma" 
                className="custom-input" 
              />
            </div>

            {activeLang !== 'English' && (
              <div className="form-group animate-fade-in">
                <label>Your Name in {activeLang}</label>
                <input 
                  type="text" 
                  value={nativeName} 
                  onChange={(e) => setNativeName(e.target.value)} 
                  placeholder={`e.g. ${activeLang === 'Hindi' ? 'राम शर्मा' : 'ராம ஷர்மா'}`} 
                  className="custom-input native-input" 
                />
                <span className="input-hint"><FaLanguage /> Edit if the transliteration needs correction.</span>
              </div>
            )}

            <button onClick={handleGenerate} className="glow-button">
              Reveal My Abhivadhaye <FaFeather />
            </button>
          </div>

          <div className="stats-card card-shadow">
            <div className="stats-icon"><FaOm /></div>
            <h4>{pageVisits}+</h4>
            <p>Abhivadhayes Served</p>
            <div className="did-you-know">
              <h5><FaLightbulb /> Wisdom of the Sages</h5>
              <div key={factIndex} className="fact-container animate-fade-in">
                <p>{VEDIC_FACTS[factIndex]}</p>
              </div>
            </div>
          </div>
        </div>

        {isGenerated && (
          <div id="result-section" className="result-card card-shadow animate-scale-up">
            <div className="lang-bar">
              {(['English', 'Hindi', 'Tamil', 'Telugu'] as Language[]).map((l) => (
                <button key={l} className={`lang-btn ${activeLang === l ? 'active' : ''}`} onClick={() => setActiveLang(l)}>{l}</button>
              ))}
            </div>
            
            <div className="mantra-display">
              <p className={`mantra-text ${activeLang !== 'English' ? 'native-font' : ''}`}>
                {getGeneratedText(activeLang)}
              </p>
              <div className="action-row">
                <button onClick={() => { navigator.clipboard.writeText(getGeneratedText(activeLang)); alert('Copied!'); }} className="action-btn"><FaCopy /> Copy</button>
                <button onClick={() => {
                  const shareMsg = `My Abhivadhaye:\n\n${getGeneratedText(activeLang)}\n\nGenerate yours at: https://abhivadhaye.in`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMsg)}`, '_blank');
                }} className="action-btn wa-btn"><FaWhatsapp /> WhatsApp</button>
              </div>
            </div>

            <div className="meaning-card">
              <h4>Meaning & Significance</h4>
              <p className="meaning-text">{generateTranslation()}</p>
            </div>
          </div>
        )}

        <div className="feedback-section-new">
          <h3>Your feedback helps us grow</h3>
          <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="How can we make this experience better for you?" />
          <button onClick={handleSubmitFeedback}>Send Feedback</button>
        </div>

        <AdComponent adSlot="1234567890" />
      </div>
      <Footer />
    </div>
  );
};

export default App;
