# pSCT Alignment Control GUI
Web GUI for pSCT mirror panel and actuator control. Built with D3.js, OPC UA, and gevent-socketio.

The frontend implementation is based on the MVC (Model-View-Controller) pattern with D3.js and Bootstrap for visualization/styling. The backend is implemented using a Python (Pyramid) webserver with python-opcua and the socket.io protocol.

## Dependencies/Packages

* Python (backend)
  * [gevent-socketio](https://github.com/abourget/gevent-socketio)
  * [python-opcua](https://github.com/FreeOpcUa/python-opcua)
  * [Pyramid](https://github.com/Pylons/pyramid)
* Javascript (frontend)
  * [D3.js](https://github.com/d3/d3)
  * [webpack](https://github.com/webpack/webpack)
  * [Bootstrap 4](https://github.com/twbs/bootstrap)
  * [jQuery](https://github.com/jquery/jquery)
  * [DataTables](https://github.com/DataTables/DataTables)
  * [Bootstrap-treeview](https://github.com/patternfly/patternfly-bootstrap-treeview)

## Installation and Setup

**TODO**

## Features/To-Do

- [ ] Frontend
  - [ ] History Logging
    - [ ] History Log Model
    - [ ] History Log View
    - [ ] History Log Controller
  - [ ] Error Handling
    - [ ] Error Log Model
    - [ ] Error Log View
    - [ ] Error Log Controller
    - [ ] Error popups/modals
      - [ ] Goto
  - [ ] Component/Device Monitoring
      - [ ] Device/Device Tree Model 
       - [ ] Telescope Model
       - [ ] Mirror (Primary/Secondary) Model
       - [ ] Panel (P1/P2/S1/S2) Model
       - [ ] Actuator Model
       - [ ] MPES Model
      - [ ] Info Box View
      - [ ] Device Tree Controller
      - [ ] Device Tree View (treeview)
  - [ ] Mirror View
  - [ ] Pointing
  - [ ] Positioner
- [ ] Backend
  - [ ] JSON message format definition
  - [ ] SubscriptionManager
  - [ ] Login/Authentication
    - [ ] MySQL backend
    
## Known Issues/Troubleshooting

## References

* CTA Operator GUI Prototype (@ DESY): [https://github.com/IftachSadeh/ctaOperatorGUI](https://github.com/IftachSadeh/ctaOperatorGUI)
  * [Paper 1](https://arxiv.org/abs/1608.03595)
  * [Paper 2](https://arxiv.org/abs/1710.07117)

* Websockets Documentation: [https://gevent-socketio.readthedocs.io/en/latest/](https://gevent-socketio.readthedocs.io/en/latest/)
* Python OPC UA Documentation: [https://python-opcua.readthedocs.io/en/latest/](https://python-opcua.readthedocs.io/en/latest/)
* Pyramid Web Framework Documentation: [https://docs.pylonsproject.org/projects/pyramid/en/latest/](https://docs.pylonsproject.org/projects/pyramid/en/latest/)

* D3.js wiki: [https://github.com/d3/d3/wiki](https://github.com/d3/d3/wiki)
* Webpack Documentation: [https://webpack.js.org/concepts/](https://webpack.js.org/concepts/)
* Bootstrap 4 Documentation: [https://getbootstrap.com/docs/4.1/getting-started/introduction/](https://getbootstrap.com/docs/4.1/getting-started/introduction/)
* jQuery Documentation: [https://api.jquery.com/](https://api.jquery.com/)
* DataTables Documentation: [https://datatables.net/manual/](https://datatables.net/manual/)
