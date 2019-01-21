import { LitElement, html } from '@polymer/lit-element';

import { PaperFontStyles } from './shared-styles.js'
import { WidgetCard } from './widget-card.js'

import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';

import '@vaadin/vaadin-checkbox/vaadin-checkbox.js';

class HistoryLogWidget extends WidgetCard {
  constructor() {
    super()
    this.name = 'History Log'

    //Sample Data
    this.historyEvents = [
      {
        time: (new Date(2013, 2, 5, 11, 10)).getTime(),
        timeString: (new Date(2013, 2, 5, 11, 10)).toISOString(),
        eventCode: 1,
        description: "Event 1 description.",
        eventCategory: "CallMethod",
        userID: "User1"
      },
      {
        time: (new Date(2013, 3, 7, 2, 30)).getTime(),
        timeString: (new Date(2013, 3, 7, 2, 10)).toISOString(),
        eventCode: 2,
        description: "Event 2 description.",
        eventCategory: "CallMethod",
        userID: "User1"
      },
      {
        time: (new Date(2015, 11, 10, 3, 10)).getTime(),
        timeString: (new Date(2015, 11, 10, 3, 10)).toISOString(),
        eventCode: 3,
        description: "Event 3 description.",
        eventCategory: "CallMethod",
        userID: "Admin"
      },
      {
        time: (new Date(2017, 2, 1, 4, 30)).getTime(),
        timeString: (new Date(2017, 2, 1, 4, 30)).toISOString(),
        eventCode: 4,
        description: "Event 4 description.",
        eventCategory: "Error",
        userID: "User2"
      }
    ]
  }

  get contentTemplate() {
    return html`
    ${PaperFontStyles}
    <style>
      .history-header {
        margin: 5px;
      }
      .history-body {
        height: 200px;
      }
      #history-grid {
        height: 100%;
      }
    </style>
    <div class="history-header paper-font-headline">${this.name}</div>
    <div class="history-body">
      <vaadin-grid items="${JSON.stringify(this.historyEvents)}" id="history-grid">
        <vaadin-grid-column width="10px">
          <template class="header"></template>
          <template>
            <vaadin-checkbox checked="{{detailsOpened}}"></vaadin-checkbox>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column path="timeString" width="150px">
          <template class="header"><vaadin-grid-sorter path="time">Timestamp</vaadin-grid-sorter></template>
        </vaadin-grid-column>
        <vaadin-grid-filter-column path="eventCode" header="Event Code" width="50px"></vaadin-grid-filter-column>
        <vaadin-grid-filter-column path="eventCategory" header="Category" width="50px"></vaadin-grid-filter-column>
        <vaadin-grid-filter-column path="userID" header="User" width="40px"></vaadin-grid-filter-column>
        <template class="row-details">[[item.description]]</template>
      </vaadin-grid>
    </div>
    `;
  }

  static get properties() {
    return {
      name: { type: String },
      historyEvents: { type: Array }
    }
  }
}

window.customElements.define('history-log-widget', HistoryLogWidget)
