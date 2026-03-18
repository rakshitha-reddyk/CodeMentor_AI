import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface Skill {
  name: string;
  level: number;
  improvement: number;
  color: string;
}

const SkillProgressChartCard: React.FC = () => {
  const [skills] = useState<Skill[]>([
    {
      name: "React",
      level: 85,
      improvement: 12,
      color: "from-blue-400 to-blue-600",
    },
    {
      name: "TypeScript",
      level: 78,
      improvement: 8,
      color: "from-blue-600 to-indigo-600",
    },
    {
      name: "JavaScript",
      level: 90,
      improvement: 5,
      color: "from-yellow-400 to-amber-600",
    },
    {
      name: "CSS",
      level: 72,
      improvement: 15,
      color: "from-pink-400 to-purple-600",
    },
    {
      name: "Testing",
      level: 65,
      improvement: 18,
      color: "from-green-400 to-emerald-600",
    },
  ]);

  return (
    <Card className="gradient-card border-card-border overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-400" />
          Skill Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.map((skill, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{skill.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-green-400">
                  +{skill.improvement}%
                </span>
                <span className="text-sm text-muted-foreground">
                  {skill.level}%
                </span>
              </div>
            </div>

            <div className="relative w-full rounded-full h-3 bg-surface-elevated/50 border border-border/50 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${skill.color} transition-all duration-500 shadow-lg`}
                style={{ width: `${skill.level}%` }}
              />
              <div
                className={`absolute top-0 left-0 h-full w-1 bg-gradient-to-r ${skill.color} opacity-75 animate-pulse`}
                style={{ left: `${skill.level}%`, marginLeft: "-2px" }}
              />
            </div>
          </div>
        ))}

        {/* Progress Summary */}
        <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-sm text-muted-foreground">Average Improvement</p>
          <p className="text-2xl font-bold text-green-400 mt-1">11.6%</p>
          <p className="text-xs text-green-400/70 mt-1">This month</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillProgressChartCard;
