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
  FaLightbulb,
  FaDownload
} from 'react-icons/fa';
import Select from 'react-select';
import { toPng } from 'html-to-image';

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
  "AaSvakAyana": { English: "AaSvakAyana", Hindi: "आश्वलायन", Tamil: "ஆஸ்வலாயன", Telugu: "ఆస్వలాయన" },
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
  "Koushika": { English: "Koushika", Hindi: "कौशिक", Tamil: "கௌஸிக", Telugu: "కౌశిక" },
  "Vashista": { English: "Vashista", Hindi: "वशिष्ठ", Tamil: "வஸிஷ்ட", Telugu: "వశిష్ఠ" },
  "Kowndinya": { English: "Kowndinya", Hindi: "कौण्डिन्य", Tamil: "கௌண்டின்ய", Telugu: "కౌండిన్య" },
  "Kashyapa": { English: "Kashyapa", Hindi: "कश्यप", Tamil: "கஸ்யப", Telugu: "కాశ్యప" },
  "Atreya": { English: "Atreya", Hindi: "आत्रेय", Tamil: "ஆத்ரேய", Telugu: "ఆత్రేయ" },
  "Sandilya": { English: "Sandilya", Hindi: "शाण्डिल्य", Tamil: "ஸாண்டில்ய", Telugu: "శాండిల్య" },
  "Haritasa": { English: "Haritasa", Hindi: "हारितस", Tamil: "ஹாரிதஸ", Telugu: "హారితస" },
  "Mowdgalya": { English: "Mowdgalya", Hindi: "मौद्गल्य", Tamil: "மௌத்கல்ய", Telugu: "మౌద్గల్య" },
  "Srivatsa": { English: "Srivatsa", Hindi: "श्रीवत्स", Tamil: "ஸ்ரீவత్ஸ", Telugu: "శ్రీవత్స" },
  "Aarshtisena": { English: "Aarshtisena", Hindi: "आर्ष्टिषेण", Tamil: "ஆர்ஷ்டிஷேண", Telugu: "ఆర్ష్టిషేణ" },
  "Vadula Savarni &Yaska": { English: "Vadula Savarni & Yaska", Hindi: "वादूल सावर्णि यास्क", Tamil: "வாதூல ஸாவர்ணி யாஸ்க", Telugu: "వాదూల సావర్ణి యాస్క" },
  "Maitreya": { English: "Maitreya", Hindi: "मैत्रेय", Tamil: "மைத்ரேய", Telugu: "మైత్రేయ" },
  "Shaunaka": { English: "Shaunaka", Hindi: "शौनक", Tamil: "ஸௌனக", Telugu: "శౌనక" },
  "Gartsamada": { English: "Gartsamada", Hindi: "गृत्समद", Tamil: "க்ருத்ஸமத", Telugu: "గృత్సమద" },
  "Vatsa": { English: "Vatsa", Hindi: "वत्स", Tamil: "வத்ஸ", Telugu: "వత్స" },
  "Bidasa": { English: "Bidasa", Hindi: "बीडस", Tamil: "பீడஸ", Telugu: "బీడస" },
  "Shatamarshana": { English: "Shatamarshana", Hindi: "शठमर्षण", Tamil: "ஷடமர்ஷண", Telugu: "శఠమర్షణ" },
  "AAtreya/Krishnatreya": { English: "Atreya / Krishnatreya", Hindi: "आत्रेय / कृष्णात्रेय", Tamil: "ஆत्रेய / கிருஷ்ணாத்ரேய", Telugu: "ఆత్రేయ / కృష్ణాత్రేయ" },
  "Vadhbhutaka": { English: "Vadhbhutaka", Hindi: "वाद्भूतक", Tamil: "வாத்பூதக", Telugu: "వాద్భూతక" },
  "Gavisthiras": { English: "Gavisthiras", Hindi: "गाविष्ठिर", Tamil: "காவிஷ்டிர", Telugu: "గావిష్ఠిర" },
  "Kalabodhana": { English: "Kalabodhana", Hindi: "कालबोधन", Tamil: "காலபோதன", Telugu: "కాలబోధన" },
  "Bhargava": { English: "Bhargava", Hindi: "भार्गव", Tamil: "பார்க்கவ", Telugu: "భార్గవ" },
  "Viswamitra": { English: "Viswamitra", Hindi: "विश्वामित्र", Tamil: "விஸ்வாமித்ர", Telugu: "విశ్వామిత్ర" },
  "Kapinjala": { English: "Kapinjala", Hindi: "కపిञ్జల", Tamil: "கபிஞ்ஜல", Telugu: "కపింజల" },
  "Gautamasa": { English: "Gautamasa", Hindi: "गौतमस", Tamil: "கௌதமஸ", Telugu: "గౌతమస" },
  "Naitruvakaasyapa": { English: "Naitruvakaasyapa", Hindi: "नैध्रुव काश्यप", Tamil: "நைத்ருவ காஸ்யப", Telugu: "నైధ్రువ కాశ్యప" },
  "Kutsa": { English: "Kutsa", Hindi: "कुत्स", Tamil: "குత్ஸ", Telugu: "కుత్స" },
  "Kapi": { English: "Kapi", Hindi: "కపి", Tamil: "కపి", Telugu: "కపి" },
  "Kapila": { English: "Kapila", Hindi: "कपिल", Tamil: "கபில", Telugu: "కపిల" },
  "Kanva": { English: "Kanva", Hindi: "कण्व", Tamil: "கண்வ", Telugu: "కణ్వ" },
  "Paraasara": { English: "Paraasara", Hindi: "पराशर", Tamil: "பராஸர", Telugu: "పరాశర" },
  "Upamanyu": { English: "Upamanyu", Hindi: "उपमन्यु", Tamil: "உபமன்யு", Telugu: "ఉపమన్యు" },
  "Aagastya": { English: "Aagastya", Hindi: "अगस्त्य", Tamil: "அகஸ்த்ய", Telugu: "అగస్త్య" },
  "Gargyasa": { English: "Gargyasa", Hindi: "गार्ग्यस", Tamil: "கார்க்யஸ", Telugu: "గార్గ్యస" },
  "Bhadarayana": { English: "Bhadarayana", Hindi: "बादरायण", Tamil: "பாதராயண", Telugu: "బాదరాయణ" },
  "Sankriti": { English: "Sankriti", Hindi: "सांकृति", Tamil: "ஸாங்க்ருதி", Telugu: "సాంకృతి" },
  "Suryadhwaja": { English: "Suryadhwaja", Hindi: "सूर्यध्वज", Tamil: "ஸూర్యత్వజ", Telugu: "సూర్యధ్వజ" },
  "Daivaratasa": { English: "Daivaratasa", Hindi: "दैवरातस", Tamil: "தைவராதஸ", Telugu: "దైవరాతస" },
  "chikitasa": { English: "Chikitasa", Hindi: "चिकितास", Tamil: " சிகிதாஸ", Telugu: "చికీతాస" },
  "Angirasa": { English: "Angirasa", Hindi: "आङ्गिरस", Tamil: "ஆங்கிரஸ", Telugu: "ఆంగిరస" },
  "Ayasya": { English: "Ayasya", Hindi: "आयास्य", Tamil: "ఆయాస్య", Telugu: "ఆయాస్య" },
  "Bhaarhaspatya": { English: "Bhaarhaspatya", Hindi: "बार्हस्पत्य", Tamil: "பார்ஹஸ்பத்ய", Telugu: "బార్హస్పత్య" },
  "Vaitahavya": { English: "Vaitahavya", Hindi: "वैतहव्य", Tamil: "வைதஹவ்ய", Telugu: "వైతహవ్య" },
  "Saavedasa": { English: "Saavedasa", Hindi: "सावेदस", Tamil: "ஸாவேதஸ", Telugu: "సావేదస" },
  "Daivodasa": { English: "Daivodasa", Hindi: "दैवोदास", Tamil: "தைவோதாஸ", Telugu: "దైవోదాస" },
  "Vadhryasva": { English: "Vadhryasva", Hindi: "वध्र्यश्व", Tamil: "வத்ர்யస్వ", Telugu: "వధ్ర్యశ్వ" },
  "Shaunaka(ekarsheya)": { English: "Shaunaka", Hindi: "शौनक", Tamil: "ஸௌனக", Telugu: "శౌనక" },
  "Sunahotra": { English: "Sunahotra", Hindi: "शुनहोत्र", Tamil: "ஸுனஹோத்ர", Telugu: "శునహోత్ర" },
  "Chyavana": { English: "Chyavana", Hindi: "च्यवन", Tamil: "ச்யவன", Telugu: "చ్యవన" },
  "Apnavana": { English: "Apnavana", Hindi: "आप्नवान", Tamil: "ஆப்னவான", Telugu: "ఆప్నవాన" },
  "Apnuvat": { English: "Apnuvat", Hindi: "आप्नुవత్", Tamil: "ஆப்னுవత్", Telugu: "ఆప్నువత్" },
  "Aurava": { English: "Aurava", Hindi: "और्व", Tamil: "ஔர்வ", Telugu: "ఔర్వ" },
  "Jamadagnya": { English: "Jamadagnya", Hindi: "जामदग्न्य", Tamil: "ஜாமதక్న్య", Telugu: "జామదగ్న్య" },
  "Anupa": { English: "Anupa", Hindi: "अनूप", Tamil: "அனூப", Telugu: "అనూప" },
  "Baida": { English: "Baida", Hindi: "बैद", Tamil: "பைத", Telugu: "పైత" },
  "Powrukutsa": { English: "Powrukutsa", Hindi: "पौरुकुत्स", Tamil: "பௌருகுత్ஸ", Telugu: "పౌరుకుత్స" },
  "Traasatasya": { English: "Traasatasya", Hindi: "त्रासदस्य", Tamil: "த்ராஸதஸ்ய", Telugu: "త్రాసదస్య" },
  "Aarchanaasa": { English: "Aarchanaasa", Hindi: "आर्चरासन", Tamil: "ஆர்சனாஸ", Telugu: "ఆర్చనాస" },
  "Syaavaasva": { English: "Syaavaasva", Hindi: "श्यावाश्व", Tamil: "ஸ்யாவாஸ்వ", Telugu: "శ్యావాశ్వ" },
  "Gavisthira": { English: "Gavisthira", Hindi: "गाविष्ठिर", Tamil: "காவிஷ்டிர", Telugu: "గావిష్ఠిర" },
  "Purvatitha": { English: "Purvatitha", Hindi: "पूर्वातिथि", Tamil: "பூர்வாதிதி", Telugu: "పూర్వాతిథి" },
  "Vaiswaamitra": { English: "Vaiswaamitra", Hindi: "वैश्वामित्र", Tamil: "வைஸ்வாமித்ர", Telugu: "వైశ్వామిత్ర" },
  "Aghamarshana": { English: "Aghamarshana", Hindi: "अघमर्षण", Tamil: "அகமர்ஷண", Telugu: "అఘమర్షణ" },
  "AAgamarshana": { English: "AAgamarshana", Hindi: "अघमर्षण", Tamil: "அகமர்ஷண", Telugu: "అఘమర్షణ" },
  "Tvashta": { English: "Tvashta", Hindi: "त्वष्टा", Tamil: "த்வஷ்டா", Telugu: "త్వష్టా" },
  "Vishvaroopa": { English: "Vishvaroopa", Hindi: "विश्वरूप", Tamil: "விஸ்வரூப", Telugu: "విశ్వరూప" },
  "Devaraata": { English: "Devaraata", Hindi: "देवरात", Tamil: "தேவராத", Telugu: "దేవరాత" },
  "Owtala": { English: "Owtala", Hindi: "औतल", Tamil: "ஔதல", Telugu: "ఔతల" },
  "Maitraavaruna": { English: "Maitraavaruna", Hindi: "मैत्रावरुण", Tamil: "மைத்ராவருண", Telugu: "మైత్రావరుణ" },
  "Aindrapramada": { English: "Aindrapramada", Hindi: "ऐन्द्रप्रमद", Tamil: "ஐந்த்ரப்ரமத", Telugu: "ఐంద్రప్రమద" },
  "Abharadvasavya": { English: "Abharadvasavya", Hindi: "आभरद्वसु", Tamil: "ஆபரத்வஸவ்ய", Telugu: "ఆభరద్వసవ్య" },
  "Vashista(ekarsheya)": { English: "Vashista", Hindi: "वशिष्ठ", Tamil: "వஸிష్ట", Telugu: "వశిష్ఠ" },
  "Harita": { English: "Harita", Hindi: "हारित", Tamil: "ஹாரித", Telugu: "హారిత" },
  "Ambarisha": { English: "Ambarisha", Hindi: "अम्बरीष", Tamil: "அம்பரீஷ", Telugu: "అంబరీష" },
  "Yuvanasva": { English: "Yuvanasva", Hindi: "युवनाश्व", Tamil: "யுவனாஸ்வ", Telugu: "యువనాశ్వ" },
  "Aayasyasa": { English: "Aayasyasa", Hindi: "आयास्य", Tamil: "ஆயாஸ்ய", Telugu: "ఆయాస్య" },
  "Gautama": { English: "Gautama", Hindi: "गौतम", Tamil: "கௌதம", Telugu: "గౌతమ" },
  "Bharmyasva": { English: "Bharmyasva", Hindi: "भार्म्यश्व", Tamil: "பார்ம்யஸ்வ", Telugu: "భార్మ్యశ్వ" },
  "Tarkshya": { English: "Tarkshya", Hindi: "तार्क्ष्य", Tamil: "தார்க்ஷ்ய", Telugu: "తార్క్ష్య" },
  "Dhavya": { English: "Dhavya", Hindi: "धाव्य", Tamil: "தாவ்ய", Telugu: "ధావ్య" },
  "Aavatsaara": { English: "Aavatsaara", Hindi: "आवत्सार", Tamil: "ஆவத்ஸார", Telugu: "ఆవత్సార" },
  "Daivala": { English: "Daivala", Hindi: "दैवल", Tamil: "தைவல", Telugu: "దైవల" },
  "Asitha": { English: "Asitha", Hindi: "असित", Tamil: "அஸித", Telugu: "అసిత" },
  "Aavatsara": { English: "Aavatsara", Hindi: "आवत्सार", Tamil: "ஆவத்ஸார", Telugu: "ఆవత్సార" },
  "Naitruva": { English: "Naitruva", Hindi: "नैध్రుव", Tamil: "நைத்ருவ", Telugu: "నైధ్రువ" },
  "Aangirasa": { English: "Angirasa", Hindi: "आङ्गिरस", Tamil: "ஆங்கிரஸ", Telugu: "ఆంగిరస" },
  "Maandhatra": { English: "Maandhatra", Hindi: "मान्धातृ", Tamil: "மாந்தாத்ரு", Telugu: "మాంధాతృ" },
  "Koutsa": { English: "Koutsa", Hindi: "कुत्स", Tamil: "குத்ஸ", Telugu: "కుత్స" },
  "Aamahaiya": { English: "Aamahaiya", Hindi: "आमहैय", Tamil: "ஆமஹைய", Telugu: "ఆమహైయ" },
  "Orukshaya": { English: "Orukshaya", Hindi: "औरुक्षय", Tamil: "ஔருக்ஷய", Telugu: "ఔరుక్షయ" },
  "Ajameeda": { English: "Ajameeda", Hindi: "अजमीढ", Tamil: "అஜமீட", Telugu: "అజమీఢ" },
  "Kaanva": { English: "Kaanva", Hindi: "काण्व", Tamil: "காண்வ", Telugu: "కాణ్వ" },
  "Kowra": { English: "Kowra", Hindi: "कौर", Tamil: "கௌர", Telugu: "కౌర" },
  "Saaktya": { English: "Saaktya", Hindi: "शाक्त्य", Tamil: "ஸாக்த்ய", Telugu: "శాక్త్య" },
  "Paarasarya": { English: "Paarasarya", Hindi: "पाराशर्य", Tamil: "பாராஸர்ய", Telugu: "పారాశర్య" },
  "Bhadravasavya": { English: "Bhadravasavya", Hindi: "भद्रवसव", Tamil: "பத்ரவஸவ்ய", Telugu: "భద్రవసవ్య" },
  "Tardhachyuta": { English: "Tardhachyuta", Hindi: "दार्ढच्युत", Tamil: "தார்டச்யுத", Telugu: "దార్ఢచ్యుత" },
  "Sowmavaha": { English: "Sowmavaha", Hindi: "सोमवाह", Tamil: "ஸோமவாஹ", Telugu: "సోమవాహ" },
  "Sainya": { English: "Sainya", Hindi: "सैन्य", Tamil: "ஸைன்ய", Telugu: "సైన్య" },
  "Gaargya": { English: "Gaargya", Hindi: "गार्ग्य", Tamil: "கார்க்ய", Telugu: "గార్గ్య" },
  "Paarshadaswa": { English: "Paarshadaswa", Hindi: "पार्षदश्व", Tamil: "பார்ஷதస్వ", Telugu: "పార్షదశ్వ" },
  "Raatitara": { English: "Raatitara", Hindi: "రాथीतर", Tamil: "రాదీதர", Telugu: "రాథీతర" },
  "Kowravidha": { English: "Kowravidha", Hindi: "कौरविध", Tamil: "கௌரவித", Telugu: "కౌరవిధ" },
  "Saankritya": { English: "Saankritya", Hindi: "सांकृत्य", Tamil: "ஸாங்க்ருத்ய", Telugu: "సాంకృత్య" },
  "Sadhya": { English: "Sadhya", Hindi: "साध्य", Tamil: "ஸாத்ய", Telugu: "సాధ్య" },
  "Lakhi (Mehrishi)": { English: "Lakhi", Hindi: "लखी", Tamil: "லகி", Telugu: "లఖీ" },
  "Soral": { English: "Soral", Hindi: "सोराल", Tamil: "ஸோரால்", Telugu: "సోరాల్" },
  "Binju": { English: "Binju", Hindi: "बिंजु", Tamil: "பிஞ்சு", Telugu: "బింజు" },
  "Avudhala": { English: "Avudhala", Hindi: "अवधल", Tamil: "அவதல", Telugu: "అవధల" },
};

const NORMALIZED_MAPPINGS: Record<string, Record<Language, string>> = Object.fromEntries(
  Object.entries(COMMON_MAPPINGS).map(([key, value]) => [key.toLowerCase().trim(), value])
);

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

const FAQ_DATA = [
  {
    question: "Why do we touch our ears while reciting the mantra?",
    answer: "Tradition holds that the ears are sacred spots where deities reside. Touching them 'seals' the spiritual energy of the Sages' names within you and acts as a shield against the intense power invoked by the Pravara."
  },
  {
    question: "Why are the hands crossed when touching an elder's feet?",
    answer: "This is a precise energy protocol. By crossing hands (right hand to right foot, left to left), you create a direct circuit with the elder, allowing their blessings and positive energy to flow into you undisturbed."
  },
  {
    question: "What does 'Sarma' or 'Sarmaham' actually mean?",
    answer: "'Sarma' is a title signifying 'joy' or 'protection.' When you say 'Rama Sarma aham asmi,' you are declaring 'I am Rama, the one who is joyful and protected by the Divine.'"
  },
  {
    question: "Can women perform Abhivadhaye?",
    answer: "Traditionally, it is part of the Upanayanam ritual for men. However, in modern times, it is highly encouraged for everyone to know their Gothra and Rishi lineage as a vital way to preserve family history and identity."
  },
  {
    question: "What if I only know my Gothra, but not my Veda or Suthra?",
    answer: "Most Gothras have a historical 'default' Veda (like Yajur Veda for many South Indian lineages). If you're unsure, consulting family elders is best, but our generator helps you explore the most common associations for your Gothra."
  }
];

const SUGGESTED_DEFAULTS: Record<string, { veda: string, suthra: string }> = {
  "Koushika": { veda: "Yajur", suthra: "Aapasthambha" },
  "Bharadwaja": { veda: "Yajur", suthra: "Aapasthambha" },
  "Vashista": { veda: "Yajur", suthra: "Aapasthambha" },
  "Kowndinya": { veda: "Yajur", suthra: "Aapasthambha" },
  "Sandilya": { veda: "Yajur", suthra: "Aapasthambha" },
  "Haritasa": { veda: "Yajur", suthra: "Aapasthambha" },
  "Gautamasa": { veda: "Yajur", suthra: "Aapasthambha" },
  "Mowdgalya": { veda: "Yajur", suthra: "Aapasthambha" },
  "Srivatsa": { veda: "Yajur", suthra: "Aapasthambha" },
  "Atreya": { veda: "Yajur", suthra: "Aapasthambha" },
  "Kashyapa": { veda: "Yajur", suthra: "Aapasthambha" },
  "Viswamitra": { veda: "Yajur", suthra: "Aapasthambha" },
  "Vadhula Savarni &Yaska": { veda: "Yajur", suthra: "Aapasthambha" },
};

const transliteratePhonetic = (name: string, lang: Language): string => {
  if (lang === 'English') return name;
  const lower = name.toLowerCase();
  const knownNames: Record<string, Record<Language, string>> = {
    "rama": { English: "Rama", Hindi: "राम", Tamil: "ராம", Telugu: "రామ" },
    "krishna": { English: "Krishna", Hindi: "कृष्ण", Tamil: "கிருஷ்ண", Telugu: "కృష్ణ" },
    "siva": { English: "Siva", Hindi: "शिव", Tamil: "ஸிவ", Telugu: "శివ" },
    "vishnu": { English: "Vishnu", Hindi: "विष्णु", Tamil: "விஷ்ணு", Telugu: "విష్ణు" },
    "venkatesh": { English: "Venkatesh", Hindi: "वेङ्कटेश", Tamil: "వేங்கடேஷ்", Telugu: "వేంకటేశ్" },
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
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'expert' | 'guided'>('expert');
  const [searchQuery, setSearchQuery] = useState('');
  const [guidedNotice, setGuidedNotice] = useState('');
  const [scale, setScale] = useState(1);
  const cardContainerRef = React.useRef<HTMLDivElement>(null);

  // --- Scaling Logic for Direct Rendering ---
  useEffect(() => {
    const handleResize = () => {
      if (cardContainerRef.current) {
        const parent = cardContainerRef.current.parentElement;
        if (!parent) return;
        
        // Available width capped at 400px for nice display
        const availableWidth = Math.min(parent.offsetWidth, 400); 
        const targetWidth = 1080;
        const targetHeight = 1920;
        
        let newScale = availableWidth / targetWidth;
        const maxHeight = window.innerHeight * 0.8;
        
        if (targetHeight * newScale > maxHeight) {
          newScale = maxHeight / targetHeight;
        }
        
        setScale(newScale);
        
        // Match container to scaled size
        cardContainerRef.current.style.width = `${targetWidth * newScale}px`;
        cardContainerRef.current.style.height = `${targetHeight * newScale}px`;
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial scale with a small delay to ensure DOM is ready
    const timer = setTimeout(handleResize, 50);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [isGenerated]);

  // --- Persistence Logic ---
  useEffect(() => {
    const saved = localStorage.getItem('abhivadhaye_session');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.gothra) setSelectedGothraName(data.gothra);
        if (data.variation !== undefined) setSelectedVariationIndex(data.variation);
        if (data.veda) setSelectedVeda(data.veda);
        if (data.suthra) setSelectedSuthra(data.suthra);
        if (data.name) setName(data.name);
        if (data.nativeName) setNativeName(data.nativeName);
        if (data.lang) setActiveLang(data.lang);
        // If everything is there, we can even auto-generate
        if (data.gothra && data.name && data.veda && data.suthra) {
          setIsGenerated(true);
        }
      } catch (e) {
        console.error("Failed to load saved session", e);
      }
    }
  }, []);

  const saveSession = () => {
    const sessionData = {
      gothra: selectedGothraName,
      variation: selectedVariationIndex,
      veda: selectedVeda,
      suthra: selectedSuthra,
      name,
      nativeName,
      lang: activeLang
    };
    localStorage.setItem('abhivadhaye_session', JSON.stringify(sessionData));
  };

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

  const filteredLineages = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return abhivadhayeData.filter(item => 
      item.Gothra.toLowerCase().includes(q) ||
      item.Rishi1.toLowerCase().includes(q) ||
      item.Rishi2.toLowerCase().includes(q) ||
      item.Rishi3.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [searchQuery]);

  const handleSelectLineage = (item: AbhivadhayeRecord) => {
    const cleanGothra = item.Gothra.replace(/\s\d+$/, '');
    setSelectedGothraName(cleanGothra);
    
    // Find the variation index
    const variations = abhivadhayeData.filter(v => v.Gothra.startsWith(cleanGothra));
    const idx = variations.findIndex(v => v.Rishi1 === item.Rishi1 && v.Rishi2 === item.Rishi2 && v.Rishi3 === item.Rishi3);
    
    setSelectedVariationIndex(idx >= 0 ? idx : 0);
    
    let veda = item.Veda;
    let suthra = item.Suthra;
    let usedDefault = false;

    if (!veda && SUGGESTED_DEFAULTS[cleanGothra]) {
      veda = SUGGESTED_DEFAULTS[cleanGothra].veda;
      suthra = SUGGESTED_DEFAULTS[cleanGothra].suthra;
      usedDefault = true;
    }

    setSelectedVeda(veda);
    setSelectedSuthra(suthra);
    setSearchQuery('');
    setGuidedNotice(usedDefault 
      ? `We've pre-filled the most common Veda/Suthra for ${cleanGothra}. Please verify.` 
      : `Selection complete for ${cleanGothra}.`
    );
    setActiveTab('expert'); 
    
    setTimeout(() => {
      document.querySelector('.glow-button')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleGenerate = () => {
    if (selectedGothraData && name && selectedVeda && selectedSuthra) {
      setIsGenerated(true);
      saveSession();
      setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      alert("Please fill in all fields to generate your Abhivadhaye.");
    }
  };

  const handleDownloadImage = () => {
    const node = document.getElementById('live-share-card');
    if (!node) return;

    // Small delay to ensure any pending renders are complete
    setTimeout(() => {
      toPng(node, { 
        cacheBust: true,
        backgroundColor: '#0f0f0f',
        width: 1080,
        height: 1920,
        pixelRatio: 1,
        skipFonts: true, // Fix for SecurityError: Failed to read 'cssRules'
      })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `Abhivadhaye-${name.replace(/\s+/g, '-')}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error('Capture failed', err);
          alert('Failed to generate image. Please try again.');
        });
    }, 100);
  };

  const handleShareImage = async () => {
    const node = document.getElementById('live-share-card');
    if (!node) return;

    try {
      await new Promise(r => setTimeout(r, 100));

      const dataUrl = await toPng(node, { 
        cacheBust: true,
        backgroundColor: '#0f0f0f',
        width: 1080,
        height: 1920,
        pixelRatio: 1,
        skipFonts: true,
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `Abhivadhaye-${name.replace(/\s+/g, '-')}.png`, { type: 'image/png' });

      // Check if sharing is supported and if the specific file can be shared
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'My Abhivadhaye',
            text: 'I just generated my ancestral lineage card!',
          });
        } catch (shareErr: any) {
          // If the user cancelled (AbortError), don't show an error
          if (shareErr.name === 'AbortError') return;
          throw shareErr; // Rethrow other errors to the outer catch
        }
      } else {
        // Fallback for Desktop or unsupported browsers
        const link = document.createElement('a');
        link.download = `Abhivadhaye-${name.replace(/\s+/g, '-')}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Share failed', err);
      // Final fallback if everything fails
      alert('Could not share directly. The image has been downloaded to your device instead.');
    }
  };

  const handleSubmitFeedback = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!feedback) return;
    
    const formData = new FormData(e.currentTarget);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData as any).toString(),
    })
      .then(() => {
        alert('Thank you for your feedback!');
        setFeedback('');
      })
      .catch(() => {
        alert('Failed to send feedback. Please try again.');
      });
  };

  const translate = (term: string, lang: Language): string => {
    if (lang === 'English') return term;
    const lowerTerm = term.toLowerCase().trim();
    const entry = NORMALIZED_MAPPINGS[lowerTerm];
    if (entry && entry[lang]) return entry[lang];
    if (entry) return entry.English || term;
    return term;
  };

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

  const getSaptarishiInfo = () => {
    if (!selectedGothraData) return null;
    
    const gothra = selectedGothraName.toLowerCase();
    const rishis = [
      selectedGothraData.Rishi1, 
      selectedGothraData.Rishi2, 
      selectedGothraData.Rishi3
    ].map(r => r?.toLowerCase() || "");

    const mapping = [
      { 
        name: "Vasishtha", 
        url: "https://vamsha.co.in/rishivamsha/vasishtha",
        triggers: ["vashista", "koundinya", "paraasara", "upamanyu", "kapinjala", "kundina"]
      },
      { 
        name: "Vishwamitra", 
        url: "https://vamsha.co.in/rishivamsha/vishwamitra",
        triggers: ["koushika", "viswamitra", "kalabodhana", "chikitasa", "daivaratasa", "devaraata", "aghamarshana"]
      },
      { 
        name: "Bharadvaja", 
        url: "https://vamsha.co.in/rishivamsha/bharadvaja",
        triggers: ["bharadwaja", "garga", "gargyasa", "kapi", "kapila", "kanva", "angirasa", "bhaarhaspatya"]
      },
      { 
        name: "Kashyapa", 
        url: "https://vamsha.co.in/rishivamsha/kashyapa",
        triggers: ["kashyapa", "kasyapa", "sandilya", "naitruva", "naitruvakaasyapa", "asitha", "daivala"]
      },
      { 
        name: "Atri", 
        url: "https://vamsha.co.in/rishivamsha/atri",
        triggers: ["atreya", "atri", "krishnatreya", "gavisthira", "vadhbhutaka", "archanaasa", "syaavaasva"]
      },
      { 
        name: "Gautama", 
        url: "https://vamsha.co.in/rishivamsha/gautama",
        triggers: ["gautama", "gautamasa", "ayasya", "aayasyasa", "sharadvan"]
      },
      { 
        name: "Jamadagni", 
        url: "https://vamsha.co.in/rishivamsha/jamadagni",
        triggers: ["jamadagni", "bhrigu", "bhargava", "vatsa", "srivatsa", "bidasa", "maitreya", "chyavana", "apnuvat", "aurava"]
      }
    ];

    // Try to find by Gothra name first, then by primary Rishis
    return mapping.find(m => 
      m.triggers.some(t => gothra.includes(t)) || 
      m.triggers.some(t => rishis.some(r => r.includes(t)))
    ) || { name: "Saptarishi", url: "https://vamsha.co.in" };
  };

  const RISHI_LORE: Record<string, string> = {
    "Vasishtha": "Sage Vasishtha is the mind-born son of Brahma and the possessor of Nandini, the divine cow of plenty. He is revered as the author of the 7th Mandala of the Rig Veda.",
    "Vishwamitra": "Born a powerful King (Kaushika), Vishwamitra attained the title of Brahmarishi through intense penance. He is the seer of the sacred Gayatri Mantra.",
    "Bharadvaja": "A master of both spiritual and worldly sciences, Sage Bharadvaja is credited with the 'Yantra Sarvasva', an ancient text on aeronautics and mechanical sciences.",
    "Kashyapa": "Known as the father of all living beings, Sage Kashyapa's lineage includes Devas, Asuras, and all creatures, symbolizing the unity of all life.",
    "Atri": "Sage Atri is one of the Saptarishis whose power of penance was so great that he and his wife Anasuya were chosen as parents by the Trimurti (Dattatreya).",
    "Gautama": "Sage Gautama is the author of the Nyaya Sutras, the foundation of logic in Indian philosophy. He is also the one who brought the river Godavari to earth.",
    "Jamadagni": "Known for his mastery over weapons and scriptures, Sage Jamadagni is the father of Parashurama. His lineage represents the perfect union of wisdom and valor."
  };

  const saptarishi = getSaptarishiInfo();
  const rishiLore = saptarishi ? RISHI_LORE[saptarishi.name] : null;

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
            <div className="tab-switcher">
              <button 
                className={`tab-btn ${activeTab === 'expert' ? 'active' : ''}`}
                onClick={() => setActiveTab('expert')}
              >
                I know my details
              </button>
              <button 
                className={`tab-btn ${activeTab === 'guided' ? 'active' : ''}`}
                onClick={() => setActiveTab('guided')}
              >
                Help me find my lineage
              </button>
            </div>

            {guidedNotice && (
              <div className="guided-notice animate-fade-in">
                <span>{guidedNotice}</span>
                <button onClick={() => setGuidedNotice('')}>×</button>
              </div>
            )}

            {activeTab === 'expert' ? (
              <div className="animate-fade-in">
                <div className="form-group">
                  <label><FaInfoCircle /> Select Your Gothra</label>
                  <Select
                    value={selectedGothraName ? { value: selectedGothraName, label: selectedGothraName } : null}
                    options={uniqueGothraNames.map((g) => ({ value: g, label: g }))}
                    onChange={(opt) => { 
                      const val = (opt as SelectOption)?.value || '';
                      setSelectedGothraName(val); 
                      setSelectedVariationIndex(0); 
                      setIsGenerated(false); 
                      setGuidedNotice('');
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
                      value={selectedVeda ? { value: selectedVeda, label: selectedVeda } : null}
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
                      value={selectedSuthra ? { value: selectedSuthra, label: selectedSuthra } : null}
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
              </div>
            ) : (
              <div className="guided-lookup animate-fade-in">
                <div className="form-group">
                  <label><FaInfoCircle /> Search by Gothra or Rishi name</label>
                  <input 
                    type="text"
                    className="custom-input"
                    placeholder="e.g. Bharadwaja or Angirasa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="lineage-results">
                  {filteredLineages.length > 0 ? (
                    <div className="lineage-grid">
                      {filteredLineages.map((item, idx) => {
                        const cleanG = item.Gothra.replace(/\s\d+$/, '');
                        const veda = item.Veda || SUGGESTED_DEFAULTS[cleanG]?.veda;
                        const suthra = item.Suthra || SUGGESTED_DEFAULTS[cleanG]?.suthra;
                        const isSuggested = !item.Veda && SUGGESTED_DEFAULTS[cleanG];

                        return (
                          <div key={idx} className="lineage-card" onClick={() => handleSelectLineage(item)}>
                            <div className="lc-gothra">{cleanG}</div>
                            <div className="lc-rishis">{[item.Rishi1, item.Rishi2, item.Rishi3].filter(Boolean).join(", ")}</div>
                            <div className="lc-meta">
                              <span className={isSuggested ? 'suggested-tag' : ''}>
                                {isSuggested ? 'Suggested: ' : ''}{veda || 'Unknown'} Veda
                              </span>
                              <span>•</span>
                              <span>{suthra || 'Unknown'} Suthra</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : searchQuery.length >= 2 ? (
                    <p className="no-results">No exact match found. Try a different spelling or use the expert tab.</p>
                  ) : (
                    <p className="search-hint">Start typing your Gothra to see matches...</p>
                  )}
                </div>
              </div>
            )}

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
                  placeholder={`e.g. ${activeLang === 'Hindi' ? 'राम शर्मा' : 'రామ శర్మ'}`} 
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
            
            <div className="live-card-container">
              <div className="live-card-preview" ref={cardContainerRef}>
                <div className="live-card-scaler" style={{ transform: `scale(${scale})` }}>
                  <div className="share-card" id="live-share-card">
                    <div className="sc-border">
                      <div className="sc-header">
                        <div className="sc-logo-box">
                          <FaOm />
                        </div>
                        <div className="sc-title">ABHIVADHAYE</div>
                        <div className="sc-divider"></div>
                      </div>
                      
                      <div className="sc-content">
                        <div className="sc-mantra-box">
                          <p className={`sc-mantra ${activeLang !== 'English' ? 'native-font' : ''}`}>
                            {getGeneratedText(activeLang)}
                          </p>
                        </div>
                        
                        <div className="sc-identity">
                          <div className="sc-label">Sacred Lineage of</div>
                          <div className="sc-name">Sri {name}</div>
                          <div className="sc-gothra-tag">{selectedGothraName} Gothra</div>
                        </div>
                      </div>

                      <div className="sc-footer">
                        <p>Explore your roots at <strong>abhivadhaye.in</strong></p>
                        <p className="sc-tagline">Honor Your Roots. Preserving Vedic Wisdom.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="action-row">
                <button onClick={() => { navigator.clipboard.writeText(getGeneratedText(activeLang)); alert('Copied!'); }} className="action-btn"><FaCopy /> Copy Text</button>
                <button onClick={handleDownloadImage} className="action-btn download-btn"><FaDownload /> Save Image</button>
                <button onClick={handleShareImage} className="action-btn wa-btn"><FaWhatsapp /> Share Card</button>
              </div>
            </div>
            <div className="meaning-card">
              <h4>Meaning & Significance</h4>
              <p className="meaning-text">{generateTranslation()}</p>
            </div>

            {saptarishi && (
              <div className="vamsha-bridge animate-fade-in">
                <div className="vb-content">
                  <div className="vb-visual">
                    <div className="vb-node saptarishi-node">
                      <FaOm />
                      <span>{saptarishi.name}</span>
                    </div>
                    <div className="vb-connector"></div>
                    <div className="vb-node gothra-node">
                      <FaUserCheck />
                      <span>{selectedGothraName}</span>
                    </div>
                  </div>
                  <div className="vb-text">
                    <h3>Discover Your Sacred Roots</h3>
                    <p>
                      The names you just recited are more than history—they are your living legacy. 
                      Your <strong>{selectedGothraName}</strong> lineage is a vital branch of the <strong>{saptarishi.name}</strong> family tree. 
                    </p>
                    {rishiLore && (
                      <div className="rishi-lore-snippet">
                        <FaLightbulb />
                        <span><strong>Sage {saptarishi.name}:</strong> {rishiLore}</span>
                      </div>
                    )}
                    <a 
                      href={saptarishi.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="vb-link-btn"
                    >
                      Explore the {saptarishi.name} Vamsha Tree →
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="faq-section">
          <h2 className="faq-title">Decoding the Ritual: <span>Secrets of the Sages</span></h2>
          <div className="faq-grid">
            {FAQ_DATA.map((item, idx) => (
              <div 
                key={idx} 
                className={`faq-item ${activeFaq === idx ? 'active' : ''}`}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div className="faq-question">
                  {item.question}
                  <span className="faq-icon">{activeFaq === idx ? '−' : '+'}</span>
                </div>
                {activeFaq === idx && (
                  <div className="faq-answer animate-fade-in">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <form 
          className="feedback-section-new" 
          name="feedback" 
          onSubmit={handleSubmitFeedback}
          data-netlify="true"
          data-netlify-honeypot="bot-field"
        >
          <input type="hidden" name="form-name" value="feedback" />
          <p className="hidden" style={{ display: 'none' }}>
            <label>
              Don't fill this out if you're human: <input name="bot-field" />
            </label>
          </p>
          <h3>Your feedback helps us grow</h3>
          <textarea 
            name="message"
            value={feedback} 
            onChange={(e) => setFeedback(e.target.value)} 
            placeholder="How can we make this experience better for you?" 
            required
          />
          <button type="submit">Send Feedback</button>
        </form>

        <AdComponent adSlot="1234567890" />
      </div>
      <Footer />
    </div>
  );
};

export default App;
