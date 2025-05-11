import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { linksTable } from "@/lib/db/schema";
import { isNull, desc } from 'drizzle-orm'

export async function GET(req: Request) {
    // TRY CATCH BLOCK KETIKA FETCH DATA GAGAL
    try {
        const linksData = await db.select()
                            .from(linksTable)
                            .where(isNull(linksTable.deleted_at))
                            .orderBy(desc(linksTable.updated_at))

        return NextResponse.json(
        {
            message: "Fetch Success",
            data: linksData,
        },
        {
            status: 200
        });
    } catch(error) {
        console.log("Error => ", error);
        return NextResponse.json(
            {
                message: "Something Went Wrong!",
            },
            {
                status: 500
            }
        );
    }
}