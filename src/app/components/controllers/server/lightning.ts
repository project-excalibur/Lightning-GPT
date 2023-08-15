import { CreateInvoicePayload, LightningInvoice } from "../../models/lightningModels";

  export async function createInvoiceServer(payload: CreateInvoicePayload): Promise<LightningInvoice> {
    const API_URL = "https://legend.lnbits.com/api/v1/payments";
    const API_KEY = process.env.LNBITS_API_KEY as string;
    const { uuid, ...newpayload } = payload;

    newpayload.out = false;

    const response = await fetch(
        API_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-Api-Key": API_KEY
      },
      body: JSON.stringify(newpayload)
    });
  
    if (!response.ok) {
        console.log(response);
      throw new Error(`Failed to create invoice: ${response.statusText}`);
    }
  
    const raw = await response.json();
    return {
        invoice: `${raw.payment_request}`,
        hash: raw.payment_hash,
        qrInvoice: `lightning:${raw.payment_request}`,
        uuid: payload.uuid,
    } as LightningInvoice
  }

  
  export async function checkInvoicePaidServer(invoice: LightningInvoice): Promise<boolean> {
    const API_URL = `https://legend.lnbits.com/api/v1/payments/${invoice.hash}`;
    const API_KEY = process.env.LNBITS_API_KEY as string;

    const response = await fetch(
        API_URL, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "X-Api-Key": API_KEY
      },
    });
  
    if (!response.ok) {
        console.log(response);
      throw new Error(`Failed to create invoice: ${response.statusText}`);
    }
  
    const raw = await response.json();
    return raw.paid;
  }
  
  
  
  
  
  