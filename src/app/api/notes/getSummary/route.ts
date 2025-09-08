import { getSummaryData } from "@/database/database-service-notes";
import { SummaryDataType } from "@/types/summary-data.types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data: SummaryDataType | null = await getSummaryData()
    if (!data) throw new Error("Pas de 'SummaryData'") 
    console.log("Summary data: ", data);
    
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}