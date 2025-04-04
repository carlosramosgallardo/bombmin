'use client';

import { useEffect, useState } from 'react';

export default function TheoryPage() {
  const [phrases, setPhrases] = useState([]);

  useEffect(() => {
    fetch('/math_phrases.json')
      .then((res) => res.json())
      .then((data) => setPhrases(data))
      .catch((err) => console.error('Error fetching JSON:', err));
  }, []);

  return (
    <main className="flex flex-col items-center w-full px-4 pt-10 pb-20 text-sm font-mono text-gray-200 bg-black">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6">Theory</h1>
        
        <section className="mb-6">
          <p>
            Sources: Wikipedia: <a href="https://en.wikipedia.org/wiki/List_of_mathematical_theories" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">https://en.wikipedia.org/wiki/List_of_mathematical_theories</a>
          </p>
          <p>
            Please, report if you identify any inaccuracies or discrepancies.
          </p>
        </section>

        <section className="mb-6">
  {phrases.map((item, index) => {
    // Replace the blank with the answer to display the complete phrase.
    const fullPhrase = item.masked.replace('_____', item.answer);
    return (
      <div key={index} className="mb-8">
        <p className="mb-2">{fullPhrase}</p>
        {item.image && (
          <img
            src={item.image}
            alt={`Image for phrase ${index + 1}`}
            className="w-full"
          />
        )}
      </div>
    );
  })}
</section>

      </div>
    </main>
  );
}
