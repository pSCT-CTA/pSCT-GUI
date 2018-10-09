// Import all required js modules
import * as $ from 'jquery';
import Popper from 'popper.js';
window.Popper = Popper;

import 'bootstrap';
import 'font-awesome-webpack';

// DataTables + Extensions
import 'datatables.net-bs4';
import 'datatables.net-buttons-bs4';
import 'datatables.net-responsive-bs4';
import 'datatables.net-scroller-bs4';
import 'datatables.net-select-bs4';

// D3.js
import * as d3 from 'd3';

// Import all css (in order)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-buttons-bs4/css/buttons.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-scroller-bs4/css/scroller.bootstrap4.min.css';
import 'datatables.net-select-bs4/css/select.bootstrap4.min.css';

import '../css/styles.css'; //Custom CSS

// Import local js
import { enableTabs, enableResizeCards, showLoginAlert } from './core.js';

enableTabs();
enableResizeCards();
