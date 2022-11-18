import { useFonts } from 'expo-font';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { CategoryItems, serviceApi } from '../../services/api-service';
import { Icon } from '@rneui/themed';
import ImageItem from '../../components/ImageItem';

interface DataProps {
    label: string;
    value: null;
    pluralName: string;
    singularName: string;
}

export default function Editor() {
    const [value, setValue] = useState(null);
    const [toggleModal, setToggleModal] = useState(false);
    const [itemValue, setItemValue] = useState(null);
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState('');
    const dataItems = [
        {label: '', value: null}
    ];
    const [categoryItem, setCategoryItem] = useState({
        singularName: '',
        pluralName: '',
        value: null,
    });
    const [categoryListage, setCategoryListage] = useState<CategoryItems[]>([]);
    const [item, setItem] = useState<CategoryItems>();
    const [isFocus, setIsFocus] = useState(false);
    const [fontsLoaded] = useFonts({
        'Mantinia': require('../../font/Mantinia.ttf'),
    });
    const [updateField, setUpdateField] = useState({
        name: undefined || '',
        description: undefined || '',
        image: undefined || ''
    });

    const data = [
        { label: "Classes", value: 1, pluralName: 'classes', singularName: 'class' },
        { label: "Bosses", value: 2,  pluralName: 'bosses', singularName: 'boss' },
        { label: "Creatures", value: 3, pluralName: 'creatures', singularName: 'creature' },
        { label: "Ammos", value: 4, pluralName: 'ammos', singularName: 'ammo' },
        { label: "Armors", value: 5, pluralName: 'armors', singularName: 'armor' },
        { label: "Items", value: 6, pluralName: 'items', singularName: 'item' },
        { label: "Shields", value: 7, pluralName: 'shields', singularName: 'shield' },
        { label: "Weapons", value: 8, pluralName: 'weapons', singularName: 'weapon' },
        { label: "Talismans", value: 9, pluralName: 'talismans', singularName: 'talisman' },
        { label: "Locations", value: 10, pluralName: 'locations', singularName: 'location' },
        { label: "Ashes", value: 11, pluralName: 'ashes', singularName: 'ashe' },
        { label: "Incantations", value: 12, pluralName: 'incantations', singularName: 'incantation' },
        { label: "Sorceries", value: 13, pluralName: 'sorceries', singularName: 'sorcerie' },
        { label: "Spirits", value: 14, pluralName: 'spirits', singularName: 'spirit' },
        { label: "Npcs", value: 15, pluralName: 'npcs', singularName: 'npc' },
    ];

    useEffect(() => {
        async function prepare() {
            await SplashScreen.preventAutoHideAsync();
        }
        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    async function handleCategorySelected(item: DataProps) {
        categoryItem.pluralName = item.pluralName;
        categoryItem.singularName = item.singularName;
        categoryItem.value = item.value;
        setValue(item.value);
        setIsFocus(false);
        setCategory(item.singularName);
        setCategories(item.pluralName);

        const res = await serviceApi.getItemsCategory(categoryItem.pluralName);

        setCategoryListage(res);
    }

    categoryListage.map((item: CategoryItems) => {
        dataItems.push({ label: item.id + ' - ' + item.name, value: item.id });
    });

    async function handleItemSelected(item: DataProps) {
        setItemValue(item.value);

        const res = await serviceApi.getItemById(Number(item.value), category);

        setItem(res);
    }

    async function handleUpdateItem() {
        try {
            await serviceApi.updateItem({
                id: itemValue,
                categories: categories,
                description: updateField.description,
                name: updateField.name,
                image: updateField.image

            });

            setToggleModal(!toggleModal);
            handleItemSelected({ value: itemValue, label: '', pluralName: '', singularName: ''});

        } catch (err) {
            console.error(err);
        }
    }


    return (
        <View style={styles.container} onLayout={onLayoutRootView}>
            <View style={styles.header}>
                <View style={{ width: "20%"}} />
                <View style={styles.headerCenterView}>
                    <Text style={styles.headerTitle}>Editor</Text>
                </View>
                <View style={{ width: "20%"}} />
            </View>
            <View style={styles.bodyView}>
                <View style={styles.insideBodyView}>
                    <View style={styles.categoryView}>
                        <Text style={styles.categoryText}>Item Category</Text>
                        <Dropdown
                            style={[styles.dropdown, isFocus && { borderColor: '#a79d7f' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={data}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocus ? 'Select item' : '...'}
                            searchPlaceholder="Search..."
                            value={value}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => handleCategorySelected(item)}
                            renderLeftIcon={() => (
                                <AntDesign
                                    style={styles.icon}
                                    color={isFocus ? '#a79d7f' : '#fff'}
                                    name="Safety"
                                    size={20}
                                />
                            )}
                        />
                        {dataItems.length > 1?
                            <>
                                <Text style={styles.categoryText}>Item</Text>
                                <Dropdown
                                    style={[styles.dropdown, isFocus && { borderColor: '#a79d7f', width: 300 }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={Object(dataItems)}
                                    search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isFocus ? 'Select item' : '...'}
                                    searchPlaceholder="Search..."
                                    value={itemValue}
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={item => handleItemSelected(item)}
                                    renderLeftIcon={() => (
                                        <AntDesign
                                            style={styles.icon}
                                            color={isFocus ? '#a79d7f' : '#fff'}
                                            name="Safety"
                                            size={20}
                                        />
                                    )}
                                />
                            </>
                            :
                            null
                        }
                    </View>
                    {item?
                        <View style={styles.previewItem}>
                            <ImageItem src={item.image} style={{height: 100, width: 100}}/>
                            <TouchableOpacity onPress={() => setToggleModal(!toggleModal)} style={styles.buttonUpdate}>
                                <Text style={styles.textUpdate}>UPDATE THIS ITEM</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        null
                    }
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={toggleModal}
                        onRequestClose={() => {
                            setToggleModal(!toggleModal);
                        }}
                    >
                        <View style={styles.modalView}>
                            <View style={styles.topModalView}>
                                <TouchableOpacity style={styles.closeModalButton} onPress={() => setToggleModal(!toggleModal)}>
                                    <Image source={require('../../../assets/close_ic.png')} style={styles.closeModalIcon}/>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.bodyModalView}>
                                <Text>Update an Item</Text>
                                <Text>name</Text>
                                <TextInput
                                    style={styles.inputModalUpdateItem}
                                    placeholderTextColor="#a8a8a8"
                                    placeholder={item?.name}
                                    value={updateField.name}
                                    onChangeText={(text) => setUpdateField({
                                        ...updateField,
                                        name: text,
                                    })}
                                />
                                <Text>description</Text>
                                <TextInput
                                    style={styles.inputModalUpdateItem}
                                    placeholderTextColor="#a8a8a8"
                                    placeholder={item?.description}
                                    value={updateField.description}
                                    onChangeText={(text) => setUpdateField({
                                        ...updateField,
                                        description: text,
                                    })}
                                />
                                <Text>image</Text>
                                <TextInput
                                    style={styles.inputModalUpdateItem}
                                    placeholderTextColor="#a8a8a8"
                                    placeholder={item?.image}
                                    value={updateField.image}
                                    onChangeText={(text) => setUpdateField({
                                        ...updateField,
                                        image: text,
                                    })}
                                />
                                <TouchableOpacity onPress={handleUpdateItem}>
                                    <Text>Update Item</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#232423',
        flex: 1
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
    bodyView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    insideBodyView: {
        width: "80%",
        height: "80%",
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 60,
    },
    categoryView: {
        height: "40%",
        width: "40%",
        justifyContent: 'center',
        alignItems: 'center'
    },
    categoryText: {
        fontFamily: "Mantinia",
        fontSize: 20,
        color: "#a79d7f",
        marginTop: 20
    },
    dropdown: {
        height: 50,
        width: 200,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
        color: "#fff"
    },
    selectedTextStyle: {
        fontSize: 16,
        color: "#fff"
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    previewItem: {
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonUpdate: {
        marginTop: 30,
        padding: 12,
        backgroundColor: "#a79d7f",
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textUpdate: {
        fontSize: 14,
        fontFamily: 'Mantinia',
        color: "#232423"
    },
    modalView: {
        flex: 1,
        backgroundColor: "#fff"
    },
    topModalView: {
        height: 60,
        width: "100%",
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    closeModalIcon: {
        width: 30,
        height: 30
    },
    closeModalButton: {
        alignSelf: 'flex-start',
        marginLeft: 13
    },
    bodyModalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputModalUpdateItem: {
        borderBottomColor: "#000",
        borderColor: "#000",
        borderBottomWidth: 1,
        width: "80%",
        height: 30,
        justifyContent: 'center',
        marginBottom: 15
    }
});
