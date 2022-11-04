import axios from 'axios';
import React, {useEffect, useState} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import DeleteModal from './DeleteModal';

function Town() {
    const [town, setTown]=useState("");
    const [towns, setTowns]=useState();
    const [loading, setLoading]=useState(false);
    const [requestLoading, setrequestLoading]=useState(false);
    const [message, setMessage]=useState();
    const [err, setErr]=useState();
    const [showModal, setShowModal]=useState(false);
    const [townId, setTownId]=useState(0);
    const [isEdit, setIsEdit]=useState(false);

    //get all town
    useEffect(async()=>{
        setrequestLoading(true);
        try {
            await axios.get('/admin/towns')
        .then(res=>{
            setTowns(res.data);
            setrequestLoading(false);
        })
        .catch(err=>{
            console.log(err.message);
        })
        } catch (error) {
            console.log(error.message);
        }
    }, []);

    //Add town
    const addTown=async()=>{
        try {
            setLoading(true);
            await axios.post('/admin/towns', {name: town})
            .then(res=>{
                setTowns([{name: town, id: res.data.id}, ...towns])
                setMessage(res.data);
                setErr();
                setTown("");
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

    //Edit township
    const editTownship=(name, id)=>{
        setIsEdit(true);
        setTown(name)
        setTownId(id);
    }

    //Update edited post
    const editUpdate=async()=>{
        setLoading(true);
        try {
            await axios.put(`/admin/towns/${townId}`, {name: town})
            .then(res=>{
                const index = towns.map(town=>town.id).indexOf(townId);
                towns[index].name = res.data.name;
                const updatedTowns= towns;
                setTowns(updatedTowns);
                setTown("");
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
        setTown("");
    }

    //delete township
    const showDelModal = id=>{
        setTownId(id);
        setShowModal(!showModal);
    }

    //update delete data
    const handleUpdate=()=>{
        const newTowns = towns.filter(town=>town.id !== townId);
        setTowns(newTowns);
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
                        <input type="text" value={town} className="form-control" placeholder="Enter township" onChange={e=>setTown(e.target.value)} />
                        {
                            isEdit?(<><button className="btn btn-danger" type="button" onClick={handleCancel}>Cancel</button>
                            <button className="btn btn-primary" type="button" onClick={editUpdate}>Update</button></>):
                            <button className="btn btn-primary" type="button" onClick={addTown}>Add</button>
                        }
                        
                        
                        </div>
                        {
                            err?(<p style={{color:'red'}}>{err}</p>):null
                        }
                    {/* list group start */}
                    <ListGroup className="mt-3">
                        {requestLoading?(<div className="text-center"><Spinner animation="grow" /></div>):<>
                                {towns && towns.map((town, index)=>{
                                return (
                                    <ListGroup.Item
                                        key={index}
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        {town.name}
                                        </div>
                                        <Badge className="mousePointer" bg="info"  pill onClick={()=>editTownship(town.name, town.id)}>
                                            Edit
                                        </Badge>&nbsp;
                                        <Badge className="mousePointer" bg="warning" pill onClick={()=>showDelModal(town.id)}>
                                            Delete
                                        </Badge>
                                    </ListGroup.Item>
                                )
                            })}
                            </>
                        }
                        
                        
                    </ListGroup>
                </div>
                <DeleteModal isShow={showModal} isToggle={showDelModal} recordId={`towns/${townId}`} handleUpdate={handleUpdate} />
            </div>
    );
}

export default Town;