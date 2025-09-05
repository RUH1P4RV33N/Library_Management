import React from 'react'
import {Button} from "@/components/ui/button";
import Link from "next/link";
const Page = () => {
    return (
        <section className={"w-full rounded-2xl bg-white p-7"}>
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">
                    All Books
                    <Button className="bg-primary-admin text-white ml-3" asChild>
                        <Link href="/admin/books/new">+ Add New Book</Link>
                    </Button>
                </h2>
            </div>
            <div className="mt-7 w-full overflow-hidden">
                <p>Table</p>
            </div>
        </section>
    )
}
export default Page
