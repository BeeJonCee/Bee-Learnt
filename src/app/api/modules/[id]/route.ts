import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { modules } from "@/lib/db/schema";
import { moduleUpdateSchema } from "@/lib/validators";
import { requireRoleOrResponse } from "@/lib/auth/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const [module] = await db.select().from(modules).where(eq(modules.id, id));
  if (!module) {
    return NextResponse.json({ message: "Module not found" }, { status: 404 });
  }
  return NextResponse.json(module);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { response } = await requireRoleOrResponse(["ADMIN"]);
  if (response) return response;

  const id = Number(params.id);
  const payload = await request.json();
  const parsed = moduleUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  const [updated] = await db
    .update(modules)
    .set(parsed.data)
    .where(eq(modules.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ message: "Module not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { response } = await requireRoleOrResponse(["ADMIN"]);
  if (response) return response;

  const id = Number(params.id);
  const [deleted] = await db.delete(modules).where(eq(modules.id, id)).returning();

  if (!deleted) {
    return NextResponse.json({ message: "Module not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
