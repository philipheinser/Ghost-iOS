import React from 'react';
import { Text, View, StyleSheet, Button, Linking } from 'react-native';
import { observer, inject } from 'mobx-react/native';

import { GhostBlue, White, DarkGrey, Yellow } from '../Colors';
import UiStore from '../stores/UiStore';

@inject('store')
@observer
export default class MarkdownHelpScreen extends React.Component<{
  store: UiStore,
}> {
  static navigationOptions = {
    title: 'Markdown Help',
  };

  render() {
    const { darkEditor } = this.props.store.uiStore;

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: darkEditor ? DarkGrey : White,
      },
      row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 8,
        marginBottom: 0,
        padding: 8,
        backgroundColor: darkEditor ? DarkGrey : White,
      },
      text: {
        color: darkEditor ? White : DarkGrey,
      },
    });

    return (
      <View style={styles.container}>
        <View>
          <View style={styles.row}>
            <Text style={styles.text}>Markdown</Text>
            <Text style={styles.text}>Result</Text>
          </View>
        </View>
        <View>
          <View style={styles.row}>
            <Text style={styles.text}>**text**</Text>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>Bold</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>*text*</Text>
            <Text style={[styles.text, { fontStyle: 'italic' }]}>
              Emphasize
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>~~text~~</Text>
            <Text style={[styles.text, { textDecorationLine: 'line-through' }]}>
              Strike-through
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>[title](http://)</Text>
            <Text style={[styles.text, { color: GhostBlue }]}>Link</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>`code`</Text>
            <Text style={styles.text}>Inline Code</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>![alt](http://)</Text>
            <Text style={styles.text}>Image</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>* item</Text>
            <Text style={styles.text}>List</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>1. item</Text>
            <Text style={styles.text}>Ordered List</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>> quote</Text>
            <Text style={styles.text}>Blockquote</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>==Highlight==</Text>
            <Text style={[styles.text, { backgroundColor: Yellow }]}>
              Highlight
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}># Heading</Text>
            <Text style={styles.text}>H1</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>## Heading</Text>
            <Text style={styles.text}>H2</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>### Heading</Text>
            <Text style={styles.text}>H3</Text>
          </View>
        </View>
        <Button
          title="Markdown Documentation"
          color={GhostBlue}
          onPress={() =>
            Linking.openURL(
              'https://help.ghost.org/hc/en-us/articles/224410728-Markdown-Guide'
            )
          }
        />
      </View>
    );
  }
}
