import { html } from '@polymer/lit-element'
import { PageViewElement } from './page-view-element.js'

// These are the shared styles needed by this element.
import { PaperFontStyles, ViewStyles } from './shared-styles.js'

import '../components/info-window-widget.js';
import '../components/mirror-widget.js';

class MirrorView extends PageViewElement {
  constructor () {
    super()
    this.selectedDeviceID = null
  }

  render () {
    return html`
    ${PaperFontStyles}
    ${ViewStyles}
    <style>
    .mirror-body {
      height: 80vh;
      overflow-y: scroll;
    }
    mirror-widget {
      height: 80vh;
      width: 100%;
      overflow-y: scroll;
    }
    .mirror-container {
      min-height: 80%;
    }
    </style>
    <section>
      <div class="paper-font-display1 view-title">Mirrors</div>
      <div class="mirror-body">
        <div class="flex-container" class="mirror-container">
          <div style="flex-grow: 6">
            <mirror-widget @changed-selected-device="${this._onChangedSelectedDevice}"></mirror-widget>
          </div>
          <div style="flex-grow: 2">
            <info-window-widget deviceID="${this.selectedDeviceID}"></info-window-widget>
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

window.customElements.define('mirror-view', MirrorView)
