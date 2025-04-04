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
            In this section, we present the complete mathematical phrases with all words visible.
            Enjoy exploring the full context, and feel free to check out the accompanying AI-generated images.
          </p>
        </section>

        <section className="mb-6">
          {phrases.map((item, index) => {
            // Replace the blank with the answer to display the complete phrase.
            const fullPhrase = item.masked.replace('_____', item.answer);
            return (
              <div key={index} className="mb-8">
                <p className="mb-2">{fullPhrase}</p>
                {/* Uncomment and replace the src with your AI-generated image URL when available */}
                {/* <img src="/path/to/generated-image.jpg" alt="AI Generated" className="w-full" /> */}
              </div>
            );
          })}
        </section>

        <section className="legal text-xs text-gray-500 border-t border-gray-700 pt-4">
          <p>
            The content in this section is provided for educational purposes only and is sourced from public domain materials, primarily Wikipedia.
          </p>
        </section>
      </div>
    </main>
  );
}
