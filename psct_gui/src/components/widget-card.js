import { LitElement, html } from '@polymer/lit-element'

import { PaperFontStyles, WidgetStyles } from './shared-styles.js'

import '@polymer/paper-card/paper-card.js'
import '@polymer/iron-icons/iron-icons.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/paper-spinner/paper-spinner-lite.js'

import '@vaadin/vaadin-select/vaadin-select.js'
import '@vaadin/vaadin-item/vaadin-item.js'
import '@vaadin/vaadin-list-box/vaadin-list-box.js'

export class WidgetCard extends LitElement {
  constructor () {
    super()
    this.name = 'Widget'
    this.showName = true
    this.fullscreen = false
    this.loading = true

    this.refreshRate = ''
    this._allRefreshRates = ['None', 1, 5, 10, 30, 60]
    this._recurringRefresh = null
  }

  render () {
    return html`
    ${PaperFontStyles}
    ${WidgetStyles}
    <paper-card class=${this.fullscreen ? 'fullscreen' : ''}>
      <div class="card-content">
      <div class="paper-font-headline title" ?hidden="${!this.showName}">${this.name}</div>
      <paper-spinner-lite ?active="${this.loading}" ?hidden="${!this.loading}"></paper-spinner-lite>
      <div class="contents" ?hidden="${this.loading}">
        ${this.contentTemplate}
      </div>
      <div class="card-actions">
        <div class="custom-actions">
          ${this.actionsTemplate}
        </div>
        <div class="shared-actions">
          <vaadin-select value="${this.refreshRate}" @value-changed="${this._changeRefreshRate}">
            <template>
              <vaadin-list-box>
                <vaadin-item value='' disabled>Refresh Rate</vaadin-item>
                <hr>
                ${this._allRefreshRates.map(i => html`<vaadin-item value="${i}">${i}</vaadin-item>`)}
              </vaadin-list-box>
            </template>
          </vaadin-select>
          <paper-icon-button icon=${this.fullscreen ? 'fullscreen-exit' : 'fullscreen'} title="fullscreen" @click="${this._onFullscreenButtonClicked}"></paper-icon-button>
          <paper-icon-button icon="refresh" slot="item-icon" @click="${this._onRefreshButtonClicked}" title="refresh"></paper-icon-button>
        </div>
      </div>
    </paper-card>
    `
  }

  get contentTemplate () {
    return html`<div>Placeholder.</div>`
  }

  get actionsTemplate () {
    return html``
  }

  _changeRefreshRate (e) {
    this.refreshRate = e.detail.value
    if (this._recurringRefresh !== null) {
      clearInterval(this._recurringRefresh)
    }
    if (this.refreshRate !== 'None' && this.refreshRate !== '') {
      this._recurringRefresh = setInterval(this.refresh.bind(this), this.refreshRate * 1000)
    }
  }

  _onRefreshButtonClicked (e) {
    this.refresh()
  }

  _onFullscreenButtonClicked (e) {
    /**
    if (!this.fullscreen) {
      this.fullscreen = true
    }
    else {
      this.fullscreen = false
    }
    */
  }

  static get properties () {
    return {
      name: { type: String },
      fullscreen: { type: Boolean },
      loading: { type: Boolean },
      refreshRate: { type: Number }
    }
  }
}

window.customElements.define('widget-card', WidgetCard)
