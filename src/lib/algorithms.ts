export interface AlgorithmStep {
  type: 'comparison' | 'match' | 'mismatch' | 'shift' | 'complete';
  textIndex: number;
  patternIndex: number;
  message: string;
  comparisons: number;
}

export interface AlgorithmResult {
  matches: number[];
  steps: AlgorithmStep[];
  totalComparisons: number;
  timeComplexity: string;
  spaceComplexity: string;
}

// Naive/Brute Force Algorithm
export function naiveSearch(text: string, pattern: string): AlgorithmResult {
  const matches: number[] = [];
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;

  for (let i = 0; i <= text.length - pattern.length; i++) {
    let j = 0;
    
    while (j < pattern.length) {
      comparisons++;
      steps.push({
        type: 'comparison',
        textIndex: i + j,
        patternIndex: j,
        message: `Comparing text[${i + j}] = '${text[i + j]}' with pattern[${j}] = '${pattern[j]}'`,
        comparisons
      });

      if (text[i + j] !== pattern[j]) {
        steps.push({
          type: 'mismatch',
          textIndex: i + j,
          patternIndex: j,
          message: `Mismatch! Shifting pattern to position ${i + 1}`,
          comparisons
        });
        break;
      }
      j++;
    }

    if (j === pattern.length) {
      matches.push(i);
      steps.push({
        type: 'match',
        textIndex: i,
        patternIndex: 0,
        message: `Pattern found at position ${i}!`,
        comparisons
      });
    }
  }

  steps.push({
    type: 'complete',
    textIndex: -1,
    patternIndex: -1,
    message: `Search complete. Found ${matches.length} match(es).`,
    comparisons
  });

  return {
    matches,
    steps,
    totalComparisons: comparisons,
    timeComplexity: 'O(n×m)',
    spaceComplexity: 'O(1)'
  };
}

// KMP Algorithm
export function kmpSearch(text: string, pattern: string): AlgorithmResult {
  const matches: number[] = [];
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;

  // Build LPS array
  const lps = buildLPS(pattern);
  
  let i = 0; // text index
  let j = 0; // pattern index

  while (i < text.length) {
    comparisons++;
    steps.push({
      type: 'comparison',
      textIndex: i,
      patternIndex: j,
      message: `Comparing text[${i}] = '${text[i]}' with pattern[${j}] = '${pattern[j]}'`,
      comparisons
    });

    if (text[i] === pattern[j]) {
      i++;
      j++;
    } else {
      steps.push({
        type: 'mismatch',
        textIndex: i,
        patternIndex: j,
        message: j === 0 
          ? `Mismatch at start of pattern. Moving to next position.`
          : `Mismatch! Using LPS array: moving pattern index to ${lps[j - 1]}`,
        comparisons
      });

      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }

    if (j === pattern.length) {
      matches.push(i - j);
      steps.push({
        type: 'match',
        textIndex: i - j,
        patternIndex: 0,
        message: `Pattern found at position ${i - j}!`,
        comparisons
      });
      j = lps[j - 1];
    }
  }

  steps.push({
    type: 'complete',
    textIndex: -1,
    patternIndex: -1,
    message: `KMP search complete. Found ${matches.length} match(es).`,
    comparisons
  });

  return {
    matches,
    steps,
    totalComparisons: comparisons,
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(m)'
  };
}

function buildLPS(pattern: string): number[] {
  const lps = new Array(pattern.length).fill(0);
  let len = 0;
  let i = 1;

  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }

  return lps;
}

// Rabin-Karp Algorithm
export function rabinKarpSearch(text: string, pattern: string): AlgorithmResult {
  const matches: number[] = [];
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;

  const d = 256; // number of characters in input alphabet
  const q = 101; // a prime number

  const m = pattern.length;
  const n = text.length;
  let p = 0; // hash value for pattern
  let t = 0; // hash value for text
  let h = 1;

  // Calculate h = pow(d, m-1) % q
  for (let i = 0; i < m - 1; i++) {
    h = (h * d) % q;
  }

  // Calculate hash values for pattern and first window of text
  for (let i = 0; i < m; i++) {
    p = (d * p + pattern.charCodeAt(i)) % q;
    t = (d * t + text.charCodeAt(i)) % q;
  }

  // Slide the pattern over text one by one
  for (let i = 0; i <= n - m; i++) {
    steps.push({
      type: 'comparison',
      textIndex: i,
      patternIndex: 0,
      message: `Comparing hash values: text hash = ${t}, pattern hash = ${p}`,
      comparisons
    });

    if (p === t) {
      // Check characters one by one
      let j = 0;
      for (j = 0; j < m; j++) {
        comparisons++;
        if (text[i + j] !== pattern[j]) {
          steps.push({
            type: 'mismatch',
            textIndex: i + j,
            patternIndex: j,
            message: `Hash match but character mismatch at position ${i + j}`,
            comparisons
          });
          break;
        }
      }

      if (j === m) {
        matches.push(i);
        steps.push({
          type: 'match',
          textIndex: i,
          patternIndex: 0,
          message: `Pattern found at position ${i}!`,
          comparisons
        });
      }
    }

    // Calculate hash value for next window
    if (i < n - m) {
      t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
      if (t < 0) t = t + q;
    }
  }

  steps.push({
    type: 'complete',
    textIndex: -1,
    patternIndex: -1,
    message: `Rabin-Karp search complete. Found ${matches.length} match(es).`,
    comparisons
  });

  return {
    matches,
    steps,
    totalComparisons: comparisons,
    timeComplexity: 'O(n + m) average, O(nm) worst',
    spaceComplexity: 'O(1)'
  };
}

export const algorithms = {
  naive: { name: 'Naive/Brute Force', fn: naiveSearch },
  kmp: { name: 'KMP (Knuth-Morris-Pratt)', fn: kmpSearch },
  rabinKarp: { name: 'Rabin-Karp', fn: rabinKarpSearch }
} as const;

export type AlgorithmType = keyof typeof algorithms;