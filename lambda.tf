# 1. Zip the Python code
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "giki_auth.py"
  output_path = "giki_auth.zip"
}

# 2. Create the IAM Role for Lambda
resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"

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

# 3. Create the Lambda Function
resource "aws_lambda_function" "pre_signup" {
  filename      = "giki_auth.zip"
  function_name = "GikiPool-PreSignup"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "giki_auth.lambda_handler" # filename.function_name
  runtime       = "python3.12"

  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
}

# 4. Allow Cognito to invoke this Lambda
resource "aws_lambda_permission" "allow_cognito" {
  statement_id  = "AllowExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.pre_signup.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.main.arn
}