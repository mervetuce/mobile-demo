import { RegisterRequest } from '@/types/auth-types';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || 'https://localhost:9001/api';

export async function POST(request: Request) {
  try {
    const registerData: RegisterRequest = await request.json();

    // Validate request
    if (!registerData.email || !registerData.password || !registerData.confirmPassword) {
      return new Response(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400 }
      );
    }

    if (registerData.password !== registerData.confirmPassword) {
      return new Response(
        JSON.stringify({ message: 'Passwords do not match' }),
        { status: 400 }
      );
    }

    const response = await fetch(`${apiUrl}/Account/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      const error = await response.json();
      return new Response(
        JSON.stringify({ message: error.message || 'Registration failed' }),
        { status: response.status }
      );
    }

    const data = await response.text();
    return new Response(data, { status: 200 });
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}