import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { CategoryItems, invalidBearerToken, serviceApi } from '../../services/api-service';

interface NpcsProps {
    navigation: Navigation;
    route: {
        params: { name: string };
    };
}

export default function Npcs({ navigation, route }: NpcsProps) {
    const [viewHeight, setViewHeight] = useState(0);
    const [items, setItems] = useState<CategoryItems[]>([]);
    const [fontsLoaded] = useFonts({
        'Mantinia': require('../../font/Mantinia.ttf'),
    });
    const categoryName = route.params.name;

    useEffect(() => {
        getItems();
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

    async function getItems() {
        try {
            const res = await serviceApi.getItemsCategory(categoryName);

            setItems(res);
        } catch (err) {
            if (err instanceof invalidBearerToken) {
                navigation.navigate('Login');
            }
        }
    }

    function renderItem({item}: ListRenderItemInfo<CategoryItems>) {
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
                <View style={{ width: "20%"}} />
                <View style={styles.headerCenterView}>
                    <Text style={styles.headerTitle}>Npcs</Text>
                </View>
                <View style={styles.headerRightView} />
            </View>
            <View style={styles.bodyView}>
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    style={[styles.listItems, {height: viewHeight}]}
                    contentContainerStyle={styles.contentList}
                    numColumns={3}
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
        height: 130,
        width: 130,
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
