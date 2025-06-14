import axiosInstance from "./api-services";

export const fetchSupportedPages = async () => {
    try {
        const response = await axiosInstance.get('/pages');
        console.log('Supported pages list:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch supported pages:', error);
        return [];
    }
};