import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

export function AppTextInput({
  keyboardType = 'default',
  inputMode = 'text' as any,
  ...props
}: TextInputProps) {
  return (
    <TextInput
      autoCapitalize="none"
      {...props}
      keyboardType={keyboardType}
      inputMode={inputMode}
      autoCorrect={false}
      spellCheck={false}
      autoComplete="off"
      textContentType="none"
      importantForAutofill="no"
      underlineColorAndroid="transparent"
    />
  );
}
