import boto3
import uuid
import json

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('GikiPool_Rides') 

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        
        claims = event['requestContext']['authorizer']['jwt']['claims']
        user_email = claims.get('email')
        
        ride_id = str(uuid.uuid4())

        table.put_item(
            Item={
                'PK': ride_id,
                'SK': body['date'],
                'destination': body['destination'],
                'price': body['price'],
                'phone': body.get('phone', ''),
                'driver': user_email,
                'status': 'open'
            }
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            },
            'body': json.dumps({ 
                "message": "Ride created!", 
                "ride_id": ride_id 
            })
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error details: {str(e)}") 
        }