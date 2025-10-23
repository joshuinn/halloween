import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const peopleCount = searchParams.get("peopleCount");

    if (!name) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }

    //save in supabase

    const { data, error } = await supabase
      .from("people")
      .insert([
        { name: name, peopleCount: peopleCount ? parseInt(peopleCount) : 1 },
      ]);

    if (error) {
      console.error(error);

      return NextResponse.json(
        { message: "Database error", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Confirmed", data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
