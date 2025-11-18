import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { RotateCcw } from 'lucide-react';

export const FlashCard = ({ front, back, icon }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="perspective-1000 h-64">
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <Card
          className={`absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 ${
            isFlipped ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="text-5xl mb-4">{icon}</div>
          <p className="text-lg font-semibold text-center text-foreground hindi-text leading-relaxed">
            {front}
          </p>
          <div className="absolute bottom-4 right-4">
            <RotateCcw className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>

        {/* Back of card */}
        <Card
          className={`absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20 ${
            isFlipped ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-base text-center text-foreground hindi-text leading-relaxed">
            {back}
          </p>
          <div className="absolute bottom-4 right-4">
            <RotateCcw className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
      </div>
    </div>
  );
};
