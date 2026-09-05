export interface TicketItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Ticket {
  store: {
    name: string;
    address?: string;
    phone?: string;
    taxId?: string;
    logoBase64?: string;
  };

  order: {
    id: string;
    date: Date;
  };

  items: TicketItem[];

  subtotal: number;
  discount?: number;
  tax?: number;
  total: number;

  payment?: {
    method: string;
    received?: number;
    change?: number;
  };

  qrCode?: string;

  footer?: string;
}
