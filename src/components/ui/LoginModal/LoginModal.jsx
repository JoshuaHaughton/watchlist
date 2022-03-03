import React from "react";
import { createPortal } from "react-dom";
import Backdrop from "./Backdrop";
import ModalOverlay from "./ModalOverlay";

const LoginModal = (props) => {
  return (
    <>
      {createPortal(
        <Backdrop closeModal={props.closeModal} />,
        document.getElementById("backdrop-root"),
      )}
      {createPortal(
        <ModalOverlay
          title={props.title}
          message={props.message}
          closeModal={props.closeModal}
        />, document.getElementById('overlay-root')
      )}
    </>
  );
};

export default LoginModal;
