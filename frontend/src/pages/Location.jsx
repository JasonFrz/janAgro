import React from 'react';

const Location = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-20 pb-6 px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800 text-center">Our Location</h1>
      <p className="text-base sm:text-lg text-gray-600 mb-6 text-center">Pondok Chandra Indah, Surabaya, Indonesia</p>
      
      <div className="w-full max-w-3xl h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden shadow-lg bg-white">
        <iframe
          title="Pondok Chandra Indah, Surabaya"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.707892340273!2d112.7405217746105!3d-7.253716794774775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fb17a00a0fb1%3A0x5e8f91b8b6eec6b5!2sPondok%20Chandra%20Indah%2C%20Surabaya%2C%20Indonesia!5e0!3m2!1sen!2sid!4v1705785000000!5m2!1sen!2sid"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Location;