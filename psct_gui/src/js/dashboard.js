// Import all required js modules
import * as $ from 'jquery';
import Popper from 'popper.js';
window.Popper = Popper;

import 'font-awesome-webpack';

// Import custom CSS styles
import '../css/styles.css';

// Import custom js
import * as core from './core.js';
import * as views from './views.js';

// Take care of all initialization after DOM is ready
$( document ).ready(function() {
    // Enable switching between tabs
    //core.enableTabs();
    // Enable maximizing and minimizing individual cards
    core.enableResizeCards();

    // Create all view objects
    var dashboard_info_window_view = new views.InfoWindowView("#dashboard-info-window", "dashboard_info_view");
    var device_tree_view = new views.DeviceTreeView("#component-tree", "device_tree_view", "#component-tree-container", dashboard_info_window_view);

    var error_log_view = new views.ErrorLogView("#error-log-table", "error_log_view", "#error-log-container");

    var primary_info_window_view = new views.InfoWindowView("#primary-mirror-info-window", "primary_info_view");
    var primary_mirror_view = new views.MirrorDisplayView("#primary-mirror-display", "primary_mirror_view", "#primary-mirror-container", "primary", primary_info_window_view);

    var secondary_info_window_view = new views.InfoWindowView("#secondary-mirror-info-window", "secondary_info_view");
    var secondary_mirror_view = new views.MirrorDisplayView("#secondary-mirror-display", "secondary_mirror_view", "#secondary-mirror-container", "secondary", secondary_info_window_view
  );


});
