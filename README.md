# pSCT Alignment Control GUI
Web GUI for pSCT mirror panel and actuator control. Built with D3.js, OPC UA, and websockets.

The frontend implementation is based on the MVC (Model-View-Controller) pattern. The backend is implemented using a Python (Pyramid) webserver.

## Dependencies/Packages

* Python (backend)
  * [websockets](https://github.com/aaugustin/websockets)
  * [python-opcua](https://github.com/FreeOpcUa/python-opcua)
  * [Pyramid](https://github.com/Pylons/pyramid)
* Javascript (frontend)
  * [D3.js](https://github.com/d3/d3)
  * [requireJS](https://github.com/requirejs/requirejs)
  * [Bootstrap 4](https://github.com/twbs/bootstrap)
  * [jQuery](https://github.com/jquery/jquery)
  * [DataTables](https://github.com/DataTables/DataTables)
  * [Bootstrap-treeview](https://github.com/patternfly/patternfly-bootstrap-treeview)

## Installation and Setup

**TODO**

## Features/To-Do

- [ ] Frontend
  - [ ] Errors
    - [ ] Error Log Model
    - [ ] Error Log View
    - [ ] Error Log Controller
    - [ ] Error popups/modals
      - [ ] Goto
  - [ ] Components/Devices
      - [ ] Device Tree Model
      - [ ] Info Box View
      - [ ] Device Tree Controller
      - [ ] Device Tree View (treeview)
  - [ ] Mirror View
  - [ ] 
- [ ] Backend
  - [ ] JSON message format definition
    - [ ] 
  - [ ]

## Known Issues/Troubleshooting

## References

* CTA Operator GUI Prototype (@ DESY): [https://github.com/IftachSadeh/ctaOperatorGUI](https://github.com/IftachSadeh/ctaOperatorGUI)
  * [Paper 1](https://arxiv.org/abs/1608.03595)
  * [Paper 2](https://arxiv.org/abs/1710.07117)

* Websockets Documentation: [https://websockets.readthedocs.io/en/stable/intro.html](https://websockets.readthedocs.io/en/stable/intro.html)
* Python OPC UA Documentation: [https://python-opcua.readthedocs.io/en/latest/](https://python-opcua.readthedocs.io/en/latest/)
* Pyramid Web Framework Documentation: [https://docs.pylonsproject.org/projects/pyramid/en/latest/](https://docs.pylonsproject.org/projects/pyramid/en/latest/)

* D3.js wiki: [https://github.com/d3/d3/wiki](https://github.com/d3/d3/wiki)
* RequireJS Documentation: [https://requirejs.org/](https://requirejs.org/)
* Bootstrap 4 Documentation: [https://getbootstrap.com/docs/4.1/getting-started/introduction/](https://getbootstrap.com/docs/4.1/getting-started/introduction/)
* jQuery Documentation: [https://api.jquery.com/](https://api.jquery.com/)
* DataTables Documentation: [https://datatables.net/manual/](https://datatables.net/manual/)
