// Info Window

// Info on methods
this.method_info = {
  "name": {
    "args": [
      {"name": "arg1",
       "type": "int" }
    ]
  }
}

//Sample Data
this.deviceID = ""
this.deviceName = "Panel 2223"
this.deviceType = "Panel"
this.deviceStatus = 2
this.deviceData = [
  {
    name: "Temperature",
    value: 15.5
  },

  {
    name: "Voltage",
    value: 0.5
  },
]
this.deviceErrors = [
  {
    time: (new Date(2018, 12, 1, 9, 30)).getTime(),
    timeString: (new Date(2018, 12, 1, 9, 30)).toISOString(),
    errorCode: 2,
    severity: "Operable",
    severityIndex: 2,
    description: "Error 2 description.",
    deviceType: "MPES",
    deviceID: "2211-4W"
  }
]
this.deviceMethods = [
  {
    name: "read",
    args: [],
    id: "id1"
  },
  {
    name: "test_method1",
    args: ["arg1", "arg2"],
    id: "id2"
  }
]


// Device tree
// Sample Data
this.allDevices = [
  {
    hasChildren:true,
    isFolder: false,
    name:"Telescope",
    status:"Nominal",
    statusNum:3,
    deviceID:"0"
  },
  {
    hasChildren:true,
    isFolder: true,
    name:"Mirrors",
    status:"Nominal",
    statusNum:3,
    deviceID:"1",
    parentDeviceIDs: ["0"]
  },
  {
    hasChildren:true,
    isFolder: false,
    name:"Primary Mirror",
    status:"Nominal",
    statusNum:3,
    deviceID:"2",
    parentDeviceIDs: ["1"]
  },
  {
    hasChildren:true,
    isFolder: true,
    name:"Panels",
    status:"Nominal",
    statusNum:3,
    deviceID:"3",
    parentDeviceIDs: ["2"]
  },
  {
    hasChildren:true,
    isFolder: true,
    name:"Edges",
    status:"Nominal",
    statusNum:3,
    deviceID:"4",
    parentDeviceIDs: ["2"]
  },
  {
    hasChildren:true,
    isFolder: false,
    name:"Panel 2221",
    status:"Nominal",
    statusNum:3,
    deviceID:"5",
    parentDeviceIDs: ["3", "15"]
  },
  {
    hasChildren:true,
    isFolder: true,
    name:"MPES",
    status:"Operable",
    statusNum:2,
    deviceID:"6",
    parentDeviceIDs: ["5"]
  },
  {
    hasChildren:true,
    isFolder: true,
    name:"ACT",
    status:"Nominal",
    statusNum:3,
    deviceID:"7",
    parentDeviceIDs: ["5"]
  },
  {
    hasChildren:true,
    isFolder: true,
    name:"Edges",
    status:"Operable",
    statusNum:2,
    deviceID:"8",
    parentDeviceIDs: ["5"]
  },
  {
    hasChildren:true,
    isFolder: false,
    name:"Panel 2222",
    status:"Nominal",
    statusNum:3,
    deviceID:"9",
    parentDeviceIDs: ["3", "15"]
  },
  {
    hasChildren:true,
    isFolder: true,
    name:"MPES",
    status:"Nominal",
    statusNum:3,
    deviceID:"10",
    parentDeviceIDs: ["9"]
  },
  {
    hasChildren:true,
    isFolder: true,
    name:"ACT",
    status:"Nominal",
    statusNum:3,
    deviceID:"11",
    parentDeviceIDs: ["9"]
  },
  {
    hasChildren:true,
    isFolder: true,
    name:"Edges",
    status:"Operable",
    statusNum:2,
    deviceID:"12",
    parentDeviceIDs: ["9"]
  },
  {
    hasChildren:true,
    isFolder: false,
    name:"Edge 2221+2222",
    status:"Fatal",
    statusNum:1,
    deviceID:"13",
    parentDeviceIDs: ["4", "8", "12"]
  },
  {
    hasChildren:true,
    isFolder: true,
    name:"MPES",
    status:"Fatal",
    statusNum:1,
    deviceID:"14",
    parentDeviceIDs: ["13"]
  },
  {
    hasChildren:true,
    isFolder: true,
    name:"Panels",
    status:"Operable",
    statusNum:3,
    deviceID:"15",
    parentDeviceIDs: ["13"]
  },
  {
    hasChildren:false,
    isFolder: false,
    name:"MPES 34",
    status:"Operable",
    statusNum:3,
    deviceID:"16",
    parentDeviceIDs: ["13", "10"]
  },
  {
    hasChildren:false,
    isFolder: false,
    name:"MPES 76",
    status:"Fatal",
    statusNum:1,
    deviceID:"17",
    parentDeviceIDs: ["13", "6"]
  },
]
