process.env.NTBA_FIX_319 = 1;

const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-west-1' })
const docClient = new AWS.DynamoDB.DocumentClient()
const table = process.env.TableName



//require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = '5542449728:AAGum7P-ocuxXz3pYHDUkNUFczWLjKJzQVs';
const bot = new TelegramBot(token, {polling: true});
const chatId = 5549900077;



exports.handler = async (event, context) => {
   
    const params = {
        TableName: table,            
        Key: {
            deviceID: event.deviceID,
            updateKey: event.message.updateKey
        },
        UpdateExpression: "set consumption = :r",
        ExpressionAttributeValues: {
            ":r": event.message.consumption,
        },
        ReturnValues: "UPDATED_NEW",           
    };        

    const getItem = await docClient.get(params).promise()

    if(event.deviceID.length >= 40 ){
        console.log('deviceID cannot be more than 40!') 
    }

    try{
        if(typeof getItem.Item == 'undefined'){
            throw new Error('Device not found!');
        }
        if(Number(event.customerID) === getItem.Item.customerID){
            const msg = 'Threshhold value exceeded! ' + event.message.updateKey+ ': ' + event.message.consumption + 
            ' threshhold: ' + getItem.Item.threshhold;                     
        
            if(event.message.consumption > getItem.Item.threshhold ){
                bot.sendMessage(chatId, msg);      
            } 
            await docClient.update(params).promise();  
            
        }else{
            throw new Error('Customer not found!');
        }
    }catch(e){
        console.log(e.toString())
    }              
}