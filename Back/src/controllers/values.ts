import api from "../api";

export const getUSDValue = async () => {
    const response = await api.get('/USD-GBP');
    const value = response.data.USDGBP.high;
    return value;
}
export const getGBPValue = async () => {
    const response = await api.get('/GBP-USD');
    const value = response.data.GBPUSD.high;
    return value;
}