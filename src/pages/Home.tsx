import { useFonts } from 'expo-font';
import React, {useState, useEffect, useCallback} from 'react';
import { View, Text, FlatList, Image, StyleSheet, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { serviceApi, Ammos } from '../services/api-service';
import * as SplashScreen from 'expo-splash-screen';
import { List } from 'react-native-paper';
import ImageItem from '../components/ImageItem';

interface HomeProps {
    navigation: Navigation;
}

export default function Home({ navigation }: HomeProps) {
    const [ammo, setAmmo] = useState<Ammos[]>([]);
    const [userRole, setUserRole] = useState('');
    const [viewHeight, setViewHeight] = useState(0);
    const [fontsLoaded] = useFonts({
        'Mantinia': require('../font/Mantinia.ttf'),
    });

    useEffect(() => {
        getAmmos();
        getUserRole();
        async function prepare() {
            await SplashScreen.preventAutoHideAsync();
        }
        prepare();

        const height = window.innerHeight - 60;
        setViewHeight(height);
        document.body.style.position = 'fixed';


        function handleResize() {
            setViewHeight(window.innerHeight - 60);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    async function getAmmos() {
        const res = await serviceApi.getAmmos();

        setAmmo(res);

        res.map((item: Ammos) => {
            if (item.image == "") {
                console.log(`O item ${item.name}, que possui o id ${item.id} não tem imagem`);
            }
        });
    }

    async function getUserRole() {
        const res = await serviceApi.getUserData();

        setUserRole(res.user.role);
    }

    function renderItem({item}: ListRenderItemInfo<Ammos>) {
        return (
            <View style={styles.itemView}>
                <Text>{item.name}</Text>
                <Image source={{uri: item.image}} style={styles.itemImage} />
            </View>
        );
    }

    return (
        <View style={styles.container} onLayout={onLayoutRootView}>
            <View style={styles.header}>
                <View style={{ width: "20%", backgroundColor: 'green'}} />
                <View style={styles.headerCenterView}>
                    <Text style={styles.headerTitle}>Elden Ring Items</Text>
                </View>
                <View style={styles.headerRightView}>
                    {userRole == "default"?
                        null
                        :
                        <TouchableOpacity onPress={() => navigation.navigate('Editor')}>
                            <List.Icon color="#c4c4c4" icon="account-edit" style={styles.adminIcon}/>
                        </TouchableOpacity>
                    }
                </View>
            </View>
            <View style={styles.bodyView}>
                <FlatList
                    data={ammo}
                    renderItem={renderItem}
                    style={[styles.listItems, {height: viewHeight}]}
                    contentContainerStyle={styles.contentList}
                    numColumns={8}
                />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#232423'
    },
    header: {
        height: 60,
        width: "100%",
        backgroundColor: "#232423",
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    headerCenterView: {
        width: "60%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: "#a79d7f",
        fontSize: 28,
        fontFamily: "Mantinia"
    },
    headerRightView: {
        width: "20%",
        height: 60,
        justifyContent:'center',
        alignItems: 'flex-end'
    },
    adminIcon: {
        height: 60,
        width: 60,
    },
    bodyView: {
        flex: 1
    },
    itemView: {
        backgroundColor: "#444444",
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        height: 150,
        width: 150,
        alignSelf: 'center',
        textAlign: 'center',
        marginHorizontal: 10
    },
    itemImage: {
        width: 50,
        height: 50,
        marginTop: 10
    },
    listItems: {
        flexWrap: 'wrap'
    },
    contentList: {
        alignItems: 'center',
    }
});
