import api from "../api"
import * as database from "./database";

interface Exchange{
    user_email: string,
    type: string,
    values: {
        USD: number,
        GBP: number
    }
}
export default async function exchange(data: Exchange){
    if(data.type === 'USD to GBP'){
        const response = await api.get('/USD-GBP');
        const value = response.data.USDGBP.high;
        const exchangeToSave = {
            user_email: data.user_email,
            date: new Date(),
            type: data.type,
            GBP: +(data.values.USD * value).toFixed(2),
            USD: data.values.USD
        }
        
        await database.save(exchangeToSave)
        const history = await database.query(data.user_email)
        return {
            GBP: (data.values.USD * value).toFixed(2),
            USD: data.values.USD,
            history
        }
    }
    else{
        const response = await api.get('/GBP-USD');
        const value = response.data.GBPUSD.high;
        const exchangeToSave = {
            user_email: data.user_email,
            date: new Date(),
            type: data.type,
            GBP: data.values.GBP,
            USD: +(data.values.GBP * value).toFixed(2)
        }
        await database.save(exchangeToSave);
        const history = await database.query(data.user_email)
        return {
           USD: (data.values.GBP * value).toFixed(2),
           GBP: data.values.GBP,
           history
        }
    }
}