import axios from 'axios';
import React, {useEffect, useState} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import DeleteModal from './DeleteModal';

function LocationType() {
    const [agencytype, setAgencyType]=useState("");
    const [locationtype, setLocationType] = useState("")
    const [agencyTypes, setAgencyTypes]=useState();
    const [locationTypes, setLocationTypes] = useState()
    const [locationTypeId, setLocationTypeId] = useState('')
    const [loading, setLoading]=useState(false);
    const [requestLoading, setrequestLoading]=useState(false);
    const [message, setMessage]=useState();
    const [err, setErr]=useState();
    const [showModal, setShowModal]=useState(false);
    const [agencytypeId, setAgencyTypeId]=useState(0);
    const [isEdit, setIsEdit]=useState(false);

    //get all agencies
    useEffect(async()=>{
        setrequestLoading(true);
        try {
            await axios.get('/admin/locations')
        .then(res=>{
            setLocationTypes(res.data);
            setrequestLoading(false);
        })
        .catch(err=>{
            console.log(err.message);
        })
        } catch (error) {
            console.log(error.message);
        }
    }, []);

    //Add location type
    const addLocationType=async()=>{
        try {
            setLoading(true);
            await axios.post('/admin/locations', {name: locationtype})
            .then(res=>{
                setLocationTypes([{name: locationtype, id: res.data.id}, ...locationTypes])
                setMessage(res.data);
                setErr();
                setLocationType("");
                setLoading(false);  
            })
            .catch(err=>{
                setErr(err.response.data.errors.name);
                setLoading(false);
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    //Edit agency
    const editLocationType=(name, id)=>{
        setIsEdit(true);
        setLocationType(name)
        setLocationTypeId(id);
    }

    //Update location
    const editUpdate=async()=>{
        setLoading(true);
        try {
            await axios.put(`/admin/locations/${locationTypeId}`, {name: locationtype})
            .then(res=>{
                const index = locationTypes.map(location=>location.id).indexOf(locationTypeId);
                locationTypes[index].name = locationtype;
                setLocationTypes(locationTypes);
                setLocationType("");
                setIsEdit(false);
                setLoading(false);
                setMessage({success: 'Record updated successfully!'});
            })
            .catch(err=>{
                console.log(err.message);
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    //cancel edit
    const handleCancel = ()=>{
        setIsEdit(false);
        setLocationType("");
    }

    //delete community
    const showDelModal = id=>{
        setLocationTypeId(id);
        setShowModal(!showModal);
    }

    //update delete data
    const handleUpdate=()=>{
        const newLocationTypes = locationTypes.filter(location=>location.id !== locationTypeId);
        setLocationTypes(newLocationTypes);
        setMessage({success:'Record deleted successfully'});
    }
    return (
            <div className="card">
                <div className="card-body">
                    {message?<div className="text-center"><p className="success-text" role="alert">
                        {message.success}
                    </p></div>:null}
                    {loading?(<div className="text-center"><Spinner animation="grow" /></div>):null}
                    <div className="input-group">
                        <input type="text" value={locationtype} className="form-control" placeholder="Enter type of location" onChange={e=>setLocationType(e.target.value)} />
                        {
                            isEdit?(<><button className="btn btn-danger" type="button" onClick={handleCancel}>Cancel</button>
                            <button className="btn btn-primary" type="button" onClick={editUpdate}>Update</button></>):
                            <button className="btn btn-primary" type="button" onClick={addLocationType}>Add</button>
                        }
                        
                        
                        </div>
                        {
                            err?(<p style={{color:'red'}}>{err}</p>):null
                        }
                    {/* list group start */}
                    <ListGroup className="mt-3">
                        {requestLoading?(<div className="text-center"><Spinner animation="grow" /></div>):<>
                                {locationTypes && locationTypes.map((location, index)=>{
                                return (
                                    <ListGroup.Item
                                        key={index}
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        {location.name}
                                        </div>
                                        <Badge className="mousePointer" bg="info"  pill onClick={()=>editLocationType(location.name, location.id)}>
                                            Edit
                                        </Badge>&nbsp;
                                        <Badge className="mousePointer" bg="warning" pill onClick={()=>showDelModal(location.id)}>
                                            Delete
                                        </Badge>
                                    </ListGroup.Item>
                                )
                            })}
                            </>
                        }
                        
                        
                    </ListGroup>
                </div>
                <DeleteModal isShow={showModal} isToggle={showDelModal} recordId={`locations/${locationTypeId}`} handleUpdate={handleUpdate} />
            </div>
    );
}

export default LocationType;
