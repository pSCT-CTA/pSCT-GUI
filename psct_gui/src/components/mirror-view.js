import { html } from '@polymer/lit-element'
import { PageViewElement } from './page-view-element.js'

// These are the shared styles needed by this element.
import { PaperFontStyles, ViewStyles } from './shared-styles.js'

import '../components/widget-card.js';
import '../components/info-window-widget.js';
import '../components/mirror-widget.js';

class MirrorView extends PageViewElement {

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
          <div style="flex-grow: 8">
            <mirror-widget></mirror-widget>
          </div>
        </div>
        <div class="flex-container">
          <div style="flex-grow: 8">
            <info-window-widget></info-window-widget>
          </div>
        </div>
      </div>
    </section>
    `
  }

  static get properties() {
    return {
    }
  }
}

window.customElements.define('mirror-view', MirrorView)
