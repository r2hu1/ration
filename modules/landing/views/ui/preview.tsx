import {
  CheckCircle2,
  Code2,
  Database,
  GitBranch,
  Key,
  Lock,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Preview() {
  return (
    <div className="px-6 mx-auto max-w-4xl py-20">
      <div className="relative">
        <Card className="p-8 shadow-2xl">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-0 justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary">
                  <Database className="w-4 h-4 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">
                    My Cool App
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    12 variables configured
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="gap-1">
                <Shield className="w-3 h-3" />
                Encrypted
              </Badge>
            </div>

            {/* Environment Variables List */}
            <div className="space-y-3">
              {[
                {
                  key: "DATABASE_URL",
                  value: "postgresql://***",
                  icon: Database,
                },
                { key: "API_SECRET_KEY", value: "••••••••••••••••", icon: Key },
                {
                  key: "STRIPE_API_KEY",
                  value: "sk_live_••••••••",
                  icon: Lock,
                },
                {
                  key: "GITHUB_TOKEN",
                  value: "ghp_••••••••••••",
                  icon: GitBranch,
                },
              ].map((env, index) => {
                const Icon = env.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-mono text-sm font-medium">
                          {env.key}
                        </div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {env.value}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Code2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Footer Actions */}
            <div className="flex gap-2 flex-wrap pt-4">
              <Button variant="outline" className="flex-1">
                Add Variable
              </Button>
              <Button variant="outline" className="flex-1">
                Import .env
              </Button>
              <Button className="flex-1">Deploy</Button>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>All systems operational</span>
              </div>
              <span>Last synced: 2 min ago</span>
            </div>
          </div>
        </Card>

        {/* Floating Elements */}
        <div className="absolute -right-2 -top-4 sm:-right-6 p-2 bg-card border shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium">Synced</span>
          </div>
        </div>

        <div className="absolute -bottom-4 -left-2 sm:-left-6 p-2 bg-card border shadow-lg">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium">AES-256 Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
