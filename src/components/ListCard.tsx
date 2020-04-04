import React from 'react';
import {Card, Col, Row} from "react-bootstrap";
import {List} from "../types/types";
import Moment from "react-moment";

type  ListCardProps = {
  list: List
  onClick: any
}

const ListCard = ({list, onClick}: ListCardProps) => {

  return (
    <Card onClick={() => onClick(list.id)}>
      <Card.Body className={"p-2"}>
        <Row className={"d-flex"}>
          <Col className={"well align-self-center col-7"}>
            <Card.Title className={"text-left font-weight-bold m-1"}>{ list.title }</Card.Title>
            <small>
              <Card.Text className={"text-left font-italic m-1"}>{ list.category }</Card.Text>
            </small>
          </Col>
          <Col className={"col-5"}>
            <Card.Subtitle className={"font-weight-light m-1"}>
              { list.itemsSummary ?
                <div>
                  <div>
                    { list.itemsSummary?.incomplete > 0 ?
                      <small>
                        {list.itemsSummary?.incomplete + " of " + list.itemsSummary?.total + " remaining"}
                      </small>
                      :
                      <small>
                        Complete
                      </small>
                    }
                  </div>
                  <div>
                    <small>
                      updated
                      <Moment fromNow className={"m-1"}>
                        {list.itemsSummary?.lastUpdated}
                      </Moment>
                    </small>
                  </div>
                </div>
                :
                <div>
                  <small className={"font-weight-light"}>
                    empty
                  </small>
                </div>
              }
            </Card.Subtitle>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )

};

export default ListCard