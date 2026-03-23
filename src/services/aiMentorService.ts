import { Challenge } from "@/data/challengeTypes";

/**
 * AI Mentor Service - Provides context-aware hints and explanations
 *
 * This service generates dynamic AI responses based on:
 * - Challenge type and difficulty
 * - User's current code (for debugging)
 * - Request type (hint, explain, approach, debug, optimize)
 */

interface AIResponse {
  type: "hint" | "explanation" | "approach" | "debug" | "optimize";
  content: string;
  relatedConcepts: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

export class AIMentorService {
  /**
   * Get a tactical hint for a challenge
   */
  static getHint(challenge: Challenge, userCode?: string): AIResponse {
    const hints = challenge.hints || [];
    let hint =
      hints.length > 0
        ? hints[0]
        : "Try starting with a simple case and gradually build up.";

    // Customize hint based on challenge category
    if (challenge.categories.includes("Strings")) {
      hint =
        hint ||
        "Think about iterating through the string. Consider using loops or built-in methods.";
    } else if (challenge.categories.includes("Arrays")) {
      hint =
        hint ||
        "Consider using pointers or indices. What patterns do you notice in the array?";
    } else if (challenge.categories.includes("Stack")) {
      hint =
        hint ||
        "A stack data structure (LIFO) could be helpful. Push and pop elements strategically.";
    } else if (challenge.categories.includes("HashMap")) {
      hint =
        hint ||
        "Using a hash map to store values can help you achieve O(n) complexity.";
    } else if (challenge.categories.includes("Dynamic Programming")) {
      hint =
        hint ||
        "Try breaking this into overlapping subproblems. Can you use memoization?";
    }

    return {
      type: "hint",
      content: hint,
      relatedConcepts: challenge.categories,
      difficulty:
        challenge.difficulty === "Hard"
          ? "advanced"
          : challenge.difficulty === "Medium"
            ? "intermediate"
            : "beginner",
    };
  }

  /**
   * Get problem explanation
   */
  static getExplanation(challenge: Challenge): AIResponse {
    const content = `
**Problem Overview:**
${challenge.fullDescription}

**Key Concepts:**
${challenge.categories.map((cat) => `- ${cat}`).join("\n")}

**What You Need to Know:**
- Input format and constraints
- Edge cases to consider (empty, single element, duplicates, negatives, etc.)
- Expected output format
- Any special requirements

**Why This Matters:**
This problem teaches you about ${challenge.categories.join(" and ")}, which are fundamental in many real-world applications.
`;

    return {
      type: "explanation",
      content,
      relatedConcepts: challenge.categories,
      difficulty: "beginner",
    };
  }

  /**
   * Get solution approach guidance
   */
  static getApproach(challenge: Challenge): AIResponse {
    let approach =
      challenge.approachExplanation ||
      "Think about the most straightforward solution first.";

    // Add category-specific approaches
    if (challenge.categories.includes("Strings")) {
      approach +=
        "\n\nFor strings, consider:\n- Character iteration\n- String manipulation techniques\n- Two-pointer approach";
    } else if (challenge.categories.includes("Arrays")) {
      approach +=
        "\n\nFor arrays, consider:\n- Two-pointer technique\n- Sliding window\n- Two-pass method";
    } else if (challenge.categories.includes("Stack")) {
      approach +=
        "\n\nFor stack problems:\n- Push elements when needed\n- Pop when finding matches\n- Check remaining stack at end";
    } else if (challenge.categories.includes("HashMap")) {
      approach +=
        "\n\nFor HashMap problems:\n- Store values in map for O(1) lookup\n- Iterate once to solve\n- Track indices/frequencies";
    } else if (challenge.categories.includes("Dynamic Programming")) {
      approach +=
        "\n\nFor DP problems:\n- Identify overlapping subproblems\n- Define recurrence relation\n- Use memoization or tabulation";
    }

    approach +=
      "\n\n**Step-by-step:**\n1. Understand the input\n2. Think of the brute force approach\n3. Optimize if needed\n4. Code it\n5. Test edge cases";

    return {
      type: "approach",
      content: approach,
      relatedConcepts: challenge.categories,
      difficulty: "intermediate",
    };
  }

  /**
   * Debug user's code
   */
  static debugCode(challenge: Challenge, userCode: string): AIResponse {
    let debugAdvice = "Here are common issues to check:\n\n";

    // Analyze code for common errors
    const issues: string[] = [];

    if (!userCode || userCode.trim().length === 0) {
      issues.push(
        "❌ **Empty code** - Your code area is empty. Write your solution here!",
      );
    }

    // Check for common mistakes based on challenge type
    if (challenge.categories.includes("Arrays")) {
      if (!userCode.includes("length") && !userCode.includes("len")) {
        issues.push(
          "💡 **Array length** - Remember to check array bounds to avoid index errors",
        );
      }
      if (!userCode.includes("for") && !userCode.includes("while")) {
        issues.push(
          "💡 **Iteration** - You might need a loop to iterate through the array",
        );
      }
    }

    if (challenge.categories.includes("Strings")) {
      if (!userCode.includes("split") && !userCode.includes("charAt")) {
        issues.push(
          "💡 **String access** - Consider how to access individual characters",
        );
      }
    }

    if (challenge.categories.includes("Stack")) {
      if (!userCode.includes("push") && !userCode.includes("pop")) {
        issues.push(
          "💡 **Stack operations** - Use push() and pop() for stack data structure",
        );
      }
    }

    if (challenge.categories.includes("HashMap")) {
      if (!userCode.includes("{}") && !userCode.includes("Map")) {
        issues.push(
          "💡 **Hash map** - Consider using an object {} or Map for O(1) lookups",
        );
      }
    }

    if (userCode.includes("==") && !userCode.includes("===")) {
      issues.push(
        "⚠️ **Loose equality** - In JavaScript, use === instead of == to avoid type coercion bugs",
      );
    }

    if (userCode.includes("var ")) {
      issues.push(
        "⚠️ **Variable declaration** - Use let or const instead of var for better scoping",
      );
    }

    // Check for missing return statement
    if (!userCode.includes("return")) {
      issues.push(
        "❌ **Missing return** - Your function should return the result",
      );
    }

    debugAdvice +=
      issues.length > 0
        ? issues.join("\n\n")
        : "Your code looks structurally sound! Make sure it:\n- Handles all test cases\n- Works for edge cases\n- Returns the correct format";

    debugAdvice +=
      "\n\n**Tips:**\n- Add console.log() to debug values\n- Test with examples from the problem\n- Check for off-by-one errors\n- Verify your logic with simple inputs first";

    return {
      type: "debug",
      content: debugAdvice,
      relatedConcepts: ["Testing", "Debugging", ...challenge.categories],
      difficulty: "intermediate",
    };
  }

  /**
   * Get optimization suggestions
   */
  static optimizeCode(challenge: Challenge, userCode?: string): AIResponse {
    const timeComplexity =
      challenge.difficulty === "Easy"
        ? "O(n)"
        : challenge.difficulty === "Medium"
          ? "O(n log n)"
          : "O(1) or O(n)";

    let optimize = `
**Optimization Analysis for ${challenge.title}:**

**Current Approach Analysis:**
- Analyze your algorithm's time complexity
- Identify bottlenecks
- Look for redundant operations

**Target Complexity:** ${timeComplexity}

**Optimization Techniques:**
`;

    if (challenge.categories.includes("Arrays")) {
      optimize += `
1. **Two Pointer Technique** - O(n) instead of O(n²)
   - Instead of nested loops, use pointers from both ends
   - Example: [1,2,3,4,5] → compare first and last

2. **Sorting First** - Sometimes sorting (O(n log n)) then scanning (O(n)) is better
   
3. **Hash Map** - O(n) lookup instead of O(n) search each time
`;
    } else if (challenge.categories.includes("Strings")) {
      optimize += `
1. **Sliding Window** - Move through string once O(n) instead of multiple passes
2. **Character Mapping** - Store frequencies in object for O(1) access
3. **String Builder** - Concatenate efficiently, don't create many strings
`;
    } else if (challenge.categories.includes("Dynamic Programming")) {
      optimize += `
1. **Memoization** - Cache results of subproblems
2. **Tabulation** - Build up solution bottom-up
3. **Space Optimization** - Can you use O(1) space instead of O(n)?
`;
    }

    optimize += `

**Common Issues:**
- ❌ Nested loops (O(n²)) when you need O(n)
- ❌ Creating new arrays/objects unnecessarily
- ❌ Recalculating same values multiple times
- ❌ Not using the right data structure

**Questions to Ask:**
1. Can I solve this in one pass?
2. Do I need a hash map?
3. Can I avoid creating new arrays?
4. Is there a mathematical formula?
5. Can I solve it with two pointers?
`;

    return {
      type: "optimize",
      content: optimize,
      relatedConcepts: [
        "Time Complexity",
        "Space Complexity",
        "Algorithms",
        ...challenge.categories,
      ],
      difficulty: "advanced",
    };
  }

  /**
   * Get general response for a challenge
   */
  static getResponse(
    type: "hint" | "explanation" | "approach" | "debug" | "optimize",
    challenge: Challenge,
    userCode?: string,
  ): AIResponse {
    switch (type) {
      case "hint":
        return this.getHint(challenge, userCode);
      case "explanation":
        return this.getExplanation(challenge);
      case "approach":
        return this.getApproach(challenge);
      case "debug":
        return this.debugCode(challenge, userCode || "");
      case "optimize":
        return this.optimizeCode(challenge, userCode);
      default:
        return this.getHint(challenge, userCode);
    }
  }

  /**
   * Get multiple related concepts to explore
   */
  static getRelatedConcepts(challenge: Challenge): string[] {
    const concepts: Set<string> = new Set(challenge.categories);

    // Add related concepts
    if (challenge.categories.includes("Arrays")) {
      concepts.add("Sorting");
      concepts.add("Searching");
    }
    if (challenge.categories.includes("Strings")) {
      concepts.add("Pattern Matching");
      concepts.add("Regular Expressions");
    }
    if (challenge.categories.includes("Stack")) {
      concepts.add("Queue");
      concepts.add("Recursion");
    }
    if (challenge.categories.includes("HashMap")) {
      concepts.add("Hash Functions");
      concepts.add("Collision Handling");
    }
    if (challenge.difficulty === "Hard") {
      concepts.add("Advanced Algorithms");
      concepts.add("System Design");
    }

    return Array.from(concepts);
  }
}
