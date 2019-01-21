import { LitElement, html } from '@polymer/lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
import { installRouter } from 'pwa-helpers/router.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';
import { SharedStyles } from './shared-styles.js';

// Import polymer elements
import '@polymer/font-roboto/roboto.js';

//import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/maps-icons.js';
import '@polymer/iron-icons/image-icons.js';
//import '@polymer/iron-icons/communication-icons.js';

//import '@polymer/iron-demo-helpers/demo-snippet.js';
//import '@polymer/iron-demo-helpers/demo-pages-shared-styles.js';

//import '@polymer/paper-item/paper-item.js';
//import '@polymer/paper-item/paper-item-body.js';
//import '@polymer/paper-item/paper-item-shared-styles.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-item/paper-icon-item.js';

import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-button/paper-button.js';

//import '@polymer/app-layout/app-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';

// Import polymer material design styles
import '@polymer/paper-styles/color.js';
import '@polymer/paper-styles/default-theme.js';
import '@polymer/paper-styles/demo-pages.js';
import '@polymer/paper-styles/paper-styles-classes.js';
import '@polymer/paper-styles/paper-styles.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/paper-styles/typography.js';

import '@polymer/paper-ripple/paper-ripple.js';

class MyApp extends LitElement {
  render() {
    // Anything that's related to rendering should be done in here.
    return html`
    ${SharedStyles}
    <style>
    :host {
      font-family: 'Roboto', 'Noto', sans-serif;
      background-color: #eee;
      display: block;
    }

    a {
      text-decoration: none; /* no underline */
    }
    .main-content {
      margin-left: 20px;
      margin-right: 20px;
      height: auto;
      min-height: 100% !important;
      overflow: auto;
    }
    footer {
        height: 50px;
        line-height: 50px;
        text-align: center;
        background-color: white;
        font-size: 14px;
    }
    </style>
    <app-header-layout>
      <app-header fixed effects="waterfall" slot="header">
        <app-toolbar>
          <paper-icon-button id="toggle" icon="menu" @click="${this._menuButtonClicked}"></paper-icon-button>
          <div main-title>${this.appTitle}</div>
          <paper-icon-button icon="account-circle" @click="${this._userButtonClicked}"></paper-icon-button>
          <paper-icon-button icon="exit-to-app" @click="${this._exitButtonClicked}"></paper-icon-button>
        </app-toolbar>
      </app-header>

      <app-drawer-layout id="drawerLayout" ?force-narrow="${this._drawerForceNarrow}">
        <app-drawer id="drawer" slot="drawer" ?opened="${this._drawerOpened}"
            @opened-changed="${this._drawerOpenedChanged}">
          <div class="drawer-content">
            <paper-icon-item focused data-page="dashboard" @click="${this._drawerButtonClicked}">
              <iron-icon icon="home" slot="item-icon" id="dashboardIcon"></iron-icon> <span>Dashboard</span><paper-ripple></paper-ripple>
            </paper-icon-item>
            <paper-icon-item data-page="mirror" @click="${this._drawerButtonClicked}">
              <iron-icon icon="image:filter-tilt-shift" slot="item-icon" id="dashboardIcon"></iron-icon> <span>Mirrors</span><paper-ripple></paper-ripple>
            </paper-icon-item>
            <paper-icon-item data-page="gas" @click="${this._drawerButtonClicked}">
              <iron-icon icon="image:rotate-right" slot="item-icon" id="dashboardIcon"></iron-icon> <span>Global Alignment</span><paper-ripple></paper-ripple>
            </paper-icon-item>
            <paper-icon-item data-page="positioner" @click="${this._drawerButtonClicked}">
              <iron-icon icon="maps:near-me" slot="item-icon" id="dashboardIcon"></iron-icon> <span>Positioner</span><paper-ripple></paper-ripple>
            </paper-icon-item>
          </div>
        </app-drawer>

        <!-- Main content -->
        <main role="main" class="main-content">
          <dashboard-view class="page" ?active="${this._page === 'dashboard'}"  ?hidden="${this._page !== 'dashboard'}"></dashboard-view>
          <mirror-view class="page" ?active="${this._page === 'mirror'}" ?hidden="${this._page !== 'mirror'}"></mirror-view>
          <gas-view class="page" ?active="${this._page === 'gas'}" ?hidden="${this._page !== 'gas'}"></gas-view>
          <positioner-view class="page" ?active="${this._page === 'positioner'}" ?hidden="${this._page !== 'positioner'}"></positioner-view>
          <notfound-view class="page" ?active="${this._page === 'notfound'}" ?hidden="${this._page !== 'not-foudn'}"></notfound-view>
        </main>

        <footer>
          <p>Created by Bryan Kim for the CTA Collaboration, 2019.</p>
        </footer>

      </app-drawer-layout>
    </app-header-layout>

    <paper-dialog id="userInfo" modal>
      <h2>User Info</h2>
      <p>Current User: User</p>
      <p>Access: User</p>
      <div class="buttons">
        <paper-button dialog-confirm autofocus>Close</paper-button>
      </div>
    </paper-dialog>
    `;
  }

  static get properties () {
    return {
      appTitle: { type: String },
      _page: { type: String },
      _drawerOpened: { type: Boolean },
      _drawerForceNarrow: { type: Boolean }
    }
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);

    // Initial settings/properties
    this.appTitle = "pSCT Alignment GUI"
    this._drawerOpened = true
    this._drawerForceNarrow = false
    this._page = "dashboard"
  }

  firstUpdated() {
    installRouter((location) => this._locationChanged(location));
    installOfflineWatcher((offline) => this._offlineChanged(offline));
    installMediaQueryWatcher(`(min-width: 460px)`,
        (matches) => this._layoutChanged(matches));
  }

  // Offline snackbar

  _offlineChanged(offline) {
    const previousOffline = this._offline;
    this._offline = offline;

    // Don't show the snackbar on the first load of the page.
    if (previousOffline === undefined) {
      return;
    }

    clearTimeout(this.__snackbarTimer);
    this._snackbarOpened = true;
    this.__snackbarTimer = setTimeout(() => { this._snackbarOpened = false }, 3000);
  }

  // Dynamic layout

  _layoutChanged(isWideLayout) {
    // The drawer doesn't make sense in a wide layout, so if it's opened, close it.
    this._updateDrawerState(false);
  }

  // Page navigation

  _locationChanged() {
    const path = window.decodeURIComponent(window.location.pathname);
    const page = path === '/' ? 'dashboard' : path.slice(1);
    this._loadPage(page);
    // Any other info you might want to extract from the path (like page type),
    // you can do here.

    // Close the drawer - in case the *path* change came from a link in the drawer.
    this._updateDrawerState(false);
  }


  updated(changedProps) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  _loadPage(page) {
    switch(page) {
      case 'dashboard':
        import('../components/dashboard-view.js').then((module) => {
          // Put code in here that you want to run every time when
          // navigating to view1 after my-view1.js is loaded.
        });
        break;
      case 'mirror':
        import('../components/mirror-view.js');
        break;
      case 'gas':
        import('../components/gas-view.js');
        break;
      case 'positioner':
        import('../components/positioner-view.js');
        break;
      default:
        page = 'notfound-view';
        import('../components/notfound-view.js');
    }

    this._page = page;
  }

  // Header button interactions
  _menuButtonClicked() {
    var drawerLayout = this.shadowRoot.getElementById('drawerLayout')
    var drawer = this.shadowRoot.getElementById('drawer')
    if (this._drawerForceNarrow || !drawerLayout.narrow) {
      this._drawerForceNarrow = !this._drawerForceNarrow
    } else {
      this._drawerOpened = !this._drawerOpened
    }
  }

  _userButtonClicked(e) {
    var userInfo = this.shadowRoot.getElementById('userInfo')
    userInfo.open()
  }

  _exitButtonClicked() {
    console.log(this._page)
  }

  // Drawer interactions
  _updateDrawerState(opened) {
    if (opened !== this._drawerOpened) {
      this._drawerOpened = opened;
    }
  }

  _drawerOpenedChanged(e) {
    this._updateDrawerState(e.target.opened);
  }

  _drawerButtonClicked(e) {
    e.currentTarget.focused = true
    this._loadPage(e.currentTarget.dataset.page)
    e.stopPropagation();
  }
}

window.customElements.define('my-app', MyApp);
