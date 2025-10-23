import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
//data from people table
/*
id: number
name: string
peopleCount: number
created_at: timestamp
*/
export async function GET() {
  try {
    const { data, error} = await supabase.from("people").select("*");
    if (error) {
      throw error;
    }
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
