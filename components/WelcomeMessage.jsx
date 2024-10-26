// components/WelcomeMessage.jsx

import React from 'react';

function WelcomeMessage() {
  return (
    <div className="block w-full py-3 px-3 bg-white border-2 border-gray-300 p-6 rounded-md tracking-tight shadow-lg my-10 space-y-4">
      <h2 className="text-3xl font-semi-bold mb-4 text-gray-800">Velkommen til Metadata &amp; Discovery</h2>
      <p className="text-lg font-normal text-gray-700">
        Jeg hedder Rolf Madsen og arbejder som IT-arkitekt ved Københavns Universitet. Denne platform er udviklet som
        en demonstration af mine kompetencer inden for systemintegration og webudvikling.
      </p>
      <p className="text-lg font-normal text-gray-700">
        Platformen er baseret på en Rust-baseret integration til den danske Fælles Biblioteksinfrastruktur (FBI) via et
        GraphQL API, hvilket gør det muligt at fremsøge materialer og bestille dem fra danske biblioteker via{' '}
        <a
          href="https://bibliotek.dk"
          className="font-medium text-teal-600 underline dark:text-teal-500 hover:no-underline"
        >
          Bibliotek.dk
        </a>
        .
      </p>
      <p className="text-lg font-normal text-gray-700">
        Hvis du er interesseret i mit arbejde, er du velkommen til at følge mig på{' '}
        <a
          href="https://www.linkedin.com/in/rolfmadsen/"
          className="font-medium text-teal-600 underline dark:text-teal-500 hover:no-underline"
        >
          LinkedIn
        </a>{' '}
        eller{' '}
        <a
          href="https://github.com/rolfmadsen/"
          className="font-medium text-teal-600 underline dark:text-teal-500 hover:no-underline"
        >
          GitHub
        </a>
        .
      </p>
    </div>
  );
}

export default WelcomeMessage;