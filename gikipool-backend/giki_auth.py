def lambda_handler(event, context):
    email = event['request']['userAttributes']['email']
    
    domain = email.split("@")[1]
    
    if domain == "giki.edu.pk":
        return event
    else:
        raise Exception("Signup failed: Only giki.edu.pk emails are allowed.")