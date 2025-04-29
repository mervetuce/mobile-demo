import { ResetPasswordRequest } from '@/types/auth-types';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || 'https://localhost:9001/api';

export async function POST(request: Request) {
  try {
    const resetPasswordData: ResetPasswordRequest = await request.json();

    if (!resetPasswordData.email || !resetPasswordData.token ||
      !resetPasswordData.password || !resetPasswordData.confirmPassword) {
      return new Response(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400 }
      );
    }

    if (resetPasswordData.password !== resetPasswordData.confirmPassword) {
      return new Response(
        JSON.stringify({ message: 'Passwords do not match' }),
        { status: 400 }
      );
    }

    const response = await fetch(`${apiUrl}/Account/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resetPasswordData),
    });

    if (!response.ok) {
      const error = await response.json();
      return new Response(
        JSON.stringify({ message: error.message || 'Failed to reset password' }),
        { status: response.status }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Password has been reset successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resetting password:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}