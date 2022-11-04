import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Spinner, ButtonGroup, Button } from 'react-bootstrap'
import ReactDOM from 'react-dom'
import Show from './Show'

function Profiles() {
  const [profiles, setProfiles] = useState()
  const [loading, setLoading] = useState(false)
  const [nextUrl, setNextUrl] = useState(null)
  const [prevUrl, setPrevUrl] = useState(null)
  const [currentPage, setCurrentPage] = useState(null)

  useEffect(()=>{
    setLoading(true)
    axios.get('/admin/profile-lists')
    .then(res=>{
      setPrevUrl(res.data.prev_page_url)
      setNextUrl(res.data.next_page_url)
      setCurrentPage(res.data.current_page)
      setProfiles(res.data.data)
      setLoading(false)
    })
    .catch(err=>{
      console.log(err.message)
    })
  }, [])

  //pagination data

  const nextData=async()=>{
    setLoading(true)
    await axios.get(nextUrl)
    .then(res=>{
        setPrevUrl(res.data.prev_page_url)
        setNextUrl(res.data.next_page_url)
        setCurrentPage(res.data.current_page)
        setProfiles(res.data.data)
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
        setProfiles(res.data.data)
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
            <li class="breadcrumb-item active" aria-current="page">Agency Profiles</li>
        </ol>
        </nav>
 <h5 className='my-4'>Organizations {profiles && <span class="badge rounded-pill bg-info text-white">{profiles.length}</span>}</h5>
<div className="card">
      <div className='card-body'>
          {
            loading || !profiles ? <div className='text-center'><Spinner animation='grow' /></div>:<>
              <table className='table table-hover'>
            <thead>
              <tr>
                <th>#</th>
                <th>Organization</th>
                <th>Email</th>
                <th>Address</th>
                <th>Sub-offices</th>
                <th>Operation started date</th>
              </tr>
            </thead>

            <tbody>
              {
                profiles.map((profile, index)=>{
                  return (
                    <tr key={index}>
                      <td>{((currentPage-1)*10 + 1)+index}</td>
                      <td><a href={`/admin/profiles/${profile.id}`} className='anchorlink'>{profile.name}</a> <span class="badge rounded-pill bg-primary text-white">{profile.agencytype.name}</span></td>
                      <td>{profile.email}</td>
                      <td>{profile.rakhine_address} , {profile.town.name}</td>
                      <td><span class="badge rounded-pill bg-info text-white">{profile.offices.length}</span></td>
                      <td>{new Date(profile.started_date).toDateString()}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
              {!loading && profiles.length > 0 && (
                <ButtonGroup size='sm'>
                    <Button variant="primary" disabled={prevUrl===null} onClick={previousData}>Previous</Button>
                    <Button variant="primary" disabled={nextUrl===null} onClick={nextData}>Next</Button>
                </ButtonGroup>
              )}
            </>
          }
      </div>
    </div>
    </>
  )
}

export default Profiles

if(document.getElementById('profiles')){
    ReactDOM.render(<Profiles />, document.getElementById('profiles'))
}