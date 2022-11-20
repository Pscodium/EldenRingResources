import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Editor from "./pages/adminPanel/Editor";
import Ammos from "./pages/items/Ammos";
import Armors from "./pages/items/Armors";
import Ashes from "./pages/items/Ashes";
import Bosses from "./pages/items/Bosses";
import Classes from "./pages/items/Classes";
import Incantations from "./pages/items/Incantations";
import Creatures from "./pages/items/Creatures";
import Items from "./pages/items/Items";
import Locations from "./pages/items/Locations";
import Npcs from "./pages/items/Npcs";
import Shields from "./pages/items/Shields";
import Sorceries from "./pages/items/Sorceries";
import Spirits from "./pages/items/Spirits";
import Talismans from "./pages/items/Talismans";
import Weapons from "./pages/items/Weapons";

const Stack = createStackNavigator();

const config = {
    screens: {
        Home: "/categories",
        Register: '/signup',
        Login: "/signin",
        Editor: "/editor",
        Ammos: "/ammo/:name",
        Armors: "/armor/:name",
        Ashes: "/ashe/:name",
        Bosses: "/boss/:name",
        Classes: "/class/:name",
        Creatures: "/creature/:name",
        Incantations: "/incantation/:name",
        Items: "/item/:name",
        Locations: "/location/:name",
        Npcs: "/npc/:name",
        Shields: "/shield/:name",
        Sorceries: "/sorcerie/:name",
        Spirits: "/spirit/:name",
        Talismans: "/talisman/:name",
        Weapons: "/weapon/:name",
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
                <Stack.Screen name="Editor" component={Editor} options={{ headerShown: false }} />
                <Stack.Screen name="Ammos" component={Ammos} options={{ headerShown: false }} />
                <Stack.Screen name="Armors" component={Armors} options={{ headerShown: false }} />
                <Stack.Screen name="Ashes" component={Ashes} options={{ headerShown: false }} />
                <Stack.Screen name="Bosses" component={Bosses} options={{ headerShown: false }} />
                <Stack.Screen name="Classes" component={Classes} options={{ headerShown: false }} />
                <Stack.Screen name="Creatures" component={Creatures} options={{ headerShown: false }} />
                <Stack.Screen name="Incantations" component={Incantations} options={{ headerShown: false }} />
                <Stack.Screen name="Items" component={Items} options={{ headerShown: false }} />
                <Stack.Screen name="Locations" component={Locations} options={{ headerShown: false }} />
                <Stack.Screen name="Npcs" component={Npcs} options={{ headerShown: false }} />
                <Stack.Screen name="Shields" component={Shields} options={{ headerShown: false }} />
                <Stack.Screen name="Sorceries" component={Sorceries} options={{ headerShown: false }} />
                <Stack.Screen name="Spirits" component={Spirits} options={{ headerShown: false }} />
                <Stack.Screen name="Talismans" component={Talismans} options={{ headerShown: false }} />
                <Stack.Screen name="Weapons" component={Weapons} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
