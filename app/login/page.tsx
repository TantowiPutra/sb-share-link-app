'use client'

import { useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import SessionContainer from "@/container/SessionContainer"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

function LoginContent() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return; 
    
    if (status === "authenticated") {
      router.push("/") 
    }
  }, [status, router])

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Silahkan Login pakai Akun Google</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Button onClick={() => signIn("google")}>
              Sign in with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <SessionContainer>
      <LoginContent />
    </SessionContainer>
  )
}
