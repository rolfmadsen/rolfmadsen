import React from "react";

const Footer = () => (
  <footer className="bg-gray-800 text-white py-6 mt-10">
    <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
      <div className="text-center sm:text-left text-teal-500 mb-4 sm:mb-0">
        <p className="text-sm">© Rolf Madsen 2023</p>
      </div>
      <div className="space-x-4">
        <a href="https://dk.linkedin.com/in/rolfmadsen/" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-500 transition-colors duration-300">
          LinkedIn
        </a>
        <a href="https://github.com/rolfmadsen/rolfmadsen/" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-500 transition-colors duration-300">
          GitHub
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;