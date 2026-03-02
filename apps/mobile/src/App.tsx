import React, { useEffect, useState } from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import { FitsScreen } from "./screens/FitsScreen";
import { EditorScreen } from "./screens/EditorScreen";
import { StatsScreen } from "./screens/StatsScreen";
import { BrowserScreen } from "./screens/BrowserScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { initDb } from "./db/repository";

const Tab = createBottomTabNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      initDb();
    } catch (e) {
      console.error("Failed to initialize database", e);
    } finally {
      setIsReady(true);
    }
  }, []);

  if (!isReady) {
    return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Text>Loading...</Text></View>;
  }

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
