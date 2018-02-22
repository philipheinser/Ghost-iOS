// @flow
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
  TouchableOpacity,
  ScrollView,
  WebView,
  Linking,
  Keyboard,
  Animated,
} from 'react-native';
import { ImagePicker } from 'expo';
import { observer, inject } from 'mobx-react/native';
import { FontAwesome } from '@expo/vector-icons';
import MarkdownIt from 'markdown-it';

import preview from '../preview';
import Save from '../components/Save';
import { LightGrey, GhostBlue, MidGrey, White, DarkGrey } from '../Colors';

const md = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-lazy-headers'))
  .use(require('markdown-it-mark'));

@inject('store')
@observer
class EditorScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: <Save post={navigation.state.params} />,
  });

  constructor(props) {
    super(props);

    const { params } = props.navigation.state;
    const markdown = params.mobiledoc
      ? JSON.parse(params.mobiledoc).cards[0][1].markdown
      : '';

    this.state = {
      text: markdown,
      title: params.title,
      selection: { start: 0, end: 0 },
    };

    this.keyboardHeight = new Animated.Value(0);
    this.keyboardWillShowSub = Keyboard.addListener(
      'keyboardWillShow',
      event => {
        Animated.timing(this.keyboardHeight, {
          duration: event.duration,
          toValue: event.endCoordinates.height,
        }).start();
      }
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      'keyboardWillHide',
      event => {
        Animated.timing(this.keyboardHeight, {
          duration: event.duration,
          toValue: 0,
        }).start();
      }
    );
  }

  componentDidUpdate() {
    const { params } = this.props.navigation.state;
    params.scratch = this.state.text;
    params.titleScratch = this.state.title;
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  performShortcut = async shortcut => {
    const { text, selection: { start, end } } = this.state;
    if (shortcut.type === 'annotateWords') {
      const mid = text.substring(start, end);
      const newCourser = mid.length ? end : end - shortcut.suffix.length;
      this.setState({
        text: `${text.substring(0, start)}${shortcut.prefix}${mid}${
          shortcut.suffix
        }${text.substring(end, text.length)}`,
        selection: {
          start: newCourser,
          end: newCourser,
        },
      });
    } else if (shortcut.type === 'annotateLine') {
      const { prefix: linePrefix } = shortcut;
      const firstLineStart = text.substring(0, start).lastIndexOf('\n') + 1;
      const lastLineEnd =
        end + Math.max(0, text.substring(end, text.length).indexOf('\n'));

      const selectedLinesText = text.substring(firstLineStart, lastLineEnd);

      const selectedLines = selectedLinesText.split('\n');

      const currentMiniumStack = selectedLines.reduce((result, l) => {
        const firstWord = l.split(' ')[0];
        if (shortcut.name === 'ol') {
          if (!!firstWord.match(/^\d+.$/)) {
            return Math.min(result, 1);
          } else {
            return 0;
          }
        }

        if (firstWord.split('').some(c => c !== linePrefix)) {
          return 0;
        } else {
          return Math.min(result, firstWord.length);
        }
      }, shortcut.maxStack);

      const nextStack =
        currentMiniumStack >= shortcut.maxStack ? 0 : currentMiniumStack + 1;

      let newLinePrefix = '';
      if (nextStack) {
        for (let i = 0; i < nextStack; i++) {
          newLinePrefix += linePrefix;
        }
        newLinePrefix += ' ';
      }

      const newSelectedLines = selectedLines.map((l, i) => {
        const words = l.split(' ');
        const lineStart = words[0];
        let firstWordIsPrefix;
        if (shortcut.name === 'ol') {
          firstWordIsPrefix = !!lineStart.match(/^\d+.$/);
        } else {
          firstWordIsPrefix = lineStart.split('').every(c => c === linePrefix);
        }

        if (firstWordIsPrefix) {
          words.shift();
        }
        return `${
          shortcut.name === 'ol' && newLinePrefix ? `${i + 1}. ` : newLinePrefix
        }${words.join(' ')}`;
      });

      const linesBeforeSelection = text.substring(0, firstLineStart);
      const linesAfterSelection = text.substring(lastLineEnd, text.length);

      const newText = `${linesBeforeSelection}${newSelectedLines.join(
        '\n'
      )}${linesAfterSelection}`;

      this.setState({
        text: newText,
      });
    } else if (shortcut.name === 'picture') {
      const imageData = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
        base64: true,
      });
      if (imageData.cancelled === false) {
        var formData = new FormData();
        formData.append('uploadimage', {
          uri: imageData.uri,
          name: imageData.uri.split('/').pop(),
          type: 'image/jpg',
        });
        const data = await AsyncStorage.getItem('userInfo');
        const clientInfo = JSON.parse(data);
        const res = await fetch(clientInfo.url + '/ghost/api/v0.1/uploads/', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${clientInfo.access_token}`,
          },
          body: formData,
        });
        if (res.status === 200) {
          const imageurl = await res.text();
          const mid = text.substring(start, end);
          const newCourser = mid.length ? end : end - imageurl.length - 3;
          this.setState(
            {
              text: `${text.substring(
                0,
                start
              )}![${mid}](${imageurl})${text.substring(end, text.length)}`,
              selection: {
                start: newCourser,
                end: newCourser,
              },
            },
            () => {
              this.textInput.focus();
            }
          );
        }
      }
    } else if (shortcut.name === 'unsplash') {
      this.props.navigation.navigate('Unsplash', {
        selectedImage: image => {
          const mid = text.substring(start, end);
          this.setState({
            text: `${text.substring(0, start)}![${mid}](${
              image.urls.regular
            })<small>Photo by [${image.user.name}](${
              image.links.html
            }?utm_source=ghost&utm_medium=referral&utm_campaign=api-credit) / [Unsplash](https://unsplash.com/?utm_source=ghost&utm_medium=referral&utm_campaign=api-credit)</small>${text.substring(
              end,
              text.length
            )}`,
          });
        },
      });
    } else if (shortcut.name === 'preview') {
      this.setState({
        showPreview: !this.state.showPreview,
      });
    } else if (shortcut.name === 'help') {
      this.props.navigation.navigate('MarkdownHelp');
    } else {
      alert(`unhandelt shortcut "${shortcut.name}"`);
    }
  };

  onMessage = event => {
    const data = event.nativeEvent.data;
    if (data) {
      Linking.openURL(event.nativeEvent.data);
    }
  };

  render() {
    const {
      showShortcuts,
      darkEditor,
      markdownShortcuts,
    } = this.props.store.uiStore;

    const blogUrl = 'http://207.154.225.34';

    return (
      <Animated.View
        style={[styles.container, { paddingBottom: this.keyboardHeight }]}
      >
        {!this.state.showPreview &&
          this.props.store.uiStore.orientation === 'PORTRAIT' && (
            <TextInput
              style={styles.titleInput}
              value={this.state.title}
              onChangeText={title => this.setState({ title })}
              placeholder="Post Title"
            />
          )}
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {(this.state.showPreview ||
            this.props.store.uiStore.orientation !== 'PORTRAIT') && (
            <WebView
              onMessage={this.onMessage}
              source={{
                html: preview.replace('$$title', this.state.title).replace(
                  '$$content',
                  md
                    .render(this.state.text)
                    .replace(
                      /(<a[^>]*href=["'])(\/[^>]*>)/gi,
                      '$1' + blogUrl + '$2'
                    )
                    // replace all relative URLs in images
                    .replace(
                      /(<img[^>]*src=["'])(\/[^>]*>)/gi,
                      '$1' + blogUrl + '$2'
                    )
                    // replace all relative URLs in videos
                    .replace(
                      /(<source[^>]*src=["'])(\/[^>]*>)/gi,
                      '$1' + blogUrl + '$2'
                    )
                ),
              }}
            />
          )}
          {!this.state.showPreview && (
            <TextInput
              ref={textInput => (this.textInput = textInput)}
              style={darkEditor ? styles.textInputDark : styles.textInput}
              selectioncolor={GhostBlue}
              keyboardAppearance={darkEditor ? 'dark' : 'light'}
              dataDetectorTypes={'none'}
              value={this.state.text}
              selection={this.state.selection}
              onSelectionChange={event =>
                this.setState({ selection: event.nativeEvent.selection })
              }
              onChangeText={text => this.setState({ text })}
              placeholder="Write our awesome story"
              multiline
            />
          )}
        </View>
        {showShortcuts && (
          <View style={styles.buttonBar}>
            {markdownShortcuts.map(shortcut => (
              <TouchableOpacity
                key={shortcut.name}
                style={{ flex: 1, alignItems: 'center' }}
                onPress={() => this.performShortcut(shortcut)}
              >
                <View>
                  <FontAwesome
                    name={shortcut.icon}
                    size={24}
                    color={DarkGrey}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightGrey,
  },
  textInput: {
    flex: 1,
    backgroundColor: White,
    padding: 8,
    fontSize: 16,
  },
  textInputDark: {
    flex: 1,
    backgroundColor: DarkGrey,
    color: White,
    padding: 8,
    fontSize: 16,
  },
  titleInput: {
    backgroundColor: MidGrey,
    fontSize: 22,
    color: White,
    fontWeight: '600',
    height: 50,
    padding: 8,
  },
  buttonBar: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default EditorScreen;
