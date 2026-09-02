import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExpenseListScreen } from '../screens/ExpenseListScreen';
import { ExpenseFormScreen } from '../screens/ExpenseFormScreen';
import { ExpenseDetailScreen } from '../screens/ExpenseDetailScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ExpenseList"
        component={ExpenseListScreen}
        options={{ title: 'Список витрат' }}
      />
      <Stack.Screen
        name="ExpenseDetail"
        component={ExpenseDetailScreen}
        options={{ title: 'Деталі' }}
      />
      <Stack.Screen
        name="ExpenseForm"
        component={ExpenseFormScreen}
        options={{ title: 'Форма витрати' }}
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
        options={{ headerShown: false, title: 'Головна' }}
      />
      <Drawer.Screen
        name="AddExpense"
        component={ExpenseFormScreen}
        options={{ title: 'Додати витрату' }}
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
