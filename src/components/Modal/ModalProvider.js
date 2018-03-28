import React, { Component } from 'react';
import { noop } from 'lodash/fp';
import createReactContext from 'create-react-context';

import Modal, { TRANSITION_DURATION } from './Modal';
import { childrenPropType } from '../../util/shared-prop-types';

const { Provider: ContextProvider, Consumer } = createReactContext({
  setModal: noop,
  getModal: noop
});

export { Consumer as ModalConsumer };

export class ModalProvider extends Component {
  static propTypes = {
    children: childrenPropType.isRequired
  };

  state = {
    modal: null,
    isOpen: false
  };

  componentDidUpdate(prevProps, { isOpen: prevIsOpen }) {
    const { isOpen } = this.state;
    if (!isOpen && prevIsOpen) {
      setTimeout(() => {
        this.setState(prevState => ({ ...prevState, modal: null }));
      }, TRANSITION_DURATION);
    }
  }

  setModal = config => {
    window.onpopstate = this.closeModal;
    this.setState(prevState => ({
      ...prevState,
      modal: { ...prevState.modal, ...config },
      isOpen: true
    }));
  };

  closeModal = () => {
    window.onpopstate = null;
    this.setState(prevState => ({
      ...prevState,
      isOpen: false
    }));
  };

  contextValue = {
    setModal: this.setModal,
    getModal: () => this.state.modal
  };

  render() {
    const { modal, isOpen } = this.state;
    const { onClose = noop, children, body, ...otherProps } = modal || {};
    const handleClose = () => {
      onClose();
      this.closeModal();
    };
    const modalProps = modal
      ? {
          isOpen,
          ...otherProps,
          children: () => children({ onClose: handleClose }),
          onClose: handleClose
        }
      : { isOpen, children: () => null };
    return (
      <ContextProvider value={this.contextValue}>
        {this.props.children}
        <Modal {...modalProps} />
      </ContextProvider>
    );
  }
}
