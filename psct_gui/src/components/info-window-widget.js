import { html } from '@polymer/lit-element'

import { getErrorDescFromName, getErrorNumFromName, getErrorSeverityFromName } from '../utilities.js'
import { PaperFontStyles } from './shared-styles.js'
import { WidgetCard } from './widget-card.js'
import { BaseSocketioDeviceClient } from '../socketio-device-client.js'

import '@polymer/paper-progress/paper-progress.js'
import '@polymer/paper-button/paper-button.js'

import '@vaadin/vaadin-grid/vaadin-grid.js'
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js'
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js'
import '@vaadin/vaadin-checkbox/vaadin-checkbox.js'
import '@vaadin/vaadin-dialog/vaadin-dialog.js'
import '@vaadin/vaadin-select/vaadin-select.js'

class InfoWindowWidget extends WidgetCard {
  constructor () {
    super()
    this.name = 'Info'

    this._dialogOpen = false

    this._deviceID = null
    this.deviceName = ''
    this.deviceType = ''
    this.deviceData = []
    this.deviceErrors = []
    this.deviceState = 0
    this.deviceErrorState = 0
    this.deviceMethods = []

    this.dataRequest = {
      component_name: this.name,
      fields: {
        All: {
          data: 'All',
          errors: 'All',
          methods: 'All'
        }
      },
      device_ids: []
    }

    this.deviceToRequest = { deviceID: null, deviceType: '' }

    this.socketioClient = new BaseSocketioDeviceClient('http://172.17.10.15:5000', this)
    this.socketioClient.connect()
    this.socketioClient.requestData(this.dataRequest)
  }

  static get properties () {
    let properties = super.properties
    Object.assign(properties, {
      deviceID: { type: String },
      deviceName: { type: String },
      deviceType: { type: String },
      deviceData: { type: Array },
      deviceErrors: { type: Array },
      deviceState: { type: Number },
      deviceErrorState: { type: Number },
      deviceMethods: { type: Array },
      _dialogOpen: { type: Boolean }
    })

    return properties
  }

  get contentTemplate () {
    return html`

      ${PaperFontStyles}
      <style>
      paper-progress.red {
        --paper-progress-active-color: #f44336;
      }
      paper-progress.green {
        --paper-progress-active-color: #4caf50;
      }
      paper-progress.yellow {
        --paper-progress-active-color: #ffeb3b;
      }
      paper-progress.gray {
        --paper-progress-active-color: #b2b2b2;
      }
      .paper-font-title {
        margin: 3px;
      }
      .error-status-display > paper-progress, .error-status-display > div {
        display: inline-block;
      }
      #call-method-button {
        color: black;
        background-color: white;
        width: 125px;
      }
      .info-header {
        margin: 5px;
      }
      .badge {
        width: 50px;
        border-radius: 3px;
        color: black;
        text-align: center;
        display:inline-block;
      }
      .gray {
        background-color: gray;
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
      vaadin-grid-cell-content {
         word-wrap: break-word;
         white-space: normal;
      }
      </style>

      ${this.deviceID === null || this.deviceID === 'null'
    ? html`
    <div class="info-header paper-font-display1">Device Not Found</div>
      <div class="status-display">
        <div class="paper-font-headline" style="display:inline-block;">${this.deviceType}</div>
        <p class="badge gray paper-font-body1">N/A</p>
      </div>
      <div class="error-status-display">
        <paper-progress value="100" class="gray"></paper-progress> <div class="paper-font-subhead">N/A</div>
      </div>
      <br>
      <div class="info-body">
        <div class="paper-font-body2">No data. Device is not found in server.</div>
      </div>`
    : html`
      <div class="info-header paper-font-display1">${this.deviceName}</div>
      <div class="status-display">
      <div class="paper-font-headline" style="display:inline-block;">${this.deviceType}</div>
        ${this.deviceState === 2
    ? html`<p class="badge yellow paper-font-body1">Busy</p>`
    : html``
}
        ${this.deviceState === 1
    ? html`<p class="badge green paper-font-body1">On</p>`
    : html``
}
        ${this.deviceState === 0
    ? html`<p class="badge gray paper-font-body1">Off</p>`
    : html``
}
      </div>
      <div class="error-status-display">
        ${this.deviceErrorState === 0
    ? html`<paper-progress value="100" class="green"></paper-progress> <div class="paper-font-subhead">Nominal</div>`
    : html``
}
        ${this.deviceErrorState === 1
    ? html`<paper-progress value="66" class="yellow""></paper-progress> <div class="paper-font-subhead">Operable</div>`
    : html``
}
        ${this.deviceErrorState === 2
    ? html`<paper-progress value="33" class="red"></paper-progress> <div class="paper-font-subhead">Fatal</div>`
    : html``
}
      </div>
      <br>
      <div class="info-body">
        <div class="paper-font-title">Properties</div>
        <vaadin-grid items="${JSON.stringify(this.deviceData)}" height-by-rows size=6>
          <vaadin-grid-filter-column path="name" header="Field Name"></vaadin-grid-filter-column>
          <vaadin-grid-column path="value" header="Value"></vaadin-grid-column>
        </vaadin-grid>
        <br>
        <div class="paper-font-title">Errors</div>
        <vaadin-grid items="${JSON.stringify(this.deviceErrors)}" height-by-rows>
          <vaadin-grid-column width="10px">
            <template class="header"></template>
            <template>
              <vaadin-checkbox checked="{{detailsOpened}}"></vaadin-checkbox>
            </template>
          </vaadin-grid-column>
          <vaadin-grid-filter-column path="errorCode" header="Code" width="30px"></vaadin-grid-filter-column>
          <vaadin-grid-column path="severity" width="30px">
            <template class="header"><vaadin-grid-sorter path="severityIndex">Severity</vaadin-grid-sorter></template>
          </vaadin-grid-column>
          <template class="row-details">
            <div class="paper-font-body1"><b>Timestamp:</b> [[item.timeString]]</div>
            <div class="paper-font-body1"><b>Description:</b> [[item.description]]</div>
          </template>
        </vaadin-grid>
      </div>`
}
    <vaadin-dialog id="call-method-dialog" ?opened="${this._dialogOpen}" @opened-changed="${this._onDialogOpenChanged}" no-close-on-outside-click>
        <template id="method-dialog-content">
          <div class="paper-font-headline">Call a method.</div>
          <vaadin-select id='select-method' label='Required' placeholder='Choose a Method' required>
          <template>
            <vaadin-list-box>
              ${this.deviceMethods.map(i => html`<vaadin-item data-methodID="${i.id}">${i.name}</vaadin-item>`)}
            </vaadin-list-box>
          </template>
          </vaadin-select>
          <div class='input-options-box'></div>
          <div class='output-log-box'></div>
          <div class='button-area'>
            <paper-button raised id='execute-button' disabled>Execute</paper-button>
            <paper-button raised id='stop-button'>Stop</paper-button>
            <paper-button style='float: right;' id='close-button' @click="${this.closeDialog}">Close</paper-button>
          </div>
        </template>
    </vaadin-dialog>
    <paper-toast id="deviceNotFoundToast" text="Device not found."></paper-toast>
    `
  }

  get actionsTemplate () {
    return html`
    <paper-button raised id="call-method-button" @click="${this.openDialog}">Call Method</paper-button>
    `
  }

  // Polymer lifecycle methods
  updated (_changedProperties) {
    // Disable stop button if the device doesn't have a stop method
    if (!this.deviceMethods.find(device => device.name === 'stop')) {
      this.shadowRoot.querySelector('#method-dialog-content').content.querySelector('#stop-button').disabled = true
    }
    // Activate interactivity on close button
    this.shadowRoot.querySelector('#method-dialog-content').content.querySelector('#close-button').onclick = this.closeDialog
  }

  // Event handlers

  openDialog () {
    if (this.deviceID !== null && this.deviceID !== 'null') {
      this._dialogOpen = true
    } else {
      this.shadowRoot.getElementById('deviceNotFoundToast').open()
    }
  }
  closeDialog () {
    this._dialogOpen = false
  }

  // Needed to handle case where the dialog is closed by clocking away, rather than the close button
  _onDialogOpenChanged (e) {
    this._dialogOpen = e.detail.value
  }

  refresh () {
      this.socketioClient.requestData(this.dataRequest)
      this.loading = true
  }

  methodSelected () {
    var selectedMethod = this.shadowRoot.querySelector('vaadin-select').value

    // Replace input-options-box with fields to input coordinates (if necessary)
    // Add submit button, if necessary

    // If there are no arguments, un-disable execute button
  }

  submitArguments () {
    // Write all arguments
    // Un-disable execute button
  }

  executeMethod () {
    // Send method call
  }

  stopMethod () {
    // Call stop method (on seperate thread)
  }
  // Getter and setter for deviceID property

  get deviceID () { return this._deviceID }

  set deviceToRequest (device) {
    if (device.deviceID !== null && device.deviceID !== 'null') {
      this._deviceID = device.deviceID
      this.dataRequest.device_ids = { [device.deviceType]: [device.deviceID] }
      this.refresh()
    } else {
      this.dataRequest.device_ids = []
    }
  }

  _onRequestedData (data) {
    console.log(data)
    let device = null
    if (Object.keys(data).length === 0) {
      this.loading = false
      return
    }

    for (let deviceType in data) {
      if (data.hasOwnProperty(deviceType)) {
        for (let deviceId in data[deviceType]) {
          if (data[deviceType].hasOwnProperty(deviceId)) {
            device = data[deviceType][deviceId]
          }
        }
      }
    }

    let dataFields = []
    for (let d in device.data) {
      if (device.data.hasOwnProperty(d)) {
        let formattedOutput
        if (typeof device.data[d] === 'string') {
          formattedOutput = device.data[d]
        } else if (Number.isInteger(device.data[d])) {
          formattedOutput = device.data[d]
        } else {
          formattedOutput = device.data[d].toFixed(6)
        }
        dataFields.push({
          name: d,
          value: formattedOutput
        })
      }
    }

    let errorFields = []
    for (let e in device.errors) {
      if (device.errors.hasOwnProperty(e) && device.errors[e]) {
        errorFields.push({
          errorCode: getErrorNumFromName(e),
          severity: getErrorSeverityFromName(e)[1],
          severityIndex: getErrorSeverityFromName(e)[0],
          timeString: (new Date()).toISOString(),
          description: getErrorDescFromName(e)
        })
      }
    }

    this.deviceName = device.deviceName.replace(/_/g, ' ')
    this.deviceType = device.deviceType
    this.deviceState = device.data.State
    this.deviceErrorState = device.data.ErrorState
    this.deviceData = dataFields
    this.deviceErrors = errorFields
    this.deviceMethods = device.methods

    this.loading = false
  }
}

window.customElements.define('info-window-widget', InfoWindowWidget)
