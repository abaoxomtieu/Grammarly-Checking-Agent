import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const checkText = async (data: { text: string; proper_nouns: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/check_text`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
