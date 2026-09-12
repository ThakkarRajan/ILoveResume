import {
  Code2,
  Wrench,
  Users,
  Database,
  Cloud,
  Palette,
  Terminal,
  Layers,
  Award,
} from "lucide-react";

const RULES = [
  { test: /tech|front|back|full|lang|program|software|engineer/i, icon: Code2 },
  { test: /tool|devops|ci|cd|git|ops/i, icon: Wrench },
  { test: /soft|lead|comm|people|collab/i, icon: Users },
  { test: /data|sql|db|postgres|mongo/i, icon: Database },
  { test: /cloud|aws|azure|gcp|infra/i, icon: Cloud },
  { test: /design|ui|ux|figma|visual/i, icon: Palette },
  { test: /cli|shell|terminal|script/i, icon: Terminal },
  { test: /framework|library|stack/i, icon: Layers },
];

export function skillCategoryIcon(categoryKey) {
  const key = String(categoryKey || "");
  for (const rule of RULES) {
    if (rule.test.test(key)) return rule.icon;
  }
  return Award;
}
