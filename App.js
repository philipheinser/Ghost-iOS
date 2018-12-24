import React from 'react';
import { AsyncStorage } from 'react-native';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation';
import { Provider, observer } from 'mobx-react/native';
import { create, persist } from 'mobx-persist';
import { Ionicons } from '@expo/vector-icons';

import { GhostBlue } from './src/Colors';
import store from './src/Store';

import URLScreen from './src/screens/UrlScreen';
import LoginScreen from './src/screens/LoginScreen';
import PostsScreen from './src/screens/PostsScreen';
import EditorScreen from './src/screens/EditorScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ShortcutsScreen from './src/screens/ShortcutsScreen';
import UnsplashScreen from './src/screens/UnsplashScreen';
import MarkdownHelpScreen from './src/screens/MarkdownHelpScreen';

const TabsNavigator = createBottomTabNavigator(
  {
    PostList: {
      screen: PostsScreen,
    },

    Settings: { screen: SettingsScreen },
  },
  {
    tabBarOptions: {
      activeTintColor: GhostBlue,
    },
    navigationOptions: ({ navigation }) => {
      const component = TabsNavigator.router.getComponentForState(
        navigation.state
      );
      if (typeof component.navigationOptions === 'function') {
        return component.navigationOptions({ navigation });
      }
      return component.navigationOptions;
    },
    defaultNavigationOptions: ({ navigation, navigationOptions }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        console.log(navigationOptions);
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'PostList') {
          iconName = 'ios-paper';
        } else if (routeName === 'Settings') {
          iconName = 'ios-settings';
        }
        return (
          <Ionicons
            name={iconName}
            size={horizontal ? 20 : 25}
            color={tintColor}
          />
        );
      },
    }),
  }
);

const hydrate = create({
  storage: AsyncStorage,
  jsonify: true,
});

@observer
export default class App extends React.Component {
  constructor() {
    super();
    this.state = { loading: true };
  }

  async componentDidMount() {
    const info = await AsyncStorage.getItem('userInfo');
    await hydrate('@uistore', store.uiStore);

    this.setState({
      info,
      loading: false,
    });
  }

  render() {
    if (this.state.loading) {
      return null;
    }

    const RootNavigator = createAppContainer(
      createSwitchNavigator(
        {
          Home: {
            screen: createStackNavigator({
              Tabs: {
                screen: TabsNavigator,
              },
              Shortcuts: {
                screen: ShortcutsScreen,
              },
              Editor: {
                screen: EditorScreen,
              },
              Unsplash: {
                screen: UnsplashScreen,
              },
              MarkdownHelp: { screen: MarkdownHelpScreen },
            }),
          },
          URL: {
            screen: URLScreen,
          },
          Login: {
            screen: LoginScreen,
          },
        },
        {
          initialRouteName: this.state.info ? 'Home' : 'URL',
          defaultNavigationOptions: {
            headerTintColor: GhostBlue,
            headerStyle: {
              backgroundColor: '#f4f8fb',
            },
          },
        }
      )
    );

    return (
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    );
  }
}
