import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CURRENCY_KEY = 'APP_CURRENCY';

export type Currency = 'UAH' | 'EUR';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  label: string;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'UAH', symbol: '₴', label: 'UAH ₴' },
  { code: 'EUR', symbol: '€', label: 'EUR €' },
];

interface CurrencyContextProps {
  currency: CurrencyInfo;
  setCurrency: (c: Currency) => void;
}

const defaultCurrency = CURRENCIES[0];

export const CurrencyContext = createContext<CurrencyContextProps>({
  currency: defaultCurrency,
  setCurrency: () => {},
});

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<CurrencyInfo>(defaultCurrency);

  useEffect(() => {
    AsyncStorage.getItem(CURRENCY_KEY).then(val => {
      const found = CURRENCIES.find(c => c.code === val);
      if (found) setCurrencyState(found);
    });
  }, []);

  const setCurrency = async (code: Currency) => {
    const found = CURRENCIES.find(c => c.code === code);
    if (!found) return;
    setCurrencyState(found);
    await AsyncStorage.setItem(CURRENCY_KEY, code);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
