import React, { useState, useMemo, useEffect } from 'react';
import { abhivadhayeData } from './data.js';
import Footer from './components/Footer.js';
import AdComponent from './components/AdComponent.js';
import { FaFeather } from 'react-icons/fa';
import Select from 'react-select';
import emailjs from '@emailjs/browser';
// declare module 'react-icons/*';

const App: React.FC = () => {
  const [selectedGothra, setSelectedGothra] = useState('');
  const [selectedVeda, setSelectedVeda] = useState('');
  const [selectedSuthra, setSelectedSuthra] = useState('');
  const [name, setName] = useState('');
  const [generatedTextEnglish, setGeneratedTextEnglish] = useState('');
  const [generatedTextDevanagari, setGeneratedTextDevanagari] = useState('');
  const [translationText, setTranslationText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [pageVisits, setPageVisits] = useState(0);

  const uniqueGothras = useMemo(
    () => [...new Set(abhivadhayeData.map((item) => item.Gothra))],
    []
  );
  const uniqueVedas = useMemo(
    () => [
      ...new Set(abhivadhayeData.map((item) => item.Veda).filter(Boolean)),
    ],
    []
  );

  const filteredSuthras = useMemo(() => {
    if (!selectedVeda) return [];
    return [
      ...new Set(
        abhivadhayeData
          .filter((item) => item.Veda === selectedVeda)
          .map((item) => item.Suthra)
          .filter(Boolean)
      ),
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

    \n2. ${selectedGothraData?.Gothra} gotrah - I belong to the ${selectedGothraData?.Gothra} gotra.

    \n3.${selectedGothraData?.Rishi1} ${selectedGothraData?.Rishi2} ${selectedGothraData?.Rishi3} trayarsheya pravaranvita - Names of the three Rishis who started ${selectedGothraData?.Gothra} gotra.

This is called the pravara of the gotra.

\n4.${selectedSuthra} sutrah - the ${selectedSuthra} sutra which I follow.

\n5.${selectedVeda} shakhadhyayi - I learn ${selectedVeda} veda

\n6.${name} Sharmahamasmi - I am ${name} Sharma

\n7.Bhoh - similar to Sir in English.
    `.trim();
  };

  const handleSubmitFeedback = () => {
    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { message: feedback },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        (result) => {
          console.log(result.text);
          alert('Thank you for your feedback!');
          setFeedback('');
        },
        (error) => {
          console.log(error.text);
          alert('Failed to send feedback. Please try again.');
        }
      );
  };

  useEffect(() => {
    // Increment page visits (this is a mock implementation)
    setPageVisits((prevVisits) => prevVisits + 1);
  }, []);

  return (
    <div className="app-container">
      <div className="hero-image-container">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Designer%20(1)-l6N1Uo1AeLib60qp2qZ2Q5c6EDBbzs.jpeg"
          alt="Hero"
          className="hero-image"
        />
        <h1 className="title">Abhivadhaye Generator</h1>
      </div>

      <div className="content">
        <div className="description-box">
          <p>
            Experience the sacred tradition of Abhivadhaye, a Vedic ritual where
            individuals declare their ancestral lineage, including gotra and
            revered sage. Honor your spiritual heritage with this unique online
            generator.
          </p>
        </div>

        <div className="main-content">
          <div className="form-container">
            <label htmlFor="gothra-select">Gothra</label>
            <Select
              id="gothra-select"
              options={uniqueGothras.map((gothra) => ({
                value: gothra,
                label: gothra,
              }))}
              onChange={(option) => setSelectedGothra(option?.value || '')}
              placeholder="Select your Gothra"
              className="react-select-container"
              classNamePrefix="react-select"
            />
            <label htmlFor="veda-select">Veda</label>
            <Select
              id="veda-select"
              options={uniqueVedas.map((veda) => ({
                value: veda,
                label: veda,
              }))}
              onChange={(option) => setSelectedVeda(option?.value || '')}
              placeholder="Select your Veda"
              className="react-select-container"
              classNamePrefix="react-select"
            />
            <label htmlFor="suthra-select">Suthra</label>
            <Select
              id="suthra-select"
              options={filteredSuthras.map((suthra) => ({
                value: suthra,
                label: suthra,
              }))}
              onChange={(option) => setSelectedSuthra(option?.value || '')}
              placeholder="Select your Suthra"
              className="react-select-container"
              classNamePrefix="react-select"
            />
            <label htmlFor="name-input">Your Name</label>
            <input
              id="name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your Name"
              className="name-input"
            />
            <button onClick={handleGenerate} className="generate-button">
              Generate Your Abhivadhaye <FaFeather />
            </button>
          </div>

          <div className="side-content">
            <div className="benefits-box">
              <h3>Benefits of doing abhivadanam</h3>
              <ul>
                <li>Earning the blessings of the person saluted.</li>
                <li>Remembering one's own great lineage.</li>
                <li>Taking the names of great Sages.</li>
              </ul>
            </div>

            <div className="visit-counter">
              <p>{pageVisits} Abhivadhayes Served!</p>
            </div>
          </div>
        </div>

        {generatedTextEnglish && (
          <div className="result">
            <h2>Your Abhivadhaye (English)</h2>
            <p>{generatedTextEnglish}</p>
          </div>
        )}
        {generatedTextDevanagari && (
          <div className="result">
            <h2>Your Abhivadhaye (Devanagari)</h2>
            <p className="devanagari">{generatedTextDevanagari}</p>
          </div>
        )}
        {translationText && (
          <div className="result">
            <h2>Your Abhivadhaye (Translation)</h2>
            <p>{translationText}</p>
          </div>
        )}

        <div className="feedback-section">
          <h2>Feedback</h2>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Please share your feedback on the usefulness of this website"
          />
          <button onClick={handleSubmitFeedback} className="feedback-button">
            Submit Feedback
          </button>
        </div>

        <AdComponent adSlot="1234567890" />
      </div>
      <Footer />
    </div>
      
  );

  
};

export default App;