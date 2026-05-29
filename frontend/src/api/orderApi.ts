import axios from 'axios';
import type { Order, CreateOrderPayload } from '../types/order';
const API_URL = 'http://localhost:5001';
export const getOrders = async (): Promise<Order[]> => { const response = await axios.get(`${API_URL}/orders`); return response.data; };
export const createOrder = async (order: CreateOrderPayload): Promise<Order> => { const response = await axios.post(`${API_URL}/orders`, order); return response.data.order; };