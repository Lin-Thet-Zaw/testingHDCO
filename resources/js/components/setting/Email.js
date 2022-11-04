import axios from 'axios';
import React, {useEffect, useState} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import DeleteModal from './DeleteModal';

function Email() {
    const [email, setEmail]=useState("")
    const [emails, setEmails] = useState()
    const [agencytype, setAgencyType]=useState("");
    const [agencyTypes, setAgencyTypes]=useState();
    const [loading, setLoading]=useState(false);
    const [requestLoading, setrequestLoading]=useState(false);
    const [message, setMessage]=useState();
    const [err, setErr]=useState();
    const [showModal, setShowModal]=useState(false);
    const [agencytypeId, setAgencyTypeId]=useState(0);
    const [emailId, setEmailId] = useState(0)
    const [isEdit, setIsEdit]=useState(false);

    //get all agencies
    useEffect(async()=>{
        setrequestLoading(true);
        try {
            await axios.get('/admin/mailableusers')
        .then(res=>{
            setEmails(res.data);
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
            await axios.post('/admin/mailableusers', {email} )
            .then(res=>{
                setEmails([{email: email, id: res.data.id}, ...emails])
                setMessage(res.data);
                setErr();
                setEmail("");
                setLoading(false);
            })
            .catch(err=>{
                setErr(err.response.data.errors.email);
                setLoading(false);
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    //Edit agency
    const editEmail=(email, id)=>{
        setIsEdit(true);
        setEmail(email)
        setEmailId(id);
    }

    //Update edited post
    const editUpdate=async()=>{
        setLoading(true);
        try {
            await axios.put(`/admin/mailableusers/${emailId}`, {email})
            .then(res=>{
                console.log(res.data)
                const index = emails.map(email=>email.id).indexOf(emailId);
                emails[index].email = res.data.email;
                setEmails(emails);
                setEmail("");
                setIsEdit(false);
                setLoading(false);
                setMessage({success: 'Record updated successfully!'});
                setErr("")
            })
            .catch(err=>{
                setErr(err.response.data.errors.email);
                setLoading(false)
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    //cancel edit
    const handleCancel = ()=>{
        setIsEdit(false);
        setEmail("");
    }

    //delete community
    const showDelModal = id=>{
        setEmailId(id);
        setShowModal(!showModal);
    }

    //update delete data
    const handleUpdate=()=>{
        const newEmails = emails.filter(email=>email.id !== emailId);
        setEmails(newEmails);
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
                        <input type="text" value={email} className="form-control" placeholder="Enter email address" onChange={e=>setEmail(e.target.value)} />
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
                                {emails && emails.map((email, index)=>{
                                return (
                                    <ListGroup.Item
                                        key={index}
                                        as="li"
                                        className="d-flex justify-content-between align-items-start"
                                    >
                                        <div className="ms-2 me-auto">
                                        {email.email}
                                        </div>
                                        <Badge className="mousePointer" bg="info"  pill onClick={()=>editEmail(email.email, email.id)}>
                                            Edit
                                        </Badge>&nbsp;
                                        <Badge className="mousePointer" bg="warning" pill onClick={()=>showDelModal(email.id)}>
                                            Delete
                                        </Badge>
                                    </ListGroup.Item>
                                )
                            })}
                            </>
                        }
                        
                        
                    </ListGroup>
                </div>
                <DeleteModal isShow={showModal} isToggle={showDelModal} recordId={`mailableusers/${emailId}`} handleUpdate={handleUpdate} />
            </div>
    );
}

export default Email;
