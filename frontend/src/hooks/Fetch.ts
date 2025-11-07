import config from '../config/config.js'
import Cookies from 'js-cookie'

class Fetch {
    ClientAPI: string | undefined;
    private isRefreshing: boolean = false;
    private refreshPromise: Promise<string> | null = null;

    constructor() {
        this.ClientAPI = `${config.serverURL}/api`
    }

    private getToken(): string | undefined {
        return Cookies.get('fileManager_token')
    }

    private async refreshAccessToken(): Promise<string> {
        if (this.isRefreshing && this.refreshPromise) {
            return this.refreshPromise
        }

        this.isRefreshing = true
        this.refreshPromise = (async () => {
            try {
                const res = await fetch(`${this.ClientAPI}/auth/refresh`, {
                    method: 'GET',
                    credentials: 'include',
                })
                
                if (!res.ok) {
                    throw new Error('Failed to refresh token')
                }

                const data = await res.json()
                if (data.success && data.accessToken) {
                    Cookies.set('fileManager_token', data.accessToken)
                    return data.accessToken
                }
                throw new Error('Invalid refresh response')
            } finally {
                this.isRefreshing = false
                this.refreshPromise = null
            }
        })()

        return this.refreshPromise
    }

    private async makeRequest(
        endURL: string,
        options: RequestInit,
        retry: boolean = true
    ): Promise<Response> {
        const token = this.getToken()
        // Don't send Authorization header for refresh endpoint (uses cookie instead)
        const shouldIncludeAuth = !endURL.includes('/auth/refresh')
        const headers: HeadersInit = {
            ...(options.headers as HeadersInit || {}),
            ...(token && shouldIncludeAuth ? { 'Authorization': `Bearer ${token}` } : {}),
        }

        const response = await fetch(`${this.ClientAPI}${endURL}`, {
            ...options,
            headers,
            credentials: 'include',
        })

        // Handle 401 Unauthorized - try to refresh token and retry
        if (response.status === 401 && retry && endURL !== '/auth/refresh') {
            try {
                const newToken = await this.refreshAccessToken()
                // Retry the request with new token
                const retryHeaders: HeadersInit = {
                    ...(options.headers as HeadersInit || {}),
                    'Authorization': `Bearer ${newToken}`,
                }
                
                return await fetch(`${this.ClientAPI}${endURL}`, {
                    ...options,
                    headers: retryHeaders,
                    credentials: 'include',
                })
            } catch (error) {
                // Refresh failed, return original response
                return response
            }
        }

        return response
    }

    async post(endURL: string, data: object, headers?: object): Promise<any> {
        const finalHeaders: HeadersInit = {
            ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
            ...(headers || {})
        }

        const res = await this.makeRequest(endURL, {
            method: 'POST',
            headers: finalHeaders,
            body: data instanceof FormData ? data : JSON.stringify(data)
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            throw new Error(errorData.message || 'Internal Server Error!')
        }

        return await res.json()
    }

    async get(endURL: string, headers?: object, signal?: AbortSignal): Promise<any> {
        const res = await this.makeRequest(endURL, {
            method: 'GET',
            headers: headers as HeadersInit,
            signal: signal,
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            throw new Error(errorData.message || 'Internal Server Error!')
        }

        return await res.json()
    }

    async put(endURL: string, data?: object, headers?: object): Promise<any> {
        const finalHeaders: HeadersInit = {
            ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
            ...(headers || {})
        }

        const res = await this.makeRequest(endURL, {
            method: 'PUT',
            headers: finalHeaders,
            body: data instanceof FormData ? data : JSON.stringify(data)
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            throw new Error(errorData.message || 'Internal Server Error!')
        }

        return await res.json()
    }

    async patch(endURL: string, data?: object, headers?: object): Promise<any> {
        const finalHeaders: HeadersInit = {
            ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
            ...(headers || {})
        }

        const res = await this.makeRequest(endURL, {
            method: 'PATCH',
            headers: finalHeaders,
            body: data instanceof FormData ? data : JSON.stringify(data)
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            throw new Error(errorData.message || 'Internal Server Error!')
        }

        return await res.json()
    }

    async delete(endURL: string, headers?: object): Promise<any> {
        const finalHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            ...(headers || {})
        }

        const res = await this.makeRequest(endURL, {
            method: 'DELETE',
            headers: finalHeaders,
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            throw new Error(errorData.message || 'Internal Server Error!')
        }

        return await res.json()
    }
}

export default new Fetch