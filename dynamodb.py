import boto3
import uuid
import json # <--- 1. We need this

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('GikiPool_Rides')

def lambda_handler(event, context):
    # 2. Parse the incoming JSON body from the frontend
    # API Gateway sends the body as a string, so we convert it to a dictionary
    body = json.loads(event['body'])
    
    ride_id = str(uuid.uuid4())

    # 3. Use the dynamic data
    table.put_item(
        Item={
            'PK': ride_id,
            'SK': body['date'],        # Using date as Sort Key is a good practice!
            'destination': body['destination'],
            'price': body['price'],
            'driver': 'Ahmad',         # We'll keep this hardcoded until we add Login
            'status': 'open'           # Good to track if a ride is full or cancelled
        }
    )
    
    return {
        'statusCode': 200,
        # We need to tell the browser "It's okay to read this" (CORS)
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' 
        },
        'body': json.dumps({ 
            "message": "Ride created!", 
            "ride_id": ride_id 
        })
    }