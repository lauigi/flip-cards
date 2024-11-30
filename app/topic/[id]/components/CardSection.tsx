'use client';

import { IChapter } from '@/models/Chapter';
import { useState, useEffect } from 'react';

interface CardSectionProps {
  cards: IChapter['cards'];
  chapter: {
    name: string;
    summary: string;
  };
}

export default function CardSection({ cards = [], chapter }: CardSectionProps) {
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const cardList = Array.isArray(cards) ? cards : [];

  const handleCardFlip = (cardId: string) => {
    if (isFlipping) return;
    setIsFlipping(true);
    setFlippedCardId(flippedCardId === cardId ? null : cardId);
  };

  useEffect(() => {
    if (isFlipping) {
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isFlipping]);

  return (
    <div>
      <div className="flex flex-col space-y-2 mb-8">
        <h3 className="text-lg font-medium text-gray-600">{chapter.name}</h3>
        <h2
          className={`font-serif text-[#1A1C1E] ${
            chapter.summary.length > 100 ? 'text-xl' : 'text-2xl'
          } leading-relaxed`}>
          {chapter.summary}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {cardList.map(card => (
          <div
            key={card.id}
            onClick={() => handleCardFlip(card.id)}
            className="relative h-56 w-full max-w-sm mx-auto cursor-pointer"
            style={{ perspective: '1000px' }}>
            <div
              className={`absolute inset-0 w-full h-full transition-transform duration-500 
                         [transform-style:preserve-3d]
                         ${flippedCardId === card.id ? '[transform:rotateY(180deg)]' : ''}`}>
              {/* Front of card */}
              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
                <div
                  className="h-full p-6 bg-white rounded-2xl border border-gray-100 shadow-sm 
                              hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                  <div className="flex flex-col h-full">
                    <h3 className="text-2xl font-serif text-[#1A1C1E] mb-4 leading-relaxed tracking-wide">
                      {card.question}
                    </h3>
                    <div className="mt-auto flex items-center justify-center text-sm text-gray-500">
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M7 8h10M7 12h10m-10 4h10"
                          />
                        </svg>
                        Click to flip
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of card */}
              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div
                  className="h-full p-6 bg-gradient-to-br from-[#f4d03f] to-[#e9bc4f] text-gray-800 rounded-2xl shadow-sm 
                  hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                  <div className="flex flex-col h-full">
                    <p className="text-lg font-medium leading-tight">{card.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
