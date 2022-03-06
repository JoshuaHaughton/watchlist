import React from "react";
import { createPortal } from "react-dom";
import Backdrop from "../Backdrop";
import DeleteItemModalOverlay from "./DeleteItemModalOverlay";

const DeleteItemModal = (props) => {
  return (
    <>
      {createPortal(
        <Backdrop closeModal={props.closeModal} />,
        document.getElementById("backdrop-root"),
      )}
      {createPortal(
        <DeleteItemModalOverlay
          title={props.title}
          message={props.message}
          closeModal={props.closeModal}
          mediaId={props.mediaId}
          reloadWatchlist={props.reloadWatchlist}
        />, document.getElementById('overlay-root')
      )}
    </>
  );
};

export default DeleteItemModal;
