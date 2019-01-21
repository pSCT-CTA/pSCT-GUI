import { LitElement, html } from '@polymer/lit-element';

import { PaperFontStyles } from './shared-styles.js'

import { WidgetCard } from './widget-card.js'

import '@polymer/paper-button/paper-button.js';

import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-tree-toggle.js';

class DeviceTreeWidget extends WidgetCard {
  constructor() {
    super()
    this.name = 'Device Tree'
    this.mode = 'Tree'

    // Sample Data
    this.allDevices = [
      {
        hasChildren:true,
        isFolder: false,
        name:"Telescope",
        status:"Nominal",
        statusNum:3,
        deviceID:"0"
      },
      {
        hasChildren:true,
        isFolder: true,
        name:"Mirrors",
        status:"Nominal",
        statusNum:3,
        deviceID:"1",
        parentDeviceIDs: ["0"]
      },
      {
        hasChildren:true,
        isFolder: false,
        name:"Primary Mirror",
        status:"Nominal",
        statusNum:3,
        deviceID:"2",
        parentDeviceIDs: ["1"]
      },
      {
        hasChildren:true,
        isFolder: true,
        name:"Panels",
        status:"Nominal",
        statusNum:3,
        deviceID:"3",
        parentDeviceIDs: ["2"]
      },
      {
        hasChildren:true,
        isFolder: true,
        name:"Edges",
        status:"Nominal",
        statusNum:3,
        deviceID:"4",
        parentDeviceIDs: ["2"]
      },
      {
        hasChildren:true,
        isFolder: false,
        name:"Panel 2221",
        status:"Nominal",
        statusNum:3,
        deviceID:"5",
        parentDeviceIDs: ["3", "15"]
      },
      {
        hasChildren:true,
        isFolder: true,
        name:"MPES",
        status:"Operable",
        statusNum:2,
        deviceID:"6",
        parentDeviceIDs: ["5"]
      },
      {
        hasChildren:true,
        isFolder: true,
        name:"ACT",
        status:"Nominal",
        statusNum:3,
        deviceID:"7",
        parentDeviceIDs: ["5"]
      },
      {
        hasChildren:true,
        isFolder: true,
        name:"Edges",
        status:"Operable",
        statusNum:2,
        deviceID:"8",
        parentDeviceIDs: ["5"]
      },
      {
        hasChildren:true,
        isFolder: false,
        name:"Panel 2222",
        status:"Nominal",
        statusNum:3,
        deviceID:"9",
        parentDeviceIDs: ["3", "15"]
      },
      {
        hasChildren:true,
        isFolder: true,
        name:"MPES",
        status:"Nominal",
        statusNum:3,
        deviceID:"10",
        parentDeviceIDs: ["9"]
      },
      {
        hasChildren:true,
        isFolder: true,
        name:"ACT",
        status:"Nominal",
        statusNum:3,
        deviceID:"11",
        parentDeviceIDs: ["9"]
      },
      {
        hasChildren:true,
        isFolder: true,
        name:"Edges",
        status:"Operable",
        statusNum:2,
        deviceID:"12",
        parentDeviceIDs: ["9"]
      },
      {
        hasChildren:true,
        isFolder: false,
        name:"Edge 2221+2222",
        status:"Fatal",
        statusNum:1,
        deviceID:"13",
        parentDeviceIDs: ["4", "8", "12"]
      },
      {
        hasChildren:true,
        isFolder: true,
        name:"MPES",
        status:"Fatal",
        statusNum:1,
        deviceID:"14",
        parentDeviceIDs: ["13"]
      },
      {
        hasChildren:true,
        isFolder: true,
        name:"Panels",
        status:"Operable",
        statusNum:3,
        deviceID:"15",
        parentDeviceIDs: ["13"]
      },
      {
        hasChildren:false,
        isFolder: false,
        name:"MPES 34",
        status:"Operable",
        statusNum:3,
        deviceID:"16",
        parentDeviceIDs: ["13", "10"]
      },
      {
        hasChildren:false,
        isFolder: false,
        name:"MPES 76",
        status:"Fatal",
        statusNum:1,
        deviceID:"17",
        parentDeviceIDs: ["13", "6"]
      },
    ]
  }

  getChildDevices(parentDeviceID, callback) {
    callback(this.allDevices.filter(function(device) {
          console.log(device)
          if (parentDeviceID) {
            if (!device.hasOwnProperty('parentDeviceIDs')) {
              return false
            }
            else {
              return device.parentDeviceIDs.includes(parentDeviceID);
            }
          } else {
            return !device.parentDeviceIDs;
          }
        })
      );
  }

  dataProvider(params, callback) {
    // If the data request concerns a tree sub-level, `params` has an additional
    // `parentItem` property that refers to the sub-level's parent item
    const parentDeviceID = params.parentItem ? params.parentItem.deviceID : null;
    //console.log(self)
    this.getChildDevices(parentDeviceID, function(selectedDeviceList) {
      const startIndex = params.page * params.pageSize;
      const pageItems = selectedDeviceList.slice(startIndex, startIndex + params.pageSize);
      const treeLevelSize = selectedDeviceList.length;
      callback(pageItems, treeLevelSize);
    });
  };

  _badgeColumnRenderer(root, column, rowData) {
    var contents = ""
    if (rowData.item.status === "Operable") {
      contents = '<p class="badge yellow paper-font-body1">Operable</p>'
    }
    else if (rowData.item.status === "Nominal") {
      contents = '<p class="badge green paper-font-body1">Nominal</p>'
    }
    else if (rowData.item.status === "Fatal") {
      contents = '<p class="badge red paper-font-body1">Fatal</p>'
    }

    root.innerHTML = contents;
  }

  get contentTemplate() {
    return html`
    ${ PaperFontStyles }
    <style>
      .device-tree-header {
        margin: 5px;
      }
      .badge {
        border-radius: 3px;
        color: black;
        text-align: center;
      }
      .red {
        background-color: red;
      }
      .yellow {
        background-color: yellow;
      }
      .green {
        background-color: lime;
      }
      [is-folder] {
        font-weight: bold;
      }
    </style>
    <div class="device-tree-header paper-font-headline">${this.name}</div>
    <div class="device-tree-body">
      <vaadin-grid>
        <vaadin-grid-column>
          <template class="header"></template>
          <template>
            <vaadin-grid-tree-toggle leaf="[[!item.hasChildren]]" expanded="{{expanded}}" level="[[level]]">
              <p class="paper-font-body1" is-folder$="[[item.isFolder]]">[[item.name]]</p>
            </vaadin-grid-tree-toggle>
          </template>
        </vaadin-grid-column>

        <vaadin-grid-column width="8em" flex-grow="0" id="badgeCol" header="Status">
        </vaadin-grid-column>

      </vaadin-grid>
    </div>
    <script>

    </script>
    `;
  }

  updated(changedProperties) {
    const grid = this.shadowRoot.querySelector('vaadin-grid')
    grid.dataProvider = this.dataProvider.bind(this)

    const badgeColumn = this.shadowRoot.querySelector('#badgeCol');
    badgeColumn.renderer = this._badgeColumnRenderer.bind(this)
  }

  get actionsTemplate() {
    return html`
    <paper-button raised toggles>Tree</paper-button>
    <paper-button raised toggles>Flat</paper-button>
    `
  }

  static get properties() {
    return {
      name: { type: String },
      mode: { type: String }
    }
  }
}

window.customElements.define('device-tree-widget', DeviceTreeWidget)
