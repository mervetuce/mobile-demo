import Constants from 'expo-constants';
import { Platform } from 'react-native';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || 'https://localhost:9001/api';

// Adjust URL for web platform if needed
export const API_URL = Platform.OS === 'web' ? apiUrl : apiUrl;

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    options.headers = {
        ...defaultHeaders,
        ...options.headers,
    };

    // Include credentials for CORS
    options.credentials = 'include';

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            let errorMessage = 'Unknown error occurred';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || `API request failed with status ${response.status}`;
            } catch (e) {
                // If response is not JSON
                errorMessage = `API request failed with status ${response.status}`;
            }
            throw new Error(errorMessage);
        }

        // Check if response is empty
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
            return await response.json();
        }

        return await response.text();
    } catch (error) {
        console.error(`API error for ${endpoint}:`, error);
        throw error;
    }
}
