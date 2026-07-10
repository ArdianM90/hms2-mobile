import { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { getAccessToken } from '@/auth/storage';
import { environment } from '@/config/environment';
import { jwtDecode } from 'jwt-decode';
import { AccessToken } from '@/auth/access-token';

export default function Dashboard() {
    const [login, setLogin] = useState('');
    const [roles, setRoles] = useState<string[]>([]);

    const hasRole = (role: string) => roles.includes(role);

    useEffect(() => {
        (async () => {
            const token = await getAccessToken();

            if (!token) {
                return;
            }

            const jwt = jwtDecode<AccessToken>(token);

            setLogin(jwt.sub);
            setRoles(jwt.roles);
        })();
    }, []);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 20,
            }}
        >
            <Text style={{ fontSize: 22 }}>Witaj {login}</Text>

            {(hasRole('ROLE_EMPLOYEE') || hasRole('ROLE_ADMIN')) && (
                <Button title="Pokaż moje zadania" onPress={() => {}} />
            )}

            {(hasRole('ROLE_GUEST') || hasRole('ROLE_ADMIN')) && (
                <Button title="Pokaż moje rezerwacje" onPress={() => {}} />
            )}
        </View>
    );
}
