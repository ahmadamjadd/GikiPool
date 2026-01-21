import json
import boto3
import os
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
table_name = "GikiPool_Rides" 
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        ride_id = event['pathParameters']['id']
        
        claims = event['requestContext']['authorizer']['jwt']['claims']
        current_user_email = claims.get('email')

        response = table.query(
            KeyConditionExpression=Key('PK').eq(ride_id)
        )
        
        if not response['Items']:
            return {
                'statusCode': 404,
                'body': json.dumps('Ride not found')
            }

        ride = response['Items'][0]

        if ride.get('driver') != current_user_email:
            return {
                'statusCode': 403,
                'body': json.dumps('You are not authorized to delete this ride')
            }

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