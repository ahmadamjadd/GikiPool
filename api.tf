# 1. The API Gateway (HTTP API V2)
resource "aws_apigatewayv2_api" "main" {
  name          = "GikiPool-API"
  protocol_type = "HTTP"

  # 🔓 CORS Configuration: This allows your React app to talk to the backend
  cors_configuration {
    allow_origins = ["*"]  # In production, change this to your actual domain (e.g., https://gikipool.com)
    allow_methods = ["POST", "GET", "OPTIONS"]
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