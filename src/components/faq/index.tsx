import React, { useState } from 'react';

type FaqItem = { id: string; question: string; answer: React.ReactNode };

type Props = {
  language: 'es' | 'en';
  items?: FaqItem[];
};

const Faq: React.FC<Props> = ({ language, items }) => {
  const defaults: FaqItem[] = language === 'es'
    ? [
        { id: 'q1', question: '¿Cómo debo tomar este producto?', answer: 'Sigue las indicaciones del envase. En caso de duda, consulta con un profesional de la salud.' },
        { id: 'q2', question: '¿Puedo combinarlo con otros suplementos?', answer: 'Sí, suele ser compatible. Ajusta dosis y evita superar la ingesta diaria recomendada.' },
        { id: 'q3', question: '¿Es apto para veganos?', answer: 'Revisa la etiqueta y los ingredientes del producto específico.' },
        { id: 'q4', question: '¿Cuánto tiempo tarda en hacer efecto?', answer: 'Depende del producto y la constancia. Normalmente se nota tras varios días o semanas de uso.' },
      ]
    : [
        { id: 'q1', question: 'How should I take this product?', answer: 'Follow the label instructions. If unsure, consult a health professional.' },
        { id: 'q2', question: 'Can I combine it with other supplements?', answer: 'Yes, generally compatible. Adjust dosage and avoid exceeding daily intake.' },
        { id: 'q3', question: 'Is it suitable for vegans?', answer: 'Check the label and the specific product ingredients.' },
        { id: 'q4', question: 'How long until I notice effects?', answer: 'It depends on the product and consistency. Usually days or weeks of use.' },
      ];

  const data = items && items.length > 0 ? items : defaults;
  const [openId, setOpenId] = useState<string | undefined>(data[0]?.id);

  return (
    <div className="divide-y divide-gray-800 rounded-xl border border-gray-800 bg-gray-900/60 overflow-hidden">
      {data.map(({ id, question, answer }) => {
        const isOpen = openId === id;
        return (
          <div key={id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? undefined : id)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between px-4 md:px-6 py-4 bg-gray-900/60 hover:bg-gray-900 text-left"
            >
              <span className="text-base md:text-lg font-semibold text-white">{question}</span>
              <svg
                className={`w-5 h-5 text-gray-300 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            {isOpen && (
              <div className="px-4 md:px-6 pb-5 text-gray-300 text-sm md:text-base leading-relaxed">
                {answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Faq;