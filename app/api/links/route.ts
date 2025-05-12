import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { linksTable } from "@/lib/db/schema";
import { isNull, desc, and, eq } from 'drizzle-orm'
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
export async function GET(req: Request) {
    // TRY CATCH BLOCK KETIKA FETCH DATA GAGAL
    try {
        const session = await getServerSession(authOptions);
    
        if (!session) {
            return {
                message: "Unauthorized",
                isSuccess: false,
                errors: {
                    title: "",
                    url: "",
                }
            };
        }

        const linksData = await db.select()
                             .from(linksTable)
                             .where(and(isNull(linksTable.deleted_at), eq(linksTable.email, session!.user!.email as string)))
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