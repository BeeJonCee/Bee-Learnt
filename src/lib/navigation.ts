export function getDashboardPath(role?: string) {
  if (role === "ADMIN") return "/admin";
  if (role === "PARENT") return "/dashboard/parent";
  return "/dashboard/student";
}
