import React from 'react';
import {Card} from "react-bootstrap";

type  AddCardProps = {
  onClick: any
}

const Add = ({onClick}: AddCardProps) => {

  return (
    <Card bg={"success"} onClick={onClick}>
      <Card.Body className={"p-2"}>
        <h3 className={"m-0"}>
          Add
        </h3>
      </Card.Body>
    </Card>
  )

};

export default Add