import boto3
import json
from decimal import Decimal

# Helper class to convert DynamoDB Decimals to JSON numbers
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('GikiPool_Rides') # Ensure this matches your Terraform table name

def lambda_handler(event, context):
    try:
        # scan() reads every item in the table (good for feeds, expensive for big data)
        response = table.scan()
        items = response.get('Items', [])

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' # The "VIP Pass" for the browser
            },
            'body': json.dumps(items, cls=DecimalEncoder)
        }
        
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps({"error": str(e)})
        }