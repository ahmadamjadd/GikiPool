import json
import boto3
import os
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
# Make sure this matches your actual table name in dynamodb.tf
table_name = "GikiPool_Rides" 
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        # 1. Get the Ride ID from the URL
        ride_id = event['pathParameters']['id']
        
        # 2. Get the user's email from the Cognito Token
        claims = event['requestContext']['authorizer']['jwt']['claims']
        current_user_email = claims.get('email')

        # 3. Fetch the ride using QUERY to find the Sort Key (SK)
        # We only know the PK (ride_id), so we query to find the rest
        response = table.query(
            KeyConditionExpression=Key('PK').eq(ride_id)
        )
        
        # Check if the ride exists
        if not response['Items']:
            return {
                'statusCode': 404,
                'body': json.dumps('Ride not found')
            }

        ride = response['Items'][0]

        # 4. SECURITY CHECK: Does the logged-in user match the driver?
        if ride.get('driver') != current_user_email:
            return {
                'statusCode': 403,
                'body': json.dumps('You are not authorized to delete this ride')
            }

        # 5. Delete using BOTH keys (PK and SK)
        # DynamoDB needs the specific date (SK) to identify which item to delete
        table.delete_item(
            Key={
                'PK': ride_id,
                'SK': ride['SK'] 
            }
        )

        return {
            'statusCode': 200,
            'body': json.dumps('Ride deleted successfully')
        }

    except Exception as e:
        print(e) 
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error details: {str(e)}") 
        }