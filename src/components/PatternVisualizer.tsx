import { useState, useEffect } from 'react';
import { AlgorithmStep } from '@/lib/algorithms';

interface PatternVisualizerProps {
  text: string;
  pattern: string;
  steps: AlgorithmStep[];
  currentStep: number;
  matches: number[];
}

export function PatternVisualizer({ text, pattern, steps, currentStep, matches }: PatternVisualizerProps) {
  const [displayText, setDisplayText] = useState<string[]>([]);

  useEffect(() => {
    setDisplayText(text.split(''));
  }, [text]);

  const getCharacterClass = (index: number) => {
    const classes = ['char-highlight'];
    
    // Show all matches
    if (matches.some(matchPos => index >= matchPos && index < matchPos + pattern.length)) {
      classes.push('char-match');
    }

    // Current step highlighting
    if (currentStep >= 0 && currentStep < steps.length) {
      const step = steps[currentStep];
      
      switch (step.type) {
        case 'comparison':
        case 'mismatch':
          if (index === step.textIndex) {
            classes.push('char-current');
          }
          // Highlight the pattern being compared
          if (step.textIndex >= 0) {
            const patternStart = step.textIndex - step.patternIndex;
            if (index >= patternStart && index < patternStart + pattern.length) {
              classes.push('char-pattern');
            }
          }
          break;
        case 'match':
          if (index >= step.textIndex && index < step.textIndex + pattern.length) {
            classes.push('char-match');
          }
          break;
      }
    }

    return classes.join(' ');
  };

  const getPatternClass = (index: number) => {
    const classes = ['char-highlight'];
    
    if (currentStep >= 0 && currentStep < steps.length) {
      const step = steps[currentStep];
      
      if ((step.type === 'comparison' || step.type === 'mismatch') && index === step.patternIndex) {
        classes.push('char-current');
      } else if (step.type === 'match') {
        classes.push('char-match');
      } else {
        classes.push('char-pattern');
      }
    } else {
      classes.push('char-pattern');
    }

    return classes.join(' ');
  };

  return (
    <div className="space-y-8 p-6 rounded-lg gradient-surface shadow-elegant">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Text:</h3>
        <div className="algorithm-text bg-card/50 p-4 rounded-lg border">
          {displayText.map((char, index) => (
            <span
              key={index}
              className={getCharacterClass(index)}
            >
              {char === ' ' ? '·' : char}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Pattern:</h3>
        <div className="algorithm-text bg-card/50 p-4 rounded-lg border">
          {pattern.split('').map((char, index) => (
            <span
              key={index}
              className={getPatternClass(index)}
            >
              {char === ' ' ? '·' : char}
            </span>
          ))}
        </div>
      </div>

      {currentStep >= 0 && currentStep < steps.length && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h4 className="font-semibold text-primary mb-2">Step {currentStep + 1}:</h4>
          <p className="text-sm text-muted-foreground">{steps[currentStep].message}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Comparisons so far: {steps[currentStep].comparisons}
          </p>
        </div>
      )}

      {matches.length > 0 && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <h4 className="font-semibold text-accent mb-2">Matches Found:</h4>
          <div className="flex flex-wrap gap-2">
            {matches.map((position, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-accent/20 text-accent rounded-md text-sm font-mono"
              >
                Position {position}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}