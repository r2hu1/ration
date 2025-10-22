import { Key, Lock, Shield, Zap } from "lucide-react";

const features = [
  { icon: Lock, text: "Secure Storage" },
  { icon: Key, text: "Easy Access" },
  { icon: Shield, text: "Encrypted" },
  { icon: Zap, text: "Fast Sync" },
];

export default function Features() {
  return (
    <div className="flex flex-wrap gap-6 px-6 sm:justify-center">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div key={index} className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium">{feature.text}</span>
          </div>
        );
      })}
    </div>
  );
}
