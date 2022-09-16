
const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-west-1' })
const docClient = new AWS.DynamoDB.DocumentClient()
const table = process.env.TableName



exports.handler = async (event, context) => {   

    const params = {
        TableName: table,
        Key: {
            deviceID: event.pathParameters.deviceID
        }
    }    
    
    const getItem = await docClient.get(params).promise();       
    
    let response = {    
        statusCode: 200,  
        body: JSON.stringify({ message: "Success" }),                          
    };

    try {
        if(typeof getItem.Item == 'undefined'){
            throw new Error('Device not found!');
        }
        if(event.pathParameters.deviceID.length >= 40 ){
            throw new Error('deviceID cannot be more than 40!');  
        }   
        let getConsumption = {
            waterConsumption : getItem.Item.waterConsumption,
            electricConsumption: getItem.Item.electricConsumption,
        }

        response.body = JSON.stringify(getConsumption);

    } catch (e) {
        response.statusCode = 400;
        message = e.toString(),
        response.body =  JSON.stringify(message)
    }
    return response;
}

