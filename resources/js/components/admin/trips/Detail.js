import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import ReactDOM from 'react-dom'
import ConfirmModal from './ConfirmModal'
import Traveller from './Traveller'

function Detail() {
    const [trip, setTrip] = useState()
    const [loading, setLoading] = useState(false)
    const [isTraveller, setIsTraveller] = useState(false)
    const [travellerDetail, setTravellerDetail] = useState()

    const [isModal, setIsModal] = useState(false)
    const [allow, setAllow] = useState(0)

    const [isConfirm, setIsConfirm] = useState(false)

    let baseUrl = window.location.href;
    let id = baseUrl.substring(baseUrl.lastIndexOf('/')+1);

    const [handlingAddress, setHandlingAddress] = useState(false)

    //get data
    useEffect(async()=>{
        setLoading(true)
        try {
            await axios.get(`/admin/tripdetail/${id}`)
            .then(res=>{
                setTrip(res.data)
                setLoading(false)
            })
            .catch(err=>{
                console.log(err.message)
                setLoading(false)
            })
            
        } catch (err) {
            console.log(err.message)
        }
    }, [])

    //show each traveller
    const showTraveller=(data)=>{
        setTravellerDetail(data)
        setIsTraveller(true)
    }

    const showModal=data=>{
        setAllow(data)
        setIsModal(true)
    }

    //update trip allow or denie
    const responseTrip = async() =>{
        try {
            await axios.put(`/admin/trips/${id}`, { allow })
            .then(res=>{
                setTrip(trip=>({
                    ...trip,
                    allow:res.data.allow
                })
                )
                setIsConfirm(true)
                setIsModal(false)
            })
            .catch(err=>{
                console.log(err.message)
            })
        } catch (err) {
            console.log(err.message)
        }
    }

    //handle address
    const handleAddress =(addressId)=>{
        setHandlingAddress(true)
        try {
            axios.put(`/admin/trips/${id}/updateaddress`, {addressId})
            .then(res=>{
                const index = trip.trip_addresses.map(address=>address.id).indexOf(addressId)
                trip.trip_addresses[index].status = res.data.status?1:0;
                setTrip(trip=>({
                    ...trip
                }))
                setHandlingAddress(false)
            })
            .catch(err=>{
                console.log(err.message)
            })
        } catch (err) {
            console.log(err.message)
        }
    }
  return (
    <>
        { loading || !trip? <div className='text-center'><Spinner animation='grow' /></div>:(
            <>
            <a onClick={e=>history.back()} className='anchorlink mousePointer'><i className="bi bi-arrow-return-left fs-4"></i></a>
        <div className='row mb-5'>
                    <div className='text-center'>
                        <img src={trip.profile.logo} width='100' />
                        <h4 className='my-4'><a href={`/admin/profiles/${trip.profile.id}`} className='anchorlink'>{trip.profile.name}</a> {trip.allow===2?<i className="bi bi-check-circle text-success"></i>: <i className="bi bi-hourglass-split text-danger"></i>} </h4>
                        
                    </div>
                    
                    <div className='row'>
                        <div className='col-md-6'>
                        <i className="bi bi-calendar-check"></i> {new Date(trip.created_at).toDateString()}
                        </div>
                        <div className='col-md-6'>
                        <div className='d-flex flex-row-reverse'>
                                {trip.allow !==2 && (
                                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                    {/* <button type="button" className="btn btn-danger">Reject</button> */}
                                    <button type="button" className="btn btn-success" onClick={e=>showModal(2)}>Approve</button>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* left col */}
                <div className='col-md-5'>
                    {/* start row */}
                    <div className='row my-2'>
                        {/* strt col */}
                        <div className='col-md-5'>
                            Departure Date
                        </div>
                        {/* end col */}
                        {/* right col */}
                        <div className='col-md-7'>
                            { new Date(trip.started_date).toDateString() }
                        </div>
                        {/* end right col */}
                    </div>
                    {/* end row */}

                    {/* start row */}
                    <div className='row my-2'>
                        {/* strt col */}
                        <div className='col-md-5'>
                            Arrival Date
                        </div>
                        {/* end col */}
                        {/* right col */}
                        <div className='col-md-7'>
                            { new Date(trip.end_date).toDateString() }
                        </div>
                        {/* end right col */}
                    </div>
                    {/* end row */}

                    {/* start row */}
                    <div className='row my-2'>
                        {/* strt col */}
                        <div className='col-md-5'>
                            Departure Location
                        </div>
                        {/* end col */}
                        {/* right col */}
                        <div className='col-md-7'>
                            { trip.departure_location }
                        </div>
                        {/* end right col */}
                    </div>
                    {/* end row */}

                    {/* start row */}
                    <div className='row my-2'>
                        {/* strt col */}
                        <div className='col-md-5'>
                            Phone Number
                        </div>
                        {/* end col */}
                        {/* right col */}
                        <div className='col-md-7'>
                            {trip.phone_number}
                        </div>
                        {/* end right col */}
                    </div>
                    {/* end row */}

                    {/* start row */}
                    <div className='row my-2'>
                        {/* strt col */}
                        <div className='col-md-5'>
                            Travel To
                        </div>
                        {/* end col */}
                        {/* right col */}
                        <div className='col-md-7'>
                            {
                                trip.trip_addresses.map(address=>(
                                    <p key={address.id}>{address.location} , {address.village_track}, {address.town.name} {trip.allow !==2 && handlingAddress?<Spinner variant='success' animation="border" size="sm" />: (<span className='mousePointer' onClick={e=>handleAddress(address.id)}>{address.status === 1 ?<i className="bi bi-check-circle-fill text-success"></i>:<i className="bi bi-slash-circle text-danger"></i>}</span>)}</p>
                                ))
                            }
                        </div>
                        {/* end right col */}
                    </div>
                    {/* end row */}

                </div>
                {/* end left col */}

                {/* right col */}
                <div className='col-md-7'>
                    {/* start row */}
                    <div className='row my-2'>
                        {/* strt col */}
                        <div className='col-md-5'>
                            Driver Name
                        </div>
                        {/* end col */}
                        {/* right col */}
                        <div className='col-md-7'>
                            {trip.driver}
                        </div>
                        {/* end right col */}
                    </div>
                    {/* end row */}

                    {/* start row */}
                    <div className='row my-2'>
                        {/* strt col */}
                        <div className='col-md-5'>
                            Types Of Vehicle and Color
                        </div>
                        {/* end col */}
                        {/* right col */}
                        <div className='col-md-7'>
                            {trip.vehicle_type}
                        </div>
                        {/* end right col */}

                        {/* start row */}
                    <div className='row my-2'>
                        {/* strt col */}
                        <div className='col-md-5'>
                            Vehicle Number
                        </div>
                        {/* end col */}
                        {/* right col */}
                        <div className='col-md-7'>
                            {trip.vehicle_number}
                        </div>
                        {/* end right col */}
                    </div>
                    {/* end row */}

                     {/* start row */}
                     <div className='row mt-4'>
                        <h5>Travel Reason</h5>
                        <p>
                            {trip.description}
                        </p>
                    </div>
                    {/* end row */}


                    </div>
                    {/* end row */}
                </div>
                {/* end right col */}
                   
               
        </div>

        {/* Employees */}
        <hr />
        <h4 className='my-5'>Travellers <span className="badge rounded-pill bg-info text-white">{trip.employees.length}</span></h4>

        <table className='table table-hover'>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Sex</th>
                    <th>Nationality</th>
                    <th>View</th>
                </tr>
            </thead>

            <tbody>
               {
                   trip.employees.map((employee, index)=>(
                        <tr key={index}>
                        <td>{++index}</td>
                        <td><img src={employee.photo} width='35' /></td>
                        <td>{employee.name} </td>
                        <td>{employee.sex ==1? 'Male':employee.sex==2?'Other':'Female'}</td>
                        <td>{employee.nationality.name}</td>
                        <td><i className="bi bi-eye text-info fs-4 mousePointer" onClick={e=>showTraveller(employee)}></i></td>
                    </tr>
                   ))
               }
            </tbody>
        </table>
        </>

        )}
        {
            isTraveller && <Traveller contact={travellerDetail} isShown={isTraveller} isToggle={e=>setIsTraveller(false)} />
        }

        {
            isModal && <ConfirmModal show={isModal} handleClose={e=>setIsModal(false)} handleConfirm={responseTrip} />
        }
    </>
  )
}

export default Detail
if(document.getElementById('tripdetail')){
    ReactDOM.render(<Detail />, document.getElementById('tripdetail'))
}