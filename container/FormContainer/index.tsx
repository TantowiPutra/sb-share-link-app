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
    title?: string;
    url?: string;
  };
  isSuccess?: boolean | null;
};

const initialState: FormState = {
  message: '',
  errors: {
    title: '',
    url  : '',
  },
  isSuccess: null,
}

export default function FormContainer({id, values, onFinished} : {
    id? : number; 
    values ?: formType;
    onFinished ?: () => void;
}) {
    const { form }              = useFormAction({values});
    const [Loading, setLoading] = useState<boolean>(false);
    const [state, formAction]   = useActionState<FormState, FormData>(createLink, initialState);

    useEffect(() => {
        if (state?.isSuccess === true) {
            // Success logic
            setLoading(false);
            alert("Berhasil Submit Link Baru!");
            onFinished?.();
            form.reset();
        }

        if (state?.isSuccess === false) {
            setLoading(false);
            onFinished?.();
            alert("Gagal Submit Link Baru...");
            form.reset();
        }
    }, [state]);

    return (
        <>
            <Form {...form}>
                <form action={formAction} className="space-y-8" onSubmit={() => setLoading(true)}>
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

                    <Button type="submit" disabled={Loading}>{ Loading ? "Loading..." : "Submit" }</Button>
                </form>
            </Form>
        </>
    );
}