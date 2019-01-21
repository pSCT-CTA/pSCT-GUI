import { LitElement, html } from '@polymer/lit-element';

import { PaperFontStyles } from './shared-styles.js'

import { WidgetCard } from './widget-card.js'

import * as d3 from "d3";

import '@polymer/paper-button/paper-button.js';

class MirrorWidget extends WidgetCard {
  constructor() {
    super()
    this.name = 'Mirror View'
    this.mirror = "secondary"

    this.width = 600
    this.height = 600

    // Hardcoded properties
    this.allPanelNumbers = {
      P1: ['1114', '1113', '1112', '1111',
        '1414', '1413', '1412', '1411',
        '1314', '1313', '1312', '1311',
        '1214', '1213', '1212', '1211'],
      P2: ['1128', '1127', '1126', '1125', '1124', '1123', '1122', '1121',
        '1428', '1427', '1426', '1425', '1424', '1423', '1422', '1421',
        '1328', '1327', '1326', '1325', '1324', '1323', '1322', '1321',
        '1228', '1227', '1226', '1225', '1224', '1223', '1222', '1221'],
      S1: ['2112', '2111', '2412', '2411',
        '2312', '2311', '2212', '2211'],
      S2: ['2124', '2123', '2122', '2121',
        '2424', '2423', '2422', '2421',
        '2324', '2323', '2322', '2321',
        '2224', '2223', '2222', '2221']
    }

    this.panelGeometry = {
      P1: {
        center: { x: 2825.3289, y: 0.0 },
        vertices: [
          { x: 2151.3557, y: -427.9312 },
          { x: 3334.6713, y: -663.3074 },
          { x: 3400.0013, y: 0.0 },
          { x: 3334.6713, y: 663.3074 },
          { x: 2151.3557, y: 427.9312 }
        ],
        referencePointsPanel: [
          { x: 2507.1922, y: 0.0 },
          { x: 2984.3973, y: -277.1281 },
          { x: 2984.3973, y: 277.1281 }
        ],
        referencePointsBack: [
          { x: 3143.4656667, y: 0.0 },
          { x: 2666.2606, y: -277.1281 },
          { x: 2666.2606, y: 277.1281 }
        ],
        mpes_attachment_points: {
          '1L': { x: 2352.01, y: -401.487 },
          '1W': { x: 2452.11, y: 444.902 },
          '2L': { x: 2764.55, y: 456.063 },
          '2W': { x: 2758.18, y: -488.03 },
          '3L': { x: 3166.33, y: -563.552 },
          '3W': { x: 3057.53, y: 565.273 },
          '4L': { x: 3280.72, y: -561.592 },
          '5W': { x: 3349.11, y: -113.243 },
          "4'L": { x: 3327.25, y: 89.236 },
          "5'W": { x: 3306.85, y: 542.313 }
        }
      },
      P2: {
        center: { x: 4132.7017, y: 0.0 },
        vertices: [
          { x: 3383.6294, y: -333.2584 },
          { x: 4808.6082, y: -473.6066 },
          { x: 4808.6082, y: 473.6066 },
          { x: 3383.6294, y: 333.2584 }
        ],
        referencePointsPanel: [
          { x: 3816.1544, y: 0.0 },
          { x: 4290.9753, y: -277.1281 },
          { x: 4290.9753, y: 277.1281 }
        ],
        referencePointsBack: [
          { x: 4449.2489, y: 0.0 },
          { x: 4132.7017, y: -277.1281 },
          { x: 4132.7017, y: 277.1281 }
        ],
        mpes_attachment_points: {
          '4W': { x: 3431.65, y: -135.86 },
          '5L': { x: 3455.77, y: 114.147 },
          '6L': { x: 3494.92, y: -278.845 },
          '6W': { x: 3598.35, y: 312.159 },
          '7L': { x: 4109.69, y: 312.288 },
          '7W': { x: 4106.48, y: -344.724 },
          '8L': { x: 4718.87, y: -399.674 },
          '8W': { x: 4611.25, y: 411.746 }
        }
      },
      S1: {
        center: { x: 1115.7017, y: 0.0 },
        vertices: [
          { x: 364.5846, y: 151.0159 },
          { x: 1474.9636, y: 610.9499 },
          { x: 1596.4891, y: 0.0 },
          { x: 1474.9636, y: -610.9499 },
          { x: 364.5846, y: -151.0159 }
        ],
        referencePointsPanel: [
          { x: 799.9935, y: 0.0 },
          { x: 1273.1926, y: 277.1281 },
          { x: 1273.1926, y: -277.1281 }
        ],
        referencePointsBack: [
          { x: 1430.9256, y: 0.0 },
          { x: 1115.4596, y: 277.1281 },
          { x: 1115.4596, y: -277.1281 }
        ],
        mpes_attachment_points: {
          '1L': { x: 564.599, y: -163.227 },
          '1W': { x: 654.18, y: 225.589 },
          '2L': { x: 959.968, y: 297.984 },
          '2W': { x: 947.410, y: -328.073 },
          '3L': { x: 1333.310, y: -482.099 },
          '3W': { x: 1227.69, y: 462.843 },
          '4L': { x: 1439.98, y: -501.603 },
          '5W': { x: 1542.45, y: -112.756 },
          "4'L": { x: 1522.32, y: 87.636 },
          "5'W": { x: 1468.19, y: 486.098 }
        }
      },
      S2: {
        center: { x: 2180.8377, y: 0.0 },
        vertices: [
          { x: 1565.8130, y: 311.4596 },
          { x: 2656.1201, y: 528.3351 },
          { x: 2656.1201, y: -528.3351 },
          { x: 1565.8130, y: -311.4596 }
        ],
        referencePointsPanel: [
          { x: 1878.2451, y: 0.0 },
          { x: 2332.1339, y: 277.1281 },
          { x: 2332.1339, y: -277.1281 }
        ],
        referencePointsBack: [
          { x: 2483.4302, y: 0.0 },
          { x: 2180.8376, y: 277.1281 },
          { x: 2180.8376, y: -277.1281 }
        ],
        mpes_attachment_points: {
          '4W': { x: 1624.04, y: -114.255 },
          '5L': { x: 1648.71, y: 93.783 },
          '6L': { x: 1678.86, y: -267.202 },
          '6W': { x: 1775.62, y: 310.576 },
          '7L': { x: 2140.40, y: 331.887 },
          '7W': { x: 2133.86, y: -363.829 },
          '8L': { x: 2588.06, y: -449.052 },
          '8W': { x: 2486.34, y: 451.305 }
        }
      }
    }

    if (this.mirror === 'primary') {
      this.innerPanelType = 'P1'
      this.outerPanelType = 'P2'
      this.innerPanelNumbers = this.allPanelNumbers.P1
      this.outerPanelNumbers = this.allPanelNumbers.P2
    } else if (this.mirror === 'secondary') {
      this.innerPanelType = 'S1'
      this.outerPanelType = 'S2'
      this.innerPanelNumbers = this.allPanelNumbers.S1
      this.outerPanelNumbers = this.allPanelNumbers.S2
    }

    this.panels = []
    this.panelPositions = {}

    this.computePositions()
    this.computeScales()
  }

  computePositions () {
    for (let z of [[this.innerPanelNumbers, this.innerPanelType], [this.outerPanelNumbers, this.outerPanelType]]) {
      var numPanels = z[0].length
      for (var i = 0; i < numPanels; i++) {
        var panelNumber = z[0][i];
        var panel = { panelNumber: panelNumber }
        this.panelPositions[panelNumber] = {}

        var theta = 2 * Math.PI * ((i + 0.5) / numPanels)

        for (let coordinateType of ['vertices', 'referencePointsPanel', 'referencePointsBack']) {
          var points = []
          for (let point of this.panelGeometry[z[1]][coordinateType]) {
            points.push(this._rotateCoords(point, theta))
          }
          this.panelPositions[panelNumber][coordinateType] = points
          panel[coordinateType] = points
        }
        this.panels.push(panel)
      }
    }
  }

  _rotateCoords (point, theta) {
    var x = point.x
    var y = point.y

    var rotX = Math.cos(theta) * x - Math.sin(theta) * y
    var rotY = Math.sin(theta) * x + Math.cos(theta) * y

    return { x: rotX, y: rotY }
  }

  computeScales () {
    var min = d3.min(this.panels, function (d) { return d3.min(d.vertices, function (e) { return e.x }) })
    var max = d3.max(this.panels, function (d) { return d3.max(d.vertices, function (e) { return e.x }) })

    this.xScale = d3.scaleLinear()
      .domain([min, max])
      .range([this.width * 0.1, this.width * 0.9])

    this.yScale = d3.scaleLinear()
      .domain([min, max])
      .range([this.height * 0.1, this.height * 0.9])
  }

  moveTooltip (d, i, group) {
    this.tooltipDiv.transition()
      .duration(200)
      .style('opacity', 0.9)
    this.tooltipDiv
      .style('top', d3.event.clientY + 'px')
      .style('left', (d3.event.clientX - 400) + 'px')
  }

  hideTooltip (d, i) {
    this.tooltipDiv.transition()
      .duration(500)
      .style('opacity', 0)
  }

  highlight (d, i, group) {
    d3.select(group[i])
      .style('stroke-width', 0.3)
      .style('stroke', 'blue')
      .style('fill', 'LightSkyBlue')
  }

  renderPanels () {
    // Render panel objects
    var svg = this.shadowRoot.querySelector('svg')

    d3.select(svg).selectAll('polygon')
      .data(this.panels)
      .enter()
      .append('polygon')
      .attr('points', d => {
        return d.vertices.map(
          e => {
            return [this.xScale(e.x), this.yScale(e.y)].join(',')
          }
        ).join(' ')
      })
      .style('fill', 'transparent')
      .style('stroke', 'black')
      .style('stroke-width', 0.1)
      .attr('pointer-events', 'all')
      .on('click', (d, i) => {
        console.log(d)
        // this.infoWindowView.changeSelection(d.id)
      })
      .on('mouseover', (function (d, i, group) {
        console.log(group[i])
        this.highlight(d, i, group)
        this.moveTooltip(d, i, group)
      }).bind(this))
      .on('mouseout', (function (d, i, group) {
        d3.select(group[i])
          .style('stroke-width', 0.1)
          .style('stroke', 'black')
          .style('fill', 'transparent')

          this.tooltipDiv.transition()
            .duration(500)
            .style('opacity', 0)
      }).bind(this))
  }

  firstUpdated(changedProps) {
    this.tooltipDiv = d3.select(this.shadowRoot.querySelector('.tooltip'))
    console.log(this.tooltipDiv)
    // Render all objects in canvas
    this.renderPanels()
  }

  get contentTemplate() {
    return html`
    <style>
    .mirror-svg {
      width: 100%;
      height: ${this.height};
      width: ${this.width};
      border-style: solid;
    }
    .tooltip {
       position: absolute;
       text-align: center;
       width: 60px;
       height: 28px;
       padding: 2px;
       font: 12px sans-serif;
       background: lightsteelblue;
       border: 0px;
       border-radius: 8px;
       pointer-events: none;
   }
    </style>
    <div class="mirror-header paper-font-headline">${this.name}</div>
    <div class="mirror-body">
    <svg class="mirror-svg" preserveAspectRatio="xMidYMidmeet" viewBox="0 0 ${this.width} ${this.height}"></svg>
    </div>
    <div class="tooltip" style="opacity: 0;">Panel 2223</div>
    `;
  }

  get actionsTemplate() {
    return html`
    <paper-button raised toggles>Primary</paper-button>
    <paper-button raised toggles>Secondary</paper-button>
    `
  }

  static get properties() {
    return {
      name: { type: String },
      mirror: { type: String }
    }
  }
}

window.customElements.define('mirror-widget', MirrorWidget)
