"use client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"

import { useState } from "react"

type Link = {
    id: number
    title: string
    url: string
    email: string
    created_at: string
    updated_at: string
}

type dataLink = {
    message: string;
    data   : Link[];
}

export default function LinksContainer({ dataLinks: data, error: error, isLoading: isLoading, onFinished }: {dataLinks: dataLink; error: object; isLoading: boolean; onFinished: () => void}) {  
    const[deletedId, setDeletedId] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        const response = await fetch(`/api/links/delete/${id}`, {
            method: "DELETE"
        })

        if(response.ok) {
            alert("Berhasil Delete Link");
        } else {
            alert("Gagal Delete Link");
        }

        onFinished?.();
    };
    
    return (
      <>
        <div className="links-wrapper grid grid-1 gap-4 mt-3">
          {
              isLoading && "Loading..."
          }
          {
              error ? "Something Went Wrong" : 
              data?.data?.map((data: Link) => 
                  <Card key={data.id}>
                      <CardContent>
                          <div className="action-wrapper flex gap-4 flex-col justify-start items-start">
                              <CardTitle>Actions</CardTitle>
                              <div className="buttons flex gap-3">
                                  <Button size="sm" variant="default">Edit</Button>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="default" size="sm" onClick={() => setDeletedId(data.id)}>Delete</Button>
                                        </PopoverTrigger>
                                        {
                                            deletedId == data.id &&
                                            <PopoverContent className="w-80">
                                                <div className="grid flex flex-col items-center justify-center gap-4">
                                                    <p>Apakah anda yakin untuk delete link ini?</p>
                                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(data.id)}>Ya</Button>
                                                </div>
                                            </PopoverContent>
                                        }
                                    </Popover>
                              </div>
                          </div>
                          
                          <div className="card-title mt-5">
                              <CardTitle>Link Title</CardTitle>
                              <CardDescription>{data.title}</CardDescription>
                          </div>

                          <div className="card-description mt-5">
                              <CardTitle>Link URL</CardTitle>
                              <CardDescription>{data.url}</CardDescription>
                          </div>

                          <div className="card-owner mt-5">
                              <CardTitle>Link Owner</CardTitle>
                              <CardDescription>{data.email}</CardDescription>
                          </div>
                      </CardContent>
                  </Card>
              )
          }
        </div>
      </>
    );
}