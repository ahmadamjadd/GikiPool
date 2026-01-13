import boto3
import uuid

# 1. Connect to DynamoDB (Resource is easier than Client)
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('GikiPool_Rides') # Make sure this matches your Terraform name exactly!

def lambda_handler(event, context):
    # 2. Create a unique ID for the ride
    ride_id = str(uuid.uuid4())

    # 3. Put the item
    table.put_item(
        Item={
            'PK': str(ride_id), 
            'SK': str(1234),    # REQUIRED (Partition Key)
            'driver': 'Ahmad',      # Other data
            'destination': 'Giki',
            'price': 500
        }
    )
    
    return {
        'statusCode': 200,
        'body': f"Ride created successfully with ID: {ride_id}"
    }