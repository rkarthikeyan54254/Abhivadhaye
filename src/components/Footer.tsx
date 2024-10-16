import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Abhivadhaye Generator</p>
        <p>Created with ❤️ and AI</p>
      </div>
    </footer>
  );
};

export default Footer;