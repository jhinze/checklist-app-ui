import React from 'react';
import {Button, Modal} from "react-bootstrap";


type  ConfirmDeleteModalProps = {
  element?: string
  show: boolean
  onConfirm: any
  onCancel: any
}

const ConfirmDeleteModal = ({element, show, onConfirm, onCancel}: ConfirmDeleteModalProps) => {

  return (
    <Modal show={show}>
      <Modal.Header>
        <Modal.Title>Confirm</Modal.Title>
      </Modal.Header>
      <Modal.Body>{`Delete '${element}' ?`}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  )

};

export default ConfirmDeleteModal