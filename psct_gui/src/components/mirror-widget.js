import { html } from '@polymer/lit-element'

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

class MirrorWidget extends WidgetCard {
  constructor () {
    super()
    this.name = 'Mirror View'

    this.SVG_WIDTH = 0
    this.SVG_HEIGHT = 0

    this.initialized = false
    this.socketioClient = new BaseSocketioDeviceClient('http://localhost:5000', this)
    this.socketioClient.connect()

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
          1: { x: 2388.01882, y: 475.00644 },
          2: { x: 3098.00818, y: 616.23216 },
          3: { x: 3356.44796667, y: 442.204933334 },
          4: { x: 3378.22463333, y: -221.102466667 },
          5: { x: 2743.0135, y: -545.6193 }
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
          1: { x: 4096.1188, y: -403.4325 },
          2: { x: 3383.6294, y: -111.086133333 },
          3: { x: 3526.12728, y: 347.29322 },
          4: { x: 4666.11032, y: 459.57178 }
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
          1: { x: 586.6604, y: -243.0027 },
          2: { x: 1252.8878, y: -518.9631 },
          3: { x: 1515.4721, y: -407.29993 },
          4: { x: 1555.9806, y: 203.64996 },
          5: { x: 919.7741, y: 380.9829 }
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
          1: { x: 2110.96655, y: 419.89735 },
          2: { x: 1565.8130, y: 103.81986 },
          3: { x: 2438.05868, y: -484.9600 },
          4: { x: 1783.87442, y: -354.8347 }
        }
      }
    }

    this.positions = {}

    this.currentObjectData = {}
    this.svgObjects = {}

    this.xScale = null
    this.yScale = null

    this.dataRequest = {
      component_name: this.name,
      fields: {
        All: {
          data: ['State']
        }
      },
      device_ids: 'Primary'
    }

    // One-time computation of hardcoded mirror geometry
    this.mirror = 'Primary'
    this._allMirrors = ['Primary', 'Secondary', 'Test']

    this.viewMode = 'Error State'
    this._allViewModes = ['', 'Device State', 'Error State', 'Internal Temperature', 'External Temperature', 'Alignment Overview', 'Actuator Lengths', 'Z Displacement', 'MPES Exposure', 'MPES Intensity']
    this._viewModeFields = {
      '': {
        All: {
          data: ['State']
        }
      },
      'Device State': {
        All: {
          data: ['State']
        }
      },
      'Error State': {
        All: {
          data: ['ErrorState']
        }
      },
      'Internal Temperature': {
        Panel: {
          data: ['InternalTemperature']
        }
      },
      'External Temperature': {
        Panel: {
          data: ['ExternalTemperature']
        }
      },
      'Alignment Overview': {
        MPES: {
          data: ['xCentroidAvg', 'yCentroidAvg', 'xCentroidNominal', 'yCentroidNominal']
        }
      },
      'Actuator Lengths': {
        Actuator: {
          data: ['CurrentLength']
        }
      },
      'Z Displacement': {
        Panel: {
          data: ['z']
        }
      },
      'MPES Exposure': {
        MPES: {
          data: ['Exposure']
        }
      },
      'MPES Intensity': {
        MPES: {
          data: ['CleanedIntensity']
        }
      }
    }
    this.computeMirrorGeometry()
    this.loading = false

    this.socketioClient.requestData(this.dataRequest)
  }

  static get properties () {
    return {
      name: { type: String },
      mirror: { type: String },
      viewMode: { type: String }
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
    <paper-tooltip id="tooltip">
      <div class="paper-font-body1" id="tooltip-device-name">${this.tooltipTarget}</div>
      <div class="paper-font-body1" id="tooltip-device-info">${this.tooltipContent}</div>
    </paper-tooltip>
    </div>
    `
  }

  get actionsTemplate () {
    return html`
    <paper-button raised id="mirror-info-button" @click="${this._selectMirror}">Mirror Info</paper-button>
    <paper-radio-group selected="${this.mirror}" @selected-changed= "${this._changeMirror}" allow-empty-selection>
      ${this._allMirrors.map(i => html`<paper-radio-button name="${i}">${i}</paper-radio-button>`)}
    </paper-radio-group>
    `
  }

  // Geometric computations (positions)
  static _rotatePoint (point, theta) {
    const x = point.x
    const y = point.y

    const rotX = Math.cos(theta) * x - Math.sin(theta) * y
    const rotY = Math.sin(theta) * x + Math.cos(theta) * y

    return { x: rotX, y: rotY }
  }

  static _getAngle (point1, point2) {
    const length1 = (point1.x ** 2 + point1.y ** 2) ** 0.5
    const length2 = (point2.x ** 2 + point2.y ** 2) ** 0.5

    const innerProduct = (point1.x * point2.x) + (point1.y * point2.y)
    return Math.acos(innerProduct / (length1 * length2))
  }

  // One-time calculation of positions of all objects in diagram
  computeMirrorGeometry () {
    const EDGE_THICKNESS = 20.0
    const ACTUATOR_THICKNESS = 20.0
    const MPES_RADIUS = 30.0

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
      for (let panelType in this.PANEL_NUMBERS[mirror]) {
        if (this.PANEL_NUMBERS[mirror].hasOwnProperty(panelType)) {
          let panelNumbers = this.PANEL_NUMBERS[mirror][panelType]
          let panelGeometry = this.PANEL_GEOMETRY[panelType]

          for (let i = 0; i < panelNumbers.length; i++) {
            let panelNumber = panelNumbers[i]
            let theta
            this.positions[mirror].Panel[panelNumber] = { id: null, position: panelNumber }

            // Special case for test mirror, only have 2 panels but they fit in a ring of 32
            if (mirror === 'Test') {
              theta = 2 * Math.PI * ((i + 0.5) / this.PANEL_NUMBERS['Primary']['P2'].length)
            } else {
              theta = 2 * Math.PI * ((i + 0.5) / panelNumbers.length)
            }

            for (let pointType of ['vertices', 'referencePointsPanel', 'referencePointsBack']) {
              this.positions[mirror].Panel[panelNumber][pointType] = panelGeometry[pointType].map(x => MirrorWidget._rotatePoint(x, theta))
            }

            this.positions[mirror].Panel[panelNumber]['mpesPositions'] = {}
            for (let mpesPosition in panelGeometry['mpesPositions']) {
              if (panelGeometry['mpesPositions'].hasOwnProperty(mpesPosition)) {
                this.positions[mirror].Panel[panelNumber]['mpesPositions'][mpesPosition] = MirrorWidget._rotatePoint(panelGeometry['mpesPositions'][mpesPosition], theta)
              }
            }

            if (!this.positions[mirror].Actuator.hasOwnProperty(panelNumber)) {
              this.positions[mirror].Actuator[panelNumber] = {}
            }

            // Add all calculated actuator positions (these are hardcoded by position number relative to the panel
            let panelPads = this.positions[mirror].Panel[panelNumber].referencePointsPanel
            let backPads = this.positions[mirror].Panel[panelNumber].referencePointsBack

            let actuatorVertices = [
              [panelPads[2], backPads[0]],
              [panelPads[2], backPads[2]],
              [panelPads[0], backPads[2]],
              [panelPads[0], backPads[1]],
              [panelPads[1], backPads[1]],
              [panelPads[1], backPads[0]]
            ]

            for (let i = 0; i < actuatorVertices.length; i++) {
              let vertex1 = actuatorVertices[i][0]
              let vertex2 = actuatorVertices[i][1]

              let length = ((vertex2.x - vertex1.x) ** 2 + (vertex2.y - vertex1.y) ** 2) ** 0.5

              // Get a vector of correct length along the parallel direction
              let parallelVector = { x: (vertex2.x - vertex1.x) / length * ACTUATOR_THICKNESS, y: (vertex2.y - vertex1.y) / length * ACTUATOR_THICKNESS }

              // Rotate it 90 degrees
              let perpendicularVector = MirrorWidget._rotatePoint(parallelVector, 2 * Math.PI / 4)

              this.positions[mirror].Actuator[panelNumber][i + 1] = {
                id: null,
                pathPoints: [{
                  x: vertex1.x - perpendicularVector.x,
                  y: vertex1.y - perpendicularVector.y
                },
                {
                  x: vertex1.x + perpendicularVector.x,
                  y: vertex1.y + perpendicularVector.y
                },
                {
                  x: vertex2.x + perpendicularVector.x,
                  y: vertex2.y + perpendicularVector.y
                },
                {
                  x: vertex2.x - perpendicularVector.x,
                  y: vertex2.y - perpendicularVector.y
                },
                {
                  x: vertex1.x - perpendicularVector.x,
                  y: vertex1.y - perpendicularVector.y
                }]
              }
            }

            // Add all calculated MPES positions
            if (!this.positions[mirror].MPES.hasOwnProperty(panelNumber)) {
              this.positions[mirror].MPES[panelNumber] = {}
            }
            for (let pos in this.positions[mirror].Panel[panelNumber]['mpesPositions']) {
              if (this.positions[mirror].Panel[panelNumber]['mpesPositions'].hasOwnProperty(pos)) {
                const MPESposition = this.positions[mirror].Panel[panelNumber]['mpesPositions'][pos]
                this.positions[mirror].MPES[panelNumber][pos] = {
                  id: null,
                  cx: MPESposition.x,
                  cy: MPESposition.y,
                  r: MPES_RADIUS
                }
              }
            }

            // Calculate edge positions

            // Add the edges in each ring (i.e. P1-P1, P2-P2)
            const thisPanel = parseInt(panelNumbers[i])
            let thisPanelVertices = this.positions[mirror].Panel[panelNumber]['vertices']
            const nextPanel = parseInt(panelNumbers[(i + 1) % panelNumbers.length])
            let panelsInEdge = [thisPanel, nextPanel]
            panelsInEdge.sort()

            let edge = panelsInEdge[0] + '+' + panelsInEdge[1]
            // Note: the coordinates for the edge you're looking at are the last two
            let vertex1 = thisPanelVertices[thisPanelVertices.length - 2]
            let vertex2 = thisPanelVertices[thisPanelVertices.length - 1]

            let length = ((vertex2.x - vertex1.x) ** 2 + (vertex2.y - vertex1.y) ** 2) ** 0.5

            // Get a vector of correct length along the parallel direction
            let parallelVector = { x: (vertex2.x - vertex1.x) / length * EDGE_THICKNESS, y: (vertex2.y - vertex1.y) / length * EDGE_THICKNESS }

            // Rotate it 90 degrees
            let perpendicularVector = MirrorWidget._rotatePoint(parallelVector, 2 * Math.PI / 4)

            let pathPoints = [{
              x: vertex1.x - perpendicularVector.x,
              y: vertex1.y - perpendicularVector.y
            },
            {
              x: vertex1.x + perpendicularVector.x,
              y: vertex1.y + perpendicularVector.y
            },
            {
              x: vertex2.x + perpendicularVector.x,
              y: vertex2.y + perpendicularVector.y
            },
            {
              x: vertex2.x - perpendicularVector.x,
              y: vertex2.y - perpendicularVector.y
            },
            {
              x: vertex1.x - perpendicularVector.x,
              y: vertex1.y - perpendicularVector.y
            }]
            this.positions[mirror].Edge[edge] = { id: null, pathPoints: pathPoints }

            // Now add the additional intra-ring edges (P1-P2, S1-S2)
            if (panelType === 'P1' || panelType === 'S1') {
              let neighborPanelType
              if (panelType === 'P1') {
                neighborPanelType = 'P2'
              } else if (panelType === 'S1') {
                neighborPanelType = 'S2'
              }

              // Hardcoded get of the corresponding outer ring panels
              panelsInEdge = [this.PANEL_NUMBERS[mirror][neighborPanelType][i * 2], this.PANEL_NUMBERS[mirror][neighborPanelType][i * 2 + 1], thisPanel]
              panelsInEdge.sort()

              edge = panelsInEdge[0] + '+' + panelsInEdge[1] + '+' + panelsInEdge[2]

              let vertex1 = thisPanelVertices[1]
              let vertex2 = thisPanelVertices[2]
              let vertex3 = thisPanelVertices[3]

              let length = ((vertex2.x - vertex1.x) ** 2 + (vertex2.y - vertex1.y) ** 2) ** 0.5

              // Get a vector of correct length along the parallel direction
              let parallelVector12 = { x: (vertex2.x - vertex1.x) / length * EDGE_THICKNESS, y: (vertex2.y - vertex1.y) / length * EDGE_THICKNESS }
              let parallelVector23 = { x: (vertex3.x - vertex2.x) / length * EDGE_THICKNESS, y: (vertex3.y - vertex2.y) / length * EDGE_THICKNESS }

              // Rotate it 90 degrees
              let perpendicularVector1 = MirrorWidget._rotatePoint(parallelVector12, 2 * Math.PI / 4)
              let perpendicularVector3 = MirrorWidget._rotatePoint(parallelVector23, 2 * Math.PI / 4)

              let angle = MirrorWidget._getAngle(perpendicularVector1, perpendicularVector3)

              let perpendicularVector2 = MirrorWidget._rotatePoint(perpendicularVector1, angle / 2)

              pathPoints = [
                { 'x': vertex1.x + perpendicularVector1.x, 'y': vertex1.y + perpendicularVector1.y },
                { 'x': vertex2.x + perpendicularVector2.x, 'y': vertex2.y + perpendicularVector2.y },
                { 'x': vertex3.x + perpendicularVector3.x, 'y': vertex3.y + perpendicularVector3.y },
                { 'x': vertex3.x - perpendicularVector3.x, 'y': vertex3.y - perpendicularVector3.y },
                { 'x': vertex2.x - perpendicularVector2.x, 'y': vertex2.y - perpendicularVector2.y },
                { 'x': vertex1.x - perpendicularVector1.x, 'y': vertex1.y - perpendicularVector1.y },
                { 'x': vertex1.x + perpendicularVector1.x, 'y': vertex1.y + perpendicularVector1.y }
              ]

              this.positions[mirror].Edge[edge] = { id: null, pathPoints: pathPoints }
            }
          }
        }
      }
    }
  }

  // Associate each object's position with a unique ID
  // This will allow new data to be easily bound to the correct objects
  // This should be done infrequently (ideally only once at startup/first connection).
  matchDevices (data) {
    this.currentObjectData = {
      Mirror: null,
      Panel: [],
      Edge: [],
      MPES: [],
      Actuator: []
    }

    this.currentObjectData['Mirror'] = data.Mirror[Object.keys(data.Mirror)[0]]
    let mirror
    if (this.currentObjectData['Mirror'].position === '1') {
      mirror = 'Primary'
    } else if (this.currentObjectData['Mirror'].position === '2') {
      mirror = 'Secondary'
    } else if (this.currentObjectData['Mirror'].position === '3') {
      mirror = 'Test'
    } else {
      console.log(this.currentObjectData['Mirror'])
    }

    for (let panelId in data.Panel) {
      if (data.Panel.hasOwnProperty(panelId)) {
        const panelData = data.Panel[panelId]
        const panelNumber = panelData.position

        if (panelNumber in this.positions[mirror].Panel) { // Find the matching panel position object
          const panelObject = {}
          Object.assign(panelObject, this.positions[mirror].Panel[panelNumber], panelData)
          this.currentObjectData['Panel'].push(panelObject)
        }

        // Search for MPES children and match them by position number
        for (let i = 0; i < panelData.children.MPES.length; i++) {
          const mpesData = data.MPES[panelData.children.MPES[i]]
          const mpesPosition = mpesData.position
          if (mpesPosition in this.positions[mirror].MPES[panelNumber]) { // Find the matching mpes position object
            const mpesObject = {}
            Object.assign(mpesObject, this.positions[mirror].MPES[panelNumber][mpesPosition], mpesData)
            this.currentObjectData['MPES'].push(mpesObject)
          }
        }

        // Search for Actuator children and match them
        for (let i = 0; i < panelData.children.Actuator.length; i++) {
          const actuatorData = data.Actuator[panelData.children.Actuator[i]]
          const actuatorPosition = actuatorData.position
          if (actuatorPosition in this.positions[mirror].Actuator[panelNumber]) { // Find the matching mpes position object
            const actuatorObject = {}
            Object.assign(actuatorObject, this.positions[mirror].Actuator[panelNumber][actuatorPosition], actuatorData)
            this.currentObjectData['Actuator'].push(actuatorObject)
          }
        }
      }
    }
    // Match edges by name
    for (let edgeId in data.Edge) {
      if (data.Edge.hasOwnProperty(edgeId)) {
        const edgeData = data.Edge[edgeId]
        const edgePosition = edgeData.deviceName.split(' ')[1]
        if (edgePosition in this.positions[mirror].Edge) { // Find the matching edge position object
          const edgeObject = {}
          Object.assign(edgeObject, this.positions[mirror].Edge[edgePosition], edgeData)
          this.currentObjectData['Edge'].push(edgeObject)
        }
      }
    }

    // Add all remaining objects that weren't matched
    for (let i = 0; i < this._allMirrors.length; i++) {
      const mirror = this._allMirrors[i]
      for (let deviceType in Object.keys(this.positions[mirror])) {
        if (deviceType === 'Edge') {
          for (let edgePosition in Object.keys(this.positions[mirror].Edge)) {
            const edgeObject = {}
            Object.assign(edgeObject, this.positions[mirror].Edge[edgePosition], { id: null })
            this.currentObjectData['Edge'].push(edgeObject)
          }
        } else if (deviceType === 'Panel') {
          for (let panelPosition in Object.keys(this.positions[mirror].Panel)) {
            const panelObject = {}
            Object.assign(panelObject, this.positions[mirror].Panel[panelPosition], { id: null })
            this.currentObjectData['Panel'].push(panelObject)
          }
        } else if (deviceType === 'MPES') {
          for (let panelPosition in Object.keys(this.positions[mirror].MPES)) {
            for (let mpesPosition in Object.keys(this.positions[mirror].MPES[panelPosition])) {
              const mpesObject = {}
              Object.assign(mpesObject, this.positions[mirror].MPES[panelPosition][mpesPosition], { id: null })
              this.currentObjectData['MPES'].push(mpesObject)
            }
          }
        } else if (deviceType === 'Actuator') {
          for (let panelPosition in Object.keys(this.positions[mirror].Actuator)) {
            for (let actuatorPosition in Object.keys(this.positions[mirror].Actuator[panelPosition])) {
              const actuatorObject = {}
              Object.assign(actuatorObject, this.positions[mirror].Actuator[panelPosition][actuatorPosition], { id: null })
              this.currentObjectData['Actuator'].push(actuatorObject)
            }
          }
        }
      }
    }
  }

  // Setting data
  _onRequestedData (data) {
    if (!this.initialized) {
      this.matchDevices(data)
      this.computeColorScales()
      if (this.svg.scrollWidth > 0) {
        this.updateSVGSize()
      }
      this.computeXYScales()
      this.renderSVG()
      this.initialized = true
    } else {
      if (this.svg.scrollWidth > 0) {
        this.updateSVGSize()
        this.computeXYScales()
      }
      this.updateSVG(data)
    }
    this.renderLegend()
    this.loading = false
  }

  // Custom D3.js scales

  computeXYScales () {
    console.log('Computing XY Scales...')
    const minX = d3.min(this.currentObjectData.Panel, function (d) { return d3.min(d.vertices, function (e) { return e.x }) })
    const maxX = d3.max(this.currentObjectData.Panel, function (d) { return d3.max(d.vertices, function (e) { return e.x }) })

    const minY = d3.min(this.currentObjectData.Panel, function (d) { return d3.min(d.vertices, function (e) { return e.y }) })
    const maxY = d3.max(this.currentObjectData.Panel, function (d) { return d3.max(d.vertices, function (e) { return e.y }) })

    this.xScale = d3.scaleLinear()
      .domain([minX, maxX])
      .range([this.SVG_WIDTH * 0.1, this.SVG_WIDTH * 0.9])

    this.yScale = d3.scaleLinear()
      .domain([minY, maxY])
      .range([this.SVG_HEIGHT * 0.1, this.SVG_HEIGHT * 0.9])

    this.rScale = d3.scaleLinear()
      .domain([0, maxX])
      .range([0, this.SVG_HEIGHT * 0.8])
  }

  computeColorScales () {
    this.temperatureColorScale = d3.scaleSequential(d3.interpolateRdYlBu)
      .domain([35.0, 15.0])

    this.alignmentColorScale = d3.scaleSequential(d3.interpolateRdYlGn)
      .domain([60.0, 0.0])

    this.zColorScale = d3.scaleSequential(d3.interpolatePuOr)
      .domain([560.0, 640.0])

    this.MPESExposureScale = d3.scaleSequential(d3.interpolateReds)
      .domain([0.0, 5000.0])

    this.MPESIntensityScale = d3.scaleSequential(d3.interpolateOranges)
      .domain([0.0, 200000.0])

    this.ActuatorLengthScale = d3.scaleSequential(d3.interpolatePuOr)
      .domain([410.0, 480.0])

    this.deviceStates = ['Off', 'On', 'Busy']

    this.deviceStateScale = d3.scaleOrdinal()
      .domain(this.deviceStates)
      .range(['#ffb3ba', '#9aff9a', '#ffffba'])

    this.errorStates = ['Nominal', 'Operable', 'Fatal']

    this.errorStateScale = d3.scaleOrdinal()
      .domain(this.errorStates)
      .range(['#9aff9a', '#ffffba', '#ffb3ba'])
  }

  // Tooltip
  updateTooltip (d) {
    this.tooltipDiv.querySelector('#tooltip-device-name').innerHTML = d.deviceName
    this.tooltipDiv.querySelector('#tooltip-device-info').innerHTML = this.getTooltipContent(d)
    this.tooltipDiv.offset = 1.0
    this.tooltipDiv.position = 'bottom'
    this.tooltipDiv.for = d.deviceName.replace(/ /g, '_')
    this.tooltipDiv.updatePosition()
    this.tooltipDiv.show()
  }

  getTooltipContent (d) {
    if (d.id === null) {
      return 'No data'
    } else {
      if (this.viewMode === 'Internal Temperature') {
        switch (d.deviceType) {
          case 'Panel':
            return 'Internal Temperature: ' + d.data.InternalTemperature.toFixed(4)
          default:
            return ''
        }
      } else if (this.viewMode === 'External Temperature') {
        switch (d.deviceType) {
          case 'Panel':
            return 'External Temperature: ' + d.data.ExternalTemperature.toFixed(4)
          default:
            return ''
        }
      } else if (this.viewMode === 'Error State') {
        return 'Error State: ' + this.errorStates[d.data.ErrorState]
      } else if (this.viewMode === 'Device State') {
        return 'Device State: ' + this.deviceStates[d.data.State]
      } else if (this.viewMode === 'Actuator Lengths') {
        switch (d.deviceType) {
          case 'Actuator':
            return 'Current Length: ' + d.data.CurrentLength.toFixed(4)
          default:
            return ''
        }
      } else if (this.viewMode === 'Z Displacement') {
        switch (d.deviceType) {
          case 'Panel':
            return 'Z displacement: ' + d.data.z.toFixed(4)
          default:
            return ''
        }
      } else if (this.viewMode === 'MPES Exposure') {
        switch (d.deviceType) {
          case 'MPES':
            return 'Exposure: ' + d.data.Exposure.toFixed(4)
          default:
            return ''
        }
      } else if (this.viewMode === 'MPES Intensity') {
        switch (d.deviceType) {
          case 'MPES':
            return 'Cleaned Intensity: ' + d.data.CleanedIntensity.toFixed(4)
          default:
            return ''
        }
      } else if (this.viewMode === 'Alignment Overview') {
        switch (d.deviceType) {
          case 'MPES':
            return 'Total Misalignment: ' + (((d.data.xCentroidAvg - d.data.xCentroidNominal) ** 2 + (d.data.xCentroidAvg - d.data.xCentroidNominal) ** 2) ** 0.5).toFixed(4)
          case 'Edge': {
            let numMPES = 0
            let misalignment = 0.0
            d.children.MPES.forEach(function (mpesId, index) {
              let mpesObject = this.currentObjectData.MPES.find(x => x.deviceID === mpesId)
              misalignment += ((mpesObject.data.xCentroidAvg - mpesObject.data.xCentroidNominal) ** 2 + (mpesObject.data.xCentroidAvg - mpesObject.data.xCentroidNominal) ** 2) ** 0.5
              numMPES += 1
            }.bind(this))
            return 'Average Edge Misalignment: ' + (misalignment / numMPES).toFixed(4)
          }
          case 'Panel': {
            let numMPES = 0
            let misalignment = 0.0
            d.children.MPES.forEach(function (mpesId, index) {
              let mpesObject = this.currentObjectData.MPES.find(x => x.deviceID === mpesId)
              misalignment += ((mpesObject.data.xCentroidAvg - mpesObject.data.xCentroidNominal) ** 2 + (mpesObject.data.xCentroidAvg - mpesObject.data.xCentroidNominal) ** 2) ** 0.5
              numMPES += 1
            }.bind(this))
            return 'Average Panel Misalignment: ' + (misalignment / numMPES).toFixed(4)
          }
          default:
            return ''
        }
      } else {
        return ''
      }
    }
  }

  // Fill
  getFill (d) {
    if (d.id === null) {
      return 'gray'
    } else {
      if (this.viewMode === 'Internal Temperature') {
        switch (d.deviceType) {
          case 'Panel':
            return this.temperatureColorScale(d.data.InternalTemperature)
          default:
            return 'white'
        }
      } else if (this.viewMode === 'External Temperature') {
        switch (d.deviceType) {
          case 'Panel':
            return this.temperatureColorScale(d.data.ExternalTemperature)
          default:
            return 'white'
        }
      } else if (this.viewMode === 'Error State') {
        return this.errorStateScale(this.errorStates[d.data.ErrorState])
      } else if (this.viewMode === 'Device State') {
        return this.deviceStateScale(this.deviceStates[d.data.State])
      } else if (this.viewMode === 'Actuator Lengths') {
        switch (d.deviceType) {
          case 'Actuator':
            return this.ActuatorLengthScale(d.data.CurrentLength)
          default:
            return 'white'
        }
      } else if (this.viewMode === 'Z Displacement') {
        switch (d.deviceType) {
          case 'Panel':
            return this.ActuatorLengthScale(d.data.z)
          default:
            return 'white'
        }
      } else if (this.viewMode === 'MPES Exposure') {
        switch (d.deviceType) {
          case 'MPES':
            return this.MPESExposureScale(d.data.Exposure)
          default:
            return 'white'
        }
      } else if (this.viewMode === 'MPES Intensity') {
        switch (d.deviceType) {
          case 'MPES':
            return this.MPESIntensityScale(d.data.CleanedIntensity)
          default:
            return 'white'
        }
      } else if (this.viewMode === 'Alignment Overview') {
        switch (d.deviceType) {
          case 'MPES': {
            let misalignment = (((d.data.xCentroidAvg - d.data.xCentroidNominal) ** 2 + (d.data.xCentroidAvg - d.data.xCentroidNominal) ** 2) ** 0.5)
            return this.alignmentColorScale(misalignment)
          }
          case 'Edge': {
            let numMPES = 0
            let misalignment = 0.0
            d.children.MPES.forEach(function (mpesId, index) {
              let mpesObject = this.currentObjectData.MPES.find(x => x.deviceID === mpesId)
              misalignment += ((mpesObject.data.xCentroidAvg - mpesObject.data.xCentroidNominal) ** 2 + (mpesObject.data.xCentroidAvg - mpesObject.data.xCentroidNominal) ** 2) ** 0.5
              numMPES += 1
            }.bind(this))
            return this.alignmentColorScale(misalignment / numMPES)
          }
          case 'Panel':
            let numMPES = 0
            let misalignment = 0.0
            d.children.MPES.forEach(function (mpesId, index) {
              let mpesObject = this.currentObjectData.MPES.find(x => x.deviceID === mpesId)
              misalignment += ((mpesObject.data.xCentroidAvg - mpesObject.data.xCentroidNominal) ** 2 + (mpesObject.data.xCentroidAvg - mpesObject.data.xCentroidNominal) ** 2) ** 0.5
              numMPES += 1
            }.bind(this))
            return this.alignmentColorScale(misalignment / numMPES)
          default:
            return 'white'
        }
      } else {
        return 'white'
      }
    }
  }

  getOpacity (d) {
    if (d.id === null) {
      return '0.3'
    } else {
      return '0.9'
    }
  }

  // Render methods (to be called after DOM update)
  // Should be used to render SVG objects for the first time
  renderSVG (data) {
    // Clear previous contents
    d3.select(this.svg).selectAll('*').remove()

    // Render all panel objects
    this.svgObjects['Panel'] = d3.select(this.svg).selectAll('.Panel')
      .data(this.currentObjectData.Panel, function (d) { return d.deviceID })
      .enter()
      .append('polygon')
      .attr('class', 'Panel')
      .attr('id', d => { return d.deviceName.replace(/ /g, '_') })
      .attr('points', d => {
        return d.vertices.map(
          function (e) {
            return [this.xScale(e.x), this.yScale(e.y)].join(',')
          }.bind(this)
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
      })

    const line = d3.line()
      .x(function (d) { return this.xScale(d['x']) }.bind(this))
      .y(function (d) { return this.yScale(d['y']) }.bind(this))

    // Render all Actuator objects
    this.svgObjects['Actuator'] = d3.select(this.svg).selectAll('.Actuator')
      .data(this.currentObjectData.Actuator, function (d) { return d.deviceID })
      .enter()
      .append('path')
      .attr('class', 'Actuator')
      .attr('id', d => { return d.deviceName.replace(/ /g, '_') })
      .attr('d', d => line(d.pathPoints))
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
      })

    // Render all edge objects
    this.svgObjects['Edge'] = d3.select(this.svg).selectAll('.Edge')
      .data(this.currentObjectData.Edge, function (d) { return d.deviceID })
      .enter()
      .append('path')
      .attr('class', 'Edge')
      .attr('id', d => { return d.deviceName.replace(/ /g, '_') })
      .attr('d', d => line(d.pathPoints))
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
      })

    // Render all MPES objects
    this.svgObjects['MPES'] = d3.select(this.svg).selectAll('.MPES')
      .data(this.currentObjectData.MPES, function (d) { return d.deviceID })
      .enter()
      .append('circle')
      .attr('class', 'MPES')
      .attr('id', d => { return d.deviceName.replace(/ /g, '_') })
      .attr('cx', function (d) { return this.xScale(d.cx) }.bind(this))
      .attr('cy', function (d) { return this.yScale(d.cy) }.bind(this))
      .attr('r', function (d) { return this.rScale(d.r) }.bind(this))
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
      })
  }

  static _linspace (start, end, n) {
    const out = []
    const delta = (end - start) / (n - 1)

    let i = 0
    while (i < (n - 1)) {
      out.push(start + (i * delta))
      i++
    }

    out.push(end)
    return out
  }

  renderLegend () {
    d3.select(this.legendSvg).selectAll('*').remove() // Clear existing contents

    const w = this.LEGEND_WIDTH * 0.2
    const h = this.LEGEND_HEIGHT * 0.8

    if ((this.viewMode === 'Internal Temperature') || (this.viewMode === 'External Temperature') || (this.viewMode === 'Overall Alignment') ||
        (this.viewMode === 'Actuator Lengths') || (this.viewMode === 'Z Displacement') || (this.viewMode === 'MPES Exposure') || (this.viewMode === 'MPES Intensity')) {
      const colorLegendObject = d3.select(this.legendSvg)
        .attr('width', w)
        .attr('height', h)
        .append('g')
        .attr('transform', 'translate(' + this.LEGEND_WIDTH * 0.1 + ',' + this.LEGEND_HEIGHT * 0.1 + ')')
      let colorScale
      let scale
      let scaleMin
      let scaleMax

      if ((this.viewMode === 'Internal Temperature') || (this.viewMode === 'External Temperature')) {
        colorScale = d3.schemeRdYlBu[10].slice().reverse()
        scale = this.temperatureColorScale
        scaleMin = scale.domain()[1]
        scaleMax = scale.domain()[0]
      } else if (this.viewMode === 'Overall Alignment') {
        colorScale = d3.schemeRdYlGn[10].slice().reverse()
        scale = this.alignmentColorScale
        scaleMin = scale.domain()[1]
        scaleMax = scale.domain()[0]
      } else if (this.viewMode === 'Z Displacement') {
        colorScale = d3.schemePuOr[10].slice()
        scale = this.zColorScale
        scaleMin = scale.domain()[0]
        scaleMax = scale.domain()[1]
      } else if (this.viewMode === 'Actuator Lengths') {
        colorScale = d3.schemePuOr[10].slice()
        scale = this.ActuatorLengthScale
        scaleMin = scale.domain()[0]
        scaleMax = scale.domain()[1]
      } else if (this.viewMode === 'MPES Exposure') {
        colorScale = d3.schemeReds[9].slice()
        scale = this.MPESExposureScale
        scaleMin = scale.domain()[0]
        scaleMax = scale.domain()[1]
      } else if (this.viewMode === 'MPES Intensity') {
        colorScale = d3.schemeOranges[9].slice()
        scale = this.MPESIntensityScale
        scaleMin = scale.domain()[0]
        scaleMax = scale.domain()[1]
      } else {
        console.log('Invalid view mode')
      }

      const gradient = colorLegendObject.append('defs')
        .append('linearGradient')
        .attr('id', 'gradient')
        .attr('x1', '0%') // bottom
        .attr('y1', '100%')
        .attr('x2', '0%') // to top
        .attr('y2', '0%')
        .attr('spreadMethod', 'pad')

      const pct = MirrorWidget._linspace(0, 100, colorScale.length).map(function (d) {
        return Math.round(d) + '%'
      })

      const colourPct = d3.zip(pct, colorScale)

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
      const colorLegendScale = d3.scaleLinear()
        .domain([scaleMin, scaleMax])
        .range([h, 0])

      const colorLegendAxis = d3.axisRight(colorLegendScale)
        .tickValues(d3.range(scaleMin, scaleMax, (scaleMax - scaleMin) / 20))
        .tickFormat(d3.format('.2f'))

      colorLegendObject.append('g')
        .attr('class', 'legend axis')
        .attr('transform', 'translate(' + w + ', 0)')
        .call(colorLegendAxis)
    } else if (this.viewMode === 'Device State' || this.viewMode === 'Error State') {
      let keys = []
      let colorScale
      if (this.viewMode === 'Device State') {
        keys = this.deviceStates
        colorScale = this.deviceStateScale
      } else if (this.viewMode === 'Error State') {
        keys = this.errorStates
        colorScale = this.errorStateScale
      }

      // Add one dot in the legend for each name.
      const size = 20
      d3.select(this.legendSvg).selectAll('legendDots')
        .data(keys)
        .enter()
        .append('rect')
        .attr('x', size)
        .attr('y', function (d, i) { return (this.SVG_HEIGHT / 3) + i * (size + 5) }.bind(this)) // 100 is where the first dot appears. 25 is the distance between dots
        .attr('width', size)
        .attr('height', size)
        .style('fill', function (d) { return colorScale(d) })

      // Add one dot in the legend for each name.
      d3.select(this.legendSvg).selectAll('legendLabels')
        .data(keys)
        .enter()
        .append('text')
        .attr('x', size + size * 1.2)
        .attr('y', function (d, i) { return (this.SVG_HEIGHT / 3) + i * (size + 5) + (size / 2) }.bind(this)) // 100 is where the first dot appears. 25 is the distance between dots
        .style('fill', function (d) { return 'black' })
        .text(function (d) { return d })
        .attr('text-anchor', 'left')
        .style('alignment-baseline', 'middle')
    }
  }

  // Bind updated data to the existing objects (note: will not re-render or create/remove any objects)
  updateSVG (data) {
    for (let deviceType in this.currentObjectData) {
      if (this.currentObjectData.hasOwnProperty(deviceType)) {
        let newData = Array.from(Object.values(data[deviceType]))
        if (this.svgObjects.hasOwnProperty(deviceType)) {
          this.svgObjects[deviceType]
            .data(newData, function (d) {
              return d.deviceID
            })
            .transition()
            .duration(100)
            .style('fill', this.getFill.bind(this))
            .style('fill-opacity', this.getOpacity.bind(this))
        }
      }
    }
  }

  // Lit Element lifecycle methods)

  firstUpdated (changedProps) {
    this.svg = this.shadowRoot.querySelector('.mirror-svg')
    this.legendSvg = this.shadowRoot.querySelector('.legend-svg')
    this.tooltipDiv = this.shadowRoot.querySelector('#tooltip')
  }

  updated (changedProps) {
  }

  updateSVGSize () {
    console.log('Updating SVG size...')
    this.SVG_WIDTH = this.svg.scrollWidth
    this.SVG_HEIGHT = this.SVG_WIDTH

    this.svg.style.height = this.SVG_HEIGHT + 'px'

    d3.select(this.svg).attr('viewBox', '0 0 ' + this.SVG_WIDTH + ' ' + this.SVG_HEIGHT)

    this.LEGEND_WIDTH = this.legendSvg.scrollWidth
    this.LEGEND_HEIGHT = this.SVG_HEIGHT

    this.legendSvg.style.height = this.LEGEND_HEIGHT + 'px'
  }

  // Event Handlers

  _changeViewMode (e) {
    this.viewMode = e.detail.value
    this.dataRequest['fields'] = this._viewModeFields[this.viewMode]
    this.refresh()
  }

  _changeMirror (e) {
    this.mirror = e.detail.value
    this.initialized = false
    this.dataRequest['device_ids'] = this.mirror
    this.refresh()
  }

  _selectMirror (e) {
    let mirrorDevice = this.currentObjectData['Mirror']
    this._onClickDevice(mirrorDevice)
  }

  _onClickDevice (data) {
    // eslint-disable-next-line no-undef
    const event = new CustomEvent('changed-selected-device', { detail: { 'deviceType': data.deviceType, 'deviceID': data.deviceID } })
    this.dispatchEvent(event)
  }

  refresh () {
    this.socketioClient.requestData(this.dataRequest)
    this.loading = true
  }
}

window.customElements.define('mirror-widget', MirrorWidget)
