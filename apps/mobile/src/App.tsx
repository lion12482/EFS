import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FitsScreen } from "./screens/FitsScreen";
import { EditorScreen } from "./screens/EditorScreen";
import { StatsScreen } from "./screens/StatsScreen";
import { BrowserScreen } from "./screens/BrowserScreen";
import { SettingsScreen } from "./screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Tab.Navigator>
        <Tab.Screen name="Fits" component={FitsScreen} />
        <Tab.Screen name="Editor" component={EditorScreen} />
        <Tab.Screen name="Stats" component={StatsScreen} />
        <Tab.Screen name="Browser" component={BrowserScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
