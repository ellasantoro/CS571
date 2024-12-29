import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from 'react-native-vector-icons/Ionicons';
import BadgerNewsScreen from '../screens/BadgerNewsScreen';
import BadgerPreferencesScreen from '../screens/BadgerPreferencesScreen';
import BadgerArticleScreen from '../screens/BadgerArticleScreen';
import * as React from 'react';

//some code here taken from the stack navigation snack: https://snack.expo.dev/@ctnelson1997/stack-navigation
//and //https://reactnavigation.org/docs/bottom-tab-navigator/ , changed to fit my use case.
const AppTabs = createBottomTabNavigator();
const ArticleNav = createNativeStackNavigator();

function ArticleNavigator() {
    return (
        <ArticleNav.Navigator>
            <ArticleNav.Screen name="News" component={BadgerNewsScreen} />
            <ArticleNav.Screen name="Article" component={BadgerArticleScreen} />
        </ArticleNav.Navigator>
    );
}

function BadgerTabs() {
    return (
        <AppTabs.Navigator
            screenOptions={({ route }) => ({
                //https://reactnavigation.org/docs/2.x/tab-based-navigation/
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    //tried a few different icon methods, found https://www.npmjs.com/package/react-native-ionicons
                    //npm installed the icons using the above article for help
                    //which is a package of raect native icons. used syntax from there, and found the full list of
                    //icons to choose from at https://iconduck.com/sets/ionicons
                    if (route.name === 'NewsArticles') {
                        //learned about focus state and other icon basics @ https://reactnavigation.org/docs/2.x/tab-based-navigation/
                        //essentially just chooses which icon to use based on whether its the active tab.
                        iconName = focused ? 'newspaper' : 'newspaper-outline';
                    } else if (route.name === 'Preferences') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                ////this is taken from the very first link in this code section (https://reactnavigation.org/docs/2.x/tab-based-navigation/), which 
                //also helped me to pass in the color, focused, and size properties above. It essentially just changes the color based on whether
                //a tab is active or not.
                tabBarActiveTintColor: 'red',
                tabBarInactiveTintColor: 'gray',
            })}>
            <AppTabs.Screen name="NewsArticles" component={ArticleNavigator} options={{ headerShown: false, title: "News" }} />
            <AppTabs.Screen name="Preferences" component={BadgerPreferencesScreen} />
        </AppTabs.Navigator>
    );
}

export default BadgerTabs;