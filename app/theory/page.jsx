'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TheoryPage() {
  const [phrases, setPhrases] = useState([]);

  useEffect(() => {
    fetch('/math_phrases.json')
      .then((res) => res.json())
      .then((data) => setPhrases(data))
      .catch((err) => console.error('Error al cargar el JSON:', err));
  }, []);

  return (
    <main className="flex flex-col items-center w-full px-4 pt-10 pb-20 text-sm font-mono text-gray-200 bg-black">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6">Theory</h1>
        
        <section className="mb-6">
          <p>
            En esta sección, presentamos algunas frases matemáticas que encapsulan conceptos clave en geometría y cálculo, basadas en fuentes de dominio público como Wikipedia.
          </p>
        </section>

        <section className="mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-700 p-2">Frase enmascarada</th>
                <th className="border border-gray-700 p-2">Respuesta</th>
                <th className="border border-gray-700 p-2">Fuente</th>
              </tr>
            </thead>
            <tbody>
              {phrases.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-700 p-2">{item.masked}</td>
                  <td className="border border-gray-700 p-2">{item.answer}</td>
                  <td className="border border-gray-700 p-2">{item.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="legal text-xs text-gray-500 border-t border-gray-700 pt-4">
          <p>
            La información presentada en esta sección tiene carácter meramente informativo y se extrae de fuentes de dominio público, principalmente Wikipedia.
          </p>
        </section>
      </div>
    </main>
  );
}

