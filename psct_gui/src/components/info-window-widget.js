import { LitElement, html } from '@polymer/lit-element'

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

class InfoWindowWidgetClient extends BaseSocketioDeviceClient {
  _onNewData (data) {
    var deviceAllData = data[this.component.deviceID]

    var dataFields = []
    for (var d in deviceAllData.data) {
      if (deviceAllData.data.hasOwnProperty(d)) {
        dataFields.push({
          name: d,
          value: (Number.isInteger(deviceAllData.data[d])) ? deviceAllData.data[d] : deviceAllData.data[d].toFixed(6)
        })
      }
    }

    var errors = []
    for (var e in deviceAllData.errors) {
      if (deviceAllData.errors.hasOwnProperty(e)) {
        errors.push({
          errorCode: e,
          severity: 'Fatal',
          severityIndex: 3,
          timeString: (new Date(2018, 12, 1, 9, 30)).toISOString(),
          description: 'Test Description'
        })
      }
    }

    this.component.deviceName = deviceAllData.name
    this.component.deviceType = deviceAllData.type
    this.component.deviceStatus = 3
    this.component.deviceData = dataFields
    this.component.deviceErrors = errors
    this.component.deviceMethods = deviceAllData.methods

    this.component.loading = false
  }
}

class InfoWindowWidget extends WidgetCard {
  constructor () {
    super()
    this.name = 'Info'
    this.showName = false
    this._dialogOpen = false

    this.deviceName = ''
    this.deviceType = ''
    this.deviceData = []
    this.deviceErrors = []
    this.deviceStatus = 3
    this.deviceMethods = []

    this.socketioClient = new InfoWindowWidgetClient('http://localhost:5000', this)
    this.socketioClient.connect()

    this.loading = false
  }

  static get properties () {
    var properties = super.properties
    Object.assign(properties, {
      deviceID: { type: String },
      deviceName: { type: String },
      deviceType: { type: String },
      deviceData: { type: Array },
      deviceErrors: { type: Array },
      deviceStatus: { type: Number },
      deviceMethods: { type: Array },
      _dialogOpen: { type: Boolean }
    })

    return properties
  }

  get contentTemplate () {
    return html`
    ${this.deviceID !== null
    ? html`
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
      .paper-font-title {
        margin: 3px;
      }
      .status-display > paper-progress, .status-display > div {
        display: inline-block;
      }
      #call-method-button {
        color: black;
        background-color: #white;
        width: 125px;
      }
      .info-header {
        margin: 5px;
      }
      </style>
      <div class="info-header paper-font-headline">${this.deviceName}</div>
      <div class="status-display">
        ${this.deviceStatus === 3
    ? html`<paper-progress value="100" class="green"></paper-progress> <div class="paper-font-subhead">Nominal</div>`
    : html``
}
        ${this.deviceStatus === 2
    ? html`<paper-progress value="66" class="yellow""></paper-progress> <div class="paper-font-subhead">Operable</div>`
    : html``
}
        ${this.deviceStatus === 1
    ? html`<paper-progress value="33" class="red"></paper-progress> <div class="paper-font-subhead">Fatal</div>`
    : html``
}
      </div>
      <div class="paper-font-subhead">${this.deviceType}</div>
      <br>
      <div class="info-body">
        <div class="paper-font-title">Properties</div>
        <vaadin-grid items="${JSON.stringify(this.deviceData)}" height-by-rows>
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
      </div>

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
      </vaadin-dialog>`
    : html``
}`
  }

  get actionsTemplate () {
    return html`
    <paper-button raised id="call-method-button" @click="${this.openDialog}">Call Method</paper-button>
    `
  }

  // Polymer lifecycle methods
  updated () {
    // Disable stop button if the device doesn't have a stop method
    if (!this.deviceMethods.find(device => device.name === 'stop')) {
      this.shadowRoot.querySelector('#method-dialog-content').content.querySelector('#stop-button').disabled = true
    }
    // Activate interactivity on close button
    this.shadowRoot.querySelector('#method-dialog-content').content.querySelector('#close-button').onclick = this.closeDialog
  }

  // Event handlers

  openDialog () {
    this._dialogOpen = true
  }
  closeDialog () {
    this._dialogOpen = false
  }

  // Needed to handle case where the dialog is closed by clocking away, rather than the close button
  _onDialogOpenChanged (e) {
    this._dialogOpen = e.detail.value
  }

  refresh () {
    if (this.deviceID !== null && this.deviceID !== 'null') {
      this.loading = true
      this.socketioClient.request_all_data('ids', [this.deviceID])
    }
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

  setAllData (data) {
    var deviceAllData = data[this.deviceID]

    this.deviceName = deviceAllData.name
    this.deviceType = deviceAllData.type

    var dataFields = []
    for (var d in deviceAllData.data) {
      if (deviceAllData.data.hasOwnProperty(d)) {
        dataFields.push({
          name: d,
          value: (Number.isInteger(deviceAllData.data[d])) ? deviceAllData.data[d] : deviceAllData.data[d].toFixed(6)
        })
      }
    }
    this.deviceData = dataFields

    var errors = []
    for (var e in deviceAllData.errors) {
      if (deviceAllData.errors.hasOwnProperty(e)) {
        errors.push({
          errorCode: e,
          severity: 'Fatal',
          severityIndex: 3,
          timeString: (new Date(2018, 12, 1, 9, 30)).toISOString(),
          description: 'Test Description'
        })
      }
    }
    this.deviceErrors = errors

    this.deviceStatus = 3
    this.deviceMethods = deviceAllData.methods

    this.requestUpdate()
  }

  // Getter and setter for deviceID property

  get deviceID () { return this._deviceID }

  set deviceID (newID) {
    this._deviceID = newID
    if (newID !== null && newID !== 'null') {
      this.socketioClient.request_all_data('ids', [newID])
    }
  }
}

window.customElements.define('info-window-widget', InfoWindowWidget)
