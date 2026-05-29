export interface Order { _id: string; product: string; quantity: number; status: string; createdAt: string; }
export interface CreateOrderPayload { product: string; quantity: number; }