import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

export function AppTextInput(props: TextInputProps) {
  return (
    <TextInput
      autoCapitalize="none"
      {...props}
      keyboardType="default"
      inputMode="text"
      autoCorrect={false}
      spellCheck={false}
      autoComplete="off"
      textContentType="none"
      importantForAutofill="no"
      underlineColorAndroid="transparent"
    />
  );
}
