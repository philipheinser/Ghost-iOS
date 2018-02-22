import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  KeyboardAvoidingView,
  AsyncStorage,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { getClientInformation, login } from '../Auth';
import { LightGrey, DarkGrey, White, MidGrey, GhostBlue, Red } from '../Colors';

class UrlScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View>
          <Text style={styles.text}>Blogadress</Text>
        </View>
        <TextInput
          placeholder={'https://demo.ghost.io'}
          placeholderTextColor={MidGrey}
          style={styles.textinput}
          onChangeText={text => this.setState({ text })}
          value={this.state.text}
          keyboardType={'url'}
          autoCapitalize={'none'}
          returnKeyType={'done'}
        />
        {this.state.errorMessage && (
          <View>
            <Text style={styles.errorText}>{this.state.errorMessage}</Text>
          </View>
        )}
        <Button
          title="Next"
          color={GhostBlue}
          onPress={() => {
            getClientInformation(this.state.text)
              .then(data => {
                this.props.navigation.navigate('Login', {
                  ...data,
                  url: this.state.text,
                });
              })
              .catch(err => {
                this.setState({
                  errorMessage: `No ghost admin-panel in "${
                    this.state.text
                  }" found.`,
                });
              });
          }}
        />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textinput: {
    padding: 8,
    height: 40,
    width: '80%',
    borderColor: MidGrey,
    borderWidth: 1,
    borderRadius: 4,
    color: White,
  },
  text: {
    color: LightGrey,
  },
  errorText: {
    color: Red,
  },
});

export default UrlScreen;
