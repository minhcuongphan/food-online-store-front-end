import axiosInstance from "./api-services";

export const fetchSupportedProducts = async () => {
    try {
        const response = await axiosInstance.get('/products');
        console.log('Supported Products list:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch supported products:', error);
        return [];
    }
};