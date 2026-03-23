import { Challenge } from "@/data/challengeTypes";

// Existing 3 challenges + 10 more for daily rotation
export const allChallenges: Challenge[] = [
  {
    id: "reverse-string",
    title: "Reverse a String",
    slug: "reverse-string",
    difficulty: "Easy",
    description:
      "Write a function to reverse a string without using built-in methods.",
    fullDescription: `Write a function that reverses a string. You cannot use built-in reverse methods or string reversal techniques beyond basic operations.

This is a fundamental problem that tests:
- String manipulation
- Loop understanding
- Basic algorithm thinking

When you reverse "hello", it becomes "olleh".
When you reverse "12345", it becomes "54321".

Important: Empty strings should remain empty.`,
    points: 100,
    timeLimit: 30,
    languages: ["JavaScript", "TypeScript", "Python", "Java"],
    defaultLanguage: "JavaScript",
    categories: ["Strings", "Fundamentals"],
    hints: [
      "Start by thinking about what a reverse operation means",
      "Consider iterating through the string from the end to the beginning",
      "You can use an array to store characters and build the result",
    ],
    approachExplanation: `1. Create an empty result array or string
2. Iterate through the input string from end to beginning
3. Add each character to the result
4. Return the final result`,
    testCases: [
      {
        id: "tc-1",
        input: "hello",
        expectedOutput: "olleh",
        description: "Basic string reversal",
        isExample: false,
      },
      {
        id: "tc-2",
        input: "world",
        expectedOutput: "dlrow",
        description: "Another basic test",
        isExample: false,
      },
    ],
    examples: [
      {
        id: "ex-1",
        input: "hello",
        expectedOutput: "olleh",
        description: "Input: hello → Output: olleh",
        isExample: true,
      },
    ],
  },

  {
    id: "two-sum",
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    description: "Find two numbers in an array that add up to a target sum.",
    fullDescription: `Given an array of integers and a target sum, return the indices of the two numbers that add up to the target.

You may assume each input has exactly one solution.`,
    points: 150,
    timeLimit: 45,
    languages: ["JavaScript", "TypeScript", "Python", "Java"],
    defaultLanguage: "JavaScript",
    categories: ["Arrays", "HashMap"],
    hints: [
      "Brute force: check all pairs (O(n²))",
      "Optimized: use a hash map to store seen numbers",
      "For each number, check if (target - number) exists in your map",
    ],
    approachExplanation: `Hash Map Approach (Optimal):
1. Create a map/object to store {number: index}
2. Iterate through the array
3. For each number, check if (target - number) exists
4. If yes, return the indices`,
    testCases: [
      {
        id: "tc-1",
        input: "2,7,11,15|9",
        expectedOutput: "0,1",
        description: "Basic two sum",
        isExample: false,
      },
    ],
    examples: [
      {
        id: "ex-1",
        input: "2,7,11,15|9",
        expectedOutput: "0,1",
        description: "Basic example",
        isExample: true,
      },
    ],
  },

  {
    id: "palindrome-number",
    title: "Palindrome Number",
    slug: "palindrome-number",
    difficulty: "Easy",
    description: "Determine if a number is a palindrome.",
    fullDescription: `Given an integer x, return true if x is a palindrome.

A palindrome reads the same forwards and backwards.
Handle negative numbers (they are not palindromes).`,
    points: 120,
    timeLimit: 25,
    languages: ["JavaScript", "TypeScript", "Python", "Java"],
    defaultLanguage: "JavaScript",
    categories: ["Numbers"],
    hints: [
      "Convert to string and check if it equals its reverse",
      "Or reverse the number mathematically",
      "Remember: negative numbers are not palindromes",
    ],
    approachExplanation: `String Approach:
1. Convert number to string
2. Check if string equals reversed string`,
    testCases: [
      {
        id: "tc-1",
        input: "121",
        expectedOutput: "true",
        description: "Palindrome",
        isExample: false,
      },
      {
        id: "tc-2",
        input: "-121",
        expectedOutput: "false",
        description: "Negative",
        isExample: false,
      },
    ],
    examples: [
      {
        id: "ex-1",
        input: "121",
        expectedOutput: "true",
        description: "121 is a palindrome",
        isExample: true,
      },
    ],
  },

  // Additional 10 challenges for daily rotation
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "Easy",
    description: "Check if parentheses, brackets, and braces are balanced.",
    fullDescription: `Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

Valid string rules:
- Open brackets must be closed by the same type
- Open brackets must be closed in the correct order`,
    points: 130,
    timeLimit: 30,
    languages: ["JavaScript", "TypeScript", "Python", "Java"],
    defaultLanguage: "JavaScript",
    categories: ["Stack"],
    hints: [
      "Use a stack data structure",
      "Push opening brackets, pop for closing",
      "Check that closing bracket matches opening",
    ],
    approachExplanation: `1. Use a stack
2. For each opening bracket, push to stack
3. For each closing bracket, pop and verify match
4. Stack should be empty at end`,
    testCases: [
      {
        id: "tc-1",
        input: "()",
        expectedOutput: "true",
        description: "Simple case",
        isExample: false,
      },
      {
        id: "tc-2",
        input: "([{}])",
        expectedOutput: "true",
        description: "Mixed",
        isExample: false,
      },
    ],
    examples: [
      {
        id: "ex-1",
        input: "()",
        expectedOutput: "true",
        description: "Valid",
        isExample: true,
      },
    ],
  },

  {
    id: "remove-duplicates",
    title: "Remove Duplicates from Sorted Array",
    slug: "remove-duplicates",
    difficulty: "Easy",
    description: "Remove duplicates from a sorted array in-place.",
    fullDescription: `Given a sorted array, remove duplicates in-place such that each element appears only once.

Return the length of the modified array.`,
    points: 110,
    timeLimit: 25,
    languages: ["JavaScript", "TypeScript", "Python", "Java"],
    defaultLanguage: "JavaScript",
    categories: ["Arrays"],
    hints: [
      "Use two pointers approach",
      "Slow pointer marks unique elements",
      "Fast pointer scans for new values",
    ],
    approachExplanation: `Two Pointers:
1. Initialize two pointers at start
2. Move fast pointer to find duplicates
3. When new value found, move slow pointer`,
    testCases: [
      {
        id: "tc-1",
        input: "[1,1,2]",
        expectedOutput: "2",
        description: "Remove duplicates",
        isExample: false,
      },
    ],
    examples: [
      {
        id: "ex-1",
        input: "[1,1,2]",
        expectedOutput: "2",
        description: "Result: [1,2]",
        isExample: true,
      },
    ],
  },

  {
    id: "fibonacci",
    title: "Fibonacci Number",
    slug: "fibonacci",
    difficulty: "Easy",
    description: "Calculate the Nth Fibonacci number.",
    fullDescription: `The Fibonacci sequence is: 0, 1, 1, 2, 3, 5, 8, 13...

Write a function that returns the nth Fibonacci number.`,
    points: 100,
    timeLimit: 20,
    languages: ["JavaScript", "TypeScript", "Python", "Java"],
    defaultLanguage: "JavaScript",
    categories: ["Recursion", "Dynamic Programming"],
    hints: [
      "Recursive approach is simple but slow",
      "Use memoization to optimize",
      "Or use iterative approach",
    ],
    approachExplanation: `Iterative (Optimal):
1. Start with a=0, b=1
2. Loop n times
3. Calculate next = a + b
4. Shift values forward`,
    testCases: [
      {
        id: "tc-1",
        input: "0",
        expectedOutput: "0",
        description: "Base case",
        isExample: false,
      },
      {
        id: "tc-2",
        input: "5",
        expectedOutput: "5",
        description: "5th fib",
        isExample: false,
      },
    ],
    examples: [
      {
        id: "ex-1",
        input: "3",
        expectedOutput: "2",
        description: "3rd fibonacci",
        isExample: true,
      },
    ],
  },

  {
    id: "merge-sorted-arrays",
    title: "Merge Sorted Arrays",
    slug: "merge-sorted-arrays",
    difficulty: "Easy",
    description: "Merge two sorted arrays into one sorted array.",
    fullDescription: `Given two sorted arrays, merge them into a single sorted array in-place if possible.`,
    points: 140,
    timeLimit: 30,
    languages: ["JavaScript", "TypeScript", "Python", "Java"],
    defaultLanguage: "JavaScript",
    categories: ["Arrays", "Sorting"],
    hints: [
      "Use two pointer technique",
      "Start from the end to avoid overwriting",
      "Compare elements and place smaller one first",
    ],
    approachExplanation: `Two Pointer Merge:
1. Compare elements at each pointer
2. Place smaller element first
3. Advance corresponding pointer`,
    testCases: [
      {
        id: "tc-1",
        input: "[1,3]|[2]",
        expectedOutput: "[1,2,3]",
        description: "Merge",
        isExample: false,
      },
    ],
    examples: [
      {
        id: "ex-1",
        input: "[1,2,3]|[2,5,6]",
        expectedOutput: "[1,2,2,3,5,6]",
        description: "Sorted merge",
        isExample: true,
      },
    ],
  },

  {
    id: "first-unique-char",
    title: "First Unique Character in a String",
    slug: "first-unique-char",
    difficulty: "Easy",
    description: "Find the first non-repeating character.",
    fullDescription: `Given a string s, find the first character that appears only once.

Return the index or -1 if no unique character.`,
    points: 120,
    timeLimit: 25,
    languages: ["JavaScript", "TypeScript", "Python", "Java"],
    defaultLanguage: "JavaScript",
    categories: ["Strings", "HashMap"],
    hints: [
      "Count character frequencies",
      "Iterate and find first with count 1",
      "Use a hash map",
    ],
    approachExplanation: `1. Create frequency map
2. Iterate through string
3. Return index of first char with count 1`,
    testCases: [
      {
        id: "tc-1",
        input: "leetcode",
        expectedOutput: "0",
        description: "First unique",
        isExample: false,
      },
    ],
    examples: [
      {
        id: "ex-1",
        input: "aabb",
        expectedOutput: "-1",
        description: "No unique",
        isExample: true,
      },
    ],
  },

  {
    id: "max-product",
    title: "Maximum Product Subarray",
    slug: "max-product",
    difficulty: "Medium",
    description: "Find the contiguous subarray with largest product.",
    fullDescription: `Given an integer array, find the contiguous subarray with the largest product.`,
    points: 200,
    timeLimit: 45,
    languages: ["JavaScript", "TypeScript", "Python", "Java"],
    defaultLanguage: "JavaScript",
    categories: ["Dynamic Programming", "Arrays"],
    hints: [
      "Track both max and min products (negative could become max)",
      "Use dynamic programming",
      "Update max at each step",
    ],
    approachExplanation: `Track min/max at each position:
1. Handle negative numbers (they could flip signs)
2. Update max = max(current, max*current, min*current)`,
    testCases: [
      {
        id: "tc-1",
        input: "[2,3,-2,4]",
        expectedOutput: "6",
        description: "Product",
        isExample: false,
      },
    ],
    examples: [
      {
        id: "ex-1",
        input: "[2,3,-2,4]",
        expectedOutput: "6",
        description: "[2,3]",
        isExample: true,
      },
    ],
  },

  {
    id: "longest-substring",
    title: "Longest Substring Without Repeating",
    slug: "longest-substring",
    difficulty: "Medium",
    description: "Find the longest substring without repeating characters.",
    fullDescription: `Given a string, find the length of the longest substring without repeating characters.`,
    points: 180,
    timeLimit: 40,
    languages: ["JavaScript", "TypeScript", "Python", "Java"],
    defaultLanguage: "JavaScript",
    categories: ["Strings", "Sliding Window"],
    hints: [
      "Use sliding window technique",
      "Track character positions",
      "Expand and contract window",
    ],
    approachExplanation: `Sliding Window:
1. Use two pointers for window
2. Track seen characters
3. Expand right, contract left on duplicate`,
    testCases: [
      {
        id: "tc-1",
        input: "abcabcbb",
        expectedOutput: "3",
        description: "abc",
        isExample: false,
      },
    ],
    examples: [
      {
        id: "ex-1",
        input: "abcabcbb",
        expectedOutput: "3",
        description: "abc",
        isExample: true,
      },
    ],
  },

  {
    id: "binary-search",
    title: "Binary Search",
    slug: "binary-search",
    difficulty: "Easy",
    description: "Search for a target value in a sorted array.",
    fullDescription: `Given a sorted array and a target value, return the index if found, else -1.

Time complexity must be O(log n).`,
    points: 125,
    timeLimit: 30,
    languages: ["JavaScript", "TypeScript", "Python", "Java"],
    defaultLanguage: "JavaScript",
    categories: ["Searching"],
    hints: [
      "Don't use linear search (too slow)",
      "Divide search space in half",
      "Adjust left/right pointers",
    ],
    approachExplanation: `Binary Search:
1. Initialize left=0, right=n-1
2. While left <= right:
   - mid = (left + right) / 2
   - If target < mid, go left
   - If target > mid, go right`,
    testCases: [
      {
        id: "tc-1",
        input: "[-1,0,3,5,9,12]|9",
        expectedOutput: "4",
        description: "Found",
        isExample: false,
      },
    ],
    examples: [
      {
        id: "ex-1",
        input: "[1,3,5,6]|5",
        expectedOutput: "2",
        description: "Target at 2",
        isExample: true,
      },
    ],
  },
];

/**
 * Get all challenges
 */
export const getAllChallenges = (): Challenge[] => {
  return allChallenges;
};

/**
 * Get challenge by ID
 */
export const getChallengeByIdExpanded = (id: string): Challenge | undefined => {
  return allChallenges.find((c) => c.id === id);
};

/**
 * Get challenges by difficulty
 */
export const getChallengesByDifficultyExpanded = (
  difficulty: "Easy" | "Medium" | "Hard",
): Challenge[] => {
  return allChallenges.filter((c) => c.difficulty === difficulty);
};

/**
 * Get challenges by category
 */
export const getChallengesByCategory = (category: string): Challenge[] => {
  return allChallenges.filter((c) => c.categories.includes(category));
};

/**
 * Shuffle array (for daily rotation)
 */
const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Get daily challenge based on date
 */
export const getDailyChallenge = (date?: Date): Challenge => {
  const today = date || new Date();
  const dateStr = today.toISOString().split("T")[0];
  const dayNumber = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  const challengeIndex = dayNumber % allChallenges.length;
  return allChallenges[challengeIndex];
};

/**
 * Get weekly challenges (7 different ones)
 */
export const getWeeklyChallenges = (date?: Date): Challenge[] => {
  const today = date || new Date();
  const dayNumber = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));

  const weeklyChallenges: Challenge[] = [];
  for (let i = 0; i < 7; i++) {
    const dayIndex = dayNumber - i;
    const idx = dayIndex % allChallenges.length;
    const challenge = allChallenges[Math.abs(idx)];
    if (!weeklyChallenges.find((c) => c.id === challenge.id)) {
      weeklyChallenges.push(challenge);
    }
  }

  return weeklyChallenges.slice(0, 7);
};

/**
 * Get categories
 */
export const getAllCategories = (): string[] => {
  const categories = new Set<string>();
  allChallenges.forEach((c) => {
    c.categories.forEach((cat) => categories.add(cat));
  });
  return Array.from(categories).sort();
};
