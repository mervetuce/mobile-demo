import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || 'https://localhost:9001/api';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const code = url.searchParams.get('code');

    if (!userId || !code) {
      return new Response(
        JSON.stringify({ message: 'UserId and code are required' }),
        { status: 400 }
      );
    }

    const response = await fetch(
      `${apiUrl}/Account/confirm-email?userId=${userId}&code=${code}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return new Response(
        JSON.stringify({ message: error.message || 'Failed to confirm email' }),
        { status: response.status }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Email confirmed successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Email confirmation error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}