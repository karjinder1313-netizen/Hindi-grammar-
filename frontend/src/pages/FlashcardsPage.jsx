import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FlashCard } from '@/components/FlashCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layers, ChevronLeft, ChevronRight, Shuffle, Play, X, CheckCircle, Circle } from 'lucide-react';
import flashcardsData from '@/data/flashcardsData';

export default function FlashcardsPage() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [shuffled, setShuffled] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [markedCards, setMarkedCards] = useState(new Set());

  const currentCategory = flashcardsData[selectedCategory];
  const cards = shuffled 
    ? [...currentCategory.cards].sort(() => Math.random() - 0.5)
    : currentCategory.cards;
  const currentCard = cards[currentCardIndex];

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleCategoryChange = (index) => {
    setSelectedCategory(index);
    setCurrentCardIndex(0);
    setShuffled(false);
    setMarkedCards(new Set());
  };

  const handleShuffle = () => {
    setShuffled(!shuffled);
    setCurrentCardIndex(0);
  };

  const startPracticeSession = () => {
    setIsPracticeMode(true);
    setCurrentCardIndex(0);
    setMarkedCards(new Set());
  };

  const exitPracticeSession = () => {
    setIsPracticeMode(false);
  };

  const toggleMarkCard = () => {
    const newMarkedCards = new Set(markedCards);
    if (newMarkedCards.has(currentCardIndex)) {
      newMarkedCards.delete(currentCardIndex);
    } else {
      newMarkedCards.add(currentCardIndex);
    }
    setMarkedCards(newMarkedCards);
  };

  // Practice Mode Full Screen View
  if (isPracticeMode) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Practice Session Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground hindi-text">
                अभ्यास सत्र - {currentCategory.category}
              </h1>
              <p className="text-sm text-muted-foreground hindi-text">
                प्रत्येक कार्ड को ध्यान से पढ़ें और याद करें
              </p>
            </div>
            <Button
              variant="outline"
              onClick={exitPracticeSession}
              className="hindi-text"
            >
              <X className="h-4 w-4 mr-2" />
              सत्र समाप्त करें
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="hindi-text">
                कार्ड {currentCardIndex + 1} / {cards.length}
              </Badge>
              <Badge variant="outline" className="hindi-text">
                याद किए: {markedCards.size} / {cards.length}
              </Badge>
            </div>
            <div className="w-full bg-secondary/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Flashcard */}
          <div className="flex justify-center mb-6">
            <div className="w-full max-w-3xl">
              <FlashCard
                front={currentCard.front}
                back={currentCard.back}
                icon={currentCard.icon}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Mark as Known Button */}
            <div className="flex justify-center">
              <Button
                variant={markedCards.has(currentCardIndex) ? 'default' : 'outline'}
                onClick={toggleMarkCard}
                className="hindi-text"
              >
                {markedCards.has(currentCardIndex) ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    याद है
                  </>
                ) : (
                  <>
                    <Circle className="h-4 w-4 mr-2" />
                    याद है के रूप में चिह्नित करें
                  </>
                )}
              </Button>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevCard}
                disabled={currentCardIndex === 0}
                className="hindi-text px-8"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                पिछला
              </Button>

              <span className="text-sm text-muted-foreground hindi-text text-center">
                कार्ड पर क्लिक करके पलटें
              </span>

              <Button
                variant="outline"
                onClick={handleNextCard}
                disabled={currentCardIndex === cards.length - 1}
                className="hindi-text px-8"
              >
                अगला
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Session Complete Message */}
            {currentCardIndex === cards.length - 1 && (
              <Card className="p-6 bg-accent/10 border-accent/20">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold text-foreground hindi-text">
                    बधाई हो! आपने सभी कार्ड पूरे कर लिए हैं!
                  </h3>
                  <div className="space-y-2 text-sm text-foreground hindi-text">
                    <p>कुल कार्ड: {cards.length}</p>
                    <p>याद किए गए: {markedCards.size}</p>
                    <p>बाकी: {cards.length - markedCards.size}</p>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={() => setCurrentCardIndex(0)}
                      variant="outline"
                      className="hindi-text"
                    >
                      फिर से शुरू करें
                    </Button>
                    <Button
                      onClick={exitPracticeSession}
                      className="hindi-text"
                    >
                      समाप्त करें
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground hindi-text">
                  फ्लैश कार्ड
                </h1>
                <p className="text-sm text-muted-foreground hindi-text">
                  व्याकरण अवधारणाओं को याद करें
                </p>
              </div>
            </div>
            <Button
              onClick={startPracticeSession}
              className="hindi-text"
              size="lg"
            >
              <Play className="h-5 w-5 mr-2" />
              अभ्यास सत्र शुरू करें
            </Button>
          </div>
        </div>

        {/* Category Selection */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 hindi-text">
            विषय चुनें
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {flashcardsData.map((category, index) => (
              <Button
                key={index}
                variant={selectedCategory === index ? 'default' : 'outline'}
                onClick={() => handleCategoryChange(index)}
                className="justify-start hindi-text"
              >
                <span className="mr-2 text-xl">{category.icon}</span>
                <span className="text-xs sm:text-sm truncate">{category.category}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Flashcard Display */}
        <div className="space-y-6">
          {/* Progress and Controls */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-foreground hindi-text">
                {currentCategory.category}
              </h2>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="hindi-text">
                  कार्ड {currentCardIndex + 1} / {cards.length}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShuffle}
                  className="hindi-text"
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  {shuffled ? 'क्रम में' : 'फेरबदल'}
                </Button>
              </div>
            </div>
          </div>

          {/* Flashcard */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <FlashCard
                front={currentCard.front}
                back={currentCard.back}
                icon={currentCard.icon}
              />
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <Button
              variant="outline"
              onClick={handlePrevCard}
              disabled={currentCardIndex === 0}
              className="hindi-text"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              पिछला
            </Button>

            <span className="text-sm text-muted-foreground hindi-text">
              कार्ड पर क्लिक करके पलटें
            </span>

            <Button
              variant="outline"
              onClick={handleNextCard}
              disabled={currentCardIndex === cards.length - 1}
              className="hindi-text"
            >
              अगला
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* All Cards Grid */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-foreground mb-6 hindi-text">
              सभी कार्ड ({cards.length})
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentCardIndex(index)}
                  className="cursor-pointer"
                >
                  <FlashCard
                    front={card.front}
                    back={card.back}
                    icon={card.icon}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <Card className="mt-12 p-6 bg-accent-light border-accent/20">
          <h3 className="text-lg font-semibold text-foreground mb-3 hindi-text">
            फ्लैश कार्ड कैसे उपयोग करें
          </h3>
          <div className="space-y-2 text-sm text-foreground hindi-text">
            <p>• कार्ड पर क्लिक करके प्रश्न और उत्तर देखें</p>
            <p>• "अगला" और "पिछला" बटन से नेविगेट करें</p>
            <p>• "फेरबदल" बटन से कार्ड का क्रम बदलें</p>
            <p>• नीचे सभी कार्ड एक साथ देख सकते हैं</p>
            <p>• किसी भी कार्ड पर क्लिक करके सीधे उस पर जाएं</p>
          </div>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}
