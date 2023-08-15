import { CreateInvoicePayload, LightningInvoice } from "../models/lightningModels";

  
  export async function createInvoice(payload: CreateInvoicePayload): Promise<LightningInvoice> {
    const API_URL = (process.env.NEXT_PUBLIC_API_URL as string) + "/lightning/createInvoice";

    payload.out = false;

    const response = await fetch(
        API_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const jsonResponse = await response.json();
  
    if (!response.ok || !jsonResponse.ok) {
        console.log(jsonResponse);
      throw new Error(`Failed to create invoice: ${response.statusText}`);
    }
  

    return jsonResponse.invoice;
  }


  export async function checkInvoicePaid(payload: LightningInvoice): Promise<boolean> {
    const API_URL = (process.env.NEXT_PUBLIC_API_URL as string) + "/lightning/checkInvoice";

    const response = await fetch(
        API_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  
    if (!response.ok) {
        console.log(response);
      throw new Error(`Failed to check invoice: ${response.statusText}`);
    }
  
    return (await response.json()).paid;
  }

  export async function getTimestamp(uuid: string): Promise<number> {
    const API_URL = (process.env.NEXT_PUBLIC_API_URL as string) + "/getTimestamp";

    const response = await fetch(
        API_URL, {
      method: "POST",
      body: JSON.stringify({uuid})
    });
  
    if (!response.ok) {
        console.log(response);
      throw new Error(`Failed to get timestamp: ${response.statusText}`);
    }
  
    return (await response.json()).timestamp;
  }