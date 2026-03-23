import { Challenge } from "./challengeTypes";

export const challengeDatabase: Record<string, Challenge> = {
  "reverse-string": {
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
    approachExplanation: `
1. Create an empty result array or string
2. Iterate through the input string from end to beginning
3. Add each character to the result
4. Return the final result

Different languages have different ways to handle this:
- JavaScript: use an array, push characters, join them
- Python: you can slice with [::-1] but try a manual loop
- Java: use StringBuilder or char array
    `,
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
      {
        id: "tc-3",
        input: "a",
        expectedOutput: "a",
        description: "Single character",
        isExample: false,
      },
      {
        id: "tc-4",
        input: "racecar",
        expectedOutput: "racecar",
        description: "Palindrome string",
        isExample: false,
      },
      {
        id: "tc-5",
        input: "",
        expectedOutput: "",
        description: "Empty string",
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
      {
        id: "ex-2",
        input: "12345",
        expectedOutput: "54321",
        description: "Input: 12345 → Output: 54321",
        isExample: true,
      },
    ],
  },

  "two-sum": {
    id: "two-sum",
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    description: "Find two numbers in an array that add up to a target sum.",
    fullDescription: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers that add up to the target.

You may assume each input has exactly one solution, and you cannot use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9

This problem tests:
- Hash map/object usage
- Time complexity optimization
- Problem-solving approach`,
    points: 150,
    timeLimit: 45,
    languages: ["JavaScript", "TypeScript", "Python", "Java"],
    defaultLanguage: "JavaScript",
    categories: ["Arrays", "Hash Map"],
    hints: [
      "Brute force: check all pairs (O(n²))",
      "Optimized: use a hash map to store seen numbers (O(n))",
      "For each number, check if (target - number) exists in your map",
    ],
    approachExplanation: `
Hash Map Approach (Optimal):
1. Create a map/object to store {number: index}
2. Iterate through the array
3. For each number, check if (target - number) exists in the map
4. If yes, return the indices
5. If no, add the current number to the map

Time: O(n), Space: O(n)
    `,
    testCases: [
      {
        id: "tc-1",
        input: "2,7,11,15|9",
        expectedOutput: "0,1",
        description: "Basic two sum",
        isExample: false,
      },
      {
        id: "tc-2",
        input: "3,2,4|6",
        expectedOutput: "1,2",
        description: "Different order",
        isExample: false,
      },
    ],
    examples: [
      {
        id: "ex-1",
        input: "2,7,11,15|9",
        expectedOutput: "0,1",
        description: "nums[0] + nums[1] = 9",
        isExample: true,
      },
    ],
  },

  "palindrome-number": {
    id: "palindrome-number",
    title: "Palindrome Number",
    slug: "palindrome-number",
    difficulty: "Easy",
    description: "Determine if a number is a palindrome.",
    fullDescription: `Given an integer x, return true if x is a palindrome, and false otherwise.

Example:
Input: x = 121
Output: true

A palindrome reads the same forwards and backwards.
Handle negative numbers (they are not palindromes).`,
    points: 120,
    timeLimit: 25,
    languages: ["JavaScript", "TypeScript", "Python", "Java"],
    defaultLanguage: "JavaScript",
    categories: ["Numbers", "Fundamentals"],
    hints: [
      "Convert to string and check if it equals its reverse",
      "Or reverse the number mathematically without string conversion",
      "Remember: negative numbers are not palindromes",
    ],
    approachExplanation: `
String Approach:
1. Convert number to string
2. Check if string equals reversed string
3. Return result

Mathematical Approach:
1. Handle negative case (return false)
2. Reverse the number by extracting digits
3. Compare with original
    `,
    testCases: [
      {
        id: "tc-1",
        input: "121",
        expectedOutput: "true",
        description: "Palindrome number",
        isExample: false,
      },
      {
        id: "tc-2",
        input: "-121",
        expectedOutput: "false",
        description: "Negative number",
        isExample: false,
      },
      {
        id: "tc-3",
        input: "10",
        expectedOutput: "false",
        description: "Not a palindrome",
        isExample: false,
      },
    ],
    examples: [
      {
        id: "ex-1",
        input: "121",
        expectedOutput: "true",
        description: "121 reads the same forwards and backwards",
        isExample: true,
      },
    ],
  },
};

export const getChallengeById = (id: string): Challenge | undefined => {
  return challengeDatabase[id];
};

export const getAllChallenges = (): Challenge[] => {
  return Object.values(challengeDatabase);
};

export const getChallengesByDifficulty = (
  difficulty: "Easy" | "Medium" | "Hard",
): Challenge[] => {
  return Object.values(challengeDatabase).filter(
    (c) => c.difficulty === difficulty,
  );
};

export const getChallengesByCategory = (category: string): Challenge[] => {
  return Object.values(challengeDatabase).filter((c) =>
    c.categories.includes(category),
  );
};
