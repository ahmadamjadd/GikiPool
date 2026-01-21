resource "aws_apigatewayv2_api" "main" {
  name          = "GikiPool-API"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["POST", "GET", "OPTIONS", "DELETE"]
    allow_headers = ["content-type", "authorization"]
    max_age       = 300
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.main.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "create_ride_integration" {
  api_id           = aws_apigatewayv2_api.main.id
  integration_type = "AWS_PROXY"

  integration_uri    = aws_lambda_function.create_ride.invoke_arn
  integration_method = "POST" 
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "create_ride_route" {
  api_id = aws_apigatewayv2_api.main.id
  
  route_key = "POST /create-ride" 
  target    = "integrations/${aws_apigatewayv2_integration.create_ride_integration.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito_auth.id
}

resource "aws_lambda_permission" "api_gw_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_ride.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

output "api_endpoint" {
  value = aws_apigatewayv2_api.main.api_endpoint
  description = "The public URL for your API"
}


resource "aws_apigatewayv2_integration" "list_rides_integration" {
  api_id           = aws_apigatewayv2_api.main.id
  integration_type = "AWS_PROXY"

  integration_uri    = aws_lambda_function.list_rides.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "list_rides_route" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /rides"
  target    = "integrations/${aws_apigatewayv2_integration.list_rides_integration.id}"
}

resource "aws_lambda_permission" "api_gw_list_rides_permission" {
  statement_id  = "AllowExecutionFromAPIGatewayList"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.list_rides.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*/rides"
}

resource "aws_apigatewayv2_authorizer" "cognito_auth" {
  api_id           = aws_apigatewayv2_api.main.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "cognito-authorizer"

  jwt_configuration {
    issuer   = "https://cognito-idp.ap-south-1.amazonaws.com/${aws_cognito_user_pool.main.id}"
    audience = [aws_cognito_user_pool_client.client.id]
  }
}

resource "aws_apigatewayv2_integration" "delete_ride_integration" {
  api_id           = aws_apigatewayv2_api.main.id
  integration_type = "AWS_PROXY"
  
  integration_uri    = aws_lambda_function.delete_ride.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "delete_ride_route" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "DELETE /rides/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.delete_ride_integration.id}"

  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito_auth.id
}

resource "aws_lambda_permission" "api_gw_delete_permission" {
  statement_id  = "AllowExecutionFromAPIGatewayDelete"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.delete_ride.function_name
  principal     = "apigateway.amazonaws.com"
  
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*/rides/*"
}
