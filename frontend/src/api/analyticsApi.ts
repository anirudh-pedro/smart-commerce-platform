import axios from 'axios';
import type { AnalyticsData } from '../types/analytics';
const API_URL = 'http://localhost:5004';
export const getAnalytics = async (): Promise<AnalyticsData> => { const response = await axios.get(`${API_URL}/analytics`); return response.data; };