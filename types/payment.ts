export interface PaymentDataProps {
  addressId: string;
}

export interface MidtransItemDetail {
  id: string;
  price: number;
  quantity: number;
  name: string;
}

type MidtransExpiry = {
  start_time?: string; // Format: "YYYY-MM-DD HH:MM:SS Z" (Opsional)
  unit: "minutes" | "hours" | "days";
  duration: number;
};

export interface MidtransTransactionParameters {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  expiry?: MidtransExpiry;
  item_details?: MidtransItemDetail[];
}

export interface PaymentProps {
  order_id: string;
  transaction_status: string;
  status_code: string;
  gross_amount: string;
  payment_type?: string;
  [key: string]: unknown;
}
