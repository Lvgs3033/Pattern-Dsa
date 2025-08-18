import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlgorithmResult } from '@/lib/algorithms';
import { algorithms, AlgorithmType } from '@/lib/algorithms';

interface AlgorithmStatsProps {
  algorithm: AlgorithmType;
  result: AlgorithmResult | null;
}

export function AlgorithmStats({ algorithm, result }: AlgorithmStatsProps) {
  if (!result) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Algorithm</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-primary">
            {algorithms[algorithm].name}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Matches Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-accent">
            {result.matches.length}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Total Comparisons</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-foreground">
            {result.totalComparisons}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Time Complexity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold text-muted-foreground font-mono">
            {result.timeComplexity}
          </p>
          <CardDescription className="text-xs mt-1">
            Space: {result.spaceComplexity}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}