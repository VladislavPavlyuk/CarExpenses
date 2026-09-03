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
import { HomeStackParamList, RootDrawerParamList } from './types';

const Drawer = createDrawerNavigator<RootDrawerParamList>();
const Stack = createNativeStackNavigator<HomeStackParamList>();

function HomeStack() {
  const { theme } = useContext(ThemeContext);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ExpenseList"
        component={ExpenseListScreen}
        options={({ navigation }) => ({
          title: 'Список витрат',
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
                + Додати
              </Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="ExpenseDetail"
        component={ExpenseDetailScreen}
        options={{ title: 'Деталі витрати' }}
      />
      <Stack.Screen
        name="ExpenseForm"
        component={ExpenseFormScreen}
        options={({ route }) => ({
          title: route.params?.item ? 'Редагування' : 'Додавання',
        })}
      />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false, title: 'Список' }}
      />
      <Drawer.Screen
        name="AddExpense"
        component={ExpenseFormScreen}
        options={{ title: 'Додавання' }}
      />
      <Drawer.Screen
        name="Statistics"
        component={StatsScreen}
        options={{ title: 'Статистика' }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Налаштування' }}
      />
    </Drawer.Navigator>
  );
}
