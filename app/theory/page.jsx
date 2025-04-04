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
            In this section, we present mathematical phrases that challenge your understanding of geometry and calculus. Try to guess the answer on your own before consulting any external resources.
          </p>
        </section>

        <section className="mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-700 p-2">Mathematical Phrase</th>
                <th className="border border-gray-700 p-2">Your Answer</th>
              </tr>
            </thead>
            <tbody>
              {phrases.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-700 p-2">{item.masked}</td>
                  <td className="border border-gray-700 p-2"></td>
                </tr>
              ))}
            </tbody>
          </table>
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
