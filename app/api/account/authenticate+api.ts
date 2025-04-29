import { AuthResponse, LoginRequest } from '@/types/auth-types';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || 'https://localhost:9001/api';

export async function POST(request: Request) {
  try {
    const loginData: LoginRequest = await request.json();

    // Validate request
    if (!loginData.email || !loginData.password) {
      return new Response(
        JSON.stringify({ message: 'Email and password are required' }),
        { status: 400 }
      );
    }

    const response = await fetch(`${apiUrl}/Account/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const error = await response.json();
      return new Response(
        JSON.stringify({ message: error.message || 'Authentication failed' }),
        { status: response.status }
      );
    }

    const data: AuthResponse = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Authentication error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}