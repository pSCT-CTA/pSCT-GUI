import sys
sys.path.insert(0, "..")
import time

from opcua import ua, Server

if __name__ == "__main__":

    # setup our server
    server = Server()
    server.set_endpoint("opc.tcp://127.0.0.1:4840")

    # setup our own namespace, not really necessary but should as spec
    uri = "http://examples.freeopcua.github.io"
    idx = server.register_namespace(uri)

    # get Objects node, this is where we should put our nodes
    objects = server.get_objects_node()

    # populating our address space
    print("Populating address space")
    obj1 = objects.add_object(idx, "Obj1")
    var1 = obj1.add_variable(idx, "Var1", 10.0)
    var2 = obj1.add_variable(idx, "Var2", 10.0)
    var3 = obj1.add_variable(idx, "Var3", 10.0)
    var4 = obj1.add_variable(idx, "Var4", 10.0)
    var5 = obj1.add_variable(idx, "Var5", 10.0)
    var6 = obj1.add_variable(idx, "Var6", 10.0)
    var7 = obj1.add_variable(idx, "Var7", 10.0)
    var8 = obj1.add_variable(idx, "Var8", 10.0)
    var9 = obj1.add_variable(idx, "Var9", 10.0)
    var10 = obj1.add_variable(idx, "Var10", 10.0)
    prop1 = obj1.add_property(idx, "Property1", 10.0)
    prop2 = obj1.add_property(idx, "Property2", 10.0)
    prop3 = obj1.add_property(idx, "Property3", 10.0)
    prop4 = obj1.add_property(idx, "Property4", 10.0)

    obj2 = obj1.add_object(idx, "Obj2")
    var5 = obj2.add_variable(idx, "Var5", 10.0)
    var6 = obj2.add_variable(idx, "Var6", 10.0)
    var7 = obj2.add_variable(idx, "Var7", 10.0)
    var8 = obj2.add_variable(idx, "Var8", 10.0)
    prop9 = obj2.add_property(idx, "Property9", 10.0)
    prop10 = obj2.add_property(idx, "Property10", 10.0)
    prop11 = obj2.add_property(idx, "Property11", 10.0)
    prop12 = obj2.add_property(idx, "Property12", 10.0)

    # starting!
    print("Starting server...")
    server.start()
