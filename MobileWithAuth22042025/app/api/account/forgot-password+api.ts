import { ForgotPasswordRequest } from '@/types/auth-types';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || 'https://localhost:9001/api';

export async function POST(request: Request) {
  try {
    const forgotPasswordData: ForgotPasswordRequest = await request.json();

    if (!forgotPasswordData.email) {
      return new Response(
        JSON.stringify({ message: 'Email is required' }),
        { status: 400 }
      );
    }

    const response = await fetch(`${apiUrl}/Account/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(forgotPasswordData),
    });

    if (!response.ok) {
      const error = await response.json();
      return new Response(
        JSON.stringify({ message: error.message || 'Failed to process request' }),
        { status: response.status }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Password reset instructions sent to your email' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}