// @flow
import React from 'react';
import { Image, View, StyleSheet, Button, ScrollView, ActionSheetIOS, TouchableHighlight, Text } from 'react-native';
import PopoverTooltip from 'react-native-popover-tooltip';
import { observer, inject } from 'mobx-react/native';

import { GhostBlue } from '../Colors'

const statusToLabel = {
  all: 'All posts',
  draft: 'Draft posts',
  published: 'Published posts',
  scheduled: 'Scheduled posts'
}

const orderToLabel = {
  '': 'Sort by: Newest',
  'published_at asc': 'Sort by: Oldest',
}

@inject('store')
@observer
export default class Filter extends React.Component<{}> {
  render() {

    const status = this.props.store.postStore.filter.status;
    const order = this.props.store.postStore.order;

    return (
      <View
        horizontal={true}
        style={styles.container}
      >
        <Button title={statusToLabel[status]} color={GhostBlue} onPress={() => {
          ActionSheetIOS.showActionSheetWithOptions({
            options: ['Cancel', ...Object.values(statusToLabel)],
            cancelButtonIndex: 0,
          }, (buttonIndex) => {
            if (buttonIndex === 1) {
              this.props.store.postStore.filter.status = 'all'
            }
            if (buttonIndex === 2) {
              this.props.store.postStore.filter.status = 'draft'
            }
            if (buttonIndex === 3) {
              this.props.store.postStore.filter.status = 'published'
            }
            if (buttonIndex === 4) {
              this.props.store.postStore.filter.status = 'scheduled'
            }
          })
        }} />
        <Button title={orderToLabel[order]} color={GhostBlue} onPress={() => {
          ActionSheetIOS.showActionSheetWithOptions({
            options: ['Cancel', ...Object.values(orderToLabel)],
            cancelButtonIndex: 0,
          }, (buttonIndex) => {
            if (buttonIndex === 1) {
              this.props.store.postStore.order = ''
            }
            if (buttonIndex === 2) {
              this.props.store.postStore.order = 'published_at asc'
            }
          })
        }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tag: {
    backgroundColor: 'grey'
  }
});
