// @flow
import React from 'react';
import { Image } from 'react-native';
import md5 from 'blueimp-md5';

export default class Avatar extends React.Component<{
  email: string,
  size: number,
  style: {},
}> {
  render() {
    const { size, email } = this.props;
    const hash = md5(email);

    return (
      <Image
        style={[
          { width: size, height: size, borderRadius: size / 2 },
          this.props.style,
        ]}
        source={{
          uri: `https://www.gravatar.com/avatar/${hash}?s=${this.props.size}`,
        }}
      />
    );
  }
}
