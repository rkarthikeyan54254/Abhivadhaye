import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from 'react';
import { abhivadhayeData } from './data';
import Footer from './components/Footer';
import AdComponent from './components/AdComponent';
import { FaFeather } from 'react-icons/fa';
import Select from 'react-select';
import emailjs from '@emailjs/browser';
const App = () => {
    const [selectedGothra, setSelectedGothra] = useState('');
    const [selectedVeda, setSelectedVeda] = useState('');
    const [selectedSuthra, setSelectedSuthra] = useState('');
    const [name, setName] = useState('');
    const [generatedTextEnglish, setGeneratedTextEnglish] = useState('');
    const [generatedTextDevanagari, setGeneratedTextDevanagari] = useState('');
    const [translationText, setTranslationText] = useState('');
    const [feedback, setFeedback] = useState('');
    const [pageVisits, setPageVisits] = useState(0);
    const uniqueGothras = useMemo(() => [...new Set(abhivadhayeData.map((item) => item.Gothra))], []);
    const uniqueVedas = useMemo(() => [
        ...new Set(abhivadhayeData.map((item) => item.Veda).filter(Boolean)),
    ], []);
    const filteredSuthras = useMemo(() => {
        if (!selectedVeda)
            return [];
        return [
            ...new Set(abhivadhayeData
                .filter((item) => item.Veda === selectedVeda)
                .map((item) => item.Suthra)
                .filter(Boolean)),
        ];
    }, [selectedVeda]);
    const selectedGothraData = useMemo(() => {
        return abhivadhayeData.find((item) => item.Gothra === selectedGothra);
    }, [selectedGothra]);
    const handleGenerate = () => {
        if (selectedGothraData) {
            const englishText = `Abhivadhaye ${selectedGothraData.Rishi1} ${selectedGothraData.Rishi2} ${selectedGothraData.Rishi3} Thraya Rusheya Pravaranvitha ${selectedGothraData.Gothra} Gothraha ${selectedSuthra} Suthraha ${selectedVeda} Shaaka Adhyayai ${name} Sarma Naam Aham Asmiboho`;
            const devanagariText = `अभिवादये ${selectedGothraData.Rishi1} ${selectedGothraData.Rishi2} ${selectedGothraData.Rishi3} त्रय ऋषेय प्रवरान्विता ${selectedGothraData.Gothra} गोत्रः ${selectedSuthra} सूत्रः ${selectedVeda} शाखाध्यायी ${name} शर्मा नामाहम् अस्मि भोः`;
            setGeneratedTextEnglish(englishText);
            setGeneratedTextDevanagari(devanagariText);
            setTranslationText(generateTranslation());
        }
    };
    const generateTranslation = () => {
        return `
    \n1. Abhivadaye - I am saluting you.

    \n2. ${selectedGothraData === null || selectedGothraData === void 0 ? void 0 : selectedGothraData.Gothra} gotrah - I belong to the ${selectedGothraData === null || selectedGothraData === void 0 ? void 0 : selectedGothraData.Gothra} gotra.

    \n3.${selectedGothraData === null || selectedGothraData === void 0 ? void 0 : selectedGothraData.Rishi1} ${selectedGothraData === null || selectedGothraData === void 0 ? void 0 : selectedGothraData.Rishi2} ${selectedGothraData === null || selectedGothraData === void 0 ? void 0 : selectedGothraData.Rishi3} trayarsheya pravaranvita - Names of the three Rishis who started ${selectedGothraData === null || selectedGothraData === void 0 ? void 0 : selectedGothraData.Gothra} gotra.

This is called the pravara of the gotra.

\n4.${selectedSuthra} sutrah - the ${selectedSuthra} sutra which I follow.

\n5.${selectedVeda} shakhadhyayi - I learn ${selectedVeda} veda

\n6.${name} Sharmahamasmi - I am ${name} Sharma

\n7.Bhoh - similar to Sir in English.
    `.trim();
    };
    const handleSubmitFeedback = () => {
        emailjs
            .send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, { message: feedback }, import.meta.env.VITE_EMAILJS_PUBLIC_KEY)
            .then((result) => {
            console.log(result.text);
            alert('Thank you for your feedback!');
            setFeedback('');
        }, (error) => {
            console.log(error.text);
            alert('Failed to send feedback. Please try again.');
        });
    };
    useEffect(() => {
        // Increment page visits (this is a mock implementation)
        setPageVisits((prevVisits) => prevVisits + 1);
    }, []);
    return (_jsxs("div", { className: "app-container", children: [_jsxs("div", { className: "hero-image-container", children: [_jsx("img", { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Designer%20(1)-l6N1Uo1AeLib60qp2qZ2Q5c6EDBbzs.jpeg", alt: "Hero", className: "hero-image" }), _jsx("h1", { className: "title", children: "Abhivadhaye Generator" })] }), _jsxs("div", { className: "content", children: [_jsx("div", { className: "description-box", children: _jsx("p", { children: "Experience the sacred tradition of Abhivadhaye, a Vedic ritual where individuals declare their ancestral lineage, including gotra and revered sage. Honor your spiritual heritage with this unique online generator." }) }), _jsxs("div", { className: "main-content", children: [_jsxs("div", { className: "form-container", children: [_jsx("label", { htmlFor: "gothra-select", children: "Gothra" }), _jsx(Select, { id: "gothra-select", options: uniqueGothras.map((gothra) => ({
                                            value: gothra,
                                            label: gothra,
                                        })), onChange: (option) => setSelectedGothra((option === null || option === void 0 ? void 0 : option.value) || ''), placeholder: "Select your Gothra", className: "react-select-container", classNamePrefix: "react-select" }), _jsx("label", { htmlFor: "veda-select", children: "Veda" }), _jsx(Select, { id: "veda-select", options: uniqueVedas.map((veda) => ({
                                            value: veda,
                                            label: veda,
                                        })), onChange: (option) => setSelectedVeda((option === null || option === void 0 ? void 0 : option.value) || ''), placeholder: "Select your Veda", className: "react-select-container", classNamePrefix: "react-select" }), _jsx("label", { htmlFor: "suthra-select", children: "Suthra" }), _jsx(Select, { id: "suthra-select", options: filteredSuthras.map((suthra) => ({
                                            value: suthra,
                                            label: suthra,
                                        })), onChange: (option) => setSelectedSuthra((option === null || option === void 0 ? void 0 : option.value) || ''), placeholder: "Select your Suthra", className: "react-select-container", classNamePrefix: "react-select" }), _jsx("label", { htmlFor: "name-input", children: "Your Name" }), _jsx("input", { id: "name-input", type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "Enter your Name", className: "name-input" }), _jsxs("button", { onClick: handleGenerate, className: "generate-button", children: ["Generate Your Abhivadhaye ", _jsx(FaFeather, {})] })] }), _jsxs("div", { className: "side-content", children: [_jsxs("div", { className: "benefits-box", children: [_jsx("h3", { children: "Benefits of doing abhivadanam" }), _jsxs("ul", { children: [_jsx("li", { children: "Earning the blessings of the person saluted." }), _jsx("li", { children: "Remembering one's own great lineage." }), _jsx("li", { children: "Taking the names of great Sages." })] })] }), _jsx("div", { className: "visit-counter", children: _jsxs("p", { children: [pageVisits, " Abhivadhayes Served!"] }) })] })] }), generatedTextEnglish && (_jsxs("div", { className: "result", children: [_jsx("h2", { children: "Your Abhivadhaye (English)" }), _jsx("p", { children: generatedTextEnglish })] })), generatedTextDevanagari && (_jsxs("div", { className: "result", children: [_jsx("h2", { children: "Your Abhivadhaye (Devanagari)" }), _jsx("p", { className: "devanagari", children: generatedTextDevanagari })] })), translationText && (_jsxs("div", { className: "result", children: [_jsx("h2", { children: "Your Abhivadhaye (Translation)" }), _jsx("p", { children: translationText })] })), _jsxs("div", { className: "feedback-section", children: [_jsx("h2", { children: "Feedback" }), _jsx("textarea", { value: feedback, onChange: (e) => setFeedback(e.target.value), placeholder: "Please share your feedback on the usefulness of this website" }), _jsx("button", { onClick: handleSubmitFeedback, className: "feedback-button", children: "Submit Feedback" })] }), _jsx(AdComponent, { adSlot: "1234567890" })] }), _jsx(Footer, {})] }));
};
export default App;
