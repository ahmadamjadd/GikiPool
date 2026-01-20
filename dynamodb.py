import boto3
import uuid
import json

dynamodb = boto3.resource('dynamodb')
# Make sure this matches the table name in your Terraform (e.g., GikiPool-Rides)
table = dynamodb.Table('GikiPool_Rides') 

def lambda_handler(event, context):
    try:
        # 1. Parse the incoming data
        body = json.loads(event['body'])
        
        # 2. Get the User's Email from Cognito
        # API Gateway validates the token and passes these details to Lambda
        claims = event['requestContext']['authorizer']['jwt']['claims']
        user_email = claims.get('email')
        
        ride_id = str(uuid.uuid4())

        # 3. Save to DynamoDB with the REAL email
        table.put_item(
            Item={
                'PK': ride_id,
                'SK': body['date'],
                'destination': body['destination'],
                'price': body['price'],
                'driver': user_email,   # <--- storing the email here!
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
        print(e) # This still logs to CloudWatch
        return {
            'statusCode': 500,
            # 👇 sending the ACTUAL error message to the frontend
            'body': json.dumps(f"Error details: {str(e)}") 
        }