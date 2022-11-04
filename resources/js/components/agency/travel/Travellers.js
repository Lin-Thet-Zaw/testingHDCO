import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {  Modal, Spinner, Button } from 'react-bootstrap'
import AddTraveller from './AddTraveller'

function Travellers({isShow, isToggle, travelId, updatedTravellers}) {
  const [addLoading, setAddLoading] = useState(false) //loading to all travellers
  
  return (
    <>
        <Modal
        size='lg'
        backdrop="static"
        show={isShow}
        onHide={isToggle}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            ADD TRAVELLER {addLoading && <Spinner animation="grow" />}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
              <div className="row">
                <div className="col-md-12">
                    <AddTraveller travelId={travelId} updatedTravellers={updatedTravellers} />
              </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Travellers