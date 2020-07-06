import React from 'react'
import '../stylesheets/main.scss'
import { isMobile } from '../utils/index'

export default class App extends React.Component {
  render() {
    const mobileClass = isMobile() ? 'mobile ' : 'desktop '
    return <div className={`${mobileClass}container`}>{this.props.children}</div>
  }
}
