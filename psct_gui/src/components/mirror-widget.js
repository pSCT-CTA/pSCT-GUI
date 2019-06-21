import { LitElement, html } from '@polymer/lit-element'

import { PaperFontStyles } from './shared-styles.js'
import { WidgetCard } from './widget-card.js'
import { BaseSocketioDeviceClient } from '../socketio-device-client.js'

import * as d3 from 'd3'

import '@polymer/paper-button/paper-button.js'

import '@polymer/paper-radio-button/paper-radio-button.js'
import '@polymer/paper-radio-group/paper-radio-group.js'

import '@polymer/paper-tooltip/paper-tooltip.js'

import '@vaadin/vaadin-select/vaadin-select.js'
import '@vaadin/vaadin-item/vaadin-item.js'
import '@vaadin/vaadin-list-box/vaadin-list-box.js'

class MirrorWidgetClient extends BaseSocketioDeviceClient {
  _onNewData (data) {
    console.log(data)
    this.component.updateAllData(data)
  }
}

class MirrorWidget extends WidgetCard {
  constructor () {
    super()
    this.name = 'Mirror View'

    this.initialized = false

    this.mirror = ''
    this._allMirrors = ['Primary', 'Secondary', 'Test']

    this.viewMode = ''
    this._allViewModes = ['', 'Internal Temperature', 'External Temperature', 'Alignment Overview']

    this.SVG_WIDTH = 0
    this.SVG_HEIGHT = 0

    // Hardcoded properties
    this.PANEL_NUMBERS = {
      Primary: {
          P1: ['1414', '1413', '1412', '1411',
            '1314', '1313', '1312', '1311',
            '1214', '1213', '1212', '1211',
            '1114', '1113', '1112', '1111'],
          P2: ['1428', '1427', '1426', '1425', '1424', '1423', '1422', '1421',
            '1328', '1327', '1326', '1325', '1324', '1323', '1322', '1321',
            '1228', '1227', '1226', '1225', '1224', '1223', '1222', '1221',
            '1128', '1127', '1126', '1125', '1124', '1123', '1122', '1121']
       },
       Secondary: {
          S1: ['2412', '2411', '2312', '2311',
            '2212', '2211', '2112', '2111'],
          S2: ['2424', '2423', '2422', '2421',
            '2324', '2323', '2322', '2321',
            '2224', '2223', '2222', '2221',
            '2124', '2123', '2122', '2121']
       },
      Test: {
        P2: ['3121', '3122']
      }
    }

    this.PANEL_GEOMETRY = {
      P1: {
        center: { x: 2825.3289, y: 0.0 },
        vertices: [
          { x: 2151.3557, y: 427.9312 },
          { x: 3334.6713, y: 663.3074 },
          { x: 3400.0013, y: 0.0 },
          { x: 3334.6713, y: -663.3074 },
          { x: 2151.3557, y: -427.9312 }
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
        mpesPositions: {
            1:{ x: 2388.01882, y: 475.00644 },
            2:{ x: 3098.00818, y: 616.23216 },
            3:{ x: 3356.44796667, y: 442.204933334 },
            4:{ x: 3378.22463333, y: -221.102466667 },
            5:{ x: 2743.0135, y: -545.6193 },
        }
      },
      P2: {
        center: { x: 4132.7017, y: 0.0 },
        vertices: [
          { x: 3383.6294, y: 333.2584 },
          { x: 4808.6082, y: 473.6066 },
          { x: 4808.6082, y: -473.6066 },
          { x: 3383.6294, y: -333.2584 }
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
        mpesPositions: {
            1:{ x: 4096.1188, y: -403.4325 },
            2:{ x: 3383.6294, y: -111.086133333 },
            3:{ x: 3526.12728, y: 347.29322 },
            4:{ x: 4666.11032, y: 459.57178 }
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
        mpesPositions: {
            1:{ x: 586.6604, y: -243.0027 },
            2:{ x: 1252.8878, y: -518.9631 },
            3:{ x: 1515.4721, y: -407.29993 },
            4:{ x: 1555.9806, y: 203.64996 },
            5:{ x: 919.7741, y: 380.9829 }
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
        mpesPositions: {
            1:{ x: 2110.96655, y: 419.89735 },
            2:{ x: 1565.8130, y: 103.81986 },
            3:{ x: 2438.05868, y: -484.9600 },
            4:{ x: 1783.87442, y: -354.8347 }
        }
      }
    }

    this.positions = {}

    this.allObjects = {}
    this.currentObjects = {}

    this.xScale = null
    this.yScale = null

    // One-time computation of hardcoded mirror geometry
    this.computeMirrorGeometry()

    this.socketioClient = new MirrorWidgetClient('http://localhost:5000', this)
    this.socketioClient.connect()
    this.refresh()
  }

  static get properties () {
    return {
      name: { type: String },
      mirror: { type: String },
      viewMode: { type: String },
      currentObjects: { type: Object }
    }
  }

  get contentTemplate () {
    return html`
    <style>
    .mirror-body {
      height: 100%;
    }
    .mirror-svg {
      width: 80%;
      height: 100%;
      border-style: solid;
      display: inline-block;
    }
    .legend-svg {
      width: 15%;
      display: inline-block;
    }
    </style>
    <vaadin-select value="${this.viewMode}" @value-changed="${this._changeViewMode}">
      <template>
        <vaadin-list-box>
          ${this._allViewModes.map(i => html`<vaadin-item value="${i}">${i}</vaadin-item>`)}
        </vaadin-list-box>
      </template>
    </vaadin-select>
    <div class="mirror-body">
    <svg class="mirror-svg" preserveAspectRatio="xMidYMidmeet" viewBox="0 0 ${this.SVG_WIDTH} ${this.SVG_HEIGHT}"></svg><svg class="legend-svg"></svg>
    </div>
    <paper-tooltip hidden id="tooltip">
      <div class="paper-font-body1" id="tooltip-device-name">${this.tooltipTarget}</div>
      <div class="paper-font-body1" id="tooltip-device-info">${this.tooltipContent}</div>
    </paper-tooltip>
    `
  }

  get actionsTemplate () {
    return html`
    <paper-radio-group selected="${this.mirror}" @selected-changed= "${this._changeMirror}" allow-empty-selection>
      ${this._allMirrors.map(i => html`<paper-radio-button name="${i}">${i}</paper-radio-button>`)}
    </paper-radio-group>
    `
  }

  // Geometric computations (positions)
  _rotatePoint (point, theta) {
    var x = point.x
    var y = point.y

    var rotX = Math.cos(theta) * x - Math.sin(theta) * y
    var rotY = Math.sin(theta) * x + Math.cos(theta) * y

    return { x: rotX, y: rotY }
  }

  // One-time calculation of positions of all objects in diagram
  computeMirrorGeometry () {
    for (let mirror of this._allMirrors) {
      if (!this.positions.hasOwnProperty(mirror)) {
        this.positions[mirror] = {
          Panel: {},
          Edge: {},
          MPES: {},
          Actuator: {}
        }
      }

      // Go panel by panel
      for (var panelType in this.PANEL_NUMBERS[mirror]) {
        var panelNumbers = this.PANEL_NUMBERS[mirror][panelType]
        var panelGeometry = this.PANEL_GEOMETRY[panelType]

        for (var i = 0; i < panelNumbers.length; i++) {
          var panelNumber = panelNumbers[i]
          this.positions[mirror].Panel[panelNumber] = {id: null, position: panelNumber}

          // Special case for test mirror, only have 2 panels but they fit in a ring of 32
          if (mirror === "Test") {
            var theta = 2 * Math.PI * ((i + 0.5) / this.PANEL_NUMBERS['Primary']['P2'].length)
          }
          else {
            var theta = 2 * Math.PI * ((i + 0.5) / panelNumbers.length)
          }

          for (let pointType of ['vertices', 'referencePointsPanel', 'referencePointsBack']) {
            this.positions[mirror].Panel[panelNumber][pointType] = panelGeometry[pointType].map(x => this._rotatePoint(x, theta))
          }

          this.positions[mirror].Panel[panelNumber]['mpesPositions'] = {}
          for (var mpesPosition in panelGeometry['mpesPositions']) {
              if (panelGeometry['mpesPositions'].hasOwnProperty(mpesPosition)) {
                this.positions[mirror].Panel[panelNumber]['mpesPositions'][mpesPosition] = this._rotatePoint(panelGeometry['mpesPositions'][mpesPosition], theta)
              }
          }

          // Add all calculated actuator positions (these are hardcoded by position number relative to the panel
          var panelPads = this.positions[mirror].Panel[panelNumber].referencePointsPanel
          var backPads = this.positions[mirror].Panel[panelNumber].referencePointsBack
          if (!this.positions[mirror].Actuator.hasOwnProperty(panelNumber)) {
            this.positions[mirror].Actuator[panelNumber] = {}
          }
          this.positions[mirror].Actuator[panelNumber][1] = {id: null, x1: panelPads[2].x, y1: panelPads[2].y, x2: backPads[0].x, y2: backPads[0].y}
          this.positions[mirror].Actuator[panelNumber][2] = {id: null, x1: panelPads[2].x, y1: panelPads[2].y, x2: backPads[2].x, y2: backPads[2].y}
          this.positions[mirror].Actuator[panelNumber][3] = {id: null, x1: panelPads[0].x, y1: panelPads[0].y, x2: backPads[2].x, y2: backPads[2].y}
          this.positions[mirror].Actuator[panelNumber][4] = {id: null, x1: panelPads[0].x, y1: panelPads[0].y, x2: backPads[1].x, y2: backPads[1].y}
          this.positions[mirror].Actuator[panelNumber][5] = {id: null, x1: panelPads[1].x, y1: panelPads[1].y, x2: backPads[1].x, y2: backPads[1].y}
          this.positions[mirror].Actuator[panelNumber][6] = {id: null, x1: panelPads[1].x, y1: panelPads[1].y, x2: backPads[0].x, y2: backPads[0].y}

          // Add all calculated MPES positions
          if (!this.positions[mirror].MPES.hasOwnProperty(panelNumber)) {
            this.positions[mirror].MPES[panelNumber] = {}
          }
          for (var pos in this.positions[mirror].Panel[panelNumber]['mpesPositions']) {
            if (this.positions[mirror].Panel[panelNumber]['mpesPositions'].hasOwnProperty(pos)) {
                var MPESposition = this.positions[mirror].Panel[panelNumber]['mpesPositions'][pos]
                this.positions[mirror].MPES[panelNumber][pos] = {id: null, cx: MPESposition.x, cy: MPESposition.y, r: 30.0}
            }
          }

          // Calculate edge positions

          // Add the edges in each ring (i.e. P1-P1, P2-P2
          var thisPanel = parseInt(panelNumbers[i])
          var thisPanelVertices = this.positions[mirror].Panel[panelNumber]['vertices']
          var nextPanel = parseInt(panelNumbers[(i+1) % panelNumbers.length])
          var panelsInEdge = [thisPanel, nextPanel]
          panelsInEdge.sort()

          var edge = panelsInEdge[0] + "+" + panelsInEdge[1]
          // Note: the coordinates for the edge you're looking at are the last two
          var pathPoints = [{ x: thisPanelVertices[thisPanelVertices.length-2].x - 5.0,
            y: thisPanelVertices[thisPanelVertices.length-2].y - 5.0},
            { x: thisPanelVertices[thisPanelVertices.length-2].x + 5.0,
            y: thisPanelVertices[thisPanelVertices.length-2].y + 5.0},
            { x: thisPanelVertices[thisPanelVertices.length-1].x + 5.0,
            y: thisPanelVertices[thisPanelVertices.length-1].y + 5.0},
            {x: thisPanelVertices[thisPanelVertices.length-1].x - 5.0,
            y: thisPanelVertices[thisPanelVertices.length-1].y -5.0}]
          this.positions[mirror].Edge[edge] = {id: null, pathPoints: pathPoints }

          // Now add the additional intra-ring edges (P1-P2, S1-S2)
          if (panelType === "P1" || panelType === "S1") {

            if (panelType === "P1") {
                var neighborPanelType = "P2"
            }
            else if (panelType === "S1") {
                var neighborPanelType = "S2"
            }

            // Hardcoded get of the corresponding P2 panels
            panelsInEdge = [this.PANEL_NUMBERS[mirror][neighborPanelType][i*2], this.PANEL_NUMBERS[mirror][neighborPanelType][i*2 - 1], thisPanel]
            panelsInEdge.sort()

            edge = panelsInEdge[0] + "+" + panelsInEdge[1] + "+" + panelsInEdge[2]

            pathPoints = [
              {'x': thisPanelVertices[1].x + 5.0, 'y': thisPanelVertices[1].y + 5.0},
              {'x': thisPanelVertices[2].x + 5.0, 'y': thisPanelVertices[2].y + 5.0},
              {'x': thisPanelVertices[3].x + 5.0, 'y': thisPanelVertices[3].y + 5.0},
              {'x': thisPanelVertices[3].x - 5.0, 'y': thisPanelVertices[3].y - 5.0},
              {'x': thisPanelVertices[2].x - 5.0, 'y': thisPanelVertices[2].y - 5.0},
              {'x': thisPanelVertices[1].x - 5.0, 'y': thisPanelVertices[1].y - 5.0}
            ];

            this.positions[mirror].Edge[edge] = {id: null, pathPoints: pathPoints }
          }
        }
      }
    }

    console.log(this.positions)
  }

  // Associate each object's position with a unique ID
  // This will allow new data to be easily bound to the correct objects
  // This should be done infrequently (ideally only once at startup/first connection).
  matchDevices (data) {
    for (var panelId in data.Panel) {
        var panelData = data.Panel[panelId]
        var panelNumber = panelData.position
        var mirror = ""
        if (panelNumber.toString().charAt(0) === "1") {
            mirror = "Primary"
        }
        else if (panelNumber.toString().charAt(0) === "2") {
            mirror = "Secondary"
        }
        else if (panelNumber.toString().charAt(0) === "3") {
            mirror = "Test"
        }
        if (!(mirror in this.allObjects)) {
           this.allObjects[mirror] = {
                Panel: [],
                Edge: [],
                MPES: [],
                Actuator: []
           }
        }

        if (panelNumber in this.positions[mirror].Panel) { // Find the matching panel position object
            var panelObject = {}
            Object.assign(panelObject, this.positions[mirror].Panel[panelNumber], panelData)
            this.allObjects[mirror]["Panel"].push(panelObject)
            delete this.positions[mirror].Panel[panelNumber] // delete any that we successfully found
        }

        // Search for MPES children and match them by position number
        for (var mpesId in panelData.children.MPES) {
            var mpesData = data.MPES[mpesId]
            var mpesPosition = mpesData.position
            if (mpesPosition in this.positions[mirror].MPES[panelNumber]) { // Find the matching mpes position object
                var mpesObject = {}
                Object.assign(mpesObject, this.positions[mirror].MPES[panelNumber][mpesPosition], mpesData);
                this.allObjects[mirror]["MPES"].push(mpesObject)
                delete this.positions[mirror].MPES[panelNumber][mpesPosition] // delete any that we successfully found
            }
        }

        // Search for Actuator children and match them
        for (var actuatorId in panelData.children.Actuator) {
            var actuatorData = data.Actuator[actuatorId]
            var actuatorPosition = actuatorData.position
            if (actuatorPosition in this.positions[mirror].Actuator[panelNumber]) { // Find the matching mpes position object
                var actuatorObject = {}
                Object.assign(actuatorObject, this.positions[mirror].Actuator[panelNumber][actuatorPosition], actuatorData);
                this.allObjects[mirror]["Actuator"].push(actuatorObject)
                delete this.positions[mirror].Actuator[panelNumber][actuatorPosition] // delete any that we successfully found
            }
        }
    }
     // Match edges by name
     for (var edgeId in data.Edge) {
        var edgeData = data.Edge[edgeId]
        var edgePosition = edgeData.name.split('_')[1]
        if (edgePosition in this.positions[mirror].Edge) { // Find the matching edge position object
            var edgeObject = {}
            Object.assign(edgeObject, this.positions[mirror].Edge[edgePosition], edgeData);
            this.allObjects[mirror]["Edge"].push(edgeObject)
            delete this.positions[mirror].Edge[edgePosition] // delete any that we successfully found
         }
     }

     // Add all remaining objects that weren't matched
     for (var i = 0; i < this._allMirrors.length; i++) {
        var mirror = this._allMirrors[i]
        for (var deviceType in Object.keys(this.positions[mirror])) {
            if (deviceType === "Edge") {
                for (var edgePosition in Object.keys(this.positions[mirror].Edge)) {
                    var edgeObject = {}
                    Object.assign(edgeObject, this.positions[mirror].Edge[edgePosition], {id: null});
                    this.allObjects[mirror]["Edge"].push(edgeObject)
                }
            }
            else if (deviceType === "Panel") {
                for (var panelPosition in Object.keys(this.positions[mirror].Panel)) {
                    var panelObject = {}
                    Object.assign(panelObject, this.positions[mirror].Panel[panelPosition], {id: null});
                    this.allObjects[mirror]["Panel"].push(panelObject)
                }
            }
            else if (deviceType === "MPES") {
                for (var panelPosition in Object.keys(this.positions[mirror].MPES)) {
                    for (var mpesPosition in Object.keys(this.positions[mirror].MPES[panelPosition])) {
                        var mpesObject = {}
                        Object.assign(mpesObject, this.positions[mirror].MPES[panelPosition][mpesPosition], {id: null});
                        this.allObjects[mirror]["MPES"].push(mpesObject)
                    }
                }
            }
            else if (deviceType === "Actuator") {
                for (var panelPosition in Object.keys(this.positions[mirror].Actuator)) {
                    for (var actuatorPosition in Object.keys(this.positions[mirror].Actuator[panelPosition])) {
                        var actuatorObject = {}
                        Object.assign(actuatorObject, this.positions[mirror].Actuator[panelPosition][actuatorPosition], {id: null});
                        this.allObjects[mirror]["Actuator"].push(actuatorObject)
                    }
                }
            }
        }
     }
     console.log(this.allObjects)
  }

  // Setting data
  updateAllData (data) {
    if (!this.initialized) {
        console.log(data)
        this.matchDevices(data)
        this.currentObjects = this.allObjects[this.mirror]
        this.computeXYScales()
        this.computeColorScales()
        this.renderSVG()
        this.initialized = true
        this.loading = false
    }
    else {
        this.currentObjects = this.allObjects[this.mirror]
        this.updateSVG(data)
    }
    this.renderColorLegends()
  }

  // Custom D3.js scales

  computeXYScales () {
    console.log(this.currentObjects)
    var min_x = d3.min(this.currentObjects.Panel, function (d) { return d3.min(d.vertices, function (e) { return e.x }) })
    var max_x = d3.max(this.currentObjects.Panel, function (d) { return d3.max(d.vertices, function (e) { return e.x }) })

    var min_y = d3.min(this.currentObjects.Panel, function (d) { return d3.min(d.vertices, function (e) { return e.y }) })
    var max_y = d3.max(this.currentObjects.Panel, function (d) { return d3.max(d.vertices, function (e) { return e.y }) })

    this.xScale = d3.scaleLinear()
      .domain([min_x, max_x])
      .range([this.SVG_WIDTH * 0.2, this.SVG_WIDTH * 0.8])

    this.yScale = d3.scaleLinear()
      .domain([min_y, max_y])
      .range([this.SVG_HEIGHT * 0.2, this.SVG_HEIGHT * 0.8])
  }

  computeColorScales () {
    this.temperatureColorScale = d3.scaleSequential(d3.interpolateRdYlBu)
      .domain([15.0, 35.0])

    this.alignmentColorScale = d3.scaleSequential(d3.interpolateRdYlGn)
      .domain([60.0, 0.0])
  }

  // Tooltip
  updateTooltip (d, i, group) {
    this.tooltipDiv.querySelector('#tooltip-device-name').innerHTML = d.deviceName
    this.tooltipDiv.querySelector('#tooltip-device-info').innerHTML = this.getTooltipContent(d)
    this.tooltipDiv.for = d.id
    this.tooltipDiv.hidden = false
  }

  getTooltipContent (d) {
      if (d.id === null) {
        return 'No data'
      }
      else {
            if (this.viewMode === 'Internal Temperature') {
             switch (d.deviceType) {
                case "Panel":
                    return 'Internal Temperature: ' + d.data.InternalTemperature.toFixed(4)
                    break
                default:
                    return ''
              }
            }
            else if (this.viewMode === 'External Temperature') {
            switch (d.deviceType) {
                case "Panel":
                    return 'External Temperature: ' + d.data.ExternalTemperature.toFixed(4)
                    break
                default:
                    return ''
              }
            }
            else if (this.viewMode === 'Alignment Overview') {
              switch (d.deviceType) {
                case "MPES":
                    return 'Total Misalignment: ' + (((d.data.xCentroid - d.data.xCentroidNominal)**2 + (d.data.xCentroid - d.data.xCentroidNominal)**2)**0.5).toFixed(4)
                    break
                case "Edge":
                    var misalignment = 0.0
                    for (var mpesId in d.children.MPES) {
                        var mpesObject = this.currentObjects.MPES.find(x => x.id === mpesId)
                        misalignment += ((mpesObject.data.xCentroid - mpesObject.data.xCentroidNominal)**2 + (mpesObject.data.xCentroid - mpesObject.data.xCentroidNominal)**2)**0.5
                    }
                    return 'Total Edge Misalignment: ' + misalignment.toFixed(4)
                    break
                case "Panel":
                    var misalignment = 0.0
                    for (var mpesId in d.children.MPES) {
                        var mpesObject = this.currentObjects.MPES.find(x => x.id === mpesId)
                        misalignment += ((mpesObject.data.xCentroid - mpesObject.data.xCentroidNominal)**2 + (mpesObject.data.xCentroid - mpesObject.data.xCentroidNominal)**2)**0.5
                    }
                    return 'Total Panel Misalignment: ' + misalignment.toFixed(4)
                    break
                default:
                    return ''
              }
            }
            else {
              return ''
            }
      }
  }

  // Fill
  getFill (d, i, group) {
    if (d.id === null) {
      return 'gray'
    }
    else {
        if (this.viewMode === 'Internal Temperature') {
         switch (d.deviceType) {
            case "Panel":
                return this.temperatureColorScale(d.InternalTemperature)
                break
            default:
                return ''
          }
        }
        else if (this.viewMode === 'External Temperature') {
        switch (d.deviceType) {
            case "Panel":
                return this.temperatureColorScale(d.ExternalTemperature)
                break
            default:
                return ''
          }
        }
        else if (this.viewMode === 'Alignment Overview') {
          switch (d.deviceType) {
            case "MPES":
                var misalignment = (((d.data.xCentroid - d.data.xCentroidNominal)**2 + (d.data.xCentroid - d.data.xCentroidNominal)**2)**0.5)
                return this.mpesAlignmentColorScale(misalignment)
                break
            case "Edge":
                var numMPES = 0
                var misalignment = 0.0
                for (var mpesId in d.children.MPES) {
                    var mpesObject = this.currentObjects.MPES.find(x => x.id === mpesId)
                    misalignment += ((mpesObject.data.xCentroid - mpesObject.data.xCentroidNominal)**2 + (mpesObject.data.xCentroid - mpesObject.data.xCentroidNominal)**2)**0.5
                    numMPES += 1
                }
                return this.edgeAlignmentColorScale(misalignment/numMPES)
                break
            case "Panel":
                var numMPES = 0
                var misalignment = 0.0
                for (var mpesId in d.children.MPES) {
                    var mpesObject = this.currentObjects.MPES.find(x => x.id === mpesId)
                    misalignment += ((mpesObject.data.xCentroid - mpesObject.data.xCentroidNominal)**2 + (mpesObject.data.xCentroid - mpesObject.data.xCentroidNominal)**2)**0.5
                    numMPES += 1
                }
                return this.panelAlignmentColorScale(misalignment/numMPES)
                break
            default:
                return 'white'
          }
        }
        else {
          return 'white'
        }
    }
  }

  getOpacity (d, i, group) {
    if (d.id === null) {
      return '0.3'
    } else {
      return '0.9'
    }
  }

  // Render methods (to be called after DOM update)
  // Should be used to render SVG objects for the first time
  renderSVG (data) {
    var svg = this.shadowRoot.querySelector('.mirror-svg')
    // Clear previous contents
    d3.select(svg).selectAll('*').remove()

    // Render all panel objects
    this.panelObjects = d3.select(svg).selectAll('.Panel')
      .data(this.currentObjects.Panel, function (d) { return d.id })
      .enter()
      .append('polygon')
      .attr('class', 'Panel')
      .attr('id', d => { return d.id })
      .attr('points', d => {
        return d.vertices.map(
          e => {
            return [this.xScale(e.x), this.yScale(e.y)].join(',')
          }
        ).join(' ')
      })
      .style('fill', this.getFill.bind(this))
      .style('fill-opacity', this.getOpacity.bind(this))
      .style('stroke', 'black')
      .style('stroke-width', 0.1)
      .attr('pointer-events', 'all')
      .on('click', (d, i, group) => {
        this._onClickDevice(d)
      })
      .on('mouseover', function (d, i, group) {
        d3.select(group[i])
          .style('stroke-width', 0.6)
          .style('stroke', 'blue')
        this.updateTooltip(d, i, group)
      }.bind(this))
      .on('mouseout', function (d, i, group) {
        d3.select(group[i])
          .style('stroke-width', 0.1)
          .style('stroke', 'black')
      }.bind(this))

    var line = d3.svg.line()
         .x(function(d) { return this.xScale(d['x']); })
         .y(function(d) { return this.yScale(d['y']); });

    // Render all edge objects
    this.edgeObjects = d3.select(svg).selectAll('.Edge')
      .data(this.currentObjects.Edge, function (d) { return d.id })
      .enter()
      .append('path')
      .attr('class', 'Edge')
      .attr('id', d => { return d.id })
      .attr('d', line(d.pathPoints))
      .style('fill', this.getFill.bind(this))
      .style('fill-opacity', this.getOpacity.bind(this))
      .style('stroke', 'black')
      .style('stroke-width', 0.1)
      .attr('pointer-events', 'all')
      .on('click', (d, i, group) => {
        this._onClickDevice(d)
      })
      .on('mouseover', function (d, i, group) {
         d3.select(group[i])
          .style('stroke-width', 0.6)
          .style('stroke', 'blue')
        this.updateTooltip(d, i, group)
      }.bind(this))
      .on('mouseout', function (d, i, group) {
         d3.select(group[i])
          .style('stroke-width', 0.1)
          .style('stroke', 'black')
      }.bind(this))

    // Render all MPES objects
    this.mpesObjects = d3.select(svg).selectAll('.MPES')
      .data(this.currentObjects.MPES, function (d) { return d.id })
      .enter()
      .append('circle')
      .attr('class', 'MPES')
      .attr('id', d => { return d.id })
      .attr("cx", function (d) { return this.xScale(d.cx); })
      .attr("cy", function (d) { return this.yScale(d.cy); })
      .attr("r", function (d) { return this.xScale(d.r); })
      .style('fill', this.getFill.bind(this))
      .style('fill-opacity', this.getOpacity.bind(this))
      .style('stroke', 'black')
      .style('stroke-width', 0.1)
      .attr('pointer-events', 'all')
      .on('click', (d, i, group) => {
        this._onClickDevice(d)
      })
      .on('mouseover', function (d, i, group) {
         d3.select(group[i])
          .style('stroke-width', 0.6)
          .style('stroke', 'blue')
        this.updateTooltip(d, i, group)
      }.bind(this))
      .on('mouseout', function (d, i, group) {
        d3.select(group[i])
          .style('stroke-width', 0.1)
          .style('stroke', 'black')
      }.bind(this))

    // Render all Actuator objects
    this.actuatorObjects = d3.select(svg).selectAll('.Actuator')
      .data(this.currentObjects.Actuator, function (d) { return d.id })
      .enter()
      .append('path')
      .attr('class', 'Actuator')
      .attr('id', d => { return d.id })
      .attr('d', line(d.pathPoints))
      .style('fill', this.getFill.bind(this))
      .style('fill-opacity', this.getOpacity.bind(this))
      .style('stroke', 'black')
      .style('stroke-width', 0.1)
      .attr('pointer-events', 'all')
      .on('click', (d, i, group) => {
        this._onClickDevice(d)
      })
      .on('mouseover', function (d, i, group) {
        d3.select(group[i])
          .style('stroke-width', 0.6)
          .style('stroke', 'blue')
        this.updateTooltip(d, i, group)
      }.bind(this))
      .on('mouseout', function (d, i, group) {
        d3.select(group[i])
          .style('stroke-width', 0.1)
          .style('stroke', 'black')
      }.bind(this))
  }

  _linspace (start, end, n) {
    var out = []
    var delta = (end - start) / (n - 1)

    var i = 0
    while (i < (n - 1)) {
      out.push(start + (i * delta))
      i++
    }

    out.push(end)
    return out
  }

  renderColorLegends () {
    var svg = this.shadowRoot.querySelector('.legend-svg') // get SVG container for legend objects
    d3.select(svg).selectAll('*').remove() // Clear existing contents

    if (this.viewMode !== '') {
      var w = this.LEGEND_WIDTH * 0.2
      var h = this.LEGEND_HEIGHT * 0.8

      var colorLegendObject = d3.select(svg)
        .attr('width', w)
        .attr('height', h)
        .append('g')
        .attr('transform', 'translate(' + this.LEGEND_WIDTH * 0.1 + ',' + this.LEGEND_HEIGHT * 0.1 + ')')

      if ((this.viewMode === 'Internal Temperature') || (this.viewMode === 'External Temperature')) {
          var colorScale = d3.schemeRdYlBu[10].slice().reverse()
          var scale = this.temperatureColorScale
      }
      else if (this.viewMode === 'Overall Alignment') {
          var colorScale = d3.schemeRdYlGn[10].slice().reverse()
          var scale = this.alignmentColorScale
      }

      var gradient = colorLegendObject.append('defs')
        .append('linearGradient')
        .attr('id', 'gradient')
        .attr('x1', '0%') // bottom
        .attr('y1', '100%')
        .attr('x2', '0%') // to top
        .attr('y2', '0%')
        .attr('spreadMethod', 'pad')

      var pct = this._linspace(0, 100, colorScale.length).map(function (d) {
        return Math.round(d) + '%'
      })

      var colourPct = d3.zip(pct, colorScale)

      colourPct.forEach(function (d) {
        gradient.append('stop')
          .attr('offset', d[0])
          .attr('stop-color', d[1])
          .attr('stop-opacity', 1)
      })

      colorLegendObject.append('rect')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('width', w)
        .attr('height', h)
        .style('fill', 'url(#gradient)')

      // create a scale and axis for the legend
      var colorLegendScale = d3.scaleLinear()
        .domain([scale.domain()[0], scale.domain()[1]])
        .range([h, 0])

      var colorLegendAxis = d3.axisRight(colorLegendScale)
        .tickValues(d3.range(scale.domain()[0], scale.domain()[1], (scale.domain()[1] - scale.domain()[0]) / 20))
        .tickFormat(d3.format('.2f'))

      colorLegendObject.append('g')
        .attr('class', 'legend axis')
        .attr('transform', 'translate(' + w + ', 0)')
        .call(colorLegendAxis)
    }
  }

  // Bind updated data to the existing objects (note: will not re-render or create/remove any objects)
  updateSVG (data) {
    for (var deviceType in this.currentObjects) {
        var newData = Array.from( data[deviceType].values() )
        this.currentObjects[deviceType]
          .data(newData, function (d, i) { return d.id })
          .transition()
          .duration(100)
          .style('fill', this.getFill.bind(this))
          .style('fill-opacity', this.getOpacity.bind(this))
    }
  }

  // Lit Element lifecycle methods)

  firstUpdated (changedProps) {
    this.tooltipDiv = this.shadowRoot.querySelector('#tooltip')
  }

  updated (changedProps) {
    this.updateSVGSize()
  }

  updateSVGSize () {
    this.SVG_WIDTH = this.shadowRoot.querySelector('.mirror-svg').scrollWidth
    this.SVG_HEIGHT = this.SVG_WIDTH

    this.shadowRoot.querySelector('.mirror-svg').style.height = this.SVG_HEIGHT + 'px'

    var svg = this.shadowRoot.querySelector('.mirror-svg')
    d3.select(svg).attr('viewBox', '0 0 ' + this.SVG_WIDTH + ' ' + this.SVG_HEIGHT)

    this.LEGEND_WIDTH = this.shadowRoot.querySelector('.legend-svg').scrollWidth
    this.LEGEND_HEIGHT = this.SVG_HEIGHT

    this.shadowRoot.querySelector('.legend-svg').style.height = this.LEGEND_HEIGHT + 'px'
  }

  // Event Handlers

  _changeViewMode (e) {
    this.viewMode = e.detail.value
    this.refresh()
  }

  _changeMirror (e) {
    this.mirror = e.detail.value
    this.refresh()
  }

  _onClickDevice (data) {
    var event = new CustomEvent('changed-selected-device', { detail: data.id })
    this.dispatchEvent(event)
  }

  refresh () {
    this.socketioClient.requestData('types', ['Panel', 'Edge', 'MPES', 'Actuator'])
    //this.socketioClient.requestData('types', ['Panel', 'MPES', 'Actuator'])
    //this.socketioClient.requestData('types', ['Actuator'])
  }
}

window.customElements.define('mirror-widget', MirrorWidget)
