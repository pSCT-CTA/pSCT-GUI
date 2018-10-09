import sys
import logging
import time
import json
from abc import ABC, abstractmethod
#sys.path.insert(0, "..")

import socketio

from opcua import Client, ua
from opcua.ua.object_ids import ObjectIds

from psct_gui.models import device_models

# TODO: Move to config file somehow
OPCUA_SERV_ADDR = "opc.tcp://10.0.1.6:4840/"

class MethodNamespace(socketio.Namespace):
    def on_connect(self, sid, environ):
        self.emit('server_connected',
            {'name': 'MethodNamespace'})

    def on_disconnect(self, sid):
        self.emit('server_disconnected',
            {'name': 'MethodNamespace'})

    def on_call_method(self, sid, data):
        id = data['node_id']
        method_name = data['method_name']
        args = data['args']

        device_model = device_models.DeviceModel.ALL_DEVICES[id]
        return_values = device_model.call_method(method_name, *args)

        self.emit('method_return_values',
            {'data': return_values})

class ErrorNamespace(socketio.Namespace):
    def on_connect(self, sid, environ):
        self.emit('server_connected',
            {'name': 'ErrorNamespace'})

    def on_disconnect(self, sid):
        self.emit('server_disconnected',
            {'name': 'ErrorNamespace'})

    def on_my_event(self, sid, data):
        self.emit('my_response', data)
