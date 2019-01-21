import { LitElement, html } from '@polymer/lit-element';

import { PaperFontStyles } from './shared-styles.js'
import { WidgetCard } from './widget-card.js'

import '@polymer/paper-progress/paper-progress.js';
import '@polymer/paper-button/paper-button.js';

import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';

import '@vaadin/vaadin-checkbox/vaadin-checkbox.js';

import '@vaadin/vaadin-dialog/vaadin-dialog.js';

class InfoWindowWidget extends WidgetCard {
  constructor() {
    super()
    this.name = 'Info'

    //Sample Data
    this.deviceName = "Panel 2223"
    this.deviceType = "Panel"
    this.deviceStatus = 2
    this.deviceData = [
      {
        name: "Temperature",
        value: 15.5
      },
      {
        name: "Voltage",
        value: 0.5
      },
    ]
    this.deviceErrors = [
      {
        time: (new Date(2018, 12, 1, 9, 30)).getTime(),
        timeString: (new Date(2018, 12, 1, 9, 30)).toISOString(),
        errorCode: 2,
        severity: "Operable",
        severityIndex: 2,
        description: "Error 2 description.",
        deviceType: "MPES",
        deviceID: "2211-4W"
      }
    ]
    this.deviceMethods = [
      {
        name: "eead",
        args: [],
        id: "id1"
      },
      {
        name: "test_method1",
        args: ["arg1", "arg2"].
        id: "id2"
      },
      {
        name: "stop",
        args: []
        id: 'stop'
      }
    ]
  }

  get contentTemplate() {
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
    .paper-font-title {
      margin: 3px;
    }
    .status-display > paper-progress, .status-display > div {
      display: inline-block;
    }
    </style>
    <div class="info-header paper-font-headline">${this.deviceName}</div>
    <div class="status-display">
      ${this.deviceStatus===3?
          html`<paper-progress value="100" class="green"></paper-progress> <div class="paper-font-subhead">Nominal</div>`:
          html``
        }
      ${this.deviceStatus===2?
          html`<paper-progress value="66" class="yellow""></paper-progress> <div class="paper-font-subhead">Operable</div>`:
          html``
        }
      ${this.deviceStatus===1?
          html`<paper-progress value="33" class="red"></paper-progress> <div class="paper-font-subhead">Fatal</div>`:
          html``
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

    <vaadin-dialog id="call-method-dialog" no-close-on-outside-click>
      <template>
        <div>Call a method.</div>
        <vaadin-select label="Required" placeholder="Choose a Method" required @value-changed="${this.methodSelected}"></vaadin-select>
        <div class="input-options-box"></div>
        <div class="output-log-box"></div>
        <div class="button-area">
          <vaadin-button id="execute-button" disabled>Execute</vaadin-button>
          <vaadin-button id="stop-button" disabled>Stop</vaadin-button>
          <vaadin-button style="float: right;">Close</vaadin-button>
        </div>
      </template>
    </vaadin-dialog>
    `;
  }

  get actionsTemplate() {
    return html`
    <paper-button raised id="call-method-button">Call Method</paper-button>
    `
  }

  firstUpdated(changedProps) {
    // Update method select dropdown in the dialog to show all options
    this.shadowRoot.querySelector('vaadin-select').renderer = function(root) {
      // Check if there is a list-box generated with the previous renderer call to update its content instead of recreation
      if (root.firstChild) {
        return;
      }
      // create the <vaadin-list-box>
      const listBox = window.document.createElement('vaadin-list-box');
      // append 3 <vaadin-item> elements
      this.deviceMethods.forEach(function(methodObject) {
        if (methodObject.name !== "stop")
        const item = window.document.createElement('vaadin-item');
        item.textContent = methodObject.name;
        listBox.appendChild(item);
      });
      // update the content
      root.appendChild(listBox);
    };

    // Disable stop button if the device doesn't have a stop method
    if (this.deviceMethods.find(device => device.name === "stop")) {
      this.shadowRoot.querySelector('stop-button').disabled = false
  }

  methodSelected() {
    var selectedMethod = this.shadowRoot.querySelector('vaadin-select').value;

    // Replace input-options-box with fields to input coordinates (if necessary)
    // Add submit button, if necessary

    // If there are no arguments, un-disable execute button

  }

  submitArguments() {
    // Write all arguments
    // Un-disable execute button
  }

  executeMethod() {
    // Send method call
  }

  stopMethod() {
    // Call stop method (on seperate thread)
  }

  _refreshButtonClicked(e) {
    // Call read method on device and update data
  }

  static get properties() {
    return {
      name: { type: String },
      deviceName: { type: String },
      deviceType: { type: String },
      deviceData: { type: Array },
      deviceErrors: { type: Array },
      deviceStatus: { type: Number },
      deviceMethods: { type: Array }
    }
  }
}

window.customElements.define('info-window-widget', InfoWindowWidget)
