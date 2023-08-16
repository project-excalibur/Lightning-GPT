import { createInvoice } from "@/app/components/controllers/lightningClient";
import { checkInvoicePaidServer } from "@/app/components/controllers/server/lightning";
import { LightningInvoice } from "@/app/components/models/lightningModels";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const playload = (await req.json()) as LightningInvoice;
        const paid = await checkInvoicePaidServer(playload);

        if(paid)
            await kv.set(playload.uuid, Date.now())

        return NextResponse.json({ok: true, paid: paid});
    } catch(e){
        return NextResponse.json({ok: false, error: `${e}`});
    }
} 