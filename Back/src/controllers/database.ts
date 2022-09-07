const ExchangeModel = require('../models/Exchange');
const UserModel = require('../models/User');
const bcrypt = require('bcrypt')

interface Exchange {
    user_email: String,
    date: Date,
    type: String,
    GBP: Number,
    USD: Number
}
interface User{
    name: string,
    email: string,
    password: string
}

export async function save (exchange:Exchange){
    try {
        await ExchangeModel.create({
            user_email: exchange.user_email,
            date: exchange.date,
            type: exchange.type,
            GBP: exchange.GBP,
            USD: exchange.USD
        })
        return 'Exchange saved'
    } catch (error) {
        return error
    }
}

export async function query(user_email : string){
    try {
        const exchanges = await ExchangeModel.find({user_email});
        await exchanges.reverse();
        return exchanges
    } catch (error) {
        return error
    }
}
export async function register(user: User){
    user.password = await bcrypt.hash(user.password, 10);
    try {
        const registeredEmail = await UserModel.find({email: user.email});
        if(!registeredEmail[0]){
            await UserModel.create(user)
            return {message: 'User created'}
        }
        return {error: 'The email is already registered'}
    } catch (error) {
        return error
    }
}
export async function login(user: {email: string, password: string}){
    try {
        const foundUser = await UserModel.find({email: user.email});
        if(!foundUser[0]){
            return {error: 'Incorrect email or password'}
        }
        const passwordHash = await bcrypt.compare(user.password, foundUser[0].password);
        if(!passwordHash){
            return {error: 'Incorrect email or password'}
        }
        return {name: foundUser[0].name, email: foundUser[0].email}
    } catch (error) {
        
    }
}