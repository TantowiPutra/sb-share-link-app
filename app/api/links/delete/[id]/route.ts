// app/api/links/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { linksTable } from '@/lib/db/schema';
import { db } from '@/lib/db';
import { sql,eq } from "drizzle-orm";

export async function DELETE(
  req: NextRequest,
  { params } : {params: Promise<{ id: string }>}
) {
    const id = (await params).id;

    try {
        const data = await db.update(linksTable)
                             .set({
                                deleted_at: sql`NOW()`
                             })
                             .where(eq(linksTable.id, Number(id)))
                             .returning({ deletedId: linksTable.id });

        return NextResponse.json(
        {
            message: "Delete Link Success",
            data: data,
        },
        {
            status: 200
        });
    } catch (error) {
        console.log(error)

        return NextResponse.json(
        {
            message: "Delete Link Failed",
            data: {},
        },
        {
            status: 500
        });
    }
}
