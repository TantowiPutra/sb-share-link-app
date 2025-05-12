'use server'

import { z } from 'zod'
import { linksTable } from "@/lib/db/schema"
import { db } from "@/lib/db"
import { sql,eq } from "drizzle-orm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

type FormState = {
  message?: string;
  errors?: {
    id? :string;
    title?: string;
    url?: string;
  };
  isSuccess?: boolean | null;
};

type FieldErrors = {
  [key: string]: string[]
}

export async function createLink(
    prevState: {
        message?: string
        data?: object
        isSuccess?: boolean | null
    },
    formData: FormData,
): Promise<FormState> {
    const formSchema = z.object({
        title: z.string().min(1, 'Title Wajib Diisi(Server Action)!'),
        url  : z.string().min(1, 'URL Wajib Diisi(Server Action)!'),
    });

    const parse = formSchema.safeParse({
        title: formData.get('title'),
        url  : formData.get('url'),
    })

    if (!parse.success) {
        const fieldErrors: FieldErrors = parse.error.formErrors.fieldErrors || {}

        const errors = Object.keys(fieldErrors)?.reduce((acc, key) => {
            acc[key] = fieldErrors[key]?.[0] || 'Unknown error'
            return acc
        }, {} as Record<string, string>)

        return { 
            errors : errors,
            isSuccess: false
        }
    }

    // KARENA APP ROUTER TIDAK MENERIMA PARAMETER REQUEST, MAKA GAK BSIA PAKAI getToken()
    const session = await getServerSession(authOptions);

    if (!session) {
        return {
            message: "Unauthorized",
            isSuccess: false,
            errors: {
                title: parse!.data!.title,
                url: parse!.data!.url,
            }
        };
    }

    try {
        const data = await db.insert(linksTable)
                             .values({
                                title: parse!.data!.title as string,
                                email: session!.user!.email as string,
                                url  : parse!.data!.url as string
                             })
                             .returning({ insertedId: linksTable.id });

        return {
            message: "Sukses Insert Data!",
            isSuccess: true,
        }
    } catch(error) {
        return {
            message: "Insert Gagal",
            isSuccess: false,
            errors: {
                title: "",
                url: "",
            }
        }
    }
}

export async function updateLink(
    prevState: {
        message?: string
        errors?: object
        isSuccess?: boolean | null
    },
    formData: FormData,
) {
    const formSchema = z.object({
        id: z.string().optional(),
        title: z.string().min(1, 'Title Wajib Diisi(Server Action)!'),
        url : z.string().min(1, 'URL Wajib Diisi(Server Action)!'),
    });

    const parse = formSchema.safeParse({
        id   : formData.get('id'),
        title: formData.get('title'),
        url  : formData.get('url'),
    })

    if (!parse.success) {
        const fieldErrors: FieldErrors = parse.error.formErrors.fieldErrors || {}

        const errors = Object.keys(fieldErrors)?.reduce((acc, key) => {
            acc[key] = fieldErrors[key]?.[0] || 'Unknown error'
            return acc
        }, {} as Record<string, string>)

        console.log(errors)

        return { 
            errors : errors,
            isSuccess: false
        }
    }

    try {
        const data = await db.update(linksTable)
                             .set({
                                title: parse.data.title,
                                url  : parse.data.url,
                                updated_at: sql`NOW()`
                             })
                             .where(eq(linksTable.id, Number(parse.data.id)))
                             .returning({ updatedId: linksTable.id });

        return {
            message: "Sukses Update Data!",
            isSuccess: true,
        }
    } catch(error) {
        return {
            message: "Insert Gagal",
            isSuccess: false,
            errors: {
                title: "",
                url: "",
            }
        }
    }
}