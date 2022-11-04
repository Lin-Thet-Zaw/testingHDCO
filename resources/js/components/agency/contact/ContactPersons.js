import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Spinner, Alert } from 'react-bootstrap'
import ReactDOM from 'react-dom'
import AddPerson from './AddPerson'
import DeleteModal from './DeleteModal'
import EditContact from './EditContact'
import ShowContact from './ShowContact'
function ContactPersons() {
    const [isShow, setIsShow] = useState(false) //add new contact
    const [isContact, setIsContact] = useState(false) // shwo contact
    const [isEdit, setIsEdit] = useState(false)
    const [isDelete, setIsDelete] = useState(false)
    const [loading, setLoading] = useState(false)
    const [contacts, setContacts] = useState([])
    const [contact, setContact] = useState()
    const [contactId, setContactId] = useState()

    const [info, setInfo] = useState(false);

    useEffect(()=>{
        setLoading(true)
        try {
            axios.get('/agency/contacts')
            .then(res=>{
                setContacts(res.data)
                setLoading(false)
            })
            .catch(err=>{
                setLoading(false)
                console.log(err.message)
            })
        } catch (err) {
            console.log(err.message)
        }
    }, [])

    const handleShow =()=>{ //to add
        setIsShow(true)
    }

    const savedContact = contact =>{
        setContacts([
            contact,
            ...contacts
        ])
        setInfo(true)
    }

    //show contact
    const handleContact = (id)=>{
        try {
            axios.get(`/agency/contactperson/${id}`)
            .then(res=>{
                console.log(res.data)
                setContact(res.data)
                setIsContact(true)
            })
            .catch(err=>{
                console.log(err.message)
            })
        } catch (err) {
            console.log(err.message)
        }

    }

    //edit contact
    const handleEdit = id=>{
        try {
            axios.get(`/agency/contactperson/${id}`)
            .then(res=>{
                setContact(res.data)
                setIsEdit(true)
            })
            .catch(err=>{
                console.log(err.message)
            })
        } catch (err) {
            console.log(err.message)
        }
    }

    //updated contact
    const updatedContact=data=>{
        const index = contacts.map(contact=>contact.id).indexOf(data.id)
        contacts[index] = data
        setContacts(contacts)
        setIsEdit(!isEdit)
        setInfo(true)
    }

    //handle delete
    const handleDelete=id=>{
        setContactId(id)
        setIsDelete(!isDelete)
    }

    //const deleted data
    const deleteData=(data)=>{
        const newData = contacts.filter(contact=>contact.id !== data.id)
        setContacts(newData)
        setIsDelete(!isDelete)
        setInfo(true)
    }
  return (
      <>
      <h4>Contact Person</h4>
    <div className='card'>
        <div className='card-body'>
            {
                info && (
                    <Alert variant="success" onClose={() => setInfo(false)} dismissible>
                        <strong>Success! </strong> 
                            Record updated successfully!
                    </Alert>
                )
            }
        <button className='btn btn-primary' onClick={handleShow}>ADD <i class="bi bi-plus-lg"></i></button>
{loading || !contacts ?<div className='text-center'><Spinner animation='grow' /></div>:(<table className='table table-hover mt-3'>
    <thead>
        <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Sex</th>
            <th>Action</th>
        </tr>
    </thead>

    {
            <tbody>
                {
                    contacts && contacts.map((contact, index)=>{
                        return (
                            <tr>
                                <td>{++index}</td>
                                <td>{contact.name}</td>
                                <td>{contact.email}</td>
                                <td>{contact.phone_number}</td>
                                <td>{contact.sex==1?'Male': contact.sex==2?'Other':'Female' }</td>
                                <td>
                                <i className="bi bi-eye mousePointer text-info" onClick={e=>handleContact(contact.id)}></i> &nbsp; 
                                <i className="bi bi-pencil-square mousePointer text-primary" onClick={e=>handleEdit(contact.id)}></i> &nbsp; 
                                <i className="bi bi-trash mousePointer text-danger" onClick={e=>handleDelete(contact.id)}></i>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
    }
</table>)}

{
    isShow && <AddPerson isShow={isShow} isToggle={e=>setIsShow(!isShow)} savedContact={savedContact} />
    
}
{
    isContact && <ShowContact isShown={isContact} isToggle={e=>setIsContact(!isContact)} contact={contact} />
}
{
    isEdit && <EditContact isShow={isEdit} isToggle={e=>setIsEdit(!isEdit)} contact={contact} updatedContact={updatedContact} />
}

{
    isDelete && <DeleteModal isShown={isDelete} isToggle={e=>setIsDelete(!isDelete)} id={contactId} deleteData={deleteData} />
}
        </div>
    </div>
    </>
  )
}

export default ContactPersons

if(document.getElementById('contactperson')){
    ReactDOM.render(<ContactPersons />, document.getElementById('contactperson'));
}