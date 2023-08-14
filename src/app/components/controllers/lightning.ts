"use client"

export interface LightningInvoice {
    invoice: string;
    hash: string; 
    qrInvoice: string;
}

export interface CreateInvoicePayload {
    amount: number;
    memo: string;
    out?: boolean;
    expiry?: number;      // Optional properties are marked with ?
    unit?: string;        // You can remove the ? if you want to make them required
    webhook?: string;
    internal?: boolean;
  };
  
  export async function createInvoice(payload: CreateInvoicePayload): Promise<LightningInvoice> {
    const API_URL = "https://legend.lnbits.com/api/v1/payments";
    const API_KEY = process.env.NEXT_PUBLIC_LNBITS_API_KEY as string;

    payload.out = false;

    const response = await fetch(
        API_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-Api-Key": API_KEY
      },
      body: JSON.stringify(payload)
    });
  
    if (!response.ok) {
        console.log(response);
      throw new Error(`Failed to create invoice: ${response.statusText}`);
    }
  
    const raw = await response.json();
    return {
        invoice: `${raw.payment_request}`,
        hash: raw.payment_hash,
        qrInvoice: `lightning:${raw.payment_request}`
    } as LightningInvoice
  }

  
  export async function checkInvoicePaid(invoice: LightningInvoice): Promise<boolean> {
    const API_URL = `https://legend.lnbits.com/api/v1/payments/${invoice.hash}`;
    const API_KEY = process.env.NEXT_PUBLIC_LNBITS_API_KEY as string;

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
  
  // Example Usage:
  // const payload: CreateInvoicePayload = {
  //   out: false,
  //   amount: 1000,
  //   memo: "Test Invoice"
  // };
  // createInvoice(payload).then(data => {
  //   console.log(data);
  // }).catch(error => {
  //   console.error("Error:", error);
  // });
  
  
  
  
  
  
  