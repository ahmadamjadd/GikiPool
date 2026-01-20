resource "aws_cognito_user_pool" "main" {
  name = "GikiPool-Users"

  username_attributes = ["email"]
  auto_verified_attributes = ["email"]

  schema {
    name                = "name"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }

  schema {
    name                = "phone_number"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }
  
  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }

  lambda_config {
    pre_sign_up = aws_lambda_function.pre_signup.arn
  }
}

resource "aws_cognito_user_pool_client" "client" {
  name = "client"
  generate_secret = false

  user_pool_id = aws_cognito_user_pool.main.id
}

output "user_pool_id" {
  value = aws_cognito_user_pool.main.id
}

output "user_pool_client_id" {
  value = aws_cognito_user_pool_client.client.id
}

