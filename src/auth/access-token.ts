export type AccessToken = {
    sub: string;
    user_id: string;
    client_id: string;
    roles: string[];
    exp: number;
    iat: number;
};
