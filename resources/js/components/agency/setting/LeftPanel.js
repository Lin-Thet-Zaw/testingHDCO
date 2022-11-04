import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

function LeftPanel() {
  const [isInfo, setIsInfo] = useState(false)
  const [isAgency, setIsAgency] = useState(false)
  const [profile, setProfile] = useState()
  const [className, setClassName]= useState({
      profile:'',
      contact:'',
      budget:'',
      donors:'',
      offices:'',
      trips:'',
  })

    let baseUrl = window.location.href;
    let nowUrl = baseUrl.substring(baseUrl.lastIndexOf('/')+1);

  useEffect(()=>{
    axios.get('/agency/profile/1')
    .then(res=>{
      setProfile(res.data)
    })
    .catch(err=>{
      console.log(err.message)
    })
    let url_path = window.location.pathname
    switch(url_path){
        case '/agency/profile':
        case '/agency/contactperson':
        case '/agency/budgets':
        case '/agency/donors':
        case '/agency/offices':
            setIsInfo(true)
            break
        case '/agency/travel':
        case '/agency/travellers':
            setIsAgency(true)
            break
        default:
            break
    }
  }, [])

  return (
    <div>
        <div className="list-group-item list-group-item-action left-panel-item mousePointer" onClick={e=>setIsInfo(!isInfo)}><i className="bi bi-building"></i> Profile</div>
         {
             isInfo && (
                <div className='px-3'>
                <a href="/agency/profile" className={`list-group-item list-group-item-action left-panel-item ${nowUrl==='profile'&&'active-left-panel'}`}><i className="bi bi-info-circle"></i> General Information</a>
                <a href="/agency/contactperson" className={`list-group-item list-group-item-action left-panel-item ${nowUrl==='contactperson'&&'active-left-panel'}`}><i className="bi bi-person"></i> Contact person</a>
                <a href="/agency/budgets" className={`list-group-item list-group-item-action left-panel-item ${nowUrl==='budgets'&&'active-left-panel'}`}><i className="bi bi-coin"></i> Annual Budget</a>
                <a href="/agency/donors" className={`list-group-item list-group-item-action left-panel-item ${nowUrl==='donors'&&'active-left-panel'}`}><i className="bi bi-heart"></i> Donors</a>
                <a href="/agency/offices" className={`list-group-item list-group-item-action left-panel-item ${nowUrl==='offices'&&'active-left-panel'}`}><i className="bi bi-house-door"></i> Sub-Offices</a>
             </div>
             )
         }

        {
          profile && profile.profile.allowtrip == 1 && <a href="/agency/travel" className={`list-group-item list-group-item-action left-panel-item ${nowUrl==='travel'&&'active-left-panel'}`}><i className="bi bi-pin-map"></i> Trips</a>
        }
         

    <a href="/agency/responseoverview" className={`list-group-item list-group-item-action left-panel-item ${nowUrl==='responseoverview'&&'active-left-panel'}`}><i className="bi bi-file-earmark-spreadsheet"></i> Projects Overview</a>
        
        
        <a href="/agency/setting" className={`list-group-item list-group-item-action left-panel-item ${nowUrl==='setting'&&'active-left-panel'}`}><i className="bi bi-gear"></i> Setting</a>
    </div>
  )
}

export default LeftPanel
if(document.getElementById('agencypanel')){
    ReactDOM.render(<LeftPanel />, document.getElementById('agencypanel'));
}