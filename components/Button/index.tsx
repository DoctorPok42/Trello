import React from 'react';
import { View } from 'react-native';

interface ButtonProps {
  title: string;
  color?: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: any;
}

const Button = ({
  title,
  color = '#000',
  onPress,
  disabled,
  style,
}: ButtonProps) => {
  return (
    <View style={style}>
      <Button title={title} color={color} onPress={onPress} disabled={disabled} />
    </View>
  );
};

export default Button;
