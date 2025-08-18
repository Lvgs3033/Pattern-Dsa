import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Search, Shuffle } from 'lucide-react';

interface InputSectionProps {
  text: string;
  pattern: string;
  onTextChange: (text: string) => void;
  onPatternChange: (pattern: string) => void;
  onSearch: () => void;
  onLoadExample: () => void;
}

export function InputSection({
  text,
  pattern,
  onTextChange,
  onPatternChange,
  onSearch,
  onLoadExample
}: InputSectionProps) {
  return (
    <div className="space-y-6 p-6 rounded-lg gradient-surface shadow-elegant">
      <div>
        <label htmlFor="text-input" className="text-sm font-medium text-foreground mb-2 block">
          Text to Search In
        </label>
        <Textarea
          id="text-input"
          placeholder="Enter the text where you want to search for patterns..."
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          className="min-h-[100px] font-mono"
        />
      </div>

      <div>
        <label htmlFor="pattern-input" className="text-sm font-medium text-foreground mb-2 block">
          Pattern to Find
        </label>
        <Textarea
          id="pattern-input"
          placeholder="Enter the pattern you want to find..."
          value={pattern}
          onChange={(e) => onPatternChange(e.target.value)}
          className="min-h-[60px] font-mono"
        />
      </div>

      <div className="flex gap-3">
        <Button 
          onClick={onSearch} 
          disabled={!text.trim() || !pattern.trim()}
          className="gradient-primary shadow-glow flex-1"
        >
          <Search className="w-4 h-4 mr-2" />
          Search Pattern
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onLoadExample}
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Load Example
        </Button>
      </div>
    </div>
  );
}