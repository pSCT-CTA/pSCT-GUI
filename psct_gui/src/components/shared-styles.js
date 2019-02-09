// This file contains all of the styling (CSS)

import { html } from '@polymer/lit-element'

export const SharedStyles = html`
<style>
body {
      margin: 0;
      font-family: 'Roboto', 'Noto', sans-serif;
      background-color: #eee;
    }
app-header-layout {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
app-header {
      background-color: #4285f4;
      color: #fff;
}
app-header paper-icon-button {
  --paper-icon-button-ink-color: #fff;
}
app-drawer-layout {
  --app-drawer-layout-content-transition: margin 0.2s;
}
app-drawer {
  --app-drawer-content-container: {
    background-color: #eee;
  }
}
.drawer-content {
  margin-top: 80px;
  height: calc(100% - 80px);
  overflow: auto;
}
.view-content {
  margin-left: 10 px
}
[hidden] {
  display: none !important;
}
</style>
`;

export const IronFlexLayoutStyles = html`
<style>
  .layout.vertical {
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
  }
  .layout.inline {
    display: -ms-inline-flexbox;
    display: -webkit-inline-flex;
    display: inline-flex;
  }
  .layout.horizontal {
    -ms-flex-direction: row;
    -webkit-flex-direction: row;
    flex-direction: row;
  }
  .layout.vertical {
    -ms-flex-direction: column;
    -webkit-flex-direction: column;
    flex-direction: column;
  }
  .layout.wrap {
    -ms-flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
  }
  .layout.no-wrap {
    -ms-flex-wrap: nowrap;
    -webkit-flex-wrap: nowrap;
    flex-wrap: nowrap;
  }
  .layout.center,
  .layout.center-center {
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  .layout.center-justified,
  .layout.center-center {
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
  }
  .flex {
    -ms-flex: 1 1 0.000000001px;
    -webkit-flex: 1;
    flex: 1;
    -webkit-flex-basis: 0.000000001px;
    flex-basis: 0.000000001px;
  }
  .flex-auto {
    -ms-flex: 1 1 auto;
    -webkit-flex: 1 1 auto;
    flex: 1 1 auto;
  }
  .flex-none {
    -ms-flex: none;
    -webkit-flex: none;
    flex: none;
  }
  /**
   * Alignment in cross axis.
   */
  .layout.start {
    -ms-flex-align: start;
    -webkit-align-items: flex-start;
    align-items: flex-start;
  }
  .layout.center,
  .layout.center-center {
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  .layout.end {
    -ms-flex-align: end;
    -webkit-align-items: flex-end;
    align-items: flex-end;
  }
  .layout.baseline {
    -ms-flex-align: baseline;
    -webkit-align-items: baseline;
    align-items: baseline;
  }
  /**
   * Alignment in main axis.
   */
  .layout.start-justified {
    -ms-flex-pack: start;
    -webkit-justify-content: flex-start;
    justify-content: flex-start;
  }
  .layout.center-justified,
  .layout.center-center {
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
  }
  .layout.end-justified {
    -ms-flex-pack: end;
    -webkit-justify-content: flex-end;
    justify-content: flex-end;
  }
  .layout.around-justified {
    -ms-flex-pack: distribute;
    -webkit-justify-content: space-around;
    justify-content: space-around;
  }
  .layout.justified {
    -ms-flex-pack: justify;
    -webkit-justify-content: space-between;
    justify-content: space-between;
  }
  /**
   * Self alignment.
   */
  .self-start {
    -ms-align-self: flex-start;
    -webkit-align-self: flex-start;
    align-self: flex-start;
  }
  .self-center {
    -ms-align-self: center;
    -webkit-align-self: center;
    align-self: center;
  }
  .self-end {
    -ms-align-self: flex-end;
    -webkit-align-self: flex-end;
    align-self: flex-end;
  }
  .self-stretch {
    -ms-align-self: stretch;
    -webkit-align-self: stretch;
    align-self: stretch;
  }
  .self-baseline {
    -ms-align-self: baseline;
    -webkit-align-self: baseline;
    align-self: baseline;
  }
  /**
   * multi-line alignment in main axis.
   */
  .layout.start-aligned {
    -ms-flex-line-pack: start;  /* IE10 */
    -ms-align-content: flex-start;
    -webkit-align-content: flex-start;
    align-content: flex-start;
  }
  .layout.end-aligned {
    -ms-flex-line-pack: end;  /* IE10 */
    -ms-align-content: flex-end;
    -webkit-align-content: flex-end;
    align-content: flex-end;
  }
  .layout.center-aligned {
    -ms-flex-line-pack: center;  /* IE10 */
    -ms-align-content: center;
    -webkit-align-content: center;
    align-content: center;
  }
  .layout.between-aligned {
    -ms-flex-line-pack: justify;  /* IE10 */
    -ms-align-content: space-between;
    -webkit-align-content: space-between;
    align-content: space-between;
  }
  .layout.around-aligned {
    -ms-flex-line-pack: distribute;  /* IE10 */
    -ms-align-content: space-around;
    -webkit-align-content: space-around;
    align-content: space-around;
  }
</style>
`;

export const PaperFontStyles = html`
<style>
.paper-font-display4,
.paper-font-display3,
.paper-font-display2,
.paper-font-display1,
.paper-font-headline,
.paper-font-title,
.paper-font-subhead,
.paper-font-body2,
.paper-font-body1,
.paper-font-caption,
.paper-font-menu,
.paper-font-button {
  font-family: 'Roboto', 'Noto', sans-serif;
  -webkit-font-smoothing: antialiased;  /* OS X subpixel AA bleed bug */
}
.paper-font-code2,
.paper-font-code1 {
  font-family: 'Roboto Mono', 'Consolas', 'Menlo', monospace;
  -webkit-font-smoothing: antialiased;  /* OS X subpixel AA bleed bug */
}
/* Opt for better kerning for headers &amp; other short labels. */
.paper-font-display4,
.paper-font-display3,
.paper-font-display2,
.paper-font-display1,
.paper-font-headline,
.paper-font-title,
.paper-font-subhead,
.paper-font-menu,
.paper-font-button {
  text-rendering: optimizeLegibility;
}
/*
"Line wrapping only applies to Body, Subhead, Headline, and the smaller Display
styles. All other styles should exist as single lines."
*/
.paper-font-display4,
.paper-font-display3,
.paper-font-title,
.paper-font-caption,
.paper-font-menu,
.paper-font-button {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.paper-font-display4 {
  font-size: 112px;
  font-weight: 300;
  letter-spacing: -.044em;
  line-height: 120px;
}
.paper-font-display3 {
  font-size: 56px;
  font-weight: 400;
  letter-spacing: -.026em;
  line-height: 60px;
}
.paper-font-display2 {
  font-size: 45px;
  font-weight: 400;
  letter-spacing: -.018em;
  line-height: 48px;
}
.paper-font-display1 {
  font-size: 34px;
  font-weight: 400;
  letter-spacing: -.01em;
  line-height: 40px;
}
.paper-font-headline {
  font-size: 24px;
  font-weight: 400;
  letter-spacing: -.012em;
  line-height: 32px;
}
.paper-font-title {
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
}
.paper-font-subhead {
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}
.paper-font-body2 {
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
}
.paper-font-body1 {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
.paper-font-caption {
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.011em;
  line-height: 20px;
}
.paper-font-menu {
  font-size: 13px;
  font-weight: 500;
  line-height: 24px;
}
.paper-font-button {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.018em;
  line-height: 24px;
  text-transform: uppercase;
}
.paper-font-code2 {
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
}
.paper-font-code1 {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}
</style>`;

export const WidgetStyles = html`
<style>
  paper-card {
    width: 100%;
    transition: width 0.5s, height 0.5s;
  }
  paper-card.fullscreen {
    z-index: -1;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
  }
  .card-actions > paper-icon-button {
    float: right;
    padding: 10px 0;
    width: 50px;
    height: 50px;
  }
  .card-actions > paper-button {
    float: left;
    padding: 10px 0;
  }
</style>`;

export const ViewStyles = html`
<style>
.flex-container {
  display: flex;
  align-items: stretch;
  background-color: #f1f1f1;
}

.flex-container > div {
  margin: 10px;
}
.view-title {
  margin: 10px;
}
.full-height {
  height: 100%;
}
</style>`;
