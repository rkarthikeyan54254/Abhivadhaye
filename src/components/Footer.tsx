import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Abhivadhaye Generator</p>
        <p>Explore your family tree and Rishi lineages on <a href="https://vamsha.co.in" target="_blank" rel="noopener noreferrer" style={{ color: '#ffd700', fontWeight: 'bold' }}>Vamsha.co.in</a></p>
        <p>Created with ❤️ and AI</p>
      </div>
    </footer>
  );
};

export default Footer;