import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Modal, Spinner, Badge } from 'react-bootstrap'

function ShowDetail({ isShow, isToggle, travelId }) {

  const [travel, setTravel] = useState();
  const [loading, setLoading] = useState(false);

  //get travel data
  useEffect(async()=>{
    try {
      await axios.get(`/agency/travel/${travelId}`)
      .then(res=>{
        setTravel(res.data)
      })
      .catch(err=>{
        console.log(err.message)
      })
    } catch (error) {
      console.log(error.message);
    }
  }, [])
  return (
    <>
      {
        loading || !travel ? <div className="text-center"><Spinner animation='grow' /></div>:(
          <Modal
            size="lg"
            backdrop="static"
            show={isShow}
            onHide={ isToggle }
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                Travel Detail
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                  <div className="row">
                          <div className="text-center">
                            <i className="bi bi-check-circle-fill text-success"></i>
                          </div>
                      <div className="col-md-7 col-12">
                          <table className="table table-striped table-hover" style={{border:"none"}}>
                            {
                              travel.trip_addresses && travel.trip_addresses.map((address, incex)=>(
                                <tr className="tableRow">
                                  <td><i class="bi bi-geo-alt-fill"></i> <strong>Location </strong> </td><td>{address.location} , {address.village_track}, {address.town.name}</td>
                                </tr>
                              ))
                            }
                            <tr className="tableRow"><td><i class="bi bi-calendar-plus"></i> <strong>Departure Date </strong> </td> <td>{travel.started_date}</td></tr>
                            <tr className="tableRow">
                              <td><i class="bi bi-calendar-plus"></i>  <strong>Arrival Date </strong></td><td>{travel.end_date}</td>
                            </tr>
                            <tr className="tableRow">
                              <td><i class="bi bi-geo-alt-fill"></i>  <strong>Departure Location </strong></td><td>{travel.departure_location}</td>
                            </tr>
                            <tr className="tableRow">
                              <td width={200}>
                              <i class="bi bi-telephone-fill"></i><strong>Phone Number</strong>
                              </td>
                              <td>
                              {travel.phone_number}
                              </td>
                            </tr>
                            <tr className="tableRow">
                              <td>
                              <i class="bi bi-people"></i><strong>Total people</strong>
                              </td>
                              <td>
                               <Badge variant="info">{travel.employees.length}</Badge>
                              </td>
                            </tr>
                            <tr className="tableRow">
                              <td><i class="bi bi-person-circle"></i><strong>Driver Name</strong></td> <td>{travel.driver}</td>
                            </tr>
                            <tr className="tableRow">
                              <td><strong>Types Of Vehicle and Color</strong></td><td>{travel.vehicle_type}</td>  
                            </tr>
                            {
                              travel.vehicle_number && (<tr className="tableRow">
                              <td><strong>Vehicle Number</strong></td><td>{travel.vehicle_number}</td>  
                            </tr>)
                            }
                            <tr className="tableRow">
                              <td><i class="bi bi-calendar-plus"></i>  <strong>Request Date </strong></td><td>{ new Date(travel.created_at).toString() }</td>
                            </tr>
                          </table>
                      </div>
                      <div className="col-md-3 col-12">
                        <p>{travel.description}</p>
                      </div>
                  </div>
            </Modal.Body>
        </Modal>
        )
      }
    </>
  )
}

export default ShowDetail