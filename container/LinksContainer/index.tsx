"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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

export default function LinksContainer({ dataLinks: data, error: error, isLoading: isLoading }: {dataLinks: dataLink; error: object; isLoading: boolean;}) {        
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
                                  <Button size="sm" variant="destructive">Delete</Button>
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