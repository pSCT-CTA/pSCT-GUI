// Import all required js modules
import * as $ from 'jquery';
import Popper from 'popper.js';
window.Popper = Popper;

import 'bootstrap';
import 'font-awesome-webpack';

// D3.js
import * as d3 from 'd3';

// Import all css (in order)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

// Import custom CSS styles
import '../css/styles.css';

// Import custom js
import * as core from './core.js';

var login_info = {};

function getLoginStatus(login_status) {
  login_info.login_status = login_status;
}

function showLoginAlert(login_attempt) {
    var $this = $("#login_alert");
    $this.removeClass();
    $this.addClass("alert alert-dismissible fade");

    if (login_attempt == 'fail') {
        $this.children('.alert-text').text('Login failed. Incorrect username or password.');
        $this.addClass("alert-danger");
    }
    else if (login_attempt == 'redirect') {
        $this.children('.alert-text').text('Sorry, please log in first.');
        $this.addClass("alert-warning");
    }
    else if (login_attempt == 'logout') {
        $this.children('.alert-text').text('Successfully logged out.');
        $this.addClass("alert-success");
    }
    $this.show();
}

// Show login alert
showLoginAlert(login_info.login_status);
