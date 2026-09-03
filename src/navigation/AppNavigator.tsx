import React, { useContext } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerActions } from '@react-navigation/native';
import { ExpenseListScreen } from '../screens/ExpenseListScreen';
import { ExpenseFormScreen } from '../screens/ExpenseFormScreen';
import { ExpenseDetailScreen } from '../screens/ExpenseDetailScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ThemeContext } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { HomeStackParamList, RootDrawerParamList } from './types';

const Drawer = createDrawerNavigator<RootDrawerParamList>();
const Stack = createNativeStackNavigator<HomeStackParamList>();

function HomeStack() {
  const { theme } = useContext(ThemeContext);
  const { t } = useI18n();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ExpenseList"
        component={ExpenseListScreen}
        options={({ navigation }) => ({
          title: t.navList,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              style={{ marginLeft: 8, padding: 8 }}
            >
              <Text style={{ fontSize: 22, color: theme.text }}>☰</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('ExpenseForm')}
              style={{ marginRight: 8, padding: 8 }}
            >
              <Text style={{ color: theme.primary, fontWeight: '600', fontSize: 16 }}>
                {t.navAddBtn}
              </Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="ExpenseDetail"
        component={ExpenseDetailScreen}
        options={{ title: t.navDetail }}
      />
      <Stack.Screen
        name="ExpenseForm"
        component={ExpenseFormScreen}
        options={({ route }) => ({
          title: route.params?.item ? t.navEdit : t.navAdd,
        })}
      />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const { t } = useI18n();

  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false, title: t.navList }}
      />
      <Drawer.Screen
        name="AddExpense"
        component={ExpenseFormScreen}
        options={{ title: t.navAdd }}
      />
      <Drawer.Screen
        name="Statistics"
        component={StatsScreen}
        options={{ title: t.navStats }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t.navSettings }}
      />
    </Drawer.Navigator>
  );
}
