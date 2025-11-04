import config from '../config/config.js'
import Cookies from 'js-cookie'

class Fetch {
    ClientAPI: string | undefined;
    token: string | undefined;

    constructor() {
        this.ClientAPI = config.serverURL
        this.token = Cookies.get('fileManager_token')
    }

    async post(endURL: string, data: object, headers?: object): Promise<any> {
        const finalHeaders: HeadersInit = {
            ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
            'Authorization': `Bearer ${this.token}`,
            ...(headers || {})
        }
        const res: Response = await fetch(`${this.ClientAPI}${endURL}`, {
            method: 'POST',
            headers: finalHeaders,
            credentials: 'include',
            body: data instanceof FormData ? data : JSON.stringify(data)
        })
        if (!res.ok) throw new Error('Internal Server Error!')
        return await res.json()
    }


    async get(endURL: string, headers?: object, signal?: AbortSignal): Promise<any> {
        const finalHeaders: HeadersInit = {
            'Authorization': `Bearer ${this.token}`,
            ...(headers || {})
        }
        const res: Response = await fetch(`${this.ClientAPI}${endURL}`, {
            method: 'GET',
            headers: finalHeaders,
            signal: signal,
            credentials: 'include',
        })
        return await res.json()
    }


    async put(endURL: string, data: object, headers?: object): Promise<any> {
        const finalHeaders: HeadersInit = {
            ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
            'Authorization': `Bearer ${this.token}`,
            ...(headers || {})
        }
        const res: Response = await fetch(`${this.ClientAPI}${endURL}`, {
            method: 'PUT',
            headers: finalHeaders,
            credentials: 'include',
            body: data instanceof FormData ? data : JSON.stringify(data)
        })
        if (!res.ok) throw new Error('Internal Server Error!')
        return await res.json()
    }


    async patch(endURL: string, data?: object, headers?: object): Promise<any> {
        const finalHeaders: HeadersInit = {
            ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
            'Authorization': `Bearer ${this.token}`,
            ...(headers || {})
        }
        const res: Response = await fetch(`${this.ClientAPI}${endURL}`, {
            method: 'PATCH',
            headers: finalHeaders,
            credentials: 'include',
            body: data instanceof FormData ? data : JSON.stringify(data)
        })
        if (!res.ok) throw new Error('Internal Server Error!')
        return await res.json()
    }


    async delete(endURL: string, headers?: object): Promise<any> {
        const finalHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
            ...(headers || {})
        }
        const res: Response = await fetch(`${this.ClientAPI}${endURL}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: finalHeaders,
        })
        if (!res.ok) throw new Error('Internal Server Error!')
        return await res.json()
    }
}

export default new Fetch