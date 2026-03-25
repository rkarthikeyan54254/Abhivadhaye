import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-divider"></div>
        <p>
          Discover your family history and explore ancient Rishi lineages at{' '}
          <a href="https://vamsha.co.in" target="_blank" rel="noopener noreferrer" className="footer-link">
            Vamsha.co.in
          </a>
        </p>
        <p>A bridge between ancient wisdom and modern technology.</p>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Abhivadhaye Generator • Built with ❤️ for the Vedic Community
        </p>
      </div>
    </footer>
  );
};

export default Footer;