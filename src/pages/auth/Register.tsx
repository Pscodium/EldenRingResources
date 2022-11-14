import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { serviceApi } from '../../services/api-service';


export default function Register() {
    const [textField, setTextField] = useState({
        name: '',
        email: '',
        password: '',
        repassword: ''
    });
    const [invalidInput, setInvalidInput] = useState(false);
    const [invalidPasswordLength, setInvalidPasswordLength] = useState(false);
    const [invalidRePassword, setInvalidRePassword] = useState(false);
    const [fontsLoaded] = useFonts({
        'Mantinia': require('../../font/Mantinia.ttf'),
    });

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

    function onChangePassword(password: string) {

        setTextField({ ...textField, password: password});

        if (textField.password.length < 8) {
            setInvalidPasswordLength(true);
        } else {
            setInvalidPasswordLength(false);
        }
    }

    async function handleRegistration() {
        setInvalidInput(false);
        setInvalidRePassword(false);

        if (textField.name == '' ||
            textField.email == '' ||
            textField.password == '' ||
            textField.repassword == ''
        ) {
            setInvalidInput(true);
            return;
        }

        if (textField.password != textField.repassword) {
            setInvalidRePassword(true);
            return;
        }


        if (!invalidInput || !invalidRePassword || !invalidPasswordLength) {
            try{
                await serviceApi.registerUser(textField.name, textField.email, textField.password);
            } catch (err) {
                console.error(err);
            }
        }
    }

    return (
        <View style={styles.container} onLayout={onLayoutRootView}>
            <View style={styles.headerView}>
                <Text style={styles.headerTitle}>register</Text>
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
                        {invalidRePassword?
                            <View>
                                <Text style={styles.invalidInput}>Passwords must be the same.</Text>
                            </View>
                            :
                            null
                        }
                        {invalidPasswordLength?
                            <View>
                                <Text style={{color: "#a79d7f", marginTop: 4}}>Your password must been have 8 characters.</Text>
                            </View>
                            :
                            null
                        }
                    </View>
                    <Text style={styles.labelTextInput}>Nome</Text>
                    <TextInput
                        style={styles.textInput}
                        value={textField.name}
                        onChangeText={(text) => setTextField({ ...textField, name: text})}
                    />
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
                        onChangeText={onChangePassword}
                    />
                    <Text style={styles.labelTextInput}>Re Password</Text>
                    <TextInput
                        secureTextEntry={true}
                        style={styles.textInput}
                        value={textField.repassword}
                        onChangeText={(text) => setTextField({ ...textField, repassword: text})}
                    />
                    <TouchableOpacity style={styles.buttonSubmit} onPress={handleRegistration}>
                        <Text style={styles.textSubmit}>SEND</Text>
                    </TouchableOpacity>
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
    buttonSubmit: {
        backgroundColor: "#a79d7f",
        marginTop: 30,
        padding: 10,
        paddingHorizontal: 15
    },
    textSubmit: {
        color: "#232423",
        fontFamily: "Mantinia",
        fontSize: 16,
    }
});
