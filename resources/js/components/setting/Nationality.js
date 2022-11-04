import axios from 'axios';
import React, {useEffect, useState} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import DeleteModal from './DeleteModal';

function Nationality() {
    const [nationality, setNationality]=useState("");
    const [nationalities, setNationalities]=useState();
    const [loading, setLoading]=useState(false);
    const [requestLoading, setrequestLoading]=useState(false);
    const [message, setMessage]=useState();
    const [err, setErr]=useState();
    const [showModal, setShowModal]=useState(false);
    const [nationalityId, setNationaliltyId]=useState(0);
    const [isEdit, setIsEdit]=useState(false);

    //get all nationality
    useEffect(async()=>{
        setrequestLoading(true);
        try {
            await axios.get('/admin/nationality')
        .then(res=>{
            setNationalities(res.data);
            setrequestLoading(false);
        })
        .catch(err=>{
            console.log(err.message);
        })
        } catch (error) {
            console.log(error.message);
        }
    }, []);

    //Add nationality
    const addNationality=async()=>{
        try {
            setLoading(true);
            await axios.post('/admin/nationality', {name: nationality})
            .then(res=>{
                setNationalities([{name: nationality, id: res.data.id}, ...nationalities])
                setMessage(res.data);
                setErr();
                setNationality("");
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

    //Edit nationality
    const editNationality=(name, id)=>{
        setIsEdit(true);
        setNationality(name)
        setNationaliltyId(id);
    }

    //Update edited post
    const editUpdate=async()=>{
        setLoading(true);
        try {
            await axios.put(`/admin/nationality/${nationalityId}`, {name: nationality})
            .then(res=>{
                const index = nationalities.map(nationality=>nationality.id).indexOf(nationalityId);
                nationalities[index].name = res.data.name;
                const updatedNationalities= nationalities;
                setNationalities(updatedNationalities);
                setNationality("");
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
        setNationality("");
    }

    //delete nationality
    const showDelModal = id=>{
        setNationaliltyId(id);
        setShowModal(!showModal);
    }

    //update delete data
    const handleUpdate=()=>{
        const newNationalities = nationalities.filter(nationality=>nationality.id !== nationalityId);
        setNationalities(newNationalities);
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
                        <input type="text" value={nationality} className="form-control" placeholder="Enter nationality" onChange={e=>setNationality(e.target.value)} />
                        {
                            isEdit?(<><button className="btn btn-danger" type="button" onClick={handleCancel}>Cancel</button>
                            <button className="btn btn-primary" type="button" onClick={editUpdate}>Update</button></>):
                            <button className="btn btn-primary" type="button" onClick={addNationality}>Add</button>
                        }
                        
                        
                        </div>
                        {
                            err?(<p style={{color:'red'}}>{err}</p>):null
                        }
                    {/* list group start */}
                    <ListGroup className="mt-3">
                        {requestLoading?(<div className="text-center"><Spinner animation="grow" /></div>):<>
                                {nationalities && nationalities.map((nationality, index)=>{
                                return (
                                    <ListGroup.Item
                                        key={index}
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        {nationality.name}
                                        </div>
                                        <Badge className="mousePointer" bg="info"  pill onClick={()=>editNationality(nationality.name, nationality.id)}>
                                            Edit
                                        </Badge>&nbsp;
                                        <Badge className="mousePointer" bg="warning" pill onClick={()=>showDelModal(nationality.id)}>
                                            Delete
                                        </Badge>
                                    </ListGroup.Item>
                                )
                            })}
                            </>
                        }
                        
                        
                    </ListGroup>
                </div>
                <DeleteModal isShow={showModal} isToggle={showDelModal} recordId={`nationality/${nationalityId}`} handleUpdate={handleUpdate} />
            </div>
    );
}


export default Nationality