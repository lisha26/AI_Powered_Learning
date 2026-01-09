import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getTopics = async () => {
    const response = await axios.get(`${API_URL}/topics`);
    return response.data;
};

export const getHistory = async () => {
    const response = await axios.get(`${API_URL}/history`);
    return response.data;
};

export const generateReference = async (topic) => {
    const response = await axios.post(`${API_URL}/reference`, { topic });
    return response.data;
};

export const generateMindMap = async (topic) => {
    const response = await axios.post(`${API_URL}/mindmap`, { topic });
    return response.data;
};

export const generateVideo = async (topic, type) => {
    const response = await axios.post(`${API_URL}/video`, { topic, type });
    return response.data;
};

export const generateAudio = async (text, language, topic) => {
    const response = await axios.post(`${API_URL}/audio`, { text, language, topic }, { responseType: 'blob' });
    return response.data;
};
