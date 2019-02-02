import { LitElement, html } from '@polymer/lit-element';

import { PaperFontStyles, WidgetStyles } from './shared-styles.js'

import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';

export class WidgetCard extends LitElement {

  constructor () {
    super()
    this.name = "Widget"
    this.fullscreen = false
    this.loading = true
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
        <paper-icon-button icon=${this.fullscreen? "fullscreen-exit": "fullscreen"} title="fullscreen" @click="${this._fullscreenButtonClicked}"></paper-icon-button>
        <paper-icon-button icon="refresh" slot="item-icon" @click="${this._refreshButtonClicked}" title="refresh"></paper-icon-button>
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
      loading: { type: Boolean }
    }
  }
}

window.customElements.define('widget-card', WidgetCard);
