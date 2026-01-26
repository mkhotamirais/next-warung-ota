export interface PaymentDataProps {
  addressId: string;
}

export interface MidtransItemDetail {
  id: string;
  price: number;
  quantity: number;
  name: string;
}

export interface MidtransTransactionParameters {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
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
