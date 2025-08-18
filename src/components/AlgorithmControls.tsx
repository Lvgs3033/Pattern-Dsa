import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';
import { algorithms, AlgorithmType } from '@/lib/algorithms';

interface AlgorithmControlsProps {
  selectedAlgorithm: AlgorithmType;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export function AlgorithmControls({
  selectedAlgorithm,
  onAlgorithmChange,
  isPlaying,
  onPlayPause,
  onReset,
  onStepForward,
  onStepBackward,
  currentStep,
  totalSteps,
  onStepChange,
  speed,
  onSpeedChange
}: AlgorithmControlsProps) {
  return (
    <div className="space-y-6 p-6 rounded-lg gradient-surface shadow-elegant">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Algorithm
        </label>
        <Select value={selectedAlgorithm} onValueChange={onAlgorithmChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(algorithms).map(([key, algorithm]) => (
              <SelectItem key={key} value={key}>
                {algorithm.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onStepBackward}
          disabled={currentStep <= 0}
        >
          <SkipBack className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="default" 
          size="sm" 
          onClick={onPlayPause}
          disabled={totalSteps === 0}
          className="gradient-primary"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onStepForward}
          disabled={currentStep >= totalSteps - 1}
        >
          <SkipForward className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onReset}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {totalSteps > 0 && (
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Step {currentStep + 1} of {totalSteps}
          </label>
          <Slider
            value={[currentStep]}
            onValueChange={(value) => onStepChange(value[0])}
            max={totalSteps - 1}
            min={0}
            step={1}
            className="w-full"
          />
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Animation Speed: {speed}ms
        </label>
        <Slider
          value={[speed]}
          onValueChange={(value) => onSpeedChange(value[0])}
          max={2000}
          min={100}
          step={100}
          className="w-full"
        />
      </div>
    </div>
  );
}