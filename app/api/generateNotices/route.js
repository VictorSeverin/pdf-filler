import { NextRequest, NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import { parseExcel } from "@/lib/utils";
export const config = {
  api: {
    bodyParser: false,
  },
};
export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  if (!file) {
    return NextResponse.json(
      { error: "File blob is required." },
      { status: 400 }
    );
  }
  const units = await parseExcel(file);
  console.log(units);

  return new Response("hello");
}
