const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-west-1' })
const docClient = new AWS.DynamoDB.DocumentClient()
const table = process.env.TableName


exports.handler = async (event, context) => {

    const params = {
        TableName: table,
        Key: {
            deviceID: event.pathParameters.deviceID,
            updateKey: event.pathParameters.updateKey
        },
        UpdateExpression: "set threshhold = :r",
        ExpressionAttributeValues: {
            ":r": event.queryStringParameters.threshhold
        },
        ReturnValues: "UPDATED_NEW",
    };
    const getItem = await docClient.get(params).promise()

    let response = {
        isBase64Encoded: false,
        body: JSON.stringify({ message: "Success" }),           
        statusCode: 200,
    }

    try{
        if(typeof getItem.Item == 'undefined'){
            throw new Error('Device not found!');

        }
        if(event.pathParameters.deviceID.length >= 40 ){
            throw new Error('deviceID cannot be more than 40!');  
        }      
                    
        if(event.queryStringParameters.threshhold <= 0){
            throw new Error('threshhold < 0!');  
        }
        else{
            await docClient.update(params).promise();
        }
        
    }catch(e){
        response.statusCode = 400;
        message = e.toString(),
        response.body = JSON.stringify(message)     
    }
     return response;  

}
