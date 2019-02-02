import { LitElement, html } from '@polymer/lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
import { installRouter } from 'pwa-helpers/router.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';
import { SharedStyles, PaperFontStyles } from './shared-styles.js';

// Import polymer elements
import '@polymer/font-roboto/roboto.js';

import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';

import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-item/paper-icon-item.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-toast/paper-toast.js';

import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/maps-icons.js';
import '@polymer/iron-icons/image-icons.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';


class MyApp extends LitElement {
  render() {
    // Anything that's related to rendering should be done in here.
    return html`
    ${SharedStyles}
    ${PaperFontStyles}
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
      margin-left: 0px;
      margin-right: 0px;
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
    .white-text {
      color: white;
    }
    .white-button {
      color: #4285f4;
      background-color: white;
    }
    .grey {
      background-color: #eee;
    }
    .blue {
      color: white;
      background-color: #4285f4;
    }

    #login-logo {
        width: 200px;
        height: 100px;
      }
    #login-card {
      width: 300px;
      height: 350px;

      top: 20%;
      left: 50%;
      -ms-transform: translate(-50%, -50%);
      transform: translate(-50%, 0%);

      text-align: center;
    }
    .paper-font-headline {
      text-width: bold;
    }
    #login-submit-button {
      align: center;
      margin: 15px;
    }
    #login-page {
      width: 100%;
      height: 80vh;
      padding:0;
      margin:0;
    }
    </style>

    <app-header-layout>
      <app-header fixed effects="waterfall" slot="header">
        <app-toolbar>
          <paper-icon-button id="toggle" icon="menu" @click="${this._menuButtonClicked}"></paper-icon-button>
          <div main-title>${this.appTitle}</div>
          <paper-button class="white-text" @click="${this._loginButtonClicked}" ?hidden="${this._loggedIn}">Sign In</paper-button>
          <paper-icon-button icon="account-circle" @click="${this._userButtonClicked}" ?hidden="${!this._loggedIn}"></paper-icon-button>
          <paper-icon-button icon="exit-to-app"  @click="${this._exitButtonClicked}" ?hidden="${!this._loggedIn}"></paper-icon-button>
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
          <div ?hidden="${this._page !== 'login'}" id="login-page" class="grey">
            <paper-card id="login-card">
              <div class="card-content">
                <iron-image sizing="contain" id="login-logo" fade src="images/pSCT_logo_blue_elg.png"></iron-image>
                <div class="paper-font-headline">pSCT Alignment GUI</div>
                <paper-input id="username-input" label="Username"></paper-input>
                <paper-input id="password-input" label="Password" type="password"></paper-input>
                <paper-button id="login-submit-button" class="blue" @click="${this._loginSubmitButtonClicked}">Sign In</paper-button>
              </div>
            </paper-card>
          </div>
          <dashboard-view class="page" ?active="${this._page === 'dashboard'}"  ?hidden="${this._page !== 'dashboard'}"></dashboard-view>
          <mirror-view class="page" ?active="${this._page === 'mirror'}" ?hidden="${this._page !== 'mirror'}"></mirror-view>
          <gas-view class="page" ?active="${this._page === 'gas'}" ?hidden="${this._page !== 'gas'}"></gas-view>
          <positioner-view class="page" ?active="${this._page === 'positioner'}" ?hidden="${this._page !== 'positioner'}"></positioner-view>
          <notfound-view class="page" ?active="${this._page === 'notfound'}" ?hidden="${this._page !== 'not-found'}"></notfound-view>
        </main>

        <footer>
          <p>Created by Bryan Kim for the CTA Collaboration, 2019.</p>
        </footer>

      </app-drawer-layout>
    </app-header-layout>

    <paper-dialog id="userInfo" modal>
      <h2>User Info</h2>
      <p>Current User: ${this._user}</p>
      <p>Permissions: ${this._permissions}</p>
      <div class="buttons">
        <paper-button dialog-confirm autofocus>Close</paper-button>
      </div>
    </paper-dialog>

    <paper-toast id="notLoggedInToast" text="Please login first."></paper-toast>
    <iron-a11y-keys id="keys" keys="enter"></iron-a11y-keys>
    `;
  }

  static get properties () {
    return {
      appTitle: { type: String },
      _page: { type: String },
      _drawerOpened: { type: Boolean },
      _drawerForceNarrow: { type: Boolean },
      _user: { type: String },
      _permissions: { type: String },
    }
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);

    // Initial settings/properties
    this.appTitle = "pSCT Alignment GUI"
    this._page = "login"
    this._drawerOpened = false
    this._drawerForceNarrow = true
  }

  firstUpdated() {
    installRouter((location) => this._locationChanged(location));
    installMediaQueryWatcher(`(min-width: 460px)`,
        (matches) => this._layoutChanged(matches));

    this.shadowRoot.querySelector('#keys').target = this.shadowRoot.querySelector('#password-input')
    this.shadowRoot.querySelector('#keys').addEventListener('keys-pressed', this._loginSubmitButtonClicked.bind(this))
}

  // Dynamic layout
  _layoutChanged(isWideLayout) {
    // The drawer doesn't make sense in a wide layout, so if it's opened, close it.
    this._updateDrawerState(false);
  }

  // Page navigation
  _locationChanged() {
    const path = window.decodeURIComponent(window.location.pathname);
    const page = path === '/' ? 'login' : path.slice(1);
    this._loadPage(page);

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
    if (page !== 'login') {
      if (this._loggedIn === true) {
        switch(page) {
          case 'dashboard':
            import('../components/dashboard-view.js').then((module) => {
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
      else {
        this.shadowRoot.getElementById('notLoggedInToast').open()
      }
    }
    else {
      this._page = page
    }
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

  _userButtonClicked() {
    var userInfo = this.shadowRoot.getElementById('userInfo')
    userInfo.open()
  }

  _exitButtonClicked() {
    this._user = null
    this._permissions = null
    this._loggedIn = false
    this._loadPage('login');
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

  _authenticate(username, password) {
    /**
    Implement DB lookup logic
    Return {
      success: bool,
      permission: string,
      error: string
  }
  */
    return {
      success: true,
      permission: "administrator"
    }
  }

  _loginButtonClicked(e) {
    this._loadPage('login');
  }

  _loginSubmitButtonClicked(e) {
    var usernameInput = this.shadowRoot.getElementById('username-input')
    var passwordInput = this.shadowRoot.getElementById('password-input')

    usernameInput.invalid = false
    passwordInput.invalid = false

    var username = usernameInput.value
    var password = passwordInput.value
    if (username === "") {
      usernameInput.errorMessage = "Username required."
      usernameInput.invalid = true
      return
    }
    if (password === "") {
      passwordInput.errorMessage = "Password required."
      passwordInput.invalid = true
      return
    }

    var authenticateResult = this._authenticate(username, password)
    if (authenticateResult.success) {
      this._user = username
      this._permissions = authenticateResult.permission
      this._loggedIn = true
      this._loadPage('dashboard');
    }
    else {
      if (authenticateResult.error === "invalid-user") {
        usernameInput.errorMessage = "Unrecognized user name."
        usernameInput.invalid = true
      }
      else if (authenticateResult.error === "wrong-password") {
        passwordInput.errorMessage="Wrong password."
        passwordInput.invalid = true
      }
    }
  }
}

window.customElements.define('my-app', MyApp);
