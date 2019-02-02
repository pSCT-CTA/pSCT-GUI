import sys
import logging

import socketio
import opcua

from psct_gui_backend.core import BackendServer

logger = logging.getLogger('psct_gui_backend')
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

opcua_client = opcua.Client("opc.tcp://10.0.1.13:48010", timeout=60)
sio = socketio.Server()

serv = BackendServer(opcua_client, sio)
serv.initialize_device_models("2:DeviceTree")

panel_0 = serv.device_models['ns=2;s=Panel_0']
