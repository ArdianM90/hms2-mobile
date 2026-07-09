import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getAccessToken } from '@/auth/storage';
import { environment } from '@/config/environment';

export default function Dashboard() {
    const [login, setLogin] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const token = await getAccessToken();

            console.log('TOKEN:', token);

            const res = await fetch(`${environment.authServer}/userinfo`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('STATUS:', res.status);

            const text = await res.text();

            console.log('BODY:', text);

            try {
                const data = JSON.parse(text);
                setLogin(data.email ?? data.sub);
            } catch (e) {
                console.error('JSON ERROR', e);
            }
        })();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 22 }}>Witaj {login ?? '...'}</Text>
        </View>
    );
}
