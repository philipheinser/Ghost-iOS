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
import { NavigationActions } from 'react-navigation';
import { getClientInformation, login } from '../Auth';
import { LightGrey, DarkGrey, White, MidGrey, Red, GhostBlue } from '../Colors';

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <TextInput
          keyboardAppearance="dark"
          placeholder={'email'}
          placeholderTextColor={MidGrey}
          style={styles.textinput}
          onChangeText={text => this.setState({ email: text })}
          value={this.state.email}
          keyboardType={'email-address'}
          autoCapitalize={'none'}
          returnKeyType={'next'}
          onSubmitEditing={() => {
            this.textinput2.focus();
          }}
        />
        <TextInput
          keyboardAppearance="dark"
          ref={textInput => {
            this.textinput2 = textInput;
          }}
          placeholder={'password'}
          placeholderTextColor={MidGrey}
          style={styles.textinput}
          onChangeText={text => this.setState({ password: text })}
          value={this.state.password}
          keyboardType={'default'}
          autoCapitalize={'none'}
          secureTextEntry={true}
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
            const { params } = this.props.navigation.state;
            login(
              this.state.email,
              this.state.password,
              params.url,
              params.clientSecret,
              params.clientId
            )
              .then(data => {
                console.log(data);
                if (data.access_token) {
                  AsyncStorage.setItem(
                    'userInfo',
                    JSON.stringify({
                      email: this.state.email,
                      url: params.url,
                      ...data,
                    })
                  )
                    .then(() => {
                      const resetAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                          NavigationActions.navigate({ routeName: 'Tabs' }),
                        ],
                      });
                      this.props.navigation.dispatch(resetAction);
                    })
                    .catch(err => console.log(err));
                } else {
                  this.setState({ errorMessage: 'Wrong email or password.' });
                }
              })
              .catch(err => {
                console.log(err);
                this.setState({
                  errorMessage: 'Please check you network connection.',
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
    marginBottom: 8,
    padding: 8,
    height: 40,
    width: '80%',
    borderColor: MidGrey,
    borderWidth: 1,
    borderRadius: 4,
    color: White,
  },
  text: {
    color: 'grey',
  },
  errorText: {
    color: Red,
  },
});

export default LoginScreen;
