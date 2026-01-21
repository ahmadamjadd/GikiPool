# 🚧 STILL IN PROGRESS 🚧

# GikiPool - Carpooling for GIKI 🚗

GikiPool is a serverless carpooling platform designed to help students share rides. It connects drivers with passengers, allowing users to list rides, view available options, and coordinate travel securely.

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
```

> **⚠️ Important:** After deployment, Terraform will output the `api_endpoint` and `user_pool_client_id`. Keep these safe!

### 2. Frontend (React)

Connect the frontend to your new AWS backend.

1. Navigate to the `src` folder.
2. Open `aws-exports.js` (or `main.tsx`) and update the **User Pool ID** and **Client ID** from the Terraform output.
3. Open `src/components/CreateRide.tsx` and `RideList.tsx`.
4. Update the `API_URL` variable with your **Terraform API Endpoint**.

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```
## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/rides` | List all available rides | No |
| `POST` | `/create-ride` | Publish a new ride | **Yes (JWT)** |
| `DELETE` | `/rides/{id}` | Delete a specific ride | **Yes (JWT)** |