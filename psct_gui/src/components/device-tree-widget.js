import { LitElement, html } from '@polymer/lit-element'

import { PaperFontStyles } from './shared-styles.js'
import { WidgetCard } from './widget-card.js'
import { BaseSocketioDeviceClient } from '../socketio-device-client.js'

import '@polymer/paper-button/paper-button.js'

import '@polymer/paper-radio-button/paper-radio-button.js'
import '@polymer/paper-radio-group/paper-radio-group.js'

import '@vaadin/vaadin-grid/vaadin-grid.js'
import '@vaadin/vaadin-grid/vaadin-grid-tree-toggle.js'

class DeviceTreeWidgetClient extends BaseSocketioDeviceClient {
  _onNewData (data) {
    console.log(data)
    var _allItemsbyID = {}
    var _devices = []
    var _deviceTypeFolders = []

    for (var id in data) {
      if (data.hasOwnProperty(id)) {
        var device = data[id]
        // Create a tree object for each device
        var deviceTreeObject = {
          isDevice: true,
          hasChildren: (Object.keys(device.children).length > 0),
          isFolder: (Object.keys(device.children).length > 0),
          name: device.name,
          status: 3,
          deviceID: device.id,
          parentDeviceIDs_tree: [],
          parentDeviceIDs_flat: [device.type]
        }

        for (var i = 0; i < device.parents.length; i++) {
          // If not already present, create a tree folder for each child type for each device
          var folderID = device.parents[i] + '_' + device.type
          if (!_allItemsbyID.hasOwnProperty(folderID)) {
            var folder = {
              isDevice: false,
              hasChildren: true,
              isFolder: true,
              name: device.type,
              status: 3,
              deviceID: folderID,
              parentDeviceIDs_tree: [device.parents[i]],
              parentDeviceIDs_flat: [device.parents[i]]
            }
            _devices.push(folder)
            _allItemsbyID[folderID] = folder
          }
          deviceTreeObject.parentDeviceIDs_tree.push(device.parents[i] + '_' + device.type)
          deviceTreeObject.parentDeviceIDs_flat.push(device.parents[i] + '_' + device.type)
        }
        _devices.push(deviceTreeObject)
        _allItemsbyID[device.id] = deviceTreeObject

        if (!_deviceTypeFolders.find(x => x.name === device.type)) {
          // Create top-level folder tree objects for use in "Flat" view mode
          var deviceTypeFolder = {
            isDevice: false,
            hasChildren: true,
            isFolder: true,
            name: device.type,
            status: 3,
            deviceID: device.type
          }
          _deviceTypeFolders.push(deviceTypeFolder)
          _allItemsbyID[deviceTypeFolder.deviceID] = deviceTypeFolder
        }
      }
    }

    this.component._allItemsbyID = _allItemsbyID
    this.component._devices = _devices
    this.component._deviceTypeFolders = _deviceTypeFolders

    this.component.setMode(this.component.mode)
    this.component.grid.dataProvider = this.component.dataProvider

    const badgeColumn = this.component.shadowRoot.querySelector('#badgeCol')
    badgeColumn.renderer = this.component._badgeColumnRenderer

    this.component.loading = false
  }
}

class DeviceTreeWidget extends WidgetCard {
  constructor () {
    super()
    this.name = 'Device Tree'
    this.mode = 'Tree'
    this._allModes = ['Tree', 'Flat']

    this.allItems = []

    this._allItemsbyID = {}
    this._devices = []
    this._deviceTypeFolders = []

    this.socketioClient = new DeviceTreeWidgetClient('http://localhost:5000', this)
    this.socketioClient.connect()
    this.socketioClient.requestData('all')
  }

  // Component properties and templates

  static get properties () {
    var properties = super.properties
    Object.assign(properties, {
      mode: { type: String },
      allItems: { type: Array }
    })

    return properties
  }

  get contentTemplate () {
    return html`
    ${PaperFontStyles}
    <style>
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
    <vaadin-grid @click="${this._onItemClick}">
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
    `
  }

  get actionsTemplate () {
    return html`
    <paper-radio-group selected="${this.mode}" @active-item-changed="${this._onChangeMode}">
      ${this._allModes.map(i => html`<paper-radio-button name="${i}">${i}</paper-radio-button>`)}
    </paper-radio-group>
    `
  }

  _getChildDevices (parentDeviceID, callback) {
    callback(this.allItems.filter(function (device) {
      if (parentDeviceID) {
        if (!device.hasOwnProperty('parentDeviceIDs')) {
          return false
        } else {
          return device.parentDeviceIDs.includes(parentDeviceID)
        }
      } else {
        return !device.parentDeviceIDs
      }
    })
    )
  }

  dataProvider (params, callback) {
    // If the data request concerns a tree sub-level, `params` has an additional
    // `parentItem` property that refers to the sub-level's parent item
    const parentDeviceID = params.parentItem ? params.parentItem.deviceID : null
    this._getChildDevices(parentDeviceID, function (selectedDeviceList) {
      const startIndex = params.page * params.pageSize
      const pageItems = selectedDeviceList.slice(startIndex, startIndex + params.pageSize)
      const treeLevelSize = selectedDeviceList.length
      callback(pageItems, treeLevelSize)
    })
  };

  _badgeColumnRenderer (root, column, rowData) {
    var contents = ''
    if (rowData.item.status === 3) {
      contents = '<p class="badge yellow paper-font-body1">Operable</p>'
    } else if (rowData.item.status === 3) {
      contents = '<p class="badge green paper-font-body1">Nominal</p>'
    } else if (rowData.item.status === 1) {
      contents = '<p class="badge red paper-font-body1">Fatal</p>'
    }

    root.innerHTML = contents
  }

  // Generic Lit Element lifecycle methods
  firstUpdated (changedProperties) {
    this.grid = this.shadowRoot.querySelector('vaadin-grid')
  }

  setMode (mode) {
    this.mode = mode
    if (this.mode === 'Tree') {
      this._devices.map(function (item) {
        if (item.parentDeviceIDs_tree.length > 0) {
          item.parentDeviceIDs = item.parentDeviceIDs_tree
        }
      })
      this.allItems = this._devices
    } else if (this.mode === 'Flat') {
      this._devices.map(function (item) {
        if (item.parentDeviceIDs_flat.length > 0) {
          item.parentDeviceIDs = item.parentDeviceIDs_flat
        }
      })
      this.allItems = this._devices.concat(this._deviceTypeFolders)
    }
  }

  // Event Handlers
  _onItemClick () {
    var item = this.grid.activeItem
    if (item !== null && item.isDevice === true) {
      this.grid.selectedItems = item ? [item] : []
      var event = new CustomEvent('changed-selected-device', { detail: item.deviceID })
      this.dispatchEvent(event)
    }
  }

  _onChangeMode (e) {
    this.setMode(e.detail.value)
    this.requestUpdate()
  }

  refresh () {
    this.socketioClient.request_all_data('all')
    this.loading = true
  }
}

window.customElements.define('device-tree-widget', DeviceTreeWidget)
