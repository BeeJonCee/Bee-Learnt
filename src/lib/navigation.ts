import type { UserRole } from "@/lib/demo-data";

export function getDashboardPath(role: UserRole) {
  return role === "parent" ? "/dashboard/parent" : "/dashboard/student";
}
