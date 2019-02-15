import { LitElement, html } from '@polymer/lit-element'

import { PaperFontStyles } from './shared-styles.js'
import { WidgetCard } from './widget-card.js'

import '@vaadin/vaadin-grid/vaadin-grid.js'
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js'
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js'
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js'

import '@vaadin/vaadin-checkbox/vaadin-checkbox.js'

class ErrorTableWidget extends WidgetCard {
  constructor () {
    super()
    this.name = 'Errors'

    // Sample Data
    this.errors = [
      {
        time: (new Date(2013, 2, 1, 1, 10)).getTime(),
        timeString: (new Date(2013, 2, 1, 1, 10)).toISOString(),
        errorCode: 1,
        severity: 'Fatal',
        severityIndex: 3,
        description: 'Error 1 description.',
        deviceType: 'Panel',
        deviceID: '2211'
      },
      {
        time: (new Date(2013, 2, 1, 2, 30)).getTime(),
        timeString: (new Date(2013, 2, 1, 2, 30)).toISOString(),
        errorCode: 2,
        severity: 'Operable',
        severityIndex: 2,
        description: 'Error 2 description.',
        deviceType: 'MPES',
        deviceID: '2222-4W'
      },
      {
        time: (new Date(2013, 2, 1, 3, 10)).getTime(),
        timeString: (new Date(2013, 2, 1, 3, 10)).toISOString(),
        errorCode: 3,
        severity: 'Fatal',
        severityIndex: 3,
        description: 'Error 3 description.',
        deviceType: 'Actuator',
        deviceID: '2211-4'
      },
      {
        time: (new Date(2013, 2, 1, 4, 30)).getTime(),
        timeString: (new Date(2013, 2, 1, 4, 30)).toISOString(),
        errorCode: 4,
        severity: 'Normal',
        severityIndex: 1,
        description: 'Error 4 description.',
        deviceType: 'MPES',
        deviceID: '2222-5W'
      }
    ]

    this.loading = false
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
      <vaadin-grid-filter-column path="deviceID" header="Device Identifier" width="70px"></vaadin-grid-filter-column>
      <template class="row-details">[[item.description]]</template>
    </vaadin-grid>
    `
  }

  static get properties () {
    return {
      name: { type: String },
      errors: { type: Array }
    }
  }
}

window.customElements.define('error-table-widget', ErrorTableWidget)
