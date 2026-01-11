resource "aws_cognito_user_pool" "main" {
  name = "GikiPool-Users"

  alias_attributes         = ["email"]
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
}

resource "aws_cognito_user_pool_client" "client" {
  name = "client"
  generate_secret = false

  user_pool_id = aws_cognito_user_pool.main.id
}

