# 1. The API Gateway (HTTP API V2)
resource "aws_apigatewayv2_api" "main" {
  name          = "GikiPool-API"
  protocol_type = "HTTP"

  # 🔓 CORS Configuration: This allows your React app to talk to the backend
  cors_configuration {
    allow_origins = ["*"]  # In production, change this to your actual domain (e.g., https://gikipool.com)
    allow_methods = ["POST", "GET", "OPTIONS", "DELETE"]
    allow_headers = ["content-type", "authorization"]
    max_age       = 300
  }
}

# 2. The Stage (Auto-deploy enabled)
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.main.id
  name        = "$default" # Special name that auto-deploys changes
  auto_deploy = true
}

# 3. Integration: Connecting API Gateway to your 'create_ride' Lambda
resource "aws_apigatewayv2_integration" "create_ride_integration" {
  api_id           = aws_apigatewayv2_api.main.id
  integration_type = "AWS_PROXY"

  # Connection details
  integration_uri    = aws_lambda_function.create_ride.invoke_arn
  integration_method = "POST" 
  payload_format_version = "2.0" # Recommended for V2 APIs
}

# 4. Route: Listening for POST requests on /create-ride
resource "aws_apigatewayv2_route" "create_ride_route" {
  api_id = aws_apigatewayv2_api.main.id
  
  # The frontend will call: POST https://[api-url]/create-ride
  route_key = "POST /create-ride" 
  target    = "integrations/${aws_apigatewayv2_integration.create_ride_integration.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito_auth.id
}

# 5. Permission: Allowing API Gateway to actually invoke the Lambda
resource "aws_lambda_permission" "api_gw_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_ride.function_name
  principal     = "apigateway.amazonaws.com"

  # The source_arn ensures ONLY this specific API Gateway can call the function
  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# 6. Output: Show the API URL after 'terraform apply'
output "api_endpoint" {
  value = aws_apigatewayv2_api.main.api_endpoint
  description = "The public URL for your API"
}


# =========================================================================
# NEW: List Rides Configuration (GET /rides)
# =========================================================================

# 7. Integration: Connecting API Gateway to your 'list_rides' Lambda
resource "aws_apigatewayv2_integration" "list_rides_integration" {
  api_id           = aws_apigatewayv2_api.main.id
  integration_type = "AWS_PROXY"

  # We point to the list_rides function defined in your lambda.tf
  integration_uri    = aws_lambda_function.list_rides.invoke_arn
  integration_method = "POST" # Lambda integration always uses POST behind the scenes
  payload_format_version = "2.0"
}

# 8. Route: Listening for GET requests on /rides
resource "aws_apigatewayv2_route" "list_rides_route" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /rides" # <--- The URL path users will visit
  target    = "integrations/${aws_apigatewayv2_integration.list_rides_integration.id}"
}

# 9. Permission: Allowing API Gateway to invoke the list_rides Lambda
resource "aws_lambda_permission" "api_gw_list_rides_permission" {
  statement_id  = "AllowExecutionFromAPIGatewayList"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.list_rides.function_name
  principal     = "apigateway.amazonaws.com"

  # Allow access specifically to the GET /rides route
  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*/rides"
}

# =========================================================================
# NEW: Security & Delete Configuration
# =========================================================================

# 1. The Authorizer (Gatekeeper) 🛡️
# This tells API Gateway to check the token with your Cognito User Pool
resource "aws_apigatewayv2_authorizer" "cognito_auth" {
  api_id           = aws_apigatewayv2_api.main.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "cognito-authorizer"

  jwt_configuration {
    # ⚠️ VERIFY REGION: https://cognito-idp.{REGION}.amazonaws.com/{USER_POOL_ID}
    issuer   = "https://cognito-idp.ap-south-1.amazonaws.com/${aws_cognito_user_pool.main.id}"
    audience = [aws_cognito_user_pool_client.client.id]
  }
}

# 2. Integration: Connect API to 'delete_ride' Lambda
resource "aws_apigatewayv2_integration" "delete_ride_integration" {
  api_id           = aws_apigatewayv2_api.main.id
  integration_type = "AWS_PROXY"
  
  integration_uri    = aws_lambda_function.delete_ride.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

# 3. Route: DELETE /rides/{id} (Protected!) 🔒
resource "aws_apigatewayv2_route" "delete_ride_route" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "DELETE /rides/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.delete_ride_integration.id}"

  # 🛑 SECURITY: We attach the authorizer here
  # Only users with a valid token can use this route
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito_auth.id
}

# 4. Permission: Allow API Gateway to call the Lambda
resource "aws_lambda_permission" "api_gw_delete_permission" {
  statement_id  = "AllowExecutionFromAPIGatewayDelete"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.delete_ride.function_name
  principal     = "apigateway.amazonaws.com"
  
  # Allow strictly for this specific route
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*/rides/*"
}