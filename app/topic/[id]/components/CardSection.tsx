'use client';

import { IChapter } from '@/models/Chapter';
import { useState, useEffect } from 'react';
import { Star, MoreVertical, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

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
  const [localCards, setLocalCards] = useState(cards);
  const { toast } = useToast();

  useEffect(() => {
    setLocalCards(cards);
  }, [cards]);

  const handleCardFlip = (cardId: string, isMenuClick?: boolean) => {
    if (isMenuClick) return;
    if (isFlipping) return;
    setIsFlipping(true);
    setFlippedCardId(flippedCardId === cardId ? null : cardId);
  };

  const handleRemoveCard = async (cardId: string) => {
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isRemoved: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove card');
      }

      setLocalCards(prevCards => prevCards.map(card => (card.id === cardId ? { ...card, isRemoved: true } : card)));

      toast({
        title: 'Success',
        description: 'Card has been removed',
        variant: 'default',
        className: 'bg-[#F97316] text-white',
      });
    } catch (error) {
      console.error('Error removing card:', error instanceof Error ? error.message : error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to remove card',
        variant: 'destructive',
      });
    }
  };

  const handleRate = async (cardId: string, rate: number) => {
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ rate }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to rate card');
      }

      setLocalCards(prevCards => prevCards.map(card => (card.id === cardId ? { ...card, rate } : card)));

      toast({
        title: 'Success',
        description: 'Card has been rated',
        variant: 'default',
        className: 'bg-[#F97316] text-white',
      });
    } catch (error) {
      console.error('Error rating card:', error instanceof Error ? error.message : error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to rate card',
        variant: 'destructive',
      });
    }
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
        {localCards
          .filter(card => !card.isRemoved)
          .map(card => (
            <div
              key={card.id}
              onClick={() => handleCardFlip(card.id)}
              className="relative h-56 w-full max-w-sm mx-auto cursor-pointer group"
              style={{ perspective: '1000px' }}>
              <div className="absolute top-2 right-2 z-10" onClick={e => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 rounded-lg bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5 text-sm text-gray-500">Rate this card</div>
                    <div className="px-2 py-1.5 flex gap-1">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          onClick={() => handleRate(card.id, rating)}
                          className="focus:outline-none"
                          title={`Rate ${rating} stars`}>
                          <Star
                            className={`w-5 h-5 ${
                              rating <= (card.rate ?? 3) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      onClick={() => handleRemoveCard(card.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Card
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

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
