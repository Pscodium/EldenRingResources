import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

const Stack = createStackNavigator();

const config = {
    screens: {
        Home: "/home",
        Register: '/signup',
        Login: "/signin"
    }
};

const linking = {
    prefixes: ["app.eldenring.resources", "api://"],
    config
};

export default function Router() {
    return (
        <NavigationContainer linking={linking}>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
