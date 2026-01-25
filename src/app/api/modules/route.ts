import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { modules } from "@/lib/db/schema";
import { moduleCreateSchema } from "@/lib/validators";
import { requireRoleOrResponse } from "@/lib/auth/server";

export async function GET() {
  const data = await db.select().from(modules);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { response } = await requireRoleOrResponse(["ADMIN"]);
  if (response) return response;

  const payload = await request.json();
  const parsed = moduleCreateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  const [created] = await db.insert(modules).values(parsed.data).returning();
  return NextResponse.json(created, { status: 201 });
}
