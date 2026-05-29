import axios from 'axios';
import type { InventoryItem } from '../types/inventory';
const API_URL = 'http://localhost:5002';
export const getInventory = async (): Promise<InventoryItem[]> => { const response = await axios.get(`${API_URL}/inventory`); return response.data; };