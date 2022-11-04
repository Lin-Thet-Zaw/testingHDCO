import axios from 'axios';
import React, {useEffect, useState} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import DeleteModal from './DeleteModal';

function AgencyType() {
    const [agencytype, setAgencyType]=useState("");
    const [agencyTypes, setAgencyTypes]=useState();
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
            await axios.get('/admin/agencytype')
        .then(res=>{
            setAgencyTypes(res.data);
            setrequestLoading(false);
        })
        .catch(err=>{
            console.log(err.message);
        })
        } catch (error) {
            console.log(error.message);
        }
    }, []);

    //Add agency type
    const addAgencyType=async()=>{
        try {
            setLoading(true);
            await axios.post('/admin/agencytype', {name: agencytype})
            .then(res=>{
                setAgencyTypes([{name: agencytype, id: res.data.id}, ...agencyTypes])
                setMessage(res.data);
                setErr();
                setAgencyType("");
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
    const editAgencyType=(name, id)=>{
        setIsEdit(true);
        setAgencyType(name)
        setAgencyTypeId(id);
    }

    //Update edited post
    const editUpdate=async()=>{
        setLoading(true);
        try {
            await axios.put(`/admin/agencytype/${agencytypeId}`, {name: agencytype})
            .then(res=>{
                const index = agencyTypes.map(agencytype=>agencytype.id).indexOf(agencytypeId);
                agencyTypes[index].name = res.data.name;
                const updatedAgencyTypes= agencyTypes;
                setAgencyTypes(updatedAgencyTypes);
                setAgencyType("");
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
        setAgencyType("");
    }

    //delete community
    const showDelModal = id=>{
        setAgencyTypeId(id);
        setShowModal(!showModal);
    }

    //update delete data
    const handleUpdate=()=>{
        const newAgencyTypes = agencyTypes.filter(agencytype=>agencytype.id !== agencytypeId);
        setAgencyTypes(newAgencyTypes);
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
                        <input type="text" value={agencytype} className="form-control" placeholder="Enter agency type" onChange={e=>setAgencyType(e.target.value)} />
                        {
                            isEdit?(<><button className="btn btn-danger" type="button" onClick={handleCancel}>Cancel</button>
                            <button className="btn btn-primary" type="button" onClick={editUpdate}>Update</button></>):
                            <button className="btn btn-primary" type="button" onClick={addAgencyType}>Add</button>
                        }
                        
                        
                        </div>
                        {
                            err?(<p style={{color:'red'}}>{err}</p>):null
                        }
                    {/* list group start */}
                    <ListGroup className="mt-3">
                        {requestLoading?(<div className="text-center"><Spinner animation="grow" /></div>):<>
                                {agencyTypes && agencyTypes.map((agencyType, index)=>{
                                return (
                                    <ListGroup.Item
                                        key={index}
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        {agencyType.name}
                                        </div>
                                        <Badge className="mousePointer" bg="info"  pill onClick={()=>editAgencyType(agencyType.name, agencyType.id)}>
                                            Edit
                                        </Badge>&nbsp;
                                        <Badge className="mousePointer" bg="warning" pill onClick={()=>showDelModal(agencyType.id)}>
                                            Delete
                                        </Badge>
                                    </ListGroup.Item>
                                )
                            })}
                            </>
                        }
                        
                        
                    </ListGroup>
                </div>
                <DeleteModal isShow={showModal} isToggle={showDelModal} recordId={`agencytype/${agencytypeId}`} handleUpdate={handleUpdate} />
            </div>
    );
}

export default AgencyType;
