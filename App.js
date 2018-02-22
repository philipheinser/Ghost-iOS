import React from 'react';
import { AsyncStorage } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { Provider, observer } from 'mobx-react/native';
import { create, persist } from 'mobx-persist';

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

const TabsNavigator = TabNavigator(
  {
    PostList: {
      screen: PostsScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
  },
  {
    tabBarOptions: {
      activeTintColor: GhostBlue,
    },
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

    const RootNavigator = StackNavigator(
      {
        Tabs: {
          screen: TabsNavigator,
        },
        URL: {
          screen: URLScreen,
        },
        Login: {
          screen: LoginScreen,
        },
        Editor: {
          screen: EditorScreen,
        },
        Shortcuts: {
          screen: ShortcutsScreen,
        },
        Unsplash: {
          screen: UnsplashScreen,
        },
        MarkdownHelp: { screen: MarkdownHelpScreen },
      },
      {
        initialRouteName: this.state.info ? 'Tabs' : 'URL',
        navigationOptions: {
          headerTintColor: GhostBlue,
          headerStyle: {
            backgroundColor: '#f4f8fb',
          },
        },
      }
    );

    return (
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    );
  }
}
