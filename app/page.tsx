"use client"

import {
  Drawer,
  DrawerContent
} from "@/components/ui/drawer"

import * as React from "react"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import LinksContainer from "@/container/LinksContainer"
import { useState } from "react"
import FormContainer from "@/container/FormContainer/index"
import SessionContainer from "@/container/SessionContainer"
import useSWR from "swr"

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

export function Home() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const { data, error, isLoading, mutate } = useSWR("/api/links", fetcher, {
        refreshInterval: 10000
    });

    // LEMPAR KE HALAMAN LOGIN SAAT BELUM AUTHENTICATED
    React.useEffect(() => {
        if (status === "loading") return; 

        if (status !== "authenticated") {
            router.push("/login") 
        }
    }, [status, router])


    const [Loading, setLoading] = useState<boolean>(false);
    const [showCreate, setShowCreate] = useState<boolean>(false);

    return (
        <>
            <div className={`fixed inset-0 z-99 flex items-center justify-center bg-black/50 ${Loading ? '' : 'hidden'}`}>
                <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin" />
            </div>
            
            <div className="container mx-auto">
                <div className="user-info flex items-center justify-between">
                    <div className="flex gap-4 items-center justify-center">
                        <div className="flex flex-col">
                            <h1 className="font-bold text-3xl">Hi, {`${session?.user?.name || 'Username'}`}</h1>
                            <p>Email: {`${session?.user?.email || "Email"}`}</p>
                        </div>
                        <Button onClick={() => signOut()}>Sign Out</Button>
                    </div>
                    <Button onClick={() => setShowCreate(true)}>+ Add Link</Button>
                </div>

                <LinksContainer 
                    dataLinks={data}
                    error={error}
                    isLoading={isLoading}
                    Loading={Loading}
                    setLoading={setLoading}
                    onFinished = {() => {
                        mutate();
                        setLoading(false);
                    }}
                />
            </div>

            {/* DRAWER CREATE */}
            <Drawer open={showCreate} onOpenChange={setShowCreate}>
                <DrawerContent>
                    <div className="container mx-auto p-4">
                        <FormContainer Loading={Loading} setLoading={setLoading} onFinished={
                            () => {
                                setShowCreate(false);
                                setLoading(false);
                                mutate();
                            }
                        }/>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default function HomePage() {
  return (
    <SessionContainer>
      <Home />
    </SessionContainer>
  )
}

