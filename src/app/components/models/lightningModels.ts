export interface LightningInvoice {
    invoice: string;
    hash: string; 
    qrInvoice: string;
    uuid: string;
}

export interface CreateInvoicePayload {
    amount: number;
    memo: string;
    uuid: string;
    out?: boolean;
    expiry?: number;      // Optional properties are marked with ?
    unit?: string;        // You can remove the ? if you want to make them required
    webhook?: string;
    internal?: boolean;
  };