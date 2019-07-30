/* global CustomEvent */

import { html } from '@polymer/lit-element'

import { getErrorDescFromName, getErrorNumFromName, getErrorSeverityFromName } from '../utilities.js'
import { PaperFontStyles } from './shared-styles.js'
import { WidgetCard } from './widget-card.js'

import '@vaadin/vaadin-grid/vaadin-grid.js'
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js'
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js'
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js'

import '@vaadin/vaadin-checkbox/vaadin-checkbox.js'
import { BaseSocketioDeviceClient } from '../socketio-device-client'

class ErrorTableWidget extends WidgetCard {
  constructor () {
    super()
    this.name = 'Error Log'

    this.devices = new Map()
    this.errors = new Map()

    this.dataRequest = {
      component_name: this.name,
      fields: {
        All: {
          errors: "All"
        }
      },
      device_ids: 'All'
    }

    this.socketioClient = new BaseSocketioDeviceClient('http://localhost:5000', this)
    this.socketioClient.connect()
    this.socketioClient.requestData(this.dataRequest)
  }

  firstUpdated (changedProps) {
    this.grid = this.shadowRoot.querySelector('vaadin-grid')
  }

  _onItemClick () {
    const item = this.grid.activeItem
    this.grid.selectedItems = item ? [item] : []
    const event = new CustomEvent('changed-selected-device', { detail: { 'deviceType': item.deviceType, 'deviceID': item.deviceID } })
    this.dispatchEvent(event)
  }

  get contentTemplate () {
    return html`
    ${PaperFontStyles}
    <style>
      #error-grid {
        height: 200px;
      }
    </style>
    <vaadin-grid items="${JSON.stringify(Array.from(this.errors.values()))}" id="error-grid" @click="${this._onItemClick}">
      <vaadin-grid-column width="15px">
        <template class="header"></template>
        <template>
          <vaadin-checkbox checked="{{detailsOpened}}"></vaadin-checkbox>
        </template>
      </vaadin-grid-column>
      <vaadin-grid-column path="timeString" width="150px">
        <template class="header"><vaadin-grid-sorter path="time">Timestamp</vaadin-grid-sorter></template>
      </vaadin-grid-column>
      <vaadin-grid-filter-column path="errorCode" header="Error Code" width="40px"></vaadin-grid-filter-column>
      <vaadin-grid-column path="severity" width="50px">
        <template class="header"><vaadin-grid-sorter path="severityIndex">Severity</vaadin-grid-sorter></template>
      </vaadin-grid-column>
      <vaadin-grid-filter-column path="deviceType" header="Device Type" width="40px"></vaadin-grid-filter-column>
      <vaadin-grid-filter-column path="deviceIdentifier" header="Device Identifier" width="70px"></vaadin-grid-filter-column>
      <template class="row-details">[[item.description]]</template>
    </vaadin-grid>
    `
  }

  static get properties () {
    let properties = super.properties
    Object.assign(properties, {
      errors: { type: Map }
    })
    return properties
  }

  setError (deviceId, errorNum, errorDesc, errorSeverity) {
    if (this.devices.hasOwnProperty(deviceId)) {
      const timeStamp = new Date()
      const timeStampString = timeStamp.toISOString()

      let severityString = ''
      if (errorSeverity === 2) {
        severityString = 'Fatal'
      } else if (errorSeverity === 1) {
        severityString = 'Operable'
      }

      const deviceInfo = this.devices[deviceId]
      let deviceIdentifier
      if (deviceInfo.deviceType === 'Panel' || deviceInfo.deviceType === 'Mirror') {
        deviceIdentifier = deviceInfo.position
      } else {
        deviceIdentifier = deviceInfo.serial
      }
      const key = {
        deviceID: deviceId,
        errorCode: errorNum
      }
      const value = {
        deviceID: deviceId,
        time: timeStamp,
        timeString: timeStampString,
        errorCode: errorNum,
        deviceType: deviceInfo.deviceType,
        severity: severityString,
        severityIndex: errorSeverity,
        description: errorDesc,
        deviceIdentifier: deviceIdentifier
      }

      this.errors.set(key, value)
    }
  }

  unsetError (deviceId, errorNum) {
    let key = {
      deviceID: deviceId,
      errorCode: errorNum
    }

    this.errors.delete(key)
  }

  refresh () {
    this.socketioClient.requestData(this.dataRequest)
    this.loading = true
  }

  _onRequestedData (data) {
    console.log(data)
    for (let deviceType in data) {
      if (data.hasOwnProperty(deviceType)) {
        for (let deviceId in data[deviceType]) {
          if (data[deviceType].hasOwnProperty(deviceId)) {
            // store some information about devices
            this.devices[deviceId] = data[deviceType][deviceId]

            // add all current set errors
            for (let errorName in data[deviceType][deviceId]['errors']) {
              if (data[deviceType][deviceId]['errors'].hasOwnProperty(errorName)) {
                let errorNum = getErrorNumFromName(errorName)
                let errorDesc = getErrorDescFromName(errorName)
                let errorSeverity = getErrorSeverityFromName(errorName)
                this.setError(deviceId, errorNum, errorDesc, errorSeverity[0])
              }
            }
          }
        }
      }
    }

    this.loading = false
  }

  _onDataChange (data) {
    if (data.data_type === 'error') {
      if (data.value === true) {
        this.setError(data.device_id, getErrorNumFromName(data.name), getErrorDescFromName(data.name), getErrorSeverityFromName(data.name)[0])
      } else {
        this.unsetError(data.device_id, getErrorNumFromName(data.name))
      }
    }
  }
}

window.customElements.define('error-table-widget', ErrorTableWidget)
