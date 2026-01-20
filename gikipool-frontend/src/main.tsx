import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { Amplify } from 'aws-amplify';

// 2. Configure it (Paste your Terraform outputs here)
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-south-1_bZFYIdH7f', // Replace with your User Pool ID
      userPoolClientId: '4tp49tb3grs94adulm59h4dm6e', // Replace with your Client ID
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
