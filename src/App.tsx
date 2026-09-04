import React, { useState, useMemo, useEffect, useRef } from 'react';
import { abhivadhayeData, AbhivadhayeRecord } from './data';
import Footer from './components/Footer';
import AdComponent from './components/AdComponent';
import {
  FaFeather, FaCopy, FaWhatsapp, FaInstagram, FaInfoCircle, FaLanguage,
  FaHistory, FaOm, FaUserCheck, FaLightbulb, FaDownload, FaPlay, FaPause,
  FaUndo, FaMusic, FaMagic, FaExternalLinkAlt, FaPrayingHands, FaScroll,
  FaHandsHelping, FaSpinner
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

const LANG_META: Record<Language, { code: string; label: string; cls: string }> = {
  English: { code: 'en-IN', label: 'English', cls: '' },
  Hindi:   { code: 'hi-IN', label: 'हिन्दी', cls: 'lang-hi' },
  Tamil:   { code: 'ta-IN', label: 'தமிழ்', cls: 'lang-ta' },
  Telugu:  { code: 'te-IN', label: 'తెలుగు', cls: 'lang-te' },
};

const VAG_BASE = 'https://prathoshap-vagdhenu-demo.hf.space';

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
  const [factIndex, setFactIndex] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'expert' | 'guided'>('expert');
  const [searchQuery, setSearchQuery] = useState('');
  const [guidedNotice, setGuidedNotice] = useState('');
  const [scale, setScale] = useState(1);
  const cardContainerRef = React.useRef<HTMLDivElement>(null);

  // --- Recite (SpeechSynthesis) state ---
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [rate, setRate] = useState(0.8);
  const speechFlag = useRef({ cancelled: false });
  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // --- Vāgdhenu AI chant state ---
  const [chantState, setChantState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [chantUrl, setChantUrl] = useState('');

  // --- Scaling Logic for Direct Rendering (share card) ---
  useEffect(() => {
    const handleResize = () => {
      if (cardContainerRef.current) {
        const parent = cardContainerRef.current.parentElement;
        if (!parent) return;
        const availableWidth = Math.min(parent.offsetWidth, 400);
        const targetWidth = 1080;
        const targetHeight = 1920;
        let newScale = availableWidth / targetWidth;
        const maxHeight = window.innerHeight * 0.8;
        if (targetHeight * newScale > maxHeight) {
          newScale = maxHeight / targetHeight;
        }
        setScale(newScale);
        cardContainerRef.current.style.width = `${targetWidth * newScale}px`;
        cardContainerRef.current.style.height = `${targetHeight * newScale}px`;
      }
    };
    window.addEventListener('resize', handleResize);
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
        if (data.gothra && data.name && data.veda && data.suthra) {
          setIsGenerated(true);
        }
      } catch (e) {
        console.error('Failed to load saved session', e);
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
      lang: activeLang,
    };
    localStorage.setItem('abhivadhaye_session', JSON.stringify(sessionData));
  };

  // Rotate the "Wisdom of the Sages" facts
  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % VEDIC_FACTS.length);
    }, 8000);
    return () => clearInterval(factInterval);
  }, []);

  // Prime speech voices + cleanup on unmount
  useEffect(() => {
    if (!ttsSupported) return;
    window.speechSynthesis.getVoices();
    const onVoices = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', onVoices);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', onVoices);
      window.speechSynthesis.cancel();
    };
  }, [ttsSupported]);

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
    ...new Set(abhivadhayeData.map((item: AbhivadhayeRecord) => item.Veda).filter(Boolean)),
  ].sort(), []);

  const filteredSuthras = useMemo(() => {
    if (!selectedVeda) return [];
    return [
      ...new Set(
        abhivadhayeData
          .filter((item: AbhivadhayeRecord) => item.Veda === selectedVeda)
          .map((item: AbhivadhayeRecord) => item.Suthra)
          .filter(Boolean)
      ),
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

  const stopSpeech = () => {
    speechFlag.current.cancelled = true;
    if (ttsSupported) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setActiveWordIndex(-1);
  };

  const resetOnEdit = () => {
    setIsGenerated(false);
    stopSpeech();
    setChantState('idle');
    setChantUrl('');
  };

  const handleSelectLineage = (item: AbhivadhayeRecord) => {
    const cleanGothra = item.Gothra.replace(/\s\d+$/, '');
    setSelectedGothraName(cleanGothra);
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
      ? `We've pre-filled the most common Veda / Suthra for ${cleanGothra}. Please verify with your family elders.`
      : `Lineage selected for ${cleanGothra}. Now add your name below.`
    );
    setActiveTab('expert');
    setTimeout(() => {
      document.querySelector('.generate-btn')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleGenerate = () => {
    if (selectedGothraData && name && selectedVeda && selectedSuthra) {
      setIsGenerated(true);
      stopSpeech();
      setChantState('idle');
      setChantUrl('');
      saveSession();
      setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      alert('Please choose your Gothra, Veda, Suthra and enter your name to reveal your Abhivadhaye.');
    }
  };

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const handleDownloadImage = () => {
    const node = document.getElementById('live-share-card');
    if (!node) return;
    setTimeout(() => {
      toPng(node, {
        cacheBust: true,
        backgroundColor: '#2a0f0f',
        width: 1080,
        height: 1920,
        pixelRatio: 1,
        skipFonts: true,
      })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `Abhivadhaye-${name.replace(/\s+/g, '-')}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error('Capture failed', err);
          alert('Could not generate the image. Please try again.');
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
        backgroundColor: '#2a0f0f',
        width: 1080,
        height: 1920,
        pixelRatio: 1,
        skipFonts: true,
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `Abhivadhaye-${name.replace(/\s+/g, '-')}.png`, { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'My Abhivadhaye',
            text: 'My ancestral lineage salutation — generated at abhivadhaye.in',
          });
        } catch (shareErr: any) {
          if (shareErr.name === 'AbortError') return;
          throw shareErr;
        }
      } else {
        const link = document.createElement('a');
        link.download = `Abhivadhaye-${name.replace(/\s+/g, '-')}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Share failed', err);
      alert('Could not share directly. The image has been downloaded to your device instead.');
    }
  };

  const handleSubmitFeedback = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!feedback) return;
    const formData = new FormData(e.currentTarget);
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData as any).toString(),
    })
      .then(() => {
        alert('Thank you — your feedback helps us keep the lineages accurate.');
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
    if (!selectedGothraData) return '';
    const script = SCRIPTS[lang];
    const rishis = [
      selectedGothraData.Rishi1,
      selectedGothraData.Rishi2,
      selectedGothraData.Rishi3,
      selectedGothraData.Rishi4,
      selectedGothraData.Rishi5,
      selectedGothraData.Rishi6,
      selectedGothraData.Rishi7,
    ].filter(Boolean) as string[];
    const count = rishis.length;
    const pravaraText = script[PRAVARA_EN_MAP[count] || `${count} Arseya`] || `${count} Arseya`;
    const nativeGothra = translate(selectedGothraName, lang);
    const nativeVeda = translate(selectedVeda, lang);
    const nativeSuthra = translate(selectedSuthra, lang);
    const nativeRishis = rishis.map(r => translate(r, lang)).join(', ');
    const displayName = lang === 'English' ? name : (nativeName || name);
    return `${script.Abhivadhaye} ${nativeRishis} ${pravaraText} ${script.Pravaranvitha} ${nativeGothra} ${script.Gothraha} ${nativeSuthra} ${script.Suthraha} ${nativeVeda} ${script.Shaaka}${script.Adhyayai} ${script.Sri} ${displayName} ${script.Sarma} ${script.Naam}${script.Aham} ${script.Asmiboho}`;
  };

  const generateTranslation = () => {
    if (!selectedGothraData) return '';
    const rishis = [selectedGothraData.Rishi1, selectedGothraData.Rishi2, selectedGothraData.Rishi3].filter(Boolean) as string[];
    return `\n1. Abhivadaye - I offer my salutations.\n2. ${selectedGothraName} gotrah - I belong to the ${selectedGothraName} gotra.\n3. ${rishis.join(', ')} pravaranvita - the Rishis who founded the ${selectedGothraName} gotra.\n4. ${selectedSuthra} sutrah - I follow the ${selectedSuthra} sutra.\n5. ${selectedVeda} shakhadhyayi - I study the ${selectedVeda} Veda.\n6. Sri ${name} Sharmahamasmi - I am Sri ${name} Sharma.\n7. Bhoh - a term of deep respect, like "Sir".`.trim();
  };

  const getSaptarishiInfo = () => {
    if (!selectedGothraData) return null;
    const gothra = selectedGothraName.toLowerCase();
    const rishis = [
      selectedGothraData.Rishi1,
      selectedGothraData.Rishi2,
      selectedGothraData.Rishi3,
    ].map(r => r?.toLowerCase() || '');
    const mapping = [
      { name: 'Vasishtha', url: 'https://vamsha.co.in/rishivamsha/vasishtha', triggers: ['vashista', 'koundinya', 'paraasara', 'upamanyu', 'kapinjala', 'kundina'] },
      { name: 'Vishwamitra', url: 'https://vamsha.co.in/rishivamsha/vishwamitra', triggers: ['koushika', 'viswamitra', 'kalabodhana', 'chikitasa', 'daivaratasa', 'devaraata', 'aghamarshana'] },
      { name: 'Bharadvaja', url: 'https://vamsha.co.in/rishivamsha/bharadvaja', triggers: ['bharadwaja', 'garga', 'gargyasa', 'kapi', 'kapila', 'kanva', 'angirasa', 'bhaarhaspatya'] },
      { name: 'Kashyapa', url: 'https://vamsha.co.in/rishivamsha/kashyapa', triggers: ['kashyapa', 'kasyapa', 'sandilya', 'naitruva', 'naitruvakaasyapa', 'asitha', 'daivala'] },
      { name: 'Atri', url: 'https://vamsha.co.in/rishivamsha/atri', triggers: ['atreya', 'atri', 'krishnatreya', 'gavisthira', 'vadhbhutaka', 'archanaasa', 'syaavaasva'] },
      { name: 'Gautama', url: 'https://vamsha.co.in/rishivamsha/gautama', triggers: ['gautama', 'gautamasa', 'ayasya', 'aayasyasa', 'sharadvan'] },
      { name: 'Jamadagni', url: 'https://vamsha.co.in/rishivamsha/jamadagni', triggers: ['jamadagni', 'bhrigu', 'bhargava', 'vatsa', 'srivatsa', 'bidasa', 'maitreya', 'chyavana', 'apnuvat', 'aurava'] },
    ];
    return mapping.find(m =>
      m.triggers.some(t => gothra.includes(t)) ||
      m.triggers.some(t => rishis.some(r => r.includes(t)))
    ) || { name: 'Saptarishi', url: 'https://vamsha.co.in' };
  };

  const RISHI_LORE: Record<string, string> = {
    'Vasishtha': 'Sage Vasishtha is the mind-born son of Brahma and keeper of Nandini, the divine cow of plenty. He is revered as the seer of the 7th Mandala of the Rig Veda.',
    'Vishwamitra': 'Born a powerful king (Kaushika), Vishwamitra attained the title of Brahmarishi through intense penance. He is the seer of the sacred Gayatri Mantra.',
    'Bharadvaja': 'A master of both spiritual and worldly sciences, Sage Bharadvaja is credited with the Yantra Sarvasva, an ancient text on mechanics and aeronautics.',
    'Kashyapa': 'Known as a father of all living beings, Sage Kashyapa’s lineage includes devas, asuras and every creature — a symbol of the unity of all life.',
    'Atri': 'Sage Atri is one of the Saptarishis whose penance was so great that he and his wife Anasuya were chosen as parents by the Trimurti (Dattatreya).',
    'Gautama': 'Sage Gautama is the author of the Nyaya Sutras, the foundation of logic in Indian philosophy, and the one who brought the river Godavari to earth.',
    'Jamadagni': 'Known for his mastery over both weapons and scriptures, Sage Jamadagni is the father of Parashurama — the perfect union of wisdom and valour.',
  };

  const saptarishi = getSaptarishiInfo();
  const rishiLore = saptarishi ? RISHI_LORE[saptarishi.name] : null;

  // Words for karaoke highlighting
  const words = useMemo(
    () => (isGenerated ? getGeneratedText(activeLang).split(/\s+/).filter(Boolean) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isGenerated, activeLang, selectedGothraData, name, nativeName, selectedVeda, selectedSuthra]
  );

  // Honest, data-derived stats (no fabricated counters)
  const gothraCount = uniqueGothraNames.length;
  const lineageCount = abhivadhayeData.length;

  // ---- Recite (native browser voice) ----
  const pickVoice = (code: string): SpeechSynthesisVoice | null => {
    if (!ttsSupported) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    const exact = voices.find(v => v.lang && v.lang.toLowerCase() === code.toLowerCase());
    if (exact) return exact;
    const base = code.split('-')[0].toLowerCase();
    return voices.find(v => v.lang && v.lang.toLowerCase().startsWith(base)) || null;
  };

  const speakFrom = (start: number) => {
    if (!ttsSupported || !words.length) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const code = LANG_META[activeLang].code;
    const voice = pickVoice(code);
    speechFlag.current.cancelled = false;
    setIsSpeaking(true);
    setIsPaused(false);
    const speakIdx = (i: number) => {
      if (speechFlag.current.cancelled) return;
      if (i >= words.length) {
        setIsSpeaking(false);
        setActiveWordIndex(-1);
        return;
      }
      setActiveWordIndex(i);
      const u = new SpeechSynthesisUtterance(words[i]);
      u.lang = code;
      if (voice) u.voice = voice;
      u.rate = rate;
      u.pitch = 1;
      u.onend = () => { if (!speechFlag.current.cancelled) speakIdx(i + 1); };
      u.onerror = () => { if (!speechFlag.current.cancelled) speakIdx(i + 1); };
      synth.speak(u);
    };
    speakIdx(start);
  };

  const handlePlayPause = () => {
    if (!ttsSupported) return;
    const synth = window.speechSynthesis;
    if (!isSpeaking) {
      speakFrom(0);
    } else if (isPaused) {
      synth.resume();
      setIsPaused(false);
    } else {
      synth.pause();
      setIsPaused(true);
    }
  };

  const handleRestart = () => {
    stopSpeech();
    setTimeout(() => speakFrom(0), 60);
  };

  const changeRate = (r: number) => {
    setRate(r);
    if (isSpeaking) {
      const resumeAt = Math.max(activeWordIndex, 0);
      stopSpeech();
      setTimeout(() => speakFrom(resumeAt), 60);
    }
  };

  // ---- Vāgdhenu AI chant (beta) ----
  const runChant = async () => {
    setChantState('loading');
    setChantUrl('');
    const text = getGeneratedText('Hindi'); // Devanagari gives the model the cleanest input
    try {
      const post = await fetch(`${VAG_BASE}/gradio_api/call/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [text, '__auto__', 60] }),
      });
      if (!post.ok) throw new Error('post_failed');
      const { event_id } = await post.json();
      if (!event_id) throw new Error('no_event');
      const res = await fetch(`${VAG_BASE}/gradio_api/call/synthesize/${event_id}`);
      if (!res.ok || !res.body) throw new Error('stream_failed');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let audioUrl = '';
      const started = Date.now();
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split('\n\n');
        buffer = chunks.pop() || '';
        for (const chunk of chunks) {
          const lines = chunk.split('\n');
          const ev = lines.find(l => l.startsWith('event:'))?.slice(6).trim();
          const dataRaw = lines.find(l => l.startsWith('data:'))?.slice(5).trim();
          if (ev === 'complete' && dataRaw) {
            try {
              const arr = JSON.parse(dataRaw);
              const a = arr && arr[0];
              audioUrl = (a && a.url) ? a.url : (a && a.path ? `${VAG_BASE}/gradio_api/file=${a.path}` : '');
            } catch { /* ignore */ }
          } else if (ev === 'error') {
            throw new Error('space_error');
          }
        }
        if (audioUrl) break;
        if (Date.now() - started > 120000) throw new Error('timeout');
      }
      if (!audioUrl) throw new Error('no_audio');
      setChantUrl(audioUrl);
      setChantState('ready');
    } catch (e) {
      console.error('Vāgdhenu chant failed:', e);
      setChantState('error');
    }
  };

  const openVagdhenu = () => {
    try { navigator.clipboard?.writeText(getGeneratedText('Hindi')); } catch { /* ignore */ }
    window.open(VAG_BASE, '_blank', 'noopener,noreferrer');
  };

  const langClass = LANG_META[activeLang].cls;
  const isNative = activeLang !== 'English';

  return (
    <div className="app-container">
      {/* ===================== HERO ===================== */}
      <header className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="hero-eyebrow"><FaOm /> The Vedic salutation of lineage</span>
            <h1 className="hero-title">Abhivadhaye</h1>
            <p className="hero-sub-native lang-hi">अभिवादये</p>
            <p className="hero-lede">
              Reciting your Abhivadhaye is how you introduce yourself to your elders and to the divine —
              naming the Rishis, Gothra, Suthra and Veda of your family line. Generate yours accurately,
              in four scripts, and <strong>learn to recite it aloud</strong>.
            </p>
            <div className="hero-cta-row">
              <button className="btn btn-primary" onClick={() => scrollTo('generator')}>
                <FaFeather /> Create my Abhivadhaye
              </button>
              <button className="btn btn-ghost" onClick={() => scrollTo('guide')}>
                <FaPrayingHands /> How it works
              </button>
            </div>
            <div className="hero-badges">
              <div className="hero-badge"><b>{gothraCount}+</b><span>Gothras mapped</span></div>
              <div className="hero-badge"><b>4</b><span>Scripts &amp; voice</span></div>
              <div className="hero-badge"><b>{lineageCount}</b><span>Rishi lineages</span></div>
            </div>
          </div>
          <div className="hero-art-wrap">
            <div className="hero-glow" />
            <img className="hero-art" src="/img/hero-blessing.jpg" alt="A child offering Abhivadanam and receiving the blessings of elders" loading="eager" />
          </div>
        </div>
      </header>

      <div className="wrap">
        {/* ===================== INTRO CARDS ===================== */}
        <div className="intro-grid">
          <div className="intro-card">
            <div className="ic-icon"><FaOm /></div>
            <h3>A Sacred Introduction</h3>
            <p>More than a name, the Abhivadhaye declares the Sages, Gothra and Veda you descend from — a living thread to thousands of years of ancestry.</p>
          </div>
          <div className="intro-card">
            <div className="ic-icon"><FaHistory /></div>
            <h3>Why it Matters</h3>
            <p>Offered when greeting elders and during rituals, it earns their blessings, preserves your family lineage, and grounds you in who you are.</p>
          </div>
          <div className="intro-card">
            <div className="ic-icon"><FaLanguage /></div>
            <h3>In Your Script</h3>
            <p>See and hear your Abhivadhaye in English, Devanagari, Tamil and Telugu — then practise it aloud, word by word, until it is yours.</p>
          </div>
        </div>

        {/* ===================== GENERATOR ===================== */}
        <section id="generator" className="section">
          <div className="section-kicker">Your Salutation</div>
          <h2 className="section-title">Generate your <span>Abhivadhaye</span></h2>
          <div className="divider-om"><FaOm /></div>

          <div className="gen-layout">
            <div className="generator">
              <div className="gen-head">
                <h2>Build it in three steps</h2>
                <p>Choose your details below. Not sure? Use “Help me find my lineage”.</p>
                <div className="stepper">
                  <div className="step"><span className="step-num">1</span> Gothra</div>
                  <div className="step-line" />
                  <div className="step"><span className="step-num">2</span> Confirm Rishis</div>
                  <div className="step-line" />
                  <div className="step"><span className="step-num">3</span> Recite</div>
                </div>
              </div>

              <div className="gen-body">
                <div className="tabs">
                  <button className={`tab ${activeTab === 'expert' ? 'active' : ''}`} onClick={() => setActiveTab('expert')}>I know my details</button>
                  <button className={`tab ${activeTab === 'guided' ? 'active' : ''}`} onClick={() => setActiveTab('guided')}>Help me find my lineage</button>
                </div>

                {guidedNotice && (
                  <div className="notice animate-fade-in">
                    <span>{guidedNotice}</span>
                    <button onClick={() => setGuidedNotice('')}>×</button>
                  </div>
                )}

                {activeTab === 'expert' ? (
                  <div className="animate-fade-in">
                    <div className="field">
                      <label><FaInfoCircle /> Select your Gothra</label>
                      <Select
                        value={selectedGothraName ? { value: selectedGothraName, label: selectedGothraName } : null}
                        options={uniqueGothraNames.map((g) => ({ value: g, label: g }))}
                        onChange={(opt) => {
                          const val = (opt as SelectOption)?.value || '';
                          setSelectedGothraName(val);
                          setSelectedVariationIndex(0);
                          resetOnEdit();
                          setGuidedNotice('');
                        }}
                        placeholder="Search your Gothra..."
                        classNamePrefix="rs"
                      />
                    </div>

                    {availableVariations.length > 1 && (
                      <div className="variation-panel">
                        <p className="panel-label"><FaInfoCircle /> Choose your family’s Rishi combination:</p>
                        <div className="chips">
                          {availableVariations.map((v: AbhivadhayeRecord, idx: number) => (
                            <div
                              key={idx}
                              className={`chip ${selectedVariationIndex === idx ? 'active' : ''}`}
                              onClick={() => { setSelectedVariationIndex(idx); resetOnEdit(); }}
                            >
                              {[v.Rishi1, v.Rishi2, v.Rishi3].filter(Boolean).join(', ')}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="field-row">
                      <div className="field flex-1">
                        <label>Veda</label>
                        <Select
                          value={selectedVeda ? { value: selectedVeda, label: selectedVeda } : null}
                          options={uniqueVedas.map((v) => ({ value: v, label: v }))}
                          onChange={(opt) => { const val = (opt as SelectOption)?.value || ''; setSelectedVeda(val); resetOnEdit(); }}
                          placeholder="Select Veda"
                          classNamePrefix="rs"
                        />
                      </div>
                      <div className="field flex-1">
                        <label>Suthra</label>
                        <Select
                          value={selectedSuthra ? { value: selectedSuthra, label: selectedSuthra } : null}
                          options={filteredSuthras.map((s) => ({ value: s, label: s }))}
                          onChange={(opt) => { const val = (opt as SelectOption)?.value || ''; setSelectedSuthra(val); resetOnEdit(); }}
                          placeholder="Select Suthra"
                          classNamePrefix="rs"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <div className="field">
                      <label><FaInfoCircle /> Search by Gothra or Rishi name</label>
                      <input
                        type="text"
                        className="text-input"
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
                                <div className="lc-rishis">{[item.Rishi1, item.Rishi2, item.Rishi3].filter(Boolean).join(', ')}</div>
                                <div className="lc-meta">
                                  <span className={isSuggested ? 'suggested-tag' : ''}>{isSuggested ? 'Suggested: ' : ''}{veda || 'Unknown'} Veda</span>
                                  <span>•</span>
                                  <span>{suthra || 'Unknown'} Suthra</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : searchQuery.length >= 2 ? (
                        <p className="no-results">No exact match found. Try a different spelling, or use the “I know my details” tab.</p>
                      ) : (
                        <p className="search-hint">Start typing your Gothra or a Rishi’s name to see matches…</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="field">
                  <label>Your Name (English)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); resetOnEdit(); }}
                    placeholder="e.g. Rama"
                    className="text-input"
                  />
                </div>

                {activeLang !== 'English' && (
                  <div className="field animate-fade-in">
                    <label>Your Name in {LANG_META[activeLang].label}</label>
                    <input
                      type="text"
                      value={nativeName}
                      onChange={(e) => setNativeName(e.target.value)}
                      placeholder={activeLang === 'Hindi' ? 'e.g. राम' : activeLang === 'Tamil' ? 'e.g. ராம' : 'e.g. రామ'}
                      className={`text-input native-input ${langClass}`}
                    />
                    <span className="input-hint"><FaLanguage /> Edit if the transliteration needs correcting — this is what will be spoken and shown.</span>
                  </div>
                )}

                <button onClick={handleGenerate} className="btn btn-primary btn-block generate-btn">
                  Reveal my Abhivadhaye <FaFeather />
                </button>
              </div>
            </div>

            {/* Side column */}
            <aside className="side-col">
              <div className="stat-card">
                <h4>What’s inside</h4>
                <div className="stat-row">
                  <div className="stat"><b>{gothraCount}+</b><span>Gothras</span></div>
                  <div className="stat"><b>{lineageCount}</b><span>Lineages</span></div>
                  <div className="stat"><b>4</b><span>Scripts</span></div>
                </div>
              </div>
              <div className="wisdom">
                <h5><FaLightbulb /> Wisdom of the Sages</h5>
                <p key={factIndex} className="animate-fade-in">{VEDIC_FACTS[factIndex]}</p>
              </div>
            </aside>
          </div>
        </section>

        {/* ===================== RESULT ===================== */}
        {isGenerated && (
          <section id="result-section" className="result animate-scale-up">
            <div className="result-head">
              <h3>Your Abhivadhaye</h3>
              <p>Sacred lineage of Sri {name}</p>
            </div>

            <div className="lang-bar">
              {(['English', 'Hindi', 'Tamil', 'Telugu'] as Language[]).map((l) => (
                <button
                  key={l}
                  className={`lang-btn ${activeLang === l ? 'active' : ''} ${LANG_META[l].cls}`}
                  onClick={() => { setActiveLang(l); stopSpeech(); }}
                >
                  {LANG_META[l].label}
                </button>
              ))}
            </div>

            <div className="result-body">
              {/* Readable mantra with karaoke highlighting */}
              <div className="mantra-display">
                <div className="md-label">Recite this</div>
                <p className={`mantra-text ${isNative ? 'native-font ' + langClass : ''}`}>
                  {words.map((w, i) => (
                    <span
                      key={i}
                      className={`mantra-word ${i === activeWordIndex ? 'active' : (i < activeWordIndex ? 'spoken' : '')}`}
                    >
                      {w}{' '}
                    </span>
                  ))}
                </p>
              </div>

              {/* Recite player */}
              <div className="recite">
                <div className="recite-top">
                  <div className="recite-title"><FaPrayingHands /> Play &amp; recite along</div>
                  <div className="recite-lang-note">
                    {isNative ? `Voice: ${LANG_META[activeLang].label}` : 'Tip: switch to हिन्दी for the clearest chant'}
                  </div>
                </div>

                {ttsSupported ? (
                  <>
                    <div className="recite-controls">
                      <button className="rec-btn rec-play" onClick={handlePlayPause}>
                        {isSpeaking && !isPaused ? <><FaPause /> Pause</> : <><FaPlay /> {isPaused ? 'Resume' : 'Play'}</>}
                      </button>
                      <button className="rec-btn rec-icon" onClick={handleRestart} title="Start again" disabled={!words.length}><FaUndo /></button>
                      <div className="speed-group" role="group" aria-label="Speed">
                        {[0.7, 0.8, 1].map((r) => (
                          <button key={r} className={`speed-btn ${rate === r ? 'active' : ''}`} onClick={() => changeRate(r)}>
                            {r === 1 ? '1×' : r === 0.8 ? '0.8×' : '0.7×'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="recite-status">
                      {isSpeaking && !isPaused && <><FaSpinner className="spin" /> Reciting… follow the highlighted words</>}
                      {isPaused && 'Paused'}
                    </div>
                  </>
                ) : (
                  <p className="recite-unavailable">Your browser doesn’t support voice playback. Use the AI Chant below, or read the highlighted mantra above.</p>
                )}

                {/* AI Chant (beta) — Vāgdhenu */}
                <div className="chant-beta">
                  <div className="chant-row">
                    <button className="chant-btn" onClick={runChant} disabled={chantState === 'loading'}>
                      {chantState === 'loading' ? <><FaSpinner className="spin" /> Composing chant…</> : <><FaMusic /> AI Chant</>}
                      <span className="beta-tag">BETA</span>
                    </button>
                    {chantState === 'error' && (
                      <button className="chant-btn" onClick={openVagdhenu}><FaExternalLinkAlt /> Open Vāgdhenu</button>
                    )}
                  </div>

                  {chantState === 'loading' && (
                    <p className="chant-note">Warming up the chant model — this can take 10–60 seconds on the first run. Please keep this tab open.</p>
                  )}
                  {chantState === 'ready' && chantUrl && (
                    <audio className="chant-audio" src={chantUrl} controls autoPlay />
                  )}
                  {chantState === 'error' && (
                    <p className="chant-note">The live chant model is busy or unreachable right now. You can try again, or open the Vāgdhenu demo (your Sanskrit text has been copied — just paste and generate).</p>
                  )}
                  <p className="chant-note">
                    <FaMagic /> AI Chant sings the Sanskrit using <a href="https://prathosh.in/vagdhenu/" target="_blank" rel="noopener noreferrer">Vāgdhenu</a>, a Sanskrit chant model by Dr. Prathosh A.P. It is experimental and works best on metered verse, so results for a spoken lineage declaration may vary.
                  </p>
                </div>
              </div>

              {/* Share card (image export) */}
              <div className="live-card-container">
                <div className="live-card-preview" ref={cardContainerRef}>
                  <div className="live-card-scaler" style={{ transform: `scale(${scale})` }}>
                    <div className="share-card" id="live-share-card">
                      <div className="sc-border">
                        <div className="sc-header">
                          <div className="sc-logo-box"><FaOm /></div>
                          <div className="sc-title">ABHIVADHAYE</div>
                          <div className="sc-divider" />
                        </div>
                        <div className="sc-content">
                          <div className="sc-mantra-box">
                            <p className={`sc-mantra ${isNative ? 'native-font' : ''}`}>{getGeneratedText(activeLang)}</p>
                          </div>
                          <div className="sc-identity">
                            <div className="sc-label">Sacred Lineage of</div>
                            <div className="sc-name">Sri {name}</div>
                            <div className="sc-gothra-tag">{selectedGothraName} Gothra</div>
                          </div>
                        </div>
                        <div className="sc-footer">
                          <p>Create yours at <strong>abhivadhaye.in</strong></p>
                          <p className="sc-tagline">Honour your roots • Preserve Vedic wisdom</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="action-row">
                  <button onClick={() => { navigator.clipboard.writeText(getGeneratedText(activeLang)); alert('Copied to clipboard!'); }} className="action-btn copy"><FaCopy /> Copy text</button>
                  <button onClick={handleDownloadImage} className="action-btn dl"><FaDownload /> Save image</button>
                  <button onClick={handleShareImage} className="action-btn wa"><FaWhatsapp /> WhatsApp</button>
                  <button onClick={handleShareImage} className="action-btn insta"><FaInstagram /> Instagram</button>
                </div>
              </div>

              {/* Meaning */}
              <div className="meaning">
                <h4>Meaning &amp; Significance</h4>
                <p className="meaning-sub">Every phrase you recite, line by line</p>
                <div className="meaning-grid">
                  {generateTranslation().split('\n').map((line, index) => {
                    const parts = line.split(' - ');
                    if (parts.length === 2) {
                      const [phrasePart, descriptionPart] = parts;
                      const phraseParts = phrasePart.split('. ');
                      if (phraseParts.length === 2) {
                        return (
                          <div key={index} className="meaning-item">
                            <div className="mi-index">{phraseParts[0]}</div>
                            <div className="mi-phrase">{phraseParts[1]}</div>
                            <div className="mi-desc">{descriptionPart}</div>
                          </div>
                        );
                      }
                    }
                    return null;
                  })}
                </div>
              </div>

              {/* Vamsha bridge */}
              {saptarishi && (
                <div className="vamsha animate-fade-in">
                  <div className="vb-visual">
                    <div className="vb-node saptarishi-node"><FaOm /><span>{saptarishi.name}</span></div>
                    <div className="vb-connector" />
                    <div className="vb-node gothra-node"><FaUserCheck /><span>{selectedGothraName}</span></div>
                  </div>
                  <h3>Discover your sacred roots</h3>
                  <p>The names you just recited are your living legacy. Your <strong>{selectedGothraName}</strong> lineage is a branch of the <strong>{saptarishi.name}</strong> family tree.</p>
                  {rishiLore && (
                    <div className="lore"><FaLightbulb /><span><strong>Sage {saptarishi.name}:</strong> {rishiLore}</span></div>
                  )}
                  <div className="vb-link">
                    <a href={saptarishi.url} target="_blank" rel="noopener noreferrer"><FaScroll /> Explore the {saptarishi.name} Vamsha tree</a>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* ===================== NAMASKARAM GUIDE ===================== */}
      <section id="guide" className="section guide">
        <div className="wrap">
          <div className="section-kicker">The Ritual</div>
          <h2 className="section-title">How to offer <span>Abhivadanam</span></h2>
          <div className="divider-om"><FaHandsHelping /></div>
          <div className="guide-inner">
            <div className="guide-art">
              <img src="/img/namaskaram.jpg" alt="A young boy in the traditional posture of Abhivadanam" loading="lazy" />
            </div>
            <div className="guide-steps">
              <div className="guide-step">
                <div className="gs-num">1</div>
                <div><h4>Stand with focus</h4><p>Face the elder or the sanctum, calm and attentive. Cross your arms so the right hand can reach the right ear and the left the left ear.</p></div>
              </div>
              <div className="guide-step">
                <div className="gs-num">2</div>
                <div><h4>Touch your ears &amp; recite</h4><p>Holding the ear-lobes, recite your Abhivadhaye clearly — naming your Rishis, Gothra, Suthra, Veda and your name, ending with “Bhoh”.</p></div>
              </div>
              <div className="guide-step">
                <div className="gs-num">3</div>
                <div><h4>Bow and offer namaskaram</h4><p>Bend forward and touch the elder’s feet with crossed hands (right to right, left to left) to receive their blessings.</p></div>
              </div>
              <div className="guide-step">
                <div className="gs-num">4</div>
                <div><h4>Receive the blessing</h4><p>The elder rests a hand on your head and blesses you — “Ayushman bhava”, “Chiranjeevi bhava” — completing the exchange.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="section">
        <div className="wrap">
          <div className="section-kicker">Good to know</div>
          <h2 className="section-title">Decoding the <span>ritual</span></h2>
          <div className="divider-om"><FaOm /></div>
          <div className="faq-grid">
            {FAQ_DATA.map((item, idx) => (
              <div key={idx} className={`faq-item ${activeFaq === idx ? 'active' : ''}`}>
                <div className="faq-q" onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                  {item.question}
                  <span className="faq-icon">{activeFaq === idx ? '−' : '+'}</span>
                </div>
                {activeFaq === idx && <div className="faq-a animate-fade-in">{item.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEEDBACK ===================== */}
      <section className="section-tight">
        <div className="wrap">
          <form className="feedback" name="feedback" onSubmit={handleSubmitFeedback} data-netlify="true" data-netlify-honeypot="bot-field">
            <input type="hidden" name="form-name" value="feedback" />
            <p style={{ display: 'none' }}>
              <label>Don’t fill this out if you’re human: <input name="bot-field" /></label>
            </p>
            <h3>Help us stay accurate</h3>
            <p className="fb-sub">Found a Gothra, Rishi or spelling that needs fixing? Tell us — real families keep this correct.</p>
            <textarea name="message" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Your suggestion, correction or note…" required />
            <button type="submit" className="btn btn-primary btn-block">Send feedback</button>
          </form>
        </div>
      </section>

      <AdComponent adSlot="1234567890" />
      <Footer />
    </div>
  );
};

export default App;
