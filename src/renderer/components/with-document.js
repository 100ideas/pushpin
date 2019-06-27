import React from 'react'
import PropTypes from 'prop-types'


export default function withDocument(
  WrappedComponent,
  documentInitializer
) {
  const DocumentContainer = class extends React.PureComponent {
    static initializeDocument = documentInitializer

    static propTypes = {
      url: PropTypes.string.isRequired,
    }

    handle
    state = { doc: null }

    componentWillMount = () => {
      this.refreshHandle(this.props.url)
    };

    componentWillUnmount = () => {
      if (this.handle) {
        this.handle.close()
      }
    };

    componentDidUpdate = (prevProps, prevState, snapshot) => {
      if (prevProps.url !== this.props.url) {
        this.refreshHandle(this.props.url)
      }
    };

    refreshHandle = docId => {
      if (this.handle) {
        this.handle.close()
      }
      this.handle = window.repo.watch(docId, doc =>
        this.onChange(doc))
    };

    onChange = doc => {
      this.setState({ doc })
    };

    render() {
      if (!this.state.doc) {
        return <h2>Loading...</h2>
      }

      return (
        <WrappedComponent
          {...this.props}
          doc={this.state.doc}
          change={this.handle.change.bind(this.handle)} //eslint-disable-line
        />
      )
    }

    renderLoading() { }
  }
  return DocumentContainer
}