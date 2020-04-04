import React from 'react';
import {Card, Col, Row} from "react-bootstrap";
import {Item} from "../types/types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckSquare} from "@fortawesome/free-solid-svg-icons";
import Moment from "react-moment";

type  ItemCardProps = {
  item: Item
  onClick: any
  toggleComplete: any
  toggling: any
}

const ItemCard = ({item, onClick, toggleComplete, toggling}: ItemCardProps) => {

  return (
    <Card>
      <Card.Body className={"p-2"}>
        <Row className={"d-flex"}>
          <Col onClick={() => onClick(item.id)} className={"well align-self-center col-10"}>
            <Card.Title className={"text-left font-weight-bold m-1"}>{ item.description }</Card.Title>
            <Card.Text className={"text-left font-italic m-1"}>
              <small>
                { item.doneAt ?
                  <span>
                    Completed <Moment fromNow>{item.doneAt}</Moment>
                  </span>
                  :
                  <span>
                    Added <Moment fromNow>{item.createdAt}</Moment>
                  </span>
                }
              </small>
            </Card.Text>
          </Col>
          <Col style={{textAlign: "left"}} className={"px-0 well align-self-center col-2"}>
            <div>
              { toggling
                ?
                <FontAwesomeIcon color={"DimGray"} size={"3x"}
                                 icon={faCheckSquare}/>
                :
                <FontAwesomeIcon color={item.doneAt ? "DarkSeaGreen" : "GostWhite"} onClick={toggleComplete} size={"3x"}
                                 icon={faCheckSquare}/>
              }
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )

};

export default ItemCard