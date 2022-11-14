import AsyncStorage from '@react-native-async-storage/async-storage';

const backend_endpoint = process.env.BACKEND_ENDPOINT;

class ExtendableError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}


class invalidInputError extends ExtendableError {
}

class invalidBearerToken extends ExtendableError {
}

class forbiddenAccess extends ExtendableError {
}

interface Ammos {
    id: number;
    name: string;
    image: string;
    description: string;
    type: string;
    attackPower: string;
    passive: string;
}

interface Users {
    name: string;
    email: string;
    id: string;
    isActive: boolean;
}

interface UserData {
    id: string;
    name: string;
    token: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    permissions: string[];
}

class ServiceApi {
    getHeaders(token?: string, contentType?: string) {
        const headers = new Headers();
        headers.set('Access-Control-Allow-Origin', String(backend_endpoint));
        headers.set('Access-Control-Allow-Credentials', 'true');

        if (token) {
            headers.set("Authorization", "Bearer " + token);
        }

        if (contentType) {
            headers.set('Content-Type', contentType);
            headers.set('Accept', contentType);
        }

        return headers;
    }

    async getAmmos(): Promise<Ammos[]> {
        const token = await this.checkAuth();

        const res = await fetch(`${backend_endpoint}/armors`, {
            method: "GET",
            headers: this.getHeaders(token, 'application/json')
        });

        return await res.json();
    }

    /**
     *
     * @returns Returns a valid bearer token if the user is authenticated
     * @throws {invalidBearerToken} Will throw an error if some there's something invalid on authentication
     */
    async checkAuth(): Promise<string> {
        const res = await this.getUserData();

        return res.token;
    }

    async getUserData(): Promise<UserData> {
        const token = await AsyncStorage.getItem("BEARER_TOKEN");

        if (!token) {
            throw new invalidBearerToken("There's no token stored on cache.");
        }

        const res = await fetch(`${backend_endpoint}/users/checkAuth`, {
            method: "GET",
            headers: this.getHeaders(token),
        });

        if (res.status != 200) {
            await AsyncStorage.removeItem("BEARER_TOKEN");
            throw new invalidBearerToken("The token token stored on cache is no longer valid.");
        }

        const response = await res.json();
        response.token = token;

        return response;
    }

    async registerUser(name: string, email: string, password: string): Promise<Users[]> {
        const res = await fetch(`${backend_endpoint}/users`, {
            method: "POST",
            headers: this.getHeaders('application/json'),
            body: JSON.stringify({
                "name": name,
                "email": email,
                "password": password
            })
        });

        if (res.status == 409) {
            throw new invalidInputError('This email is already in use');
        }

        return await res.json();
    }

    async userLogin(email: string, password: string) {
        console.log(`${backend_endpoint}/auth`);
        const res = await fetch(`${backend_endpoint}/auth`, {
            method: "POST",
            headers: this.getHeaders(undefined, 'application/json'),
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        });

        if (res.status != 200) {
            throw new Error("Unexpected error on login");
        }

        const responseJson = await res.json();
        const token = responseJson.token;

        if (token) {
            await AsyncStorage.setItem('BEARER_TOKEN', token);
        }
    }
}

export const serviceApi = new ServiceApi();
export { Ammos };
