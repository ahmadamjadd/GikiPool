def lambda_handler(event, context):
    # 1. Get the email from the event data
    email = event['request']['userAttributes']['email']
    
    # 2. Extract the domain (the part after @)
    domain = email.split("@")[1]
    
    # 3. Check if it matches GIKI
    if domain == "giki.edu.pk":
        # Success: Return the event object to Cognito to continue
        return event
    else:
        # Failure: Raise an exception to block the sign-up
        raise Exception("Signup failed: Only giki.edu.pk emails are allowed.")