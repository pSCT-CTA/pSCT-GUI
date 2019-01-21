import { html } from '@polymer/lit-element'
import { PageViewElement } from './page-view-element.js'

// These are the shared styles needed by this element.
import { PaperFontStyles, ViewStyles } from './shared-styles.js'

import '../components/widget-card.js';

class PositionerView extends PageViewElement {
  render () {
    return html`
    ${PaperFontStyles}
    ${ViewStyles}
    <section>
      <div class="paper-font-display1 view-title">Positioner</div>
      <div class="flex-container">
        <div style="flex-grow: 8">
          <widget-card></widget-card>
        </div>
      </div>
    </section>
    `
  }
}

window.customElements.define('positioner-view', PositionerView)
