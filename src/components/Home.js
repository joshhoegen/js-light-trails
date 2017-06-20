import React from 'react';
import GreenScreen from './trails/index';

export default class Home extends React.Component {
  componentWillMount() {
    this.query = this.props.location.query;
  }

  render() {
    const query = this.query;
    return (
      <div className="page-home">
        <GreenScreen
          hex={query.hex || '2ab050'}
          size={query.size || '4'}
          pixelate={query.pixelate || 'false'}
        />
        <a href="http://joshhoegen.com">
          <img className="logo" src="media/jh-logo-80.png" alt="Art by Josh Hoegen" />
        </a>
      </div>
    );
  }
}
