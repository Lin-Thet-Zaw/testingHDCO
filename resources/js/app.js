/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

require('./components/agency/setting/LeftPanel');
require('./components/setting/Town');
require('./components/setting/Setting');
require('./components/agency/AgencyProfile');
require('./components/agency/contact/ContactPersons');
require('./components/agency/budget/Budgets');
require('./components/agency/travel/Travels');
require('./components/agency/Employees');
require('./components/agency/setting/AgencySetting');
require('./components/agency/responseoverview/Responses');
require('./components/agency/donors/Donors');
require('./components/agency/offices/Offices');


//Admin panel
require('./components/admin/agencyprofile/Profiles');
require('./components/admin/trips/AgencyTrips');
require('./components/admin/trips/AllowedTrips');
require('./components/admin/trips/Detail');