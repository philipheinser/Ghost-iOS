// @flow
import React from 'react';
import { Image, Button } from 'react-native';
import { observer, inject } from 'mobx-react/native';

import { Post } from '../stores/PostStore';
import { GhostBlue, MidGrey } from '../Colors';

@inject('store')
@observer
export default class Avatar extends React.Component<{ post: Post }> {
  render() {
    const post: Post = this.props.store.postStore.posts.find(
      post => post.id === this.props.post.id
    );

    let buttonTitle = '';

    if (post.status === 'published') {
      buttonTitle = post.saving ? 'Updating...' : 'Update';
    } else {
      buttonTitle = post.saving ? 'Saving...' : 'Save';
    }

    return (
      <Button
        title={buttonTitle}
        color={post.saving ? MidGrey : GhostBlue}
        disabled={post.saving}
        onPress={() => {
          this.props.post.updatePost();
        }}
      />
    );
  }
}
