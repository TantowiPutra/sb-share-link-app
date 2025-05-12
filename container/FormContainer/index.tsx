"use client"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from "@/components/ui/form"

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input"
import useFormAction from "@/hooks/useFormAction"
import { formType } from "@/hooks/useFormAction";
import { Button } from "@/components/ui/button";
import { createLink, updateLink } from "@/app/server/action";
import { useEffect } from "react";

type FormState = {
  message?: string;
  errors?: {
    id? :string | number;
    title?: string;
    url?: string;
  };
  isSuccess?: boolean | null;
};

const initialState: FormState = {
  message: '',
  errors: {
    id: 0,
    title: '',
    url  : '',
  },
  isSuccess: null,
}

export default function FormContainer({id, Loading, setLoading, values, onFinished} : {
    id? : number;
    Loading?: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    values ?: formType;
    onFinished ?: () => void;
}) {
    const { form }              = useFormAction({ values });

    const handleAction = values?.id && values?.id > 0 ? updateLink : createLink;

    const [state, formAction]   = useActionState<FormState, FormData>(handleAction, initialState);

    useEffect(() => {
        if(!state.errors) {
            if (state?.isSuccess === true) {
                alert(state.message);
                onFinished?.();
                form.reset();
            }

            if (state?.isSuccess === false) {
                onFinished?.();
                alert("Gagal Submit/Edit Link ... (Coba lagi yaa.. kadang Neon databasenya lemot)");
                form.reset();
            }
        } {
            setLoading(false);
        }
    }, [state]);

    return (
        <>
            <Form {...form}>
                <form action={formAction} className="space-y-8" onSubmit={() => {
                    if(typeof setLoading === "function") {
                        setLoading(true);
                    }
                }}>
                    <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                        <Input placeholder="ID ..." {...field} type="hidden"/>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Title ..." {...field} />
                            </FormControl>
                            <FormDescription>
                                Title min. 1 Character(s)
                            </FormDescription>
                            <FormMessage />
                            {
                                state?.errors && typeof state.errors === 'object' && (
                                    <small className="text-red-500">{state?.errors?.title}</small>
                                )
                            }
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                            <Input placeholder="URL ..." {...field} />
                        </FormControl>
                        <FormDescription>
                            URl min. 1 Character(s)
                        </FormDescription>
                        <FormMessage />
                        {
                            state?.errors && typeof state.errors === 'object' && (
                                <small className="text-red-500">{state?.errors?.title}</small>
                            )
                        }
                        </FormItem>
                    )}
                    />

                    <Button type="submit" disabled={Loading}>Submit</Button>
                </form>
            </Form>
        </>
    );
}