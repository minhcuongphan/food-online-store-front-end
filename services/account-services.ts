import axiosInstance from "./api-services";

export const fetchAccounts = async () => {
    try {
        const response = await axiosInstance.get('/bots');
        console.log('Accounts list:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch accounts:', error);
        return [];
    }
};