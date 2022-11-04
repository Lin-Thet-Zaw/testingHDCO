import axios from 'axios';
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import DeleteModal from './DeleteModal';

function Community() {
    const [community, setCommunity]=useState("");
    const [communities, setCommunities]=useState();
    const [loading, setLoading]=useState(false);
    const [requestLoading, setrequestLoading]=useState(false);
    const [message, setMessage]=useState();
    const [err, setErr]=useState();
    const [showModal, setShowModal]=useState(false);
    const [communityId, setCommunityId]=useState(0);
    const [isEdit, setIsEdit]=useState(false);

    //get all town
    useEffect(async()=>{
        setrequestLoading(true);
        try {
            await axios.get('/admin/community')
        .then(res=>{
            setCommunities(res.data);
            setrequestLoading(false);
        })
        .catch(err=>{
            console.log(err.message);
        })
        } catch (error) {
            console.log(error.message);
        }
    }, []);

    //Add community
    const addCommunity=async()=>{
        try {
            setLoading(true);
            await axios.post('/admin/community', {name: community})
            .then(res=>{
                setCommunities([{name: community, id: res.data.id}, ...communities])
                setMessage(res.data);
                setErr();
                setCommunity("");
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

    //Edit community
    const editCommunity=(name, id)=>{
        setIsEdit(true);
        setCommunity(name)
        setCommunityId(id);
    }

    //Update edited post
    const editUpdate=async()=>{
        setLoading(true);
        try {
            await axios.put(`/admin/community/${communityId}`, {name: community})
            .then(res=>{
                const index = communities.map(community=>community.id).indexOf(communityId);
                communities[index].name = res.data.name;
                const updatedCommunities= communities;
                setCommunities(updatedCommunities);
                setCommunity("");
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
        setCommunity("");
    }

    //delete community
    const showDelModal = id=>{
        setCommunityId(id);
        setShowModal(!showModal);
    }

    //update delete data
    const handleUpdate=()=>{
        const newCommunities = communities.filter(community=>community.id !== communityId);
        setCommunities(newCommunities);
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
                        <input type="text" value={community} className="form-control" placeholder="Enter community" onChange={e=>setCommunity(e.target.value)} />
                        {
                            isEdit?(<><button className="btn btn-danger" type="button" onClick={handleCancel}>Cancel</button>
                            <button className="btn btn-primary" type="button" onClick={editUpdate}>Update</button></>):
                            <button className="btn btn-primary" type="button" onClick={addCommunity}>Add</button>
                        }
                        
                        
                        </div>
                        {
                            err?(<p style={{color:'red'}}>{err}</p>):null
                        }
                    {/* list group start */}
                    <ListGroup className="mt-3">
                        {requestLoading?(<div className="text-center"><Spinner animation="grow" /></div>):<>
                                {communities && communities.map((community, index)=>{
                                return (
                                    <ListGroup.Item
                                        key={index}
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        {community.name}
                                        </div>
                                        <Badge className="mousePointer" bg="info"  pill onClick={()=>editCommunity(community.name, community.id)}>
                                            Edit
                                        </Badge>&nbsp;
                                        <Badge className="mousePointer" bg="warning" pill onClick={()=>showDelModal(community.id)}>
                                            Delete
                                        </Badge>
                                    </ListGroup.Item>
                                )
                            })}
                            </>
                        }
                        
                        
                    </ListGroup>
                </div>
                <DeleteModal isShow={showModal} isToggle={showDelModal} recordId={`community/${communityId}`} handleUpdate={handleUpdate} />
            </div>
    );
}

export default Community;
