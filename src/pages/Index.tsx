import { useState, useEffect } from 'react';
import { InputSection } from '@/components/InputSection';
import { AlgorithmControls } from '@/components/AlgorithmControls';
import { PatternVisualizer } from '@/components/PatternVisualizer';
import { AlgorithmStats } from '@/components/AlgorithmStats';
import { algorithms, AlgorithmType, AlgorithmResult } from '@/lib/algorithms';
import heroImage from '@/assets/hero-pattern-search.jpg';

const Index = () => {
  const [text, setText] = useState('');
  const [pattern, setPattern] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('naive');
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);

  const handleSearch = () => {
    if (!text.trim() || !pattern.trim()) return;
    
    const algorithmFn = algorithms[selectedAlgorithm].fn;
    const searchResult = algorithmFn(text, pattern);
    setResult(searchResult);
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const handleLoadExample = () => {
    setText("ABABDABACDABABCABCABCABDAB");
    setPattern("ABABCAB");
    setResult(null);
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (!result) return;
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (!result || currentStep >= result.steps.length - 1) return;
    setCurrentStep(currentStep + 1);
  };

  const handleStepBackward = () => {
    if (currentStep <= 0) return;
    setCurrentStep(currentStep - 1);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !result || currentStep >= result.steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep(currentStep + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, result, speed]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-primary bg-clip-text text-transparent">
            Pattern Search Visualizer
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore and visualize different string matching algorithms including KMP, Rabin-Karp, and Naive search with step-by-step animations.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <InputSection
              text={text}
              pattern={pattern}
              onTextChange={setText}
              onPatternChange={setPattern}
              onSearch={handleSearch}
              onLoadExample={handleLoadExample}
            />
          </div>

          {/* Controls Section */}
          <div className="lg:col-span-1">
            <AlgorithmControls
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmChange={setSelectedAlgorithm}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onReset={handleReset}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              currentStep={currentStep}
              totalSteps={result?.steps.length || 0}
              onStepChange={setCurrentStep}
              speed={speed}
              onSpeedChange={setSpeed}
            />
          </div>

          {/* Stats Section */}
          <div className="lg:col-span-1">
            {result && (
              <AlgorithmStats
                algorithm={selectedAlgorithm}
                result={result}
              />
            )}
          </div>
        </div>

        {/* Visualization Section */}
        {result && (
          <PatternVisualizer
            text={text}
            pattern={pattern}
            steps={result.steps}
            currentStep={currentStep}
            matches={result.matches}
          />
        )}

        {/* Algorithm Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 rounded-lg gradient-surface shadow-elegant slide-in">
            <h3 className="text-xl font-semibold mb-4 text-primary">Naive Search</h3>
            <p className="text-muted-foreground text-sm mb-2">
              The simplest pattern matching algorithm that checks every position in the text.
            </p>
            <div className="text-xs text-muted-foreground">
              <p>Time: O(n×m) | Space: O(1)</p>
            </div>
          </div>

          <div className="p-6 rounded-lg gradient-surface shadow-elegant slide-in">
            <h3 className="text-xl font-semibold mb-4 text-primary">KMP Algorithm</h3>
            <p className="text-muted-foreground text-sm mb-2">
              Uses preprocessing to avoid unnecessary comparisons by computing failure function.
            </p>
            <div className="text-xs text-muted-foreground">
              <p>Time: O(n+m) | Space: O(m)</p>
            </div>
          </div>

          <div className="p-6 rounded-lg gradient-surface shadow-elegant slide-in">
            <h3 className="text-xl font-semibold mb-4 text-primary">Rabin-Karp</h3>
            <p className="text-muted-foreground text-sm mb-2">
              Uses rolling hash to quickly eliminate most non-matching positions.
            </p>
            <div className="text-xs text-muted-foreground">
              <p>Time: O(n+m) avg | Space: O(1)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
