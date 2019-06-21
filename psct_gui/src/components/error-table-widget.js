import { LitElement, html } from '@polymer/lit-element'

import { PaperFontStyles } from './shared-styles.js'
import { WidgetCard } from './widget-card.js'

import '@vaadin/vaadin-grid/vaadin-grid.js'
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js'
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js'
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js'

import '@vaadin/vaadin-checkbox/vaadin-checkbox.js'
import {BaseSocketioDeviceClient} from "../socketio-device-client";

class ErrorWidgetClient extends BaseSocketioDeviceClient {
  _onNewData (data) {
    this.component.setAllData(data)
  }
  _onDataChange (data) {
    if (data.data_type == "error") {
        if (data.value == true) {
            this.component.setError(data.device_id, getErrorNumFromName(data.name))
        }
        else {
            this.component.unsetError(data.device_id, getErrorNumFromName(data.name))
        }
    }
  }
}

class ErrorTableWidget extends WidgetCard {
  constructor () {
    super()
    this.name = 'Errors'

    this.all_devices = new Map()
    this.errors = new Map()

    this.socketioClient = new ErrorWidgetClient('http://localhost:5000', this)
    this.socketioClient.connect()
    console.log("Socket connected (errorwidget)")
    this.socketioClient.requestData('all')
  }

  firstUpdated (changedProps) {
    this.grid = this.shadowRoot.querySelector('vaadin-grid')
    this.grid.addEventListener('click', function(e) {
      const item = grid.getEventContext(e).item
      grid.selectedItems = grid.selectedItems[0] === item ? [] : [item]
      var event = new CustomEvent('changed-selected-device', { detail: item.deviceID })
      this.dispatchEvent(event)
    })
  }

  get contentTemplate () {
    return html`
    ${PaperFontStyles}
    <style>
      #error-grid {
        height: 200px;
      }
    </style>
    <vaadin-grid items="${JSON.stringify(this.errors)}" id="error-grid">
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
    return {
      name: { type: String },
      errors: { type: Map }
    }
  }

  setAllData (data) {
    console.log("Error table set all data")
    for (var device_id in data) {
        if (data.hasOwnProperty(device_id)) {
            // store some information about devices
            var value = {
                'id': data[device_id].id,
                'name': data[device_id].name,
                'type': data[device_id].type,
                'serial': data[device_id].serial,
                'position': data[device_id].position,
                'position_info': data[device_id].position_info,
            }
            this.all_devices.set(device_id, value)

            // add all current set errors
            for (var error_name in data[device_id]['errors']) {
                if (data[device_id]['errors'][error_name].value === true) {
                    var error_num = getErrorNumFromName(error_name)
                    setError(device_id, error_num)
                }
           }
        }
    }
    this.loading = false
  }

  setError (device_id, error_num) {
    if (this.devices.has(device_id)) {
        var timeStamp = new Date()
        var timeStampString = timeStamp.toISOString();

        var device_info = this.devices.get(device_id)
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
            time: timeStamp,
            timeString: timeStampString,
            errorCode: error_num,
            severity: 'Operable',
            severityIndex: 2,
            description: 'Example error description.',
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
      var pattern = /\[[a-z]+\]/ // extract pattern of "[errorNum]" from the error name string
      var error_num = error_name.match(pattern)
      error_num = parseInt(error_num.substring(1, error_num.length-1)) // strip leading and trailing "[} and "]" and convert to int
      return error_num
  }

  getErrorDescFromName (error_name) {
      var pattern = /\[[a-z]+\]/ // extract pattern of "[errorNum]" from the error name string
      var description = error_name.match(pattern)[1]
      return description
  }

  refresh() {
    this.socketioClient.requestData('all')
  }
}



window.customElements.define('error-table-widget', ErrorTableWidget)
