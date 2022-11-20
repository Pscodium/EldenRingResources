import { useFonts } from 'expo-font';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { invalidBearerToken, serviceApi } from '../../services/api-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface LoginProps {
    navigation: Navigation;
}

export default function Login({navigation}: LoginProps) {

    const [textField, setTextField] = useState({
        email: '',
        password: ''
    });
    const [fontsLoaded] = useFonts({
        'Mantinia': require('../../font/Mantinia.ttf'),
    });
    const [invalidInput, setInvalidInput] = useState(false);


    useFocusEffect(
        useCallback(() => {
            checkAuth();
        }, [navigation])
    );

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

    async function handleLogin() {
        setInvalidInput(false);

        if (textField.email == '' || textField.password == '') {
            setInvalidInput(true);
            return;
        }

        try {
            await serviceApi.userLogin(textField.email, textField.password);

            navigation.navigate("Home");
        } catch (err) {
            if (err instanceof invalidBearerToken) {
                navigation.navigate('Login');
            }
        }
    }

    async function checkAuth() {
        const token = await AsyncStorage.getItem("BEARER_TOKEN");

        if (token) {
            navigation.navigate('Home');
        }
    }


    return (
        <View style={styles.container} onLayout={onLayoutRootView}>
            <View style={styles.headerView}>
                <Text style={styles.headerTitle}>login</Text>
            </View>
            <View style={styles.bodyView}>
                <View style={styles.textInputView}>
                    <View style={styles.invalidInputView}>
                        {invalidInput?
                            <View>
                                <Text style={styles.invalidInput}>You must fill in all fields.</Text>
                            </View>
                            :
                            null
                        }
                    </View>
                    <Text style={styles.labelTextInput}>E mail</Text>
                    <TextInput
                        style={styles.textInput}
                        value={textField.email}
                        onChangeText={(text) => setTextField({ ...textField, email: text})}
                    />
                    <Text style={styles.labelTextInput}>Password</Text>
                    <TextInput
                        secureTextEntry={true}
                        style={styles.textInput}
                        value={textField.password}
                        onChangeText={(text) => setTextField({ ...textField, password: text})}
                    />
                    <View style={styles.buttonsView}>
                        <TouchableOpacity style={styles.buttonSubmit} onPress={handleLogin}>
                            <Text style={styles.textSubmit}>SEND</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonSubmit} onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.textSubmit}>REGISTER</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#232423'
    },
    headerView: {
        height: 60,
        width: "100%",
        backgroundColor: '#232423',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerTitle: {
        fontSize: 44,
        color: "#a79d7f",
        marginTop: 12,
        fontFamily: "Mantinia"
    },
    bodyView: {
        flex: 1,
        marginBottom: 60,
        justifyContent: 'center'
    },
    textInputView: {
        height: 500,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 100
    },
    invalidInputView: {
        height: 50,
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    invalidInput: {
        color: "red",
        marginTop: 4
    },
    labelTextInput: {
        fontSize: 24,
        color: "#a79d7f",
        marginTop: 20,
        fontFamily: "Mantinia"
    },
    textInput: {
        backgroundColor: "#444444",
        width: "65%",
        color: "#fff",
        height: 30,
        fontSize: 18,
        paddingHorizontal: 4
    },
    buttonsView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonSubmit: {
        backgroundColor: "#a79d7f",
        marginTop: 30,
        padding: 10,
        paddingHorizontal: 15,
        marginHorizontal: 10
    },
    textSubmit: {
        color: "#232423",
        fontFamily: "Mantinia",
        fontSize: 16,
    }
});
