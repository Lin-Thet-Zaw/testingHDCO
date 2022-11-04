import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Modal, Spinner } from 'react-bootstrap'
import ReactDOM from 'react-dom'
import Contact from './Contact'
import TripConfirmModal from './TripConfirmModal'

function Show() {
    const [isContact, setIsContact] = useState(false)
    const [contact, setContact] = useState()
    const [profile, setProfile] = useState()
    const [loading, setLoading] = useState(false)   

    const [id, setId] = useState(null)
    const [isModal, setIsModal] = useState(false)

    useEffect(()=>{
        try {
            const baseUrl = window.location.href;
            const id = baseUrl.substring(baseUrl.lastIndexOf('/')+1);
            setId(id)
            setLoading(true)
            axios.get(`/admin/profilesdata/${id}`)
            .then(res=>{
                setProfile(res.data)
                setLoading(false)
            })
            .catch(err=>{
                console.log(err.message)
            })
        } catch (error) {
            console.log(error.message)
        }
    }, [])

    const showContact=(data)=>{
        setContact(data)
        setIsContact(true)
    }

    const updatedProfile=(data)=>{
        setProfile(profile=>({
            ...profile,
            allowtrip: data.allowtrip
        }))
        setIsModal(false)
    }
  return (
    <>
       {
           loading || !profile ? <div className='text-center'><Spinner animation='grow' /></div>:(
                <>
                <a onClick={e=>history.back()} className='anchorlink mousePointer'><i className="bi bi-arrow-return-left fs-4"></i></a>
                    {/* row */}
                    <div className='row justify-content-center'>
                            <div className='text-center mb-5'>
                                <img src={profile.logo} width='100' />
                            </div>
                            <div className='d-flex flex-row-reverse'>
                                {
                                    profile && profile.allowtrip?(<button className='btn btn-danger' onClick={e=>setIsModal(true)}>Deny</button>):(<button className='btn btn-success' onClick={e=>setIsModal(true)}>Allow</button>)
                                }
                                
                                
                            </div>
                        {/* left col */}
                        <div className='col-md-5'>
                            <div>
                                {/* row org profile */}
                                <div className='row'>
                                    <div className='col-md-5'>Organization Name</div>
                                    <div className='col-md-7'><p>{profile.name} , {profile.agencytype.name}</p></div>
                                </div>
                                {/* end org profile row */}
                                {/* row org profile */}
                                <div className='row'>
                                    <div className='col-md-5'>Email address</div>
                                    <div className='col-md-7'><p>{profile.email}</p></div>
                                </div>
                                {/* end org profile row */}

                                {/* row org profile */}
                                    {
                                        profile.website && 
                                        <div className='row'>
                                            <div className='col-md-5'>Website</div>
                                            <div className='col-md-7'><p>{profile.website}</p></div>
                                        </div>
                                    }
                                {/* end org profile row */}

                                {/* row org profile */}
                                <div className='row'>
                                    <div className='col-md-5'>Phone number</div>
                                    <div className='col-md-7'><p>{profile.phonenumber}</p></div>
                                </div>
                                {/* end org profile row */}

                                {/* row org profile */}
                                <div className='row'>
                                    <div className='col-md-5'>The Main Office Address In Arakan</div>
                                    <div className='col-md-7'><p>{profile.rakhine_address} , {profile.town.name}</p></div>
                                </div>
                                {/* end org profile row */}

                                {/* row org profile */}
                                <div className='row'>
                                    <div className='col-md-5'>Main address</div>
                                    <div className='col-md-7'><p>{profile.country_address}</p></div>
                                </div>
                                {/* end org profile row */}

                                {/* row org profile */}
                                <div className='row'>
                                    <div className='col-md-5'>Operation Started Date In Arakan</div>
                                    <div className='col-md-7'><p>{profile.started_date}</p></div>
                                </div>
                                {/* end org profile row */}
                            </div>
                            <h5 className='mt-5'>Staffs</h5>
                            <table className='table table-hover'>
                                <thead>
                                    <tr>
                                        <th>Community</th>
                                        <th>Count</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        profile.staffs && profile.staffs.map((staff, index)=>(
                                            <tr key={index}>
                                                <td>{staff.community.name}</td>
                                                <td>{staff.staffs}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>

                            <div className='mt-5'>
                                <h5>Response Overview</h5>
                                <table className='table table-hover'>
                                    <thead>
                                        <tr>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                            <th>File</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            profile.responses && profile.responses.map((response, index)=>(
                                                <tr key={index}>
                                                    <td>{response.start_date}</td>
                                                    <td>{response.end_date}</td>
                                                    <td> <a href={`/admin/profile/filedownload/${response.file}`}>{response.file}</a> </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* end left col */}

                        <div className='col-md-7'>
                        


                {/* contact person */}
                        <h5>Contact Person</h5>
                        <table className='table table-hover'>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    profile.contacts && profile.contacts.map(contact=>(
                                        <tr>
                                            <td style={{ textDecoration:'underline', color:'blue', cursor:'pointer' }} onClick={e=>showContact(contact)}>{contact.name}</td>
                                            <td>{contact.email}</td>
                                            <td>{contact.phone_number}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>

                        <h5 className='mt-5'>Budget</h5>
                        <table className='table '>
                            <thead>
                                <tr>
                                    <th>Year</th>
                                    <th>Location</th>
                                    <th>Budget</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    profile.budgets && profile.budgets.map(budget=>(
                                        <tr>
                                            <td>{budget.year}</td>
                                            <td>{budget.address}</td>
                                            <td style={{ textAlign:'right' }}>{budget.amount}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>

                        {/* donors */}
                        <h5 className='mt-5'>Donors</h5>
                            <table className='table '>
                                <tbody>
                                    {
                                        profile.donors && profile.donors.map(donor=>(
                                            <tr>
                                                <td>{donor.name}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>

                            {/* Offices */}

                                <h5 className='mt-5'>Offices</h5>
                                <table className='table '>
                                    <tbody>
                                        {
                                            profile.offices && profile.offices.map(office=>(
                                                <tr>
                                                    <td>{office.address} , {office.town.name}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                        </div>
                    </div>
                {/* end row */}

                    {
                        isContact && <Contact isShown={isContact} contact={contact} isToggle={e=>setIsContact(false)} />
                    }

                    {
                        isModal && <TripConfirmModal show={isModal} handleClose={e=>setIsModal(false)} id={id} responseData={updatedProfile} />
                    }
                </>
           )
       }
    </>
  )
}

export default Show

if(document.getElementById('showprofile')){
    ReactDOM.render(<Show />, document.getElementById('showprofile'))
}