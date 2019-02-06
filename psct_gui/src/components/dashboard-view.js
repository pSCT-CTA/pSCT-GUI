import { html } from '@polymer/lit-element'
import { PageViewElement } from './page-view-element.js'

// These are the shared styles needed by this element.
import { PaperFontStyles, ViewStyles } from './shared-styles.js'

import '../components/widget-card.js';
import '../components/info-window-widget.js';
import '../components/error-table-widget.js';
import '../components/history-log-widget.js';
import '../components/device-tree-widget.js';

// Polymer elements

class DashboardView extends PageViewElement {
  constructor () {
    super()
    this.selectedDeviceID = null
  }

  render () {
    return html`
      ${PaperFontStyles}
      ${ViewStyles}
      <style>
      .dashboard-body {
        height: 80vh;
        overflow-y: scroll;
      }
      </style>
      <section>
        <div class="paper-font-display1 view-title">Dashboard</div>
        <div class="dashboard-body">
          <div class="flex-container">
            <div style="flex-grow: 6; height: 200%">
              <device-tree-widget @changed-selected-device="${this._onChangedSelectedDevice}"></device-tree-widget>
            </div>
            <div style="flex-grow: 1; height: 200%">
              <info-window-widget deviceID="${this.selectedDeviceID}"></info-window-widget>
            </div>
          </div>
          <div class="flex-container">
            <div style="flex-grow: 8">
              <error-table-widget></error-table-widget>
            </div>
          </div>
          <div class="flex-container">
            <div style="flex-grow: 8">
              <history-log-widget></history-log-widget>
            </div>
          </div>
        </div>
      </section>
    `
  }

  _onChangedSelectedDevice(e){
    this.selectedDeviceID = e.detail
  }

  static get properties () {
    return {
      selectedDeviceID: { type: String }
    }
  }
}

window.customElements.define('dashboard-view', DashboardView)
