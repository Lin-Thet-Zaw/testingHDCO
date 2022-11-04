import React from 'react';
import ReactDOM from 'react-dom';
import Town from './Town';
import  Tab  from 'react-bootstrap/Tab';
import  Tabs  from 'react-bootstrap/Tabs';
import Community from './Community';
import Nationality from './Nationality';
import AgencyType from './AgencyType';
import LocationType from './LocationType';
import Email from './Email';

function Setting() {
    return (
        <>
            <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/admin/home">Dashboard</a></li>
            <li class="breadcrumb-item active" aria-current="page">Setting</li>
        </ol>
        </nav>

            <Tabs defaultActiveKey="town" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="town" title="Towns">
                    <Town />
                </Tab>
                <Tab eventKey="community" title="Community">
                    <Community />
                </Tab>
                <Tab eventKey="nationality" title="Nationality">
                    <Nationality />
                </Tab>
                <Tab eventKey="agencytype" title="Agency">
                    <AgencyType />
                </Tab>
                <Tab eventKey="locationtype" title="Location Types">
                    <LocationType />
                </Tab>
                <Tab eventKey="email" title="Mailable Users">
                    <Email />
                </Tab>
                </Tabs>
        </>
    );
}

export default Setting;

if (document.getElementById('setting')) {
    ReactDOM.render(<Setting />, document.getElementById('setting'));
}
