import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Button, ButtonGroup, Spinner } from 'react-bootstrap'
import axios from 'axios'

function AllowedTrips() {
    const [trips, setTrips] = useState()
    const [loading, setLoading] = useState(false)
    const [nextUrl, setNextUrl] = useState(null)
    const [prevUrl, setPrevUrl] = useState(null)
    const [currentPage, setCurrentPage] = useState(null)

    //get travel data
    useEffect(()=>{
        setLoading(true)
        try {
            axios.get('/admin/alltrips/2')
            .then(res=>{
                setPrevUrl(res.data.prev_page_url)
                setNextUrl(res.data.next_page_url)
                setCurrentPage(res.data.current_page)
                setTrips(res.data.data)
                setLoading(false)
            })
            .catch(err=>{
                console.log(err.message)
            })
        } catch (err) {
            console.log(err.message)
        }
    }, [])

    //pagination data

    const nextData=async()=>{
        setLoading(true)
        await axios.get(nextUrl)
        .then(res=>{
            setPrevUrl(res.data.prev_page_url)
            setNextUrl(res.data.next_page_url)
            setCurrentPage(res.data.current_page)
            setTrips(res.data.data)
            setLoading(false)
        })
        .catch(err=>{
            console.log(err.message)
        })
      }

      const previousData=async()=>{
          setLoading(true)
        await axios.get(prevUrl)
        .then(res=>{
            setPrevUrl(res.data.prev_page_url)
                setNextUrl(res.data.next_page_url)
                setCurrentPage(res.data.current_page)
                setTrips(res.data.data)
            setLoading(false)
        })
        .catch(err=>{
            console.log(err.message)
        })
      }

  return (
    <>
        <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/admin/home">Dashboard</a></li>
            <li class="breadcrumb-item active" aria-current="page">Trips</li>
        </ol>
        </nav>
        <h5 className='my-4'>Ask For Travel Lists <span class="badge rounded-pill bg-info text-white">{trips && trips.length}</span> </h5>
        {
            loading || !trips ? <div className='text-center'><Spinner animation='grow' /></div>:(
               <>
                <table className='table table-hover'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Organization</th>
                            <th>Departure Date</th>
                            <th>Arrival Date</th>
                            <th>Status</th>
                            <th>Travellers</th>
                            <th>Locations</th>
                            <th>View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            trips.map((trip, index)=>(
                                <tr>
                                    <td>{((currentPage-1)*10 + 1)+index}</td>
                                    <td><a href={`/admin/profiles/${trip.profile.id}`} className='anchorlink'>{trip.profile.name}</a></td>
                                    <td>{new Date(trip.started_date).toDateString()}</td>
                                    <td>{new Date(trip.end_date).toDateString()}</td>
                                    <td><span class="badge rounded-pill bg-success text-white">{trip.allow===0?'Pending':'Allow'}</span></td>
                                    <td><span class="badge rounded-pill bg-info text-white">{trip.employees.length}</span></td>
                                    <td><span class="badge rounded-pill bg-info text-white">{trip.trip_addresses.length}</span></td>
                                    <td><a href={`/admin/trips/${trip.id}`} className='fs-5'><i className="bi bi-eye"></i></a></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {
                       !loading && trips.length > 0 && (
                        <ButtonGroup size='sm'>
                            <Button variant="primary" disabled={prevUrl===null} onClick={previousData}>Previous</Button>
                            <Button variant="primary" disabled={nextUrl===null} onClick={nextData}>Next</Button>
                        </ButtonGroup>
                       )
                   }
               </>
            )
        }
    </>
  )
}

export default AllowedTrips

if(document.getElementById('allowedtrips')){
    ReactDOM.render(<AllowedTrips />, document.getElementById('allowedtrips'));
}