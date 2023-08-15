import { createInvoiceServer } from "@/app/components/controllers/server/lightning";
import { CreateInvoicePayload } from "@/app/components/models/lightningModels";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const uuid = (await req.json()).uuid as string;
        let timestamp = (await kv.get(uuid)) as number;

        if(!timestamp){
            timestamp = 0
        }

        return NextResponse.json({ok: true, timestamp});
    } catch(e){

        return NextResponse.json({ok: false, error: `${e}`});
    }
} 