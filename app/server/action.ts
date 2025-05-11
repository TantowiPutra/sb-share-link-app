'use server'

import { z } from 'zod'
import { linksTable } from "@/lib/db/schema"
import { db } from "@/lib/db"

type FormState = {
  message?: string;
  errors?: {
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
        errors?: object
        isSuccess?: boolean | null
    },
    formData: FormData,
): Promise<FormState> {
    const formSchema = z.object({
        title: z.string().min(1, 'Title Wajib Diisi(Server Action)!'),
        url : z.string().min(1, 'URL Wajib Diisi(Server Action)!'),
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

    try {
        const data = await db.insert(linksTable)
                             .values({
                                title: parse!.data!.title as string,
                                email: "" as string,
                                url  : parse!.data!.url as string
                             })
                             .returning({ insertedId: linksTable.id });

        console.log(data);

        return {
            message: "Sukses Insert Data!",
            isSuccess: true,
        }
    } catch(error) {
        return {
            message: "Insert Gagal",
            isSuccess: false,
            errors : error
        }
    }
}

export async function updateLink(
    prevState: {
        message: string
        errors: object
    },
    formData: FormData,
) {
    const formSchema = z.object({
        
    });
}

export async function deleteLink(
    prevState: {
        message: string
        errors: object
    },
    formData: FormData,
) {
    const formSchema = z.object({
        
    });
}