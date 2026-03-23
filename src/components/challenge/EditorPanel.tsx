import React, { useState } from "react";
import { Challenge } from "@/data/challengeTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Code, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorPanelProps {
  challenge: Challenge;
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  challenge,
  code,
  language,
  onCodeChange,
  onLanguageChange,
  onRun,
  onSubmit,
  isRunning = false,
  isSubmitting = false,
}) => {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // Template code for each language
  const templates: Record<string, string> = {
    JavaScript: `function solve(input) {
  // Your code here
  
  return output;
}

// Example:
// console.log(solve("hello")); // expected: "olleh"
`,
    TypeScript: `function solve(input: string): string {
  // Your code here
  
  return output;
}

// Example:
// console.log(solve("hello")); // expected: "olleh"
`,
    Python: `def solve(input):
    # Your code here
    
    return output

# Example:
# print(solve("hello"))  # expected: "olleh"
`,
    Java: `public class Solution {
    public static String solve(String input) {
        // Your code here
        
        return output;
    }
    
    public static void main(String[] args) {
        // Test your solution
        System.out.println(solve("hello")); // expected: "olleh"
    }
}
`,
  };

  const handleLanguageChange = (newLanguage: string) => {
    onLanguageChange(newLanguage);
    setShowLanguageSelector(false);
    // Optionally reset code to template
    if (!code || code.trim().length < 20) {
      onCodeChange(templates[newLanguage] || "");
    }
  };

  const insertTemplate = () => {
    onCodeChange(templates[language] || "");
  };

  return (
    <Card className="h-full flex flex-col bg-card border-border overflow-hidden">
      <CardHeader className="border-b border-border/50 pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Code className="w-5 h-5 text-codementor-cyan" />
            Code Editor
          </CardTitle>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {challenge.languages.map((lang) => (
                  <SelectItem key={lang} value={lang} className="text-xs">
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden pt-3">
        {/* Editor Area */}
        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-muted-foreground">
              {language} • {code.length} characters
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={insertTemplate}
              className="text-xs h-7"
            >
              Insert Template
            </Button>
          </div>

          <textarea
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder={`Write your ${language} solution here...\n\n// Example:\n// Your code logic`}
            className={cn(
              "flex-1 w-full bg-background border border-border/50 rounded p-3 font-mono text-xs",
              "text-codementor-cyan resize-none focus:outline-none focus:border-brand-primary/50",
              "focus:ring-1 focus:ring-brand-primary/20",
            )}
            spellCheck="false"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={onRun}
            disabled={isRunning || isSubmitting || !code.trim()}
            variant="outline"
            className="flex-1 text-xs h-9"
          >
            {isRunning ? (
              <>
                <span className="animate-spin inline-block mr-1">⟳</span>
                Running...
              </>
            ) : (
              "Run"
            )}
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isRunning || isSubmitting || !code.trim()}
            className="flex-1 bg-gradient-to-r from-brand-primary to-brand-primary/80 hover:from-brand-primary/90 hover:to-brand-primary/70 text-xs h-9"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin inline-block mr-1">⟳</span>
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditorPanel;
