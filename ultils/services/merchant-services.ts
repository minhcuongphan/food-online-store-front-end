import axiosInstance from "./api-services";

export const fetchMerchants = async () => {
    try {
        const response = await axiosInstance.get('/users');
        console.log('User list:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return [];
    }
};