"use client"

import {
  Drawer,
  DrawerContent
} from "@/components/ui/drawer"

import { Button } from "@/components/ui/button"
import LinksContainer from "@/container/LinksContainer"
import { useState } from "react"
import FormContainer from "@/container/FormContainer/index"

import useSWR from "swr"

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

export default function Home() {
    const { data, error, isLoading, mutate } = useSWR("/api/links", fetcher, {
        refreshInterval: 10000
    });

    const [showCreate, setShowCreate] = useState<boolean>(false);

    return (
        <>
            <div className="container mx-auto">
                <div className="user-info flex items-center justify-between">
                    <h1 className="font-bold text-3xl">Hi, {`Tantowi`}</h1>
                    <Button onClick={() => setShowCreate(true)}>+ Add Link</Button>
                </div>

                <LinksContainer 
                    dataLinks={data}
                    error={error}
                    isLoading={isLoading}
                    onFinished = {() => {
                        mutate();
                    }}
                />
            </div>

            <Drawer open={showCreate} onOpenChange={setShowCreate}>
                <DrawerContent>
                    <div className="container mx-auto p-4">
                        <FormContainer onFinished={
                            () => {
                                setShowCreate(false);
                                mutate();
                            }
                        }/>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}
