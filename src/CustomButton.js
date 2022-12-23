import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';

const CustomButton = ({onPress, title}) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <Text style={styles.textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  buttonContainer: {
    width: Dimensions.get('window').width / 6,
    height: Dimensions.get('window').height / 25,
    borderRadius: 5,
    backgroundColor: '#3b5998',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
  },
});

export default CustomButton;
