import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, mobile, email, service, message } = body;

  if (!name || !mobile) {
    return NextResponse.json({ error: "Name and mobile are required." }, { status: 400 });
  }

  const { error } = await supabase.from("enquiries").insert({
    name, mobile, email: email || null, service: service || null, message: message || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
