<<<<<<< Updated upstream:psct_gui/backend/element_models.py
from abc import ABC, abstractmethod
import socketio

class BaseElementModel(object):
    def __init__(self, socketio_server, namespace_name):
        self.sio = socketio_server
        self.namespace_name = namespace_name

    @property
    @abstractmethod
    def data(self):
        pass

    # Notify the view that the model data has been changed
    # so that the view is updated
    # Each element model individually determines when its data needs to be recalculated/sent to
    # the view
    @abstractmethod
    def notify(self, name, type):
        pass

    # Attach to a device model so that this element model is notified
    # (noify() is called) whenever that device model changes
    def observe(self, device_model):
        device_model.add_observer(self)

# General model object for a tree of devices
class DeviceTreeModel(BaseElementModel):

    def __init__(self, socketio_server, device_tree, devices_by_type):
        super().__init__(socketio_server, '/device_tree')

        class DeviceTreeNamespace(socketio.Namespace):
            # On connect, send initial data for rendering
            def on_connect(self, sid, environ):
                self.emit('server_connected',
                    {'name': 'DeviceTreeNamespace'})
                self.emit('datachange_notification',
                    {'data': self.data})

            def on_disconnect(self, sid):
                self.emit('server_disconnected',
                    {'name': 'DeviceTreeNamespace'})

            def on_toggle_mode(self, sid, data):
                if self.mode == 'tree':
                    self.mode == 'flat'
                elif self.mode == 'flat':
                    self.mode == 'tree'
                self.emit('datachange_notification',
                    {'data': self.data})

        self.sio.register_namespace(DeviceTreeNamespace(self.namespace_name))

        self.mode = "tree"

        # Dictionary of device models
        self.device_tree = device_tree
        self.devices_by_type = devices_by_type

        # Observe all device models
        for device_model in device_tree:
            self.observe(device_model)

    def get_tree(self):
        tree = []

        if self.mode == 'tree':
            # Custom callback function to build a dict_tree from a hierarchy
            # of NodeModels/DeviceModels
            def build_tree_callback(model, parent_dict={}):

                if issubclass(model, DeviceModel):
                    node = {'text': model.name, 'nodes': []}
                elif isinstance(model, FolderModel):
                    node = {'text': model.name, 'nodes': []}

                if not parent_dict:
                    new_parent_dict = node
                else:
                    parent_dict['nodes'].append(node)
                    new_parent_dict = parent_dict[-1]

                new_kwargs = {
                    'parent_dict': new_parent_dict
                }

                return new_kwargs

            for root_node in self.device_tree:
                subtree = {}
                NodeModel.traverse_models(root_model, build_tree_callback, parent_dict=subtree)
                tree.append(subtree)

        elif self.mode == 'flat':
            for device_type in self.devices_by_type:
                node = {'text': device_type, 'nodes': []}
                for device_model in self.devices_by_type[device_type]:
                    node['nodes'].append({'text': device_model.name,
                    'device_id': device_model.id,
                    'device_status': device_model.status,
                    'nodes': [],
                     })

                tree.append(node)
        else:
            raise ValueError('Invalid mode: {}'.format(self.mode))

        return tree

    @property
    def data(self):
        return self.get_tree()

    def notify(self, data_node_name, data_node_type):
        self.sio.emit('datachange_notification',
            {'data': self.data},
            namespace=self.namespace)

# General model object for an info window view
class InfoWindowModel(BaseElementModel):

    def __init__(self, socketio_server, device_model, name="dashboard"):
        super().__init__(self, socketio_server, '/info_window_' + name)

        # A single device model
        self.device_model = device_model

        class InfoWindowNamespace(socketio.Namespace):
            # On connect, send initial data for rendering
            def on_connect(self, sid, environ):
                self.emit('server_connected',
                    {'name': 'InfoWindowNamespace'})
                self.emit('datachange_notification',
                    {'data': self.data})

            def on_disconnect(self, sid):
                self.emit('server_disconnected',
                    {'name': 'InfoWindowNamespace'})

            def on_change_selection(self, sid, data):
                id = data['id']
                self.device_model = DeviceModel.ALL_DEVICES[id]
                self.emit('datachange_notification',
                    {'data': self.data})

        self.sio.register_namespace(InfoWindowNamespace(self.namespace_name))

    @property
    def data(self):
        if self.device_model:
            return self.device_model.description
        else:
            return {}

    def notify(self, data_node_name, data_node_type):
        self.sio.emit('datachange_notification',
            {'data': self.data},
            namespace=self.namespace)

# General model object for a tree of devices
class MirrorDisplayModel(BaseElementModel):

    def __init__(self, socketio_server, mirror_model):
        super().__init__(self, socketio_server, '/mirror_display_' + type)

        self.type = mirror_model.mirror_type

        class MirrorDisplayNamespace(socketio.Namespace):
            # On connect, send initial data for rendering
            def on_connect(self, sid, environ):
                self.emit('server_connected',
                    {'name': self.name})
                self.emit('datachange_notification',
                    {'data': self.data})

            def on_disconnect(self, sid):
                self.emit('server_disconnected',
                    {'name': self.name})

        self.sio.register_namespace(MirrorDisplayNamespace(self.namespace_name))

        self.mirror_model = mirror_model
        self.panel_models = self.mirror_model.panels
        self.edge_models = self.mirror_model.edges

        # Observe mirror device model and all descendents
        self.observe(mirror_model)

    def get_mirror_data(self):

        mirror_data = {}

        mirror_data['mirrors'] = {self.mirror_model.id: self.mirror_model.description}
        mirror_data['panels'] = {self.mirror_model.id: self.mirror_model.description}
        mirror_data['edges'] = {self.mirror_model.id: self.mirror_model.description}
        mirror_data['MPES'] = {self.mirror_model.id: self.mirror_model.description}
        mirror_data['actuators'] = {self.mirror_model.id: self.mirror_model.description}

        return mirror_data

    @property
    def data(self):
        return self.get_mirror_data()

    def notify(self, data_node_name, data_node_type):
        self.sio.emit('datachange_notification',
            {'data': self.data},
            namespace=self.namespace)

# General model object for a tree of devices
class ErrorLogModel(BaseElementModel):

    def __init__(self, socketio_server, devices_by_type):
        super().__init__(self, socketio_server, '/error_log')

        class ErrorLogNamespace(socketio.Namespace):
            # On connect, send initial data for rendering
            def on_connect(self, sid, environ):
                self.emit('server_connected',
                    {'name': 'ErrorLog'})
                self.emit('datachange_notification',
                    {'data': self.data})

            def on_disconnect(self, sid):
                self.emit('server_disconnected',
                    {'name': 'ErrorLog'})

        self.sio.register_namespace(ErrorLogNamespace(self.namespace_name))

        # Dictionary of device models
        self.devices_by_type = devices_by_type

        # Observe all device models
        for device_type in self.devices_by_type:
            for device_model in self.devices_by_type[device_type]:
                self.observe(device_model)

    def get_error_data(self):

        error_data = []

        for device_type in self.devices_by_type:
            for device_model in self.devices_by_type[device_type]:
                error_data.append(device_model.errors)

        return error_data

    @property
    def data(self):
        return self.get_error_data()

    def notify(self, data_node_id, data_node_type):
        self.sio.emit('datachange_notification',
            {'data': self.data},
            namespace=self.namespace)
=======
from abc import ABC, abstractmethod


class BaseElementModel(object):
    def __init__(self, socketio_server, namespace_name):
        self.sio = socketio_server
        self.namespace_name = namespace_name

    @property
    @abstractmethod
    def data(self):
        pass

    # Notify the view that the model data has been changed
    # so that the view is updated
    # Each element model individually determines when its data needs to be recalculated/sent to
    # the view
    @abstractmethod
    def notify(self, name, type):
        pass

    # Attach to a device model so that this element model is notified
    # (noify() is called) whenever that device model changes
    def observe(self, device_model):
        device_model.add_observer(self)

# General model object for a tree of devices
class DeviceTreeModel(BaseElementModel):

    def __init__(self, socketio_server, device_model_trees, device_models_by_type, ):
        super().__init__(self, socketio_server, '/device_tree', device_model_tree, devices_by_type)

        class DeviceTreeNamespace(socketio.Namespace):
            # On connect, send initial data for rendering
            def on_connect(self, sid, environ):
                self.emit('server_connected',
                    {'name': 'DeviceTreeNamespace'})
                self.emit('datachange_notification',
                    {'data': self.data})

            def on_disconnect(self, sid):
                self.emit('server_disconnected',
                    {'name': 'DeviceTreeNamespace'})

            def on_toggle_mode(self, sid, data):
                if self.mode == 'tree':
                    self.mode == 'flat'
                elif self.mode == 'flat':
                    self.mode == 'tree'
                self.emit('datachange_notification',
                    {'data': self.data})

        self.sio.register_namespace(DeviceTreeNamespace(self.namespace_name))

        self.mode = "tree"

        # Dictionary of device models
        self.device_model_trees = device_model_trees
        self.devices_by_type = devices_by_type

        # Observe all device models
        for device_type in self.devices_by_type:
            for device_model in self.devices_by_type[device_type]:
                self.observe(device_model)

    def get_tree(self):
        tree = []

        if self.mode == 'tree':
            # Custom callback function to build a dict_tree from a hierarchy
            # of NodeModels/DeviceModels
            def build_tree_callback(model, parent_dict={}):

                if issubclass(model, DeviceModel):
                    node = {'text': model.name, 'nodes': []}
                elif isinstance(model, FolderModel):
                    node = {'text': model.name, 'nodes': []}

                if not parent_dict:
                    new_parent_dict = node
                else:
                    parent_dict['nodes'].append(node)
                    new_parent_dict = parent_dict[-1]

                new_kwargs = {
                    'parent_dict': new_parent_dict
                }

                return new_kwargs

            for root_node in self.device_model_trees:
                subtree = {}
                NodeModel.traverse_models(root_model, build_tree_callback, parent_dict=subtree)
                tree.append(subtree)

        elif self.mode == 'flat':
            for device_type in self.devices_by_type:
                node = {'text': device_type, 'nodes': []}
                for device_model in self.devices_by_type[device_type]:
                    node['nodes'].append({'text': device_model.name,
                    'device_id': device_model.id,
                    'device_status': device_model.status,
                    'nodes': [],
                     })

                tree.append(node)
        else:
            raise ValueError('Invalid mode: {}'.format(self.mode))

        return tree

    @property
    def data(self):
        return self.get_tree()

    def notify(self, data_node_name, data_node_type):
        if data_node_name == '':
            self.sio.emit('datachange_notification',
                {'data': self.data},
                namespace=self.namespace)

# General model object for an info window view
class InfoWindowModel(BaseElementModel):

    def __init__(self, socketio_server, device_model):
        super().__init__(self, socketio_server, '/info_window')

        # A single device model
        self.device_model = device_model

        class InfoWindowNamespace(socketio.Namespace):
            # On connect, send initial data for rendering
            def on_connect(self, sid, environ):
                self.emit('server_connected',
                    {'name': 'InfoWindowNamespace'})
                self.emit('datachange_notification',
                    {'data': self.data})

            def on_disconnect(self, sid):
                self.emit('server_disconnected',
                    {'name': 'InfoWindowNamespace'})

            def on_change_selection(self, sid, data):
                id = data['id']
                self.device_model = DeviceModel.ALL_DEVICES[id]
                self.emit('datachange_notification',
                    {'data': self.data})

        self.sio.register_namespace(InfoWindowNamespace(self.namespace_name))

    @property
    def data(self):
        return self.device_model.description

    def notify(self, data_node_name, data_node_type):
        if data_node_name == '':
            self.sio.emit('datachange_notification',
                {'data': self.data},
                namespace=self.namespace)
>>>>>>> Stashed changes:psct_gui/models/element_models.py
