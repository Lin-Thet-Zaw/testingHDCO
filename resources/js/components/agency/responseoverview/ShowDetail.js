import React from 'react'
import { Modal } from 'react-bootstrap'

function ShowDetail({isShow, isToggle, data}) {
  return (
    <div><Modal
    size='lg'
    show={isShow}
    onHide={isToggle}
    backdrop="static"
    keyboard={false}
  >
    <Modal.Header closeButton>
      <Modal.Title>Response Overview</Modal.Title>
    </Modal.Header>
    <Modal.Body>
       <table className='table table-hover'>
          <tbody>
            <tr>
              <td>Location</td>
              <td>{data && data.location}</td>
            </tr>
            <tr>
              <td>Location Type</td>
              <td>{data && data.locationtype.name}</td>
            </tr>

            <tr>
              <td>Township</td>
              <td>{data && data.town.name}</td>
            </tr>

            <tr>
              <td>Travel Month</td>
              <td>{data && data.traveldate}</td>
            </tr>

            <tr>
              <td>Community</td>
              <td>{data && data.community.name}</td>
            </tr>

            <tr>
              <td>Township</td>
              <td>{data && data.town.name}</td>
            </tr>

            <tr>
              <td>Number of Household</td>
              <td>{data && data.household}</td>
            </tr>

            <tr>
              <td>Number of Male</td>
              <td>{data && data.male}</td>
            </tr>

            <tr>
              <td>Number of Female</td>
              <td>{data && data.female}</td>
            </tr>

            <tr>
              <td>Population</td>
              <td>{data && data.female + data.male}</td>
            </tr>

            <tr>
              <td>Remark</td>
              <td>{data && data.remark}</td>
            </tr>

          </tbody>
       </table>
    </Modal.Body>
  </Modal></div>
  )
}

export default ShowDetail