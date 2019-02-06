import { LitElement, html } from '@polymer/lit-element';

import { PaperFontStyles } from './shared-styles.js'
import { WidgetCard } from './widget-card.js'
import { BaseSocketioDeviceClient } from '../socketio-device-client.js'

import '@polymer/paper-button/paper-button.js';

import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';

import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-tree-toggle.js';

class DeviceTreeWidgetClient extends BaseSocketioDeviceClient {
  constructor (address, component) {
    super(address, component)
  }

  on_data_change(data) {
    /**
    var i = this.component.allDevices.findIndex(x => x.deviceID === data.device_id)
    if (i > -1) {
      this.component.allDevices[i].

    }
    {
      hasChildren:true,
      isFolder: true,
      name:"Mirrors",
      status:"Nominal",
      statusNum:3,
      deviceID:"1",
      parentDeviceIDs: ["0"]
    },
    this.component.requestUpdate()
    */
  }
}

class DeviceTreeWidget extends WidgetCard {
  constructor() {
    super()
    this.name = 'Device Tree'
    this.mode = 'Tree'
    this._allModes = ['Tree', 'Flat']

    this.allItems = []
    this._allItemsbyID = {}
    this._devices = []
    this._deviceTypeFolders = []

    this.socketioClient = new DeviceTreeWidgetClient("http://localhost:5000", this)
    this.socketioClient.connect()
    this.socketioClient.request_all_data("all")
  }

  // Component properties and templates

  static get properties() {
    return {
      name: { type: String },
      mode: { type: String }
    }
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
      <vaadin-grid @click="${this._onGridClick}">
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

  get actionsTemplate() {
    return html`
    <paper-radio-group selected="${this.mode}" @active-item-changed="${this._onChangeMode}">
      ${this._allModes.map(i => html`<paper-radio-button name="${i}">${i}</paper-radio-button>`)}
    </paper-radio-group>
    `
  }

  // Utility functions for rendering the device tree

  _getChildDevices(parentDeviceID, callback) {
    callback(this.allItems.filter(function(device) {
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
    this._getChildDevices(parentDeviceID, function(selectedDeviceList) {
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

  // Generic Lit Element lifecycle methods

  updated(changedProperties) {
    const grid = this.shadowRoot.querySelector('vaadin-grid')
    grid.dataProvider = this.dataProvider.bind(this)

    const badgeColumn = this.shadowRoot.querySelector('#badgeCol');
    badgeColumn.renderer = this._badgeColumnRenderer.bind(this)
  }

  // Function to retreive and update all data

  setAllData(data)  {
    this.allItems = []
    this._allItemsbyID = {}
    this._devices = []
    this._deviceTypeFolders = []

    for (var id in data) {
      if (data.hasOwnProperty(id)) {
        var device = data[id]
        // Create a tree object for each device
        var deviceTreeObject = {
          isDevice: true,
          hasChildren: (Object.keys(device.children).length > 0) ? true : false,
          isFolder: (Object.keys(device.children).length > 0) ? true : false,
          name: device.name,
          status:"Nominal",
          statusNum: 3,
          deviceID: device.id,
          parentDeviceIDs_tree: [],
          parentDeviceIDs_flat: [device.type]
        }

        for (var i = 0; i < device.parents.length; i++) {
          // If not already present, create a tree folder for each child type for each device
          var folderID = device.parents[i] + "_" + device.type
          if (!this._allItemsbyID.hasOwnProperty(folderID)) {
            var folder = {
              isDevice: false,
              hasChildren: true,
              isFolder: true,
              name: device.type,
              status:"Nominal",
              statusNum: 3,
              deviceID: folderID,
              parentDeviceIDs_tree: [device.parents[i]],
              parentDeviceIDs_flat: [device.parents[i]]
            }
            this._devices.push(folder)
            this._allItemsbyID[folderID] = folder
          }
          deviceTreeObject.parentDeviceIDs_tree.push(device.parents[i] + "_" + device.type)
          deviceTreeObject.parentDeviceIDs_flat.push(device.parents[i] + "_" + device.type)
        }
        this._devices.push(deviceTreeObject)
        this._allItemsbyID[device.id] = deviceTreeObject

        if (!this._deviceTypeFolders.find(x => x.name === device.type)) {
          // Create top-level folder tree objects for use in "Flat" view mode
          var folder = {
            isDevice: false,
            hasChildren: true,
            isFolder: true,
            name: device.type,
            status:"Nominal",
            statusNum: 3,
            deviceID: device.type
          }
          this._deviceTypeFolders.push(folder)
          this._allItemsbyID[folder.deviceID] = folder
        }
      }
    }
    this.setMode(this.mode)
    this.requestUpdate()
  }

  setMode(mode) {
    this.mode = mode
    if (this.mode === "Tree") {
      this._devices.map(function (item) {
        if (item.parentDeviceIDs_tree.length > 0) {
          item.parentDeviceIDs = item.parentDeviceIDs_tree
        }
      })
      this.allItems = this._devices
    }
    else if (this.mode === "Flat") {
      this._devices.map(function (item) {
        if (item.parentDeviceIDs_flat.length > 0) {
          item.parentDeviceIDs = item.parentDeviceIDs_flat
        }
      })
      this.allItems = this._devices.concat(this._deviceTypeFolders)
    }
 }

 // Event Handlers

  _onGridClick(item) {
    const grid = this.shadowRoot.querySelector('vaadin-grid')
    var item = grid.activeItem
    if (item !== null && item.isDevice === true) {
      grid.selectedItems = item ? [item] : []
      var event = new CustomEvent('changed-selected-device', { detail: item.deviceID })
      this.dispatchEvent(event)
    }
}

_onChangeMode (e) {
  this.setMode(e.detail.value)
  this.requestUpdate()
}

_onRefreshButtonClicked(e) {
  this.socketioClient.request_all_data("all")
  this.requestUpdate()
}

}

window.customElements.define('device-tree-widget', DeviceTreeWidget)
