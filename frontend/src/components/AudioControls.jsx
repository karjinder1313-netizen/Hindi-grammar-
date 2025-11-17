import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Square, Volume2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const AudioControls = ({ 
  isPlaying, 
  isPaused, 
  onPlay, 
  onPause, 
  onResume, 
  onStop,
  rate,
  onRateChange 
}) => {
  const handlePlayPause = () => {
    if (isPlaying) {
      if (isPaused) {
        onResume();
      } else {
        onPause();
      }
    } else {
      onPlay();
    }
  };

  return (
    <Card className="p-4 bg-accent-light border-accent/20">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Button
            onClick={handlePlayPause}
            size="sm"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                <span className="hindi-text">रोकें</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                <span className="hindi-text">{isPaused ? 'जारी रखें' : 'सुनें'}</span>
              </>
            )}
          </Button>

          {isPlaying && (
            <Button
              onClick={onStop}
              size="sm"
              variant="outline"
              className="border-accent/20"
            >
              <Square className="h-4 w-4 mr-2" />
              <span className="hindi-text">बंद करें</span>
            </Button>
          )}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button 
              size="sm" 
              variant="outline"
              className="border-accent/20"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              <span className="hindi-text">गति: {rate}x</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2 hindi-text">बोलने की गति</p>
                <Slider
                  value={[rate]}
                  onValueChange={(value) => onRateChange(value[0])}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground hindi-text">
                <span>धीमा (0.5x)</span>
                <span>तेज़ (2x)</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </Card>
  );
};
