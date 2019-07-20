import { html } from '@polymer/lit-element'

import { PaperFontStyles } from './shared-styles.js'
import { WidgetCard } from './widget-card.js'

import '@vaadin/vaadin-grid/vaadin-grid.js'
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js'
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js'
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js'

import '@vaadin/vaadin-checkbox/vaadin-checkbox.js'
import {BaseSocketioDeviceClient} from "../socketio-device-client";

class ErrorTableWidget extends WidgetCard {
  constructor () {
    super()
    this.name = 'Error Log'

    this.devices = new Map()
    this.errors = new Map()

    this.dataRequest = {
        component_name: this.name,
        fields: {
            all: {
                data: [],
                errors: "all",
                methods: []
            }
        },
        device_ids: "all"
    }

    this.socketioClient = new BaseSocketioDeviceClient('http://localhost:5000', this)
    this.socketioClient.connect()
    this.socketioClient.requestData(this.dataRequest)
  }

  firstUpdated (changedProps) {
    this.grid = this.shadowRoot.querySelector('vaadin-grid')
  }

  _onItemClick () {
    var item = this.grid.activeItem
    this.grid.selectedItems = item ? [item] : []
    var event = new CustomEvent('changed-selected-device', { detail: {'type': item.deviceType, 'id': item.deviceID }})
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
    var properties = super.properties
    Object.assign(properties, {
        errors: { type: Map }
    })
    return properties
  }

  setError (device_id, error_num, error_desc, error_severity) {
    if (this.devices.hasOwnProperty(device_id)) {
        var timeStamp = new Date()
        var timeStampString = timeStamp.toISOString();

        var severityString = ""
        if (error_severity === 2) {
            severityString = "Fatal"
        }
        else if (error_severity === 1) {
            severityString = "Operable"
        }

        var device_info = this.devices[device_id]
        if (device_info.type === "Panel" || device_info.type === "Mirror") {
            var deviceIdentifier = device_info.position
        }
        else {
            var deviceIdentifier = device_info.serial
        }
        var key = {
            deviceID: device_id,
            errorCode: error_num
            }
        var value = {
            deviceID: device_id,
            time: timeStamp,
            timeString: timeStampString,
            errorCode: error_num,
            deviceType: device_info.type,
            severity: severityString,
            severityIndex: error_severity,
            description: error_desc,
            deviceIdentifier: deviceIdentifier,
        }

        this.errors.set(key, value)
    }
  }

  unsetError (device_id, error_num) {
    var key = {
        deviceID: device_id,
        errorCode: error_num
        }

    this.errors.delete(key)
  }

  getErrorNumFromName (error_name) {
      var pattern = /\[[0-9]+\]/ // extract pattern of "[errorNum]" from the error name string
      var error_num = error_name.match(pattern)[0]
      error_num = parseInt(error_num.substring(1, error_num.length-1)) // strip leading and trailing "[} and "]" and convert to int
      return error_num
  }

  getErrorSeverityFromName (error_name) {
      var pattern = /\[[a-zA-Z]+\]/ // extract pattern of "[severity]" from the error name string
      var severity = error_name.match(pattern)[0]
      severity = severity.substring(1, severity.length-1)
      var severityCode = null
      if (severity === "Operable") {
         severityCode = 1
      }
      else if (severity === "Fatal") {
         severityCode = 2
      }
      return [severityCode, severity]
  }

  getErrorDescFromName (error_name) {
      var description = error_name.split("]")[2]
      return description
  }

  refresh() {
    this.socketioClient.requestData(this.dataRequest)
    this.loading = true
  }
  
  _onRequestedData (data) {
    console.log(data)
    for (var deviceType in data) {
        if (data.hasOwnProperty(deviceType)) {
            for (var device_id in data[deviceType]) {
                if (data[deviceType].hasOwnProperty(device_id)) {
                    // store some information about devices
                    this.devices[device_id] = data[deviceType][device_id]

                    // add all current set errors
                    for (var error_name in data[deviceType][device_id]['errors']) {
                        if (data[deviceType][device_id]['errors'][error_name]) {
                            var error_num = this.getErrorNumFromName(error_name)
                            var error_desc = this.getErrorDescFromName(error_name)
                            var error_severity = this.getErrorSeverityFromName(error_name)
                            this.setError(device_id, error_num, error_desc, error_severity[0])
                        }
                   }
                }
            }
        }
    }

    this.loading = false
  }
  
  _onDataChange (data) {
    if (data.data_type == "error") {
        if (data.value == true) {
            this.setError(data.device_id, this.getErrorNumFromName(data.name), this.getErrorDescFromName(data.name), this.getErrorSeverityFromName(data.name)[0])
        }
        else {
            this.unsetError(data.device_id, getErrorNumFromName(data.name))
        }
    }
  }

}



window.customElements.define('error-table-widget', ErrorTableWidget)
