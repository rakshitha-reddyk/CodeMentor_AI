import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Code,
  CheckCircle,
  Clock,
  Flame,
  ChevronRight,
  X,
  Play,
  Send,
  RotateCcw,
  Lightbulb,
  Brain,
  Zap,
  BookOpen,
  Trophy,
} from "lucide-react";

interface CodeProblem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  status: "attempted" | "solved" | "unsolved";
  acceptance: number;
  description: string;
  examples: { input: string; output: string }[];
  hints: string[];
}

const Practice = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<CodeProblem | null>(null);
  const [code, setCode] = useState("// Write your code here\n\n");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  // Mock problems data
  const problems: CodeProblem[] = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      category: "Arrays",
      status: "solved",
      acceptance: 47.2,
      description:
        "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.\n\nYou may assume that each input has exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
        },
        {
          input: "nums = [3,2,4], target = 6",
          output: "[1,2]",
        },
      ],
      hints: ["Use a hash map to store values you've seen", "For each number, check if target - num exists in the map"],
    },
    {
      id: 2,
      title: "Reverse String",
      difficulty: "Easy",
      category: "Strings",
      status: "solved",
      acceptance: 79.5,
      description:
        "Write a function that reverses a string. The input string is given as an array of characters s.",
      examples: [
        { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
        { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
      ],
      hints: ["Use two pointers approach", "Swap characters from start and end"],
    },
    {
      id: 3,
      title: "Binary Search",
      difficulty: "Medium",
      category: "DSA",
      status: "attempted",
      acceptance: 43.8,
      description:
        "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.",
      examples: [
        { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
        { input: "nums = [-1,0,3,5,9,12], target = 13", output: "-1" },
      ],
      hints: ["Use binary search algorithm", "Split the search space in half each time"],
    },
    {
      id: 4,
      title: "Longest Palindrome",
      difficulty: "Medium",
      category: "Strings",
      status: "unsolved",
      acceptance: 37.5,
      description:
        "Given a string s, return the longest palindromic substring in s.",
      examples: [
        { input: 's = "babad"', output: '"bab" or "aba"' },
        { input: 's = "cbbd"', output: '"bb"' },
      ],
      hints: ["Consider all possible substrings", "Use dynamic programming or expand around center"],
    },
    {
      id: 5,
      title: "Merge Sorted Array",
      difficulty: "Easy",
      category: "Arrays",
      status: "unsolved",
      acceptance: 42.1,
      description:
        "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n representing the number of valid elements in nums1 and nums2 respectively.",
      examples: [
        { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]" },
      ],
      hints: ["Start from the end of both arrays", "Compare and place larger elements at the end"],
    },
    {
      id: 6,
      title: "Fibonacci Number",
      difficulty: "Easy",
      category: "Recursion",
      status: "unsolved",
      acceptance: 68.9,
      description:
        "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones.",
      examples: [
        { input: "n = 2", output: "1" },
        { input: "n = 3", output: "2" },
        { input: "n = 4", output: "3" },
      ],
      hints: ["Simple recursion with memoization", "Or use iterative approach for better performance"],
    },
  ];

  const difficulties = ["All", "Easy", "Medium", "Hard", "Completed"];
  const categories = ["Arrays", "Strings", "Recursion", "DSA", "JavaScript", "React", "Python"];

  // Filter problems
  const filteredProblems = useMemo(() => {
    let filtered = problems;

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedDifficulty && selectedDifficulty !== "All") {
      if (selectedDifficulty === "Completed") {
        filtered = filtered.filter((p) => p.status === "solved");
      } else {
        filtered = filtered.filter((p) => p.difficulty === selectedDifficulty);
      }
    }

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    return filtered;
  }, [searchQuery, selectedDifficulty, selectedCategory]);

  // Calculate stats
  const stats = {
    solved: problems.filter((p) => p.status === "solved").length,
    attempted: problems.filter((p) => p.status === "attempted").length,
    total: problems.length,
    accuracy: Math.round(
      (problems.filter((p) => p.status === "solved").length / problems.length) * 100,
    ),
    streak: 7,
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setOutput("✓ Output:\nTest case 1 passed\nTest case 2 passed\n2/2 test cases passed");
      setIsRunning(false);
    }, 1500);
  };

  const handleSubmitCode = async () => {
    setIsRunning(true);
    setTimeout(() => {
      setOutput(
        "✓ Accepted!\nRuntime: 48ms (faster than 65.32%)\nMemory: 42.1MB (better than 23.45%)",
      );
      setIsRunning(false);
      if (selectedProblem) {
        setSelectedProblem({ ...selectedProblem, status: "solved" });
      }
    }, 2000);
  };

  const handleResetCode = () => {
    setCode("// Write your code here\n\n");
    setOutput("");
  };

  return selectedProblem ? (
    // Editor View
    <div className="space-y-4">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSelectedProblem(null)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
          <span>Back to Problems</span>
        </button>
        <h1 className="text-2xl font-bold">{selectedProblem.title}</h1>
        <div className="w-24"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Problem Panel */}
        <div className="space-y-4">
          <Card className="gradient-card border-card-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Problem</CardTitle>
                <Badge
                  className={`${
                    selectedProblem.difficulty === "Easy"
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : selectedProblem.difficulty === "Medium"
                        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                  }`}
                >
                  {selectedProblem.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto max-h-96">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedProblem.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Examples</h3>
                <div className="space-y-2">
                  {selectedProblem.examples.map((example, idx) => (
                    <div
                      key={idx}
                      className="bg-surface-elevated/50 border border-border/50 rounded-lg p-3 text-xs"
                    >
                      <div className="font-mono">
                        <div className="text-muted-foreground">Input: {example.input}</div>
                        <div className="text-brand-success mt-1">Output: {example.output}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Hints</h3>
                <ul className="space-y-1">
                  {selectedProblem.hints.map((hint, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                      <Lightbulb className="w-4 h-4 text-brand-warning flex-shrink-0 mt-0.5" />
                      {hint}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* AI Help Panel */}
          <Card className="gradient-card border-card-border bg-gradient-to-br from-brand-primary/10 to-purple-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="w-5 h-5 text-brand-primary" />
                AI Help
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-xs border-brand-primary/30 hover:bg-brand-primary/10"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Explain Problem
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs border-yellow-500/30 hover:bg-yellow-500/10"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Show Hint
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs border-purple-500/30 hover:bg-purple-500/10"
              >
                <Code className="w-4 h-4 mr-2" />
                Generate Solution
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs border-amber-500/30 hover:bg-amber-500/10"
              >
                <Zap className="w-4 h-4 mr-2" />
                Optimize Code
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Code Editor Panel */}
        <div className="space-y-4 flex flex-col">
          {/* Editor */}
          <Card className="gradient-card border-card-border flex-1 flex flex-col">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2">
                <Code className="w-5 h-5" />
                Code Editor
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-surface-elevated/50 border-0 text-sm font-mono text-foreground placeholder-muted-foreground focus:outline-none p-4 resize-none focus:ring-0"
                placeholder="// Write your code here"
              />
            </CardContent>
          </Card>

          {/* Output */}
          {output && (
            <Card className="gradient-card border-card-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Output</CardTitle>
              </CardHeader>
              <CardContent className="font-mono text-xs whitespace-pre-wrap text-muted-foreground">
                {output}
              </CardContent>
            </Card>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/40 text-white border-0 rounded-lg font-medium"
            >
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
            <Button
              onClick={handleSubmitCode}
              disabled={isRunning}
              className="flex-1 bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-lg hover:shadow-brand-primary/40 text-white border-0 rounded-lg font-medium"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit
            </Button>
            <Button
              onClick={handleResetCode}
              variant="outline"
              className="border-border/50 hover:bg-surface-elevated/80 rounded-lg"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    // Problem List View
    <div className="space-y-6">
      {/* Header */}
      <div className="max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Practice Coding</h1>
        <p className="text-lg text-muted-foreground">
          Solve problems and improve your skills
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="gradient-card border-card-border">
          <CardContent className="pt-4 text-center">
            <div className="text-3xl font-bold text-brand-success mb-1">{stats.solved}</div>
            <div className="text-xs font-medium text-muted-foreground uppercase">Solved</div>
          </CardContent>
        </Card>
        <Card className="gradient-card border-card-border">
          <CardContent className="pt-4 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">{stats.attempted}</div>
            <div className="text-xs font-medium text-muted-foreground uppercase">Attempted</div>
          </CardContent>
        </Card>
        <Card className="gradient-card border-card-border">
          <CardContent className="pt-4 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-1">{stats.accuracy}%</div>
            <div className="text-xs font-medium text-muted-foreground uppercase">Accuracy</div>
          </CardContent>
        </Card>
        <Card className="gradient-card border-card-border">
          <CardContent className="pt-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-3xl font-bold text-orange-400">{stats.streak}</span>
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase">Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="gradient-card border-card-border">
        <CardContent className="pt-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-elevated/50 border border-border/50 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>

          {/* Difficulty Filters */}
          <div className="flex flex-wrap gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() =>
                  setSelectedDifficulty(diff === selectedDifficulty ? null : diff)
                }
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedDifficulty === diff
                    ? "bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/30"
                    : "bg-surface-elevated/50 border border-border/50 text-muted-foreground hover:border-brand-primary/50"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-brand-primary text-white"
                    : "bg-surface-elevated/50 border border-border/50 text-muted-foreground hover:border-brand-primary/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Problems List */}
      {filteredProblems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <BookOpen className="w-16 h-16 text-muted-foreground opacity-20 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Problems Found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Try adjusting your filters or search to find coding problems
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredProblems.map((problem) => (
            <Card
              key={problem.id}
              className="gradient-card border-card-border hover:border-brand-primary/30 hover:shadow-card transition-all cursor-pointer group"
              onClick={() => setSelectedProblem(problem)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Status Icon */}
                    {problem.status === "solved" && (
                      <CheckCircle className="w-5 h-5 text-brand-success flex-shrink-0" />
                    )}
                    {problem.status === "attempted" && (
                      <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    )}
                    {problem.status === "unsolved" && (
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                    )}

                    {/* Problem Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold group-hover:text-brand-primary transition-colors truncate">
                        {problem.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Acceptance: {problem.acceptance}%
                      </p>
                    </div>
                  </div>

                  {/* Tags and Buttons */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge
                      className={`text-xs ${
                        problem.difficulty === "Easy"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : problem.difficulty === "Medium"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}
                    >
                      {problem.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {problem.category}
                    </Badge>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-brand-primary to-brand-primary/80 hover:shadow-lg hover:shadow-brand-primary/40 text-white border-0 rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProblem(problem);
                      }}
                    >
                      Solve
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Practice;
