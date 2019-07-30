# pSCT Alignment Control GUI
Web GUI for pSCT mirror panel alignment monitoring/control. Built with a Python backend using OPC UA + socket.io + eventlet. The frontend implementation is based on custom socket.io-connected Web Components with extensive use of Polymer and Vaadin components as building blocks.

## Dependencies/Packages

* psct_gui_backend (OPC UA <-> Socket.io <-> Browser)
  * [Python 3](https://www.python.org/)
  * [python-socketio](https://github.com/miguelgrinberg/python-socketio)
  * [python-opcua](https://github.com/FreeOpcUa/python-opcua)
  * [eventlet](http://eventlet.net/)
* psct_gui (web server and client-side code)
  * [PWA Starter Kit](https://pwa-starter-kit.polymer-project.org/)
  * [LitElement](https://lit-element.polymer-project.org)
  * [Web Components](https://www.webcomponents.org/)
  * [Vaadin Web Components](https://vaadin.com/components/)
  * [Node.js](https://nodejs.org/en/)
  * [Node Package Manager](https://vaadin.com/components/)
  * [D3.js](https://github.com/d3/d3)

## Installation and Setup

### psct_gui_backend

To install Python backend dependencies in development mode:

```bash
cd pSCT-GUI
python setup.py develop
```

To install in production mode:

```bash
cd pSCT-GUI
python setup.py develop
```

Optionally, do the installation in a separate virtual environment (with Python 3).

### psct_gui_backend

To install all JavaScript dependencies + the PWA web server:

First install Node.js and NPM by following the instructions [here](https://github.com/nodesource/distributions/blob/master/README.md#deb).

Then simply do

```bash
cd pSCT-GUI/psct_gui_backend
npm install
```

## To Run:

First, start the OPC UA pSCT central alignment server (code in a private repo, contact Prof. Vladimir Vassiliev, UCLA for access). In the most up-to-date versions of the server code the OPC UA node structure will match the expected format for the backend server. If not, it may be necessary to use psct_gui_backend.core.OldBackendServer. 

Then, run the backend server and pass it the providing the port where it can connect to the OPC UA alignment server.

```bash
cd pSCT-GUI/psct_gui_backend
python core.py opc.tcp://localhost:48010
```
The backend server will, by default, serve data via Socket.io on localhost:5000. Note that currently the Web Components in the frontend are hardcoded to listen on that port.

While the backend server is running, start the frontend server with:

```bash
cd pSCT-GUI/psct_gui
npm start
```

It may take a minute or more to completely finish startup. By default the GUI will be served at localhost:8000.

Finally, open a browser and point it to the web server address (i.e. localhost:8000) to use the GUI.

## Known Issues/Troubleshooting

## References

* CTA Operator GUI Prototype (@ DESY): [https://github.com/IftachSadeh/ctaOperatorGUI](https://github.com/IftachSadeh/ctaOperatorGUI)
  * [Paper 1](https://arxiv.org/abs/1608.03595)
  * [Paper 2](https://arxiv.org/abs/1710.07117)
