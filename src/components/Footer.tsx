import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-om">ॐ</div>
        <div className="footer-divider"></div>
        <p>
          Explore your family history and the lives of the ancient Rishis at{' '}
          <a href="https://vamsha.co.in" target="_blank" rel="noopener noreferrer" className="footer-link">
            Vamsha.co.in
          </a>
        </p>
        <p>A bridge between ancient wisdom and modern technology.</p>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Abhivadhaye • Built with devotion for the Vedic community
        </p>
      </div>
    </footer>
  );
};

export default Footer;
