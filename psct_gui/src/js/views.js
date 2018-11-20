// Import NPM modules
import * as $ from 'jquery';
import Popper from 'popper.js';
window.Popper = Popper;

import 'bootstrap';
import 'patternfly-bootstrap-treeview';

// DataTables + Extensions
import 'datatables.net-bs4';
import 'datatables.net-buttons-bs4';
import 'datatables.net-responsive-bs4';
import 'datatables.net-scroller-bs4';
import 'datatables.net-select-bs4';

// D3.js
import * as d3 from 'd3';

import io from 'socket.io-client';

// Import all css (in order)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'patternfly-bootstrap-treeview/dist/bootstrap-treeview.min.css';
import 'font-awesome/css/font-awesome.min.css';

import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-buttons-bs4/css/buttons.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-scroller-bs4/css/scroller.bootstrap4.min.css';
import 'datatables.net-select-bs4/css/select.bootstrap4.min.css';


export class BaseView {
  constructor(selector, namespace_name) {
    this.$element = $(selector);

    /*
    this.socket = io();

    this.socket.on('connect', (data) => {
      this.socket.emit('client_connected');
    });
    this.socket.on('disconnect', (data) => {
      this.socket.emit('client_disconnected');
    });
    */

  }
  show() {
    throw new Error('You must implement this method.');
  }
}

export class DeviceTreeView extends BaseView {
  constructor(selector, namespace_name, container_selector, info_window_view=None) {
    super(selector, namespace_name);

    // TEMPORARY: Example data:
    this.data = [
      {
        text: "Test Mirror",
        tags: [{text:'Normal', class:'badge float-right badge-success'}],
        device_data: {
          name: "Test Mirror",
          id: "1",
          object_type: "Mirror",
          description: "This is a test mirror."
        },
        nodes: [
          {
            text: "Panels",
            tags: [{text:'Normal', class:'badge float-right badge-success'}],
            nodes: [
              {
                text: "Panel 1",
                tags: [{text:'Normal', class:'badge float-right badge-success'}],
                device_data: {
                  name: "Panel 1",
                  id: "2",
                  object_type: "Panel",
                  description: "This is test panel #1."
                },
                nodes: [
                  {
                    text: "MPES",
                    tags: [{text:'Normal', class:'badge float-right badge-success'}],
                    nodes: [
                      {
                        text: "MPES 1",
                        tags: [{text:'Normal', class:'badge float-right badge-success'}],
                        device_data: {
                          name: "MPES 1",
                          id: "5",
                          object_type: "MPES",
                          description: "This is test MPES #1."
                        }
                      }
                    ]
                  },
                  {
                    text: "ACT",
                    tags: [{text:'Normal', class:'badge float-right badge-success'}],
                    nodes: [
                      {
                        text: "ACT 1",
                        tags: [{text:'Warning', class:'badge float-right badge-warning'}],
                        device_data: {
                          name: "ACT 1",
                          id: "6",
                          object_type: "Actuator",
                          description: "This is test actuator #1."
                        }
                      }
                    ]
                  }
                ]
              },
              {
                text: "Panel 2",
                tags: [{text:'Normal', class:'badge float-right badge-success'}],
                device_data: {
                  name: "Panel 2",
                  id: "3",
                  object_type: "Panel",
                  description: "This is test panel #2."
                },
                nodes: [
                  {
                    text: "MPES",
                    tags: [{text:'Normal', class:'badge float-right badge-success'}],
                    nodes: [
                      {
                        text: "MPES 2",
                        device_data: {
                          name: "MPES 2",
                          id: "7",
                          object_type: "MPES",
                          description: "This is test MPES #2."
                        }
                      }
                    ]
                  },
                  {
                    text: "ACT",
                    tags: [{text:'Normal', class:'badge float-right badge-success'}],
                    nodes: [
                      {
                        text: "ACT 2",
                        tags: [{text:'Error', class:'badge float-right badge-danger'}],
                        device_data: {
                          name: "ACT 2",
                          id: "8",
                          object_type: "Actuator",
                          description: "This is test actuator #2."
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            text: "Edges",
            tags: [{text:'Normal', class:'badge float-right badge-success'}],
            nodes: [
              {
                text: "Edge_1_2",
                tags: [{text:'Normal', class:' badge float-right badge-success'}],
                device_data: {
                  name: "Edge_1_2",
                  id: "4",
                  object_type: "Edge",
                  description: "This is edge 1 + 2."
                },
                nodes: [
                  {
                    text: "MPES",
                    tags: [{text:'Normal', class:'badge float-right badge-success'}],
                    nodes: [
                      {
                        text: "MPES 1",
                        tags: [{text:'Normal', class:' badge float-right badge-success'}],
                        device_data: {
                          name: "MPES 1",
                          id: "5",
                          object_type: "MPES",
                          description: "This is test MPES #1."
                        }
                      },
                      {
                        text: "MPES 2",
                        tags: [{text:'Normal', class:'badge float-right badge-success'}],
                        device_data: {
                          name: "MPES 2",
                          id: "7",
                          object_type: "MPES",
                          description: "This is test MPES #2."
                        }
                      }
                    ]
                  },
                  {
                    text: "Panels",
                    nodes: [
                      {
                        text: "Panel 1",
                        tags: [{text:'Normal', class:'badge float-right badge-success'}],
                        device_data: {
                          name: "Panel 1",
                          id: "2",
                          object_type: "Panel",
                          description: "This is test panel #1."
                        }
                      },
                      {
                        text: "Panel 2",
                        tags: [{text:'Normal', class:'badge float-right badge-success'}],
                        device_data: {
                          name: "Panel 2",
                          id: "3",
                          object_type: "Panel",
                          description: "This is test panel #2."
                        }
                      },
                    ]
                  }
                ]
              }
            ]
          },
        ]
      }
    ];

    this.flat_data = [
      {
        text: "Mirrors",
        tags: [{text:'Normal', class:'badge float-right badge-success'}],
        nodes: [
          {
            text: "Test Mirror",
            tags: [{text:'Normal', class:'badge float-right badge-success'}],
            device_data: {
              name: "Test Mirror",
              id: "1",
              object_type: "Mirror",
              description: "This is a test mirror."
            }
          }
        ]
      },
      {
        text: "Panels",
        tags: [{text:'Normal', class:'badge float-right badge-success'}],
        nodes: [
          {
            text: "Panel 1",
            tags: [{text:'Normal', class:'badge float-right badge-success'}],
            device_data: {
              name: "Panel 1",
              id: "2",
              object_type: "Panel",
              description: "This is test panel #1."
            }
          },
          {
            text: "Panel 2",
            tags: [{text:'Normal', class:'badge float-right badge-success'}],
            device_data: {
              name: "Panel 2",
              id: "3",
              object_type: "Panel",
              description: "This is test panel #2."
            }
          }
        ]
      },
      {
        text: "Edges",
        tags: [{text:'Normal', class:'badge float-right badge-success'}],
        nodes: [
          {
            text: "Edge_1_2",
            tags: [{text:'Normal', class:' badge float-right badge-success'}],
            device_data: {
              name: "Edge_1_2",
              id: "4",
              object_type: "Edge",
              description: "This is edge 1 + 2."
            }
          }
        ]
      },
      {
        text: "MPES",
        tags: [{text:'Normal', class:'badge float-right badge-success'}],
        nodes: [
          {
            text: "MPES 1",
            tags: [{text:'Normal', class:' badge float-right badge-success'}],
            device_data: {
              name: "MPES 1",
              id: "5",
              object_type: "MPES",
              description: "This is test MPES #1."
            }
          },
          {
            text: "MPES 2",
            tags: [{text:'Normal', class:'badge float-right badge-success'}],
            device_data: {
              name: "MPES 2",
              id: "7",
              object_type: "MPES",
              description: "This is test MPES #2."
            }
          }
        ]
      },
      {
        text: "ACT",
        tags: [{text:'Normal', class:'badge float-right badge-success'}],
        nodes: [
          {
            text: "ACT 1",
            tags: [{text:'Warning', class:'badge float-right badge-warning'}],
            device_data: {
              name: "ACT 1",
              id: "6",
              object_type: "Actuator",
              description: "This is test actuator #1."
            }
          },
          {
            text: "ACT 2",
            tags: [{text:'Error', class:'badge float-right badge-danger'}],
            device_data: {
              name: "ACT 2",
              id: "8",
              object_type: "Actuator",
              description: "This is test actuator #2."
            }
          }
        ]
      }
    ];

    this.info_window_view = info_window_view;
    this.$container = $(container_selector);

    this.mode = "tree";

    /*
    this.socket.on('datachange_notification', function(data){
      var formatted_data = data;

      for (var node in formatted_data){
        this.add_status_tag(node);
      }

      this.data = formatted_data;
      this.show();
    });
    */

    // attach listeners to HTML controls
    //elements.addButton.addEventListener('click',
      //() => this.socket.emit('toggle_mode'));

    this.show();
  }

  static add_status_tag(obj)
  {
    if(obj.hasOwnProperty('device_status'))
    {
      switch(obj.device_status) {
          case 1:
              obj['tags'] = [{text:'Normal', class:'badge-success'}];
              break;
          case 2:
              obj['tags'] = [{text:'Warning', class:'badge-warning'}];
              break;
          case 3:
              obj['tags'] = [{text:'Error', class:'badge-danger'}];
              break;
      }
    }
    if (obj.nodes.length > 0)
    {
      for (var child in obj)
      {
        //recurse(obj[k]);
      }
    }
  }

  show() {
    // Create toggle button for mode
    var $toggle_button = $('<div>', {class: "btn-group btn-group-toggle", "data-toggle":"buttons"});

    $('<label>', {
      class: 'btn btn-primary active',
      text: 'Tree'
    }).append($('<input>', {
        type: 'radio',
        name: 'options',
        id: 'tree-mode-button',
        autocomplete: "off",
        value: "tree"
      }))
    .appendTo($toggle_button);

    $('<label>', {
      class: 'btn btn-primary active',
      text: 'Flat'
    }).append($('<input>', {
        type: 'radio',
        name: 'options',
        id: 'flat-mode-button',
        autocomplete: "off",
        value: "flat"
      }))
    .appendTo($toggle_button);

    $toggle_button.on('change', e => {
      this.mode = $("input:radio[name=options]:checked").val();
      this.rebuildTree();
   });

    $toggle_button.prependTo(this.$container);

    this.rebuildTree();
  }

  rebuildTree() {

    // Temporary:
    if (this.mode == "tree") {
      var selected_data = this.data;
    }
    else if (this.mode == "flat") {
      var selected_data = this.flat_data;
    }
    else {
      var selected_data = {};
    }

    this.$element.treeview({
      data: selected_data,
      levels: 1,
      'showTags': true,
      checkedIcon: "fas fa-check",
      collapseIcon: "far fa-minus-square",
      emptyIcon: "far fa-circle",
      expandIcon: "far fa-plus-square",
      selectedIcon: "far fa-check-circle",
      onNodeSelected: (event, data) =>  {
        if(this.info_window_view && data.hasOwnProperty("device_data")) {
            console.log(data);
            this.info_window_view.changeSelection(data.device_data);
        }
      }
    });
  }
}

export class InfoWindowView extends BaseView {
  constructor(selector, namespace_name) {
    super(selector, namespace_name);

    /*
    this.socket.on('datachange_notification', function(data){
      var formatted_data = data;

      this.data = data;
      this.show();
    });
    */

    // Temporary
    this.data = {
      name: "None",
      object_type: "None",
      properties: [
        ["Device ID", "None"],
        ["Description", "None"]
      ]
    };

    this.show();

  }

  show() {
    this.rebuildWindow();
  }

  //changeSelection(device_id) {
    //this.socket.emit('change_selection', {'id': device_id});
    //this.rebuildWindow();
  //}

  changeSelection(device_data) {
    this.data = {
      name: device_data.name,
      object_type: device_data.object_type,
      properties: [
        ["Device ID", device_data.id],
        ["Description", device_data.description],
      ]
    };
    this.rebuildWindow();
  }

  rebuildWindow() {

    // Clear existing content
    this.$element.empty();

    // Append title (Object name and type)
    var $title = $('<h3>').text(this.data.name + "   ");
    $('<small/>', {
      class: 'text-muted',
      text: this.data.object_type
    }).appendTo($title);
    $title.appendTo(this.$element);

    // Append list of properties as a table
    var $table = $('<table>',{class:"table table-sm"});

    for (var property of this.data.properties) {
      var property_name = property[0];
      var property_value = property[1];

      var $row = $('<tr/>');

      $('<td/>', {
        text: property_name
      }).appendTo($row);
      $('<td/>', {
        text: property_value
      }).appendTo($row);

      $row.appendTo($table);
    }

    $table.appendTo(this.$element);
  }
}

// Hardcoded information about panel ordering by position number
// Goes clockwise from top
const panel_numbers = {
  P1: ["1114", "1113", "1112", "1111",
      "1414", "1413", "1412", "1411",
      "1314", "1313", "1312", "1311",
      "1214", "1213", "1212", "1211"],
  P2: ["1128", "1127", "1126", "1125", "1124", "1123", "1122", "1121",
      "1428", "1427", "1426", "1425", "1424", "1423", "1422", "1421",
      "1328", "1327", "1326", "1325", "1324", "1323", "1322", "1321",
      "1228", "1227", "1226", "1225", "1224", "1223", "1222", "1221"],
  S1: ["2112", "2111", "2412", "2411",
      "2312", "2311", "2212", "2211"],
  S2: ["2124", "2123", "2122", "2121",
      "2424", "2423", "2422", "2421",
      "2324", "2323", "2322", "2321",
      "2224", "2223", "2222", "2221"]
};

const panel_geometry = {
  P1: {
    vertices: [
        {x:2151.3557, y:-427.9312},
        {x:3334.6713, y:-663.3074},
        {x:3400.0013, y:0.0},
        {x:3334.6713, y:663.3074},
        {x:2151.3557, y:427.9312}
      ],
    reference_points: [
        {x:2507.1922, y:0.0},
        {x:2984.3973, y:-277.1281},
        {x:2984.3973, y:277.1281}
      ]
  },
  P2: {
    vertices: [
        {x:3383.6294, y:-333.2584},
        {x:4808.6082, y:-473.6066},
        {x:4808.6082, y:473.6066},
        {x:3383.6294, y:333.2584}
      ],
    reference_points: [
        {x:3816.1544, y:0.0},
        {x:4290.9753, y:-277.1281},
        {x:4290.9753, y:277.1281}
      ]
  },
  S1: {
    vertices: [
        {x:364.5846, y:151.0159},
        {x:1474.9636, y:610.9499},
        {x:1596.4891, y:0.0},
        {x:1474.9636, y:-610.9499},
        {x:364.5846, y:-151.0159}
      ],
    reference_points: [
        {x:799.9935, y:0.0},
        {x:1273.1926, y:277.1281},
        {x:1273.1926, y:-277.1281}
      ]
  },
  S2: {
    vertices: [
        {x:1565.8130, y:311.4596},
        {x:2656.1201, y:528.3351},
        {x:2656.1201, y:-528.3351},
        {x:1565.8130, y:-311.4596}
      ],
    reference_points: [
        {x:1878.2451, y:0.0},
        {x:2332.1339, y:277.1281},
        {x:2332.1339, y:-277.1281}
      ]
  },
};

function rotate_coords(point, theta) {
  var x = point.x;
  var y = point.y;

  var rot_x = Math.cos(theta) * x - Math.sin(theta) * y;
  var rot_y = Math.sin(theta) * x + Math.cos(theta) * y;

  return {x: rot_x, y: rot_y}
};

const MPES_positions = {};

export class MirrorDisplayView extends BaseView {
  constructor(selector, namespace_name, container_selector, mirror_type, info_window_view=None) {
    super(selector, namespace_name, container_selector);

    this.info_window_view = info_window_view;
    this.$container = $(container_selector);
    this.$svg = $(selector);
    this.width = 40;
    this.height = 40;

    this.type = mirror_type;

    if (this.type == "primary")
    {
      this.inner_panel_type = "P1";
      this.outer_panel_type = "P2";
    }
    else if (this.type == "secondary")
    {
      this.inner_panel_type = "S1";
      this.outer_panel_type = "S2";
    }

    this.inner_panel_numbers = panel_numbers[this.inner_panel_type];
    this.outer_panel_numbers = panel_numbers[this.outer_panel_type];

    /*
    this.socket.on('datachange_notification', function(data){
      this.data = data;
      this.show();
    });
    */

    // Compute panel objects
    this.panels = [];

    var num_inner_panels = this.inner_panel_numbers.length;
    for (var i = 0; i < num_inner_panels; i++) {
      var panel_num = this.inner_panel_numbers[i];
      var theta = 2 * Math.PI * ((i+0.5)/num_inner_panels);

      var vertices = [];
      for (var point of panel_geometry[this.inner_panel_type]["vertices"]) {
          vertices.push(rotate_coords(point, theta));
      }

      var reference_points = [];
      for (var point of panel_geometry[this.inner_panel_type]["reference_points"]) {
          reference_points.push(rotate_coords(point, theta));
      }

      this.panels.push(
        {
          vertices: vertices,
          reference_points: reference_points,
          device_data: {
            name: "Panel " + String(panel_num) ,
            id: String(panel_num),
            object_type: this.inner_panel_type + " Panel",
            description: "This is a test panel."
          }
        }
      );
    }

    var num_outer_panels = this.outer_panel_numbers.length;
    for (var i = 0; i < num_outer_panels; i++) {
      var panel_num = this.outer_panel_numbers[i];
      var theta = 2 * Math.PI * ((i+0.5)/num_outer_panels);

      var vertices = [];
      for (var point of panel_geometry[this.outer_panel_type]["vertices"]) {
          vertices.push(rotate_coords(point, theta));
      }

      var reference_points = [];
      for (var point of panel_geometry[this.outer_panel_type]["reference_points"]) {
          reference_points.push(rotate_coords(point, theta));
      }

      this.panels.push(
        {
          vertices: vertices,
          reference_points: reference_points,
          device_data: {
            name: "Panel " + String(panel_num) ,
            id: String(panel_num),
            object_type: this.outer_panel_type + " Panel",
            description: "This is a test panel."
          }
        }
      );
    }

    // Compute edge objects

    // Compute MPES objects

    // Compute actuator objects

    // Setup scales
    var min = d3.min(this.panels, function(d) { return d3.min(d.vertices, function(e) { return e.x; })});
    var max = d3.max(this.panels, function(d) { return d3.max(d.vertices, function(e) { return e.x; })});
    this.xScale = d3.scaleLinear()
          .domain([min, max])
          .range([this.width * 0.1, this.width * 0.9]);

    this.yScale = d3.scaleLinear()
          .domain([min, max])
          .range([this.height * 0.1, this.height * 0.9]);

    this.show();
  }

  show() {
    this.renderMirror();
  }

  renderMirror() {
    console.log(this.panels);

    // Render panel objects
    d3.select(this.$svg.get(0)).selectAll("polygon")
      .data(this.panels)
      .enter()
      .append("polygon")
      .attr("points", d => {
          return d.vertices.map(
            e => {
              return [this.xScale(e.x),this.yScale(e.y)].join(",");
            }
          ).join(" ");
        })
      .style("fill", "transparent")
      .style("stroke", "black")
      .style("stroke-width", 0.1)
      .attr("pointer-events", "all")
      .on("click", (d,i) => {
        this.info_window_view.changeSelection(d.device_data);
      })
      .on("mouseover", function(d,i){
        d3.select(this)
          .style("stroke-width", 0.3)
          .style("stroke", "blue")
          .style("fill", "LightSkyBlue");
      })
      .on("mouseout", function(d,i){
        d3.select(this)
          .style("stroke-width", 0.1)
          .style("stroke", "black")
          .style("fill", "transparent");
      })

    // Render actuator objects

    // Render edge objects

    // Render MPES objects



  }
}

export class ErrorLogView extends BaseView {
  constructor(selector, namespace_name, container_selector) {
    super(selector, namespace_name);

    this.$container = $(container_selector);
    this.$table = $(selector);

    /*
    this.socket.on('datachange_notification', function(data){
      this.data = data;
      this.show();
    });
    */

    this.data = [
      {
        error_code: 3,
        description: "This is a test error (3).",
        severity: "Operable",
        source: "Panel 1"
      },
      {
        error_code: 5,
        description:"This is a test error (5).",
        severity: "Critical",
        source: "Panel 2"
      },
    ];

    this.show();

  }

  show() {
    this.renderErrorLog();
  }

  renderErrorLog() {
    this.$table.DataTable({
    data: this.data,
    columns: [
        { title: "Error Code",
          data: 'error_code' },
        { title: "Description",
          data: 'description' },
        { title: "Severity",
          data: 'severity' },
        { title: "Source",
          data: 'source' }
    ],
    createdRow: function( row, data, dataIndex ) {
             if ( data['severity'] == "Critical" ) {
                $(row).css('background-color', 'red');
              }
            else if ( data['severity'] == "Operable" ) {
               $(row).css('background-color', 'yellow');
             }
             else {
             }
           }
    });
  }
}

export class HistoryLogView extends BaseView {
  constructor(selector, namespace_name, container_selector) {
    super(selector, namespace_name, container_selector);

    this.$container = $(container_selector);

    /*
    this.socket.on('datachange_notification', function(data){
      this.data = data;
      this.show();
    });
    */
  }

  show() {
    this.renderHistoryLog();
  }

  renderHistoryLog() {
    return 0;
  }
}
