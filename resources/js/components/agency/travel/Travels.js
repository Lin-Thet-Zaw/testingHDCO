import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Table, Spinner, Button, Alert, ButtonGroup, Badge } from 'react-bootstrap'
import axios from 'axios';
import RequestTravel from './RequestTravel'
import ShowDetail from './ShowDetail';
import EditTravel from './EditTravel';
import Travellers from './Travellers';
import DelModal from './DelModal';

function Travels() {
    const [travels, setTravels] = useState([]);
    const [loading, setLoading]= useState(false);

    //request travel
    const [isTravel, setIsTravel] = useState(false);

    //show travel detail
    const [isDetail, setIsDetail] = useState(false);
    const [travelId, setTravelId] = useState();

    //edit travel
    const [isEdit, setIsEdit] = useState(false)

    //add traveller
    const [isAddTravel, setIsAddTravel] = useState(false)

    const [isDelete, setIsDelete] = useState(false)

    const [isInfo, setIsInfo] = useState(false)

    const [nextUrl, setNextUrl] = useState(null)
    const [prevUrl, setPrevUrl] = useState(null)
    const [currentPage, setCurrentPage] = useState(null)

    useEffect(async()=>{
        setLoading(true);
        try {
            await axios.get('/agency/travel/lists')
            .then(res=>{
                setPrevUrl(res.data.prev_page_url)
                setNextUrl(res.data.next_page_url)
                setCurrentPage(res.data.current_page)
                setTravels(res.data.data);
                setLoading(false);
            })
            .catch(err=>{
                console.log(err.message);
                setLoading(false);
            })
        } catch (error) {
            console.log(error.message);
        }
    }, [])

    //add travel
    const addTravel = (travelData)=>{
        try {
            setTravels([travelData, ...travels])
            setIsTravel(!isTravel)
            setIsInfo(true)
            setTravelId(travelData.id)
            setIsAddTravel(true)
        } catch (error) {
            console.log(error.message)
        }
    }

    //show travel modal
    const showTravelModal = id =>{
        setIsDetail(!isDetail)
        setTravelId(id)
    }

    //shwo edit travel moda
    const editTravel = (id)=>{
        setIsEdit(!isEdit)
        setTravelId(id)
    }

    //update Travel data
    const updateTravel = (updatedData)=>{
        const index =travels && travels.map(travel=>travel.id).indexOf(updatedData.id)
        travels[index] = updatedData
        setTravels(travels)
        setIsEdit(!isEdit)
        setIsInfo(true)
    }

    //add people for travel
    const addPeople = (id)=>{
        setIsAddTravel(!isAddTravel)
        setTravelId(id)

    }

    //updated travellers
    const updatedTravellers = data =>{
        const index =travels && travels.map(travel=>travel.id).indexOf(parseInt(data.travel_id))
        travels[index].employees = data.travellers
        setTravels(travels)
        //setIsAddTravel(!isAddTravel)
    }

    //del modal
    const delModal=id=>{
        setTravelId(id)
        setIsDelete(true)
    }

    const deleteData=data=>{
        const newData = travels.filter(travel=>travel.id !== data.id)
        setTravels(newData)
        setIsDelete(false)
        setIsInfo(true)
    }

    //pagination data

    const nextData=async()=>{
        setLoading(true)
        await axios.get(nextUrl)
        .then(res=>{
            console.log(res.data)
            setPrevUrl(res.data.prev_page_url)
            setNextUrl(res.data.next_page_url)
            setCurrentPage(res.data.current_page)
            setTravels(res.data.data)
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
            setTravels(res.data.data)
            setLoading(false)
        })
        .catch(err=>{
            console.log(err.message)
        })
      }

  return (
      <>
      <h4>Trips</h4>
    <div className="card shadow-sm">
        
        <div className="card-body">
        {
                isInfo && (
                    <Alert variant="success" onClose={() => setIsInfo(false)} dismissible>

                        <span className='font-strong'>Success!</span>    Record updated successfully

                    </Alert>
                )
            }
            <div className="btn-group">
                <Button className="btn btn-primary" onClick={e=>setIsTravel(!isTravel)}>ADD <i class="bi bi-plus-lg"></i></Button>
            </div>
            {
                loading?<div className="text-center"><Spinner animation="grow" /></div>:(
                    <Table hover>
            <thead>
                <tr>
                <th>#</th>
                <th>Location</th>
                <th>Departure Date</th>
                <th>Arrival Date</th>
                <th>Status</th>
                <th>Action</th>
                </tr>
            </thead>
                        <tbody>
                {
                   travels.length > 0 && travels.map((travel, index)=>{
                        return (
                            <tr key={index}>
                            <td>{((currentPage-1)*10 + 1)+index}</td>
                            <td><Badge variant='info'>{travel.trip_addresses.length}</Badge></td>
                            <td>{new Date(travel.started_date).toDateString()}</td>
                            <td>{new Date(travel.end_date).toDateString()}</td>
                            <td>{travel.allow===0?<span class="badge bg-warning ">Pending</span>:<span class="badge bg-success">Allow</span>}</td>
                            <td>
                            <i className="bi bi-eye mousePointer text-info" onClick={e=>showTravelModal(travel.id)}></i> &nbsp;
                               
                                {
                                    travel.allow === 0 &&
                                    <>
                                    <i className="bi bi-person-plus-fill mousePointer text-primary" onClick={e=>addPeople(travel.id)}></i>&nbsp;&nbsp;
                                <i className="bi bi-pencil-square mousePointer text-primary" onClick={e=>editTravel(travel.id)}></i> &nbsp;
                                 <i className="bi bi-trash mousePointer text-danger" onClick={e=>delModal(travel.id)}></i>
                                 </>
                                }
                            </td>
                            </tr>
                        )
                    })
                }
            </tbody>
            </Table>
                )
            }
            {
                !loading && travels.length > 0 && <div className='d-flex justify-content-end'>
                    <ButtonGroup size='sm'>
                        <Button variant="primary" disabled={prevUrl===null} onClick={previousData}>Previous</Button>
                        <Button variant="primary" disabled={nextUrl===null} onClick={nextData}>Next</Button>
                    </ButtonGroup>
                </div>
            }
        </div>
        {isTravel && <RequestTravel isShow={isTravel} isToggle={e=>setIsTravel(!isTravel)} travelData={addTravel} />}
        {isDetail && <ShowDetail isShow={isDetail} isToggle={e=>setIsDetail(!isDetail)} travelId = {travelId} />} 
        {isEdit && <EditTravel isShow={isEdit} isToggle={e=>setIsEdit(!isEdit)} travelId = { travelId } travelData={updateTravel} />}
        {isAddTravel && <Travellers isShow={isAddTravel} isToggle={e=>setIsAddTravel(!isAddTravel)} travelId = { travelId } updatedTravellers = {updatedTravellers} />}
        {isDelete && <DelModal isShown={ isDelete } isToggle={e=>setIsDelete(false) } id={travelId} deleteData={deleteData} />}
    </div>
    </>
  )
}

export default Travels

if(document.getElementById('travels')){
    ReactDOM.render(<Travels />, document.getElementById('travels'));
}