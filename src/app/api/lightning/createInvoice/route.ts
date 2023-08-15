import { createInvoiceServer } from "@/app/components/controllers/server/lightning";
import { CreateInvoicePayload } from "@/app/components/models/lightningModels";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const playload = (await req.json()) as CreateInvoicePayload;
        const response = await createInvoiceServer(playload);

        return NextResponse.json({ok: true, invoice: response});
    } catch(e){
        return NextResponse.json({ok: false, error: `${e}`});
    }
} 