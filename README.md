# GikiPool - Carpooling for GIKI 🚗

Located in the remote region of Topi, GIKI poses a unique challenge for students: finding reliable and affordable transportation to and from campus is notoriously difficult.

**GikiPool** is a dedicated serverless carpooling platform built specifically to solve this problem for the GIKI community. It connects students who own cars with those looking for a ride. Students driving home or to the city can post their travel plans, allowing peers to find rides easily. By pooling resources, GikiPool makes travel more accessible, convenient, and collaborative for everyone on campus.

## 🏗️ Architecture
This project uses a fully serverless architecture on AWS, managed by **Terraform**.

* **Frontend:** React (Vite + TypeScript + Tailwind CSS)
* **Backend:** AWS Lambda (Python 3.12)
* **API:** AWS HTTP API Gateway (V2)
* **Database:** AWS DynamoDB
* **Auth:** AWS Cognito (User Pools)
* **Infrastructure as Code:** Terraform

## 🚀 Features
* **User Authentication:** Sign up and Sign in using email (via AWS Cognito).
* **Create Ride:** Drivers can publish a ride with destination, date, price, and seat details.
* **List Rides:** View all available rides in real-time.
* **Delete Ride:** Drivers can delete their own rides (secured via JWT tokens).
* **Security:** All backend routes verify identity using Cognito Authorizers.

---

## 🛠️ Prerequisites
Before running this project, ensure you have the following installed:
1.  **Node.js & npm** (for the frontend)
2.  **Terraform** (to deploy AWS infrastructure)
3.  **AWS CLI** (configured with your credentials: `aws configure`)
4.  **Python 3.12** (for Lambda functions)

---

## ⚙️ Setup & Deployment

### 1. Backend (Terraform)
Deploy the AWS infrastructure first.

```bash
# Navigate to the terraform folder
cd terraform

# Initialize Terraform
terraform init

# Plan the deployment (check for errors)
terraform plan

# Deploy infrastructure to AWS
terraform apply --auto-approve
