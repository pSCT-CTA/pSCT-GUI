import { LitElement, html } from '@polymer/lit-element';

import { PaperFontStyles, WidgetStyles } from './shared-styles.js'

import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-icons/iron-icons.js';

export class WidgetCard extends LitElement {

  constructor () {
    super()
    this.name = "Widget"
    this.fullscreen = false
    this.refreshing = false
    this.reloading = false
  }

  render() {
    return html`
    ${PaperFontStyles}
    ${WidgetStyles}
    <paper-card class=${this.fullscreen? "fullscreen": ""}>
      <div class="card-content">
        ${this.contentTemplate}
      </div>
      <div class="card-actions">
        ${this.actionsTemplate}
        <iron-icon icon=${this.fullscreen? "fullscreen-exit": "fullscreen"} slot="item-icon" onclick="${this._fullscreenButtonClicked}"></iron-icon>
        <iron-icon icon="refresh" slot="item-icon" onclick="${this._refreshButtonClicked}"></iron-icon>
      </div>
    </paper-card>
    `;
  }

  get contentTemplate() {
    return html`<div>Placeholder.</div>`
  }

  get actionsTemplate() {
    return html``
  }

  _refreshButtonClicked(e) {
  }

  _fullscreenButtonClicked(e) {
    if (!this.fullscreen) {
      this.fullscreen = true
    }
    else {
      this.fullscreen = false
    }

  }

  static get properties() {
    return {
      name: { type: String },
      fullscreen: { type: Boolean },
      refreshing: { type: Boolean },
      reloading: { type: Boolean }
    }
  }
}

window.customElements.define('widget-card', WidgetCard);
