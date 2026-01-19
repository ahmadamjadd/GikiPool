# =========================================================================
# 1. ZIP FILES
# =========================================================================

# Zip for Auth Function
data "archive_file" "auth_zip" {
  type        = "zip"
  source_file = "giki_auth.py"
  output_path = "giki_auth.zip"
}

# Zip for Create Ride Function
data "archive_file" "ride_zip" {
  type        = "zip"
  source_file = "dynamodb.py"  # Make sure your python file is named this!
  output_path = "dynamodb.zip"
}

# =========================================================================
# 2. IAM ROLES & POLICIES
# =========================================================================

# --- Role 1: For Pre-Signup Auth ---
resource "aws_iam_role" "iam_for_auth" {
  name = "iam_for_auth_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# Add Logging Permission to Auth Role (Critical for debugging!)
resource "aws_iam_role_policy_attachment" "auth_logs" {
  role       = aws_iam_role.iam_for_auth.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# --- Role 2: For Creating Rides (Needs DynamoDB) ---
resource "aws_iam_role" "iam_for_rides" {
  name = "iam_for_rides_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}



# Add Logging Permission to Rides Role
resource "aws_iam_role_policy_attachment" "ride_logs" {
  role       = aws_iam_role.iam_for_rides.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Custom Policy: Allow Access to DynamoDB
resource "aws_iam_policy" "dynamodb_access" {
  name        = "GikiPool-DynamoDB-Access"
  description = "Allow Lambda to access the Rides table"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:UpdateItem"
        ]
        Effect   = "Allow"
        Resource = aws_dynamodb_table.gikipooltable.arn # Matches your dynamodb.tf
      }
    ]
  })
}

# Attach DynamoDB Policy to Rides Role
resource "aws_iam_role_policy_attachment" "attach_dynamo" {
  role       = aws_iam_role.iam_for_rides.name
  policy_arn = aws_iam_policy.dynamodb_access.arn
}

# =========================================================================
# 3. LAMBDA FUNCTIONS
# =========================================================================

# --- Function 1: Pre-Signup Auth ---
resource "aws_lambda_function" "pre_signup" {
  filename      = "giki_auth.zip"
  function_name = "GikiPool-PreSignup"
  role          = aws_iam_role.iam_for_auth.arn
  handler       = "giki_auth.lambda_handler"
  runtime       = "python3.12"

  source_code_hash = data.archive_file.auth_zip.output_base64sha256
}

# Permission: Allow Cognito to call Auth Function
resource "aws_lambda_permission" "allow_cognito" {
  statement_id  = "AllowExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.pre_signup.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.main.arn
}

# --- Function 2: Create Ride ---
resource "aws_lambda_function" "create_ride" {
  filename      = "dynamodb.zip"
  function_name = "create_ride"
  role          = aws_iam_role.iam_for_rides.arn
  handler       = "dynamodb.lambda_handler" # File is dynamodb.py
  runtime       = "python3.12"

  source_code_hash = data.archive_file.ride_zip.output_base64sha256
}

# --- Function 3: List Rides ---
# 1. Zip the new code
data "archive_file" "list_rides" {
  type        = "zip"
  source_file = "${path.module}/list_rides.py"
  output_path = "${path.module}/list_rides.zip"
}

# 2. Create the Lambda Function
resource "aws_lambda_function" "list_rides" {
  filename      = "list_rides.zip"
  function_name = "list_rides"
  role          = aws_iam_role.iam_for_rides.arn # Make sure this matches your existing role name!
  handler       = "list_rides.lambda_handler"
  runtime       = "python3.12"
  source_code_hash = data.archive_file.list_rides.output_base64sha256

  environment {
    variables = {
      TABLE_NAME = "GikiPool_Rides" # Or use aws_dynamodb_table.rides.name
    }
  }
}

