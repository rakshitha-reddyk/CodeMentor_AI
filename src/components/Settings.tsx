import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Bell,
  Moon,
  Sun,
  Code,
  LogOut,
  Save,
  RotateCcw,
  Upload,
  Edit2,
  Shield,
  Trash2,
  MessageSquare,
  Zap,
  Smartphone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserProfile {
  name: string;
  email: string;
  username: string;
  avatar: string;
}

interface PreferenceToggle {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

interface SecurityOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  danger: boolean;
}

const Settings: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Alex Johnson",
    email: "alex@codementor.ai",
    username: "alexjohnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  });

  const [formData, setFormData] = useState({
    fullName: profile.name,
    email: profile.email,
    skillLevel: "intermediate",
    favoriteLanguage: "javascript",
    learningGoal: "full-stack",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");

  const [preferences, setPreferences] = useState<PreferenceToggle[]>([
    {
      id: "dark-mode",
      label: "Dark Mode",
      description: "Use dark theme for the interface",
      icon: <Moon className="w-5 h-5" />,
      enabled: true,
    },
    {
      id: "notifications",
      label: "Notifications",
      description: "Receive email and push notifications",
      icon: <Bell className="w-5 h-5" />,
      enabled: true,
    },
    {
      id: "ai-suggestions",
      label: "AI Suggestions",
      description: "Get AI-powered code suggestions",
      icon: <Zap className="w-5 h-5" />,
      enabled: true,
    },
    {
      id: "auto-save",
      label: "Auto Save",
      description: "Automatically save your progress",
      icon: <Save className="w-5 h-5" />,
      enabled: false,
    },
  ]);

  const securityOptions: SecurityOption[] = [
    {
      id: "change-password",
      title: "Change Password",
      description: "Update your account password",
      icon: <Lock className="w-5 h-5" />,
      danger: false,
    },
    {
      id: "logout-devices",
      title: "Logout All Devices",
      description: "Sign out from all active sessions",
      icon: <Smartphone className="w-5 h-5" />,
      danger: false,
    },
    {
      id: "delete-account",
      title: "Delete Account",
      description: "Permanently delete your account and data",
      icon: <Trash2 className="w-5 h-5" />,
      danger: true,
    },
  ];

  const togglePreference = (id: string) => {
    setPreferences(
      preferences.map((pref) =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setProfile({
      ...profile,
      name: formData.fullName,
      email: formData.email,
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and preferences
        </p>
      </div>

      {/* Section 1: Profile */}
      <Card className="border-border/50 bg-surface-elevated/30 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-brand-primary/50 p-1">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full rounded-full"
                />
              </div>
              <Button variant="outline" size="sm" className="rounded-lg gap-2">
                <Upload className="w-4 h-4" />
                Upload Avatar
              </Button>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Name</p>
                <p className="text-lg font-semibold">{profile.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="text-lg font-semibold">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Username</p>
                <p className="text-lg font-semibold">@{profile.username}</p>
              </div>
              <Button variant="default" size="sm" className="rounded-lg gap-2 mt-4">
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Account Settings */}
      <Card className="border-border/50 bg-surface-elevated/30 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-surface-elevated/50 border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-brand-primary/50 transition-colors"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-surface-elevated/50 border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-brand-primary/50 transition-colors"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-surface-elevated/50 border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-brand-primary/50 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-surface-elevated/50 border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-brand-primary/50 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-surface-elevated/50 border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-brand-primary/50 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <Button
            onClick={handleSaveProfile}
            className="rounded-lg w-full gap-2 mt-4"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Section 3: Preferences */}
      <Card className="border-border/50 bg-surface-elevated/30 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {preferences.map((pref) => (
            <div
              key={pref.id}
              className="flex items-center justify-between p-4 rounded-lg bg-surface-elevated/50 border border-border/30 hover:border-border/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
                  {pref.icon}
                </div>
                <div>
                  <p className="font-medium">{pref.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {pref.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => togglePreference(pref.id)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  pref.enabled
                    ? "bg-green-600/80 hover:bg-green-600"
                    : "bg-surface-elevated/80 hover:bg-surface-elevated"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 rounded-full bg-white transition-transform ${
                    pref.enabled ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Section 4: Learning Preferences */}
      <Card className="border-border/50 bg-surface-elevated/30 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Learning Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Skill Level
            </label>
            <Select value={formData.skillLevel}>
              <SelectTrigger className="rounded-lg bg-surface-elevated/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Favorite Language
            </label>
            <Select value={formData.favoriteLanguage}>
              <SelectTrigger className="rounded-lg bg-surface-elevated/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="rust">Rust</SelectItem>
                <SelectItem value="go">Go</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Learning Goal
            </label>
            <Select value={formData.learningGoal}>
              <SelectTrigger className="rounded-lg bg-surface-elevated/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frontend">Frontend Dev</SelectItem>
                <SelectItem value="backend">Backend Dev</SelectItem>
                <SelectItem value="full-stack">Full Stack</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Security */}
      <Card className="bg-surface-elevated/30 backdrop-blur border border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {securityOptions.map((option) => (
            <div
              key={option.id}
              className="flex items-center justify-between p-4 rounded-lg bg-surface-elevated/50 border border-border/30 hover:border-border/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    option.danger
                      ? "bg-red-500/10 text-red-500"
                      : "bg-amber-500/10 text-amber-500"
                  }`}
                >
                  {option.icon}
                </div>
                <div>
                  <p className="font-medium">{option.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
              <Button
                variant={option.danger ? "destructive" : "outline"}
                size="sm"
                className="rounded-lg"
              >
                {option.danger ? "Delete" : "Update"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Section 6: Theme */}
      <Card className="border-border/50 bg-surface-elevated/30 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5" />
            Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["dark", "light", "system"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === t
                    ? "border-brand-primary bg-brand-primary/10"
                    : "border-border/50 bg-surface-elevated/30 hover:border-border/80"
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  {t === "dark" ? (
                    <Moon className="w-6 h-6" />
                  ) : t === "light" ? (
                    <Sun className="w-6 h-6" />
                  ) : (
                    <Smartphone className="w-6 h-6" />
                  )}
                </div>
                <p className="font-medium capitalize">{t} Mode</p>
                {theme === t && (
                  <Badge className="mt-2 bg-brand-primary/80 text-white w-full justify-center">
                    Active
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 7: About */}
      <Card className="border-border/50 bg-surface-elevated/30 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-surface-elevated/50 border border-border/30">
              <p className="text-xs text-muted-foreground mb-1">Version</p>
              <p className="font-semibold text-lg">1.0.0</p>
            </div>
            <div className="p-4 rounded-lg bg-surface-elevated/50 border border-border/30">
              <p className="text-xs text-muted-foreground mb-1">App Name</p>
              <p className="font-semibold text-lg">CodeMentor</p>
            </div>
            <div className="p-4 rounded-lg bg-surface-elevated/50 border border-border/30">
              <p className="text-xs text-muted-foreground mb-1">Developer</p>
              <p className="font-semibold text-lg">AI Team</p>
            </div>
            <div className="p-4 rounded-lg bg-surface-elevated/50 border border-border/30">
              <p className="text-xs text-muted-foreground mb-1">License</p>
              <p className="font-semibold text-lg">MIT</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-surface-elevated/50 border border-border/30">
            <p className="text-sm text-muted-foreground mb-2">Description</p>
            <p className="text-sm">
              CodeMentor AI is an AI-powered coding learning platform designed
              to help developers master new skills through interactive lessons,
              AI-assisted coding, and practice problems.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 8: Actions */}
      <Card className="border-border/50 bg-surface-elevated/30 backdrop-blur">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Button className="rounded-lg gap-2 flex-1">
            <Save className="w-4 h-4" />
            Save All Changes
          </Button>
          <Button variant="outline" className="rounded-lg gap-2 flex-1">
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </Button>
          <Button
            variant="destructive"
            className="rounded-lg gap-2 flex-1"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
