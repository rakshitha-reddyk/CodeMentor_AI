import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  title?: string;
  lead?: string;
  features?: string[];
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  onClose: () => void;
}

const PremiumModal: React.FC<Props> = ({
  open,
  title = "Premium Feature",
  lead = "Detailed AI explanations are available in the premium experience.",
  features = [],
  primaryLabel = "Try Premium",
  secondaryLabel = "Close",
  onPrimary,
  onSecondary,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-brand-primary/50 bg-surface-elevated shadow-2xl">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-foreground">{lead}</p>

          {features.length > 0 && (
            <div className="space-y-2">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="text-sm text-foreground flex items-start gap-2"
                >
                  <span className="text-brand-primary font-semibold mr-2">
                    •
                  </span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              className="flex-1"
              onClick={() => {
                onPrimary?.();
              }}
            >
              {primaryLabel}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onSecondary?.();
              }}
            >
              {secondaryLabel}
            </Button>
          </div>

          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumModal;
