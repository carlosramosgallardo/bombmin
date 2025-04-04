'use client';

import { useEffect, useState } from 'react';

export default function TheoryPage() {
  const [phrases, setPhrases] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/math_phrases.json')
      .then((res) => res.json())
      .then((data) => setPhrases(data))
      .catch((err) => console.error('Error fetching JSON:', err));
  }, []);

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % phrases.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + phrases.length) % phrases.length);
  };

  if (phrases.length === 0) {
    return (
      <main className="flex flex-col items-center justify-center h-screen text-sm font-mono text-gray-200 bg-black">
        <p>Loading...</p>
      </main>
    );
  }

  const currentPhrase = phrases[currentIndex];
  const fullPhrase = currentPhrase.masked.replace('_____', currentPhrase.answer);

  return (
    <main className="flex flex-col items-center w-full px-4 pt-10 pb-20 text-sm font-mono text-gray-200 bg-black">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6">Theory</h1>

        <section className="mb-6">
          <p>
            Sources: Wikipedia:{' '}
            <a
              href="https://en.wikipedia.org/wiki/List_of_mathematical_theories"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              https://en.wikipedia.org/wiki/List_of_mathematical_theories
            </a>
          </p>
          <p>Please, report if you identify any inaccuracies or discrepancies.</p>
        </section>

        <section className="mb-6 flex flex-col items-center">
          <p className="mb-4 text-center">{fullPhrase}</p>
          {currentPhrase.image && (
            <img
              src={currentPhrase.image}
              alt={`Image for phrase ${currentIndex + 1}`}
              className="max-w-full h-auto"
            />
          )}
        </section>

        <section className="flex justify-between">
          <button
            onClick={goPrev}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Previous
          </button>
          <button
            onClick={goNext}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Next
          </button>
        </section>
      </div>
    </main>
  );
}
