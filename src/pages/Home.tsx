import React, {useState, useEffect} from 'react';
import { View, Text, FlatList, Image, StyleSheet, ListRenderItemInfo } from 'react-native';
import { serviceApi, Ammos } from '../services/api-service';

export default function Home() {
    const [ammo, setAmmo] = useState<Ammos[]>([]);

    useEffect(() => {
        getAmmos();
    },[]);

    async function getAmmos() {
        const res = await serviceApi.getAmmos();

        setAmmo(res);

        res.map((item: Ammos) => {
            if (item.image == "") {
                console.log(`O item ${item.name}, que possui o id ${item.id} não tem imagem`);
            }
        });
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
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Header</Text>
            </View>
            <View style={styles.bodyView}>
                <FlatList
                    data={ammo}
                    renderItem={renderItem}
                />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        height: 60,
        width: "100%",
        backgroundColor: "#000",
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerTitle: {
        color: "#fff",
        fontSize: 20
    },
    bodyView: {
        flex: 1
    },
    itemView: {
        backgroundColor: "#a8a8a8",
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        height: 200,
        width: "70%",
        alignSelf: 'center'
    },
    itemImage: {
        width: 50,
        height: 50
    }
});
