import { NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
  return new NextResponse(fs.readFileSync("src/assets/William McVay - Full Stack Developer.pdf"), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="William McVay - Full Stack Developer.pdf"',
    },
  });
}