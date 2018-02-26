'use strict';

var util = require('util');

var SensorLib = require('../index');
var Sensor = SensorLib.Sensor;
var logger = Sensor.getLogger('Sensor');
var gems5200 = require('../gems5200');

var addressTable = {
  VOLT_A: [40015, 'readFloatBE'],
  VOLT_B: [40017, 'readFloatBE'],
  VOLT_C: [40019, 'readFloatBE'],
  CURR_A: [40021, 'readFloatBE'],
  CURR_B: [40023, 'readFloatBE'],
  CURR_C: [40025, 'readFloatBE'],
  CURR_G: [40027, 'readFloatBE'],
  IMBALANCE_VOLT: [40029, 'readFloatBE'],
  IMBALANCE_CURR: [40031, 'readFloatBE'],
  TOTAL_RUNNING_TIME: [40033, 'readUInt32BE'],
  RUNNING_TIME: [40035, 'readUInt32BE'],
  TOTAL_WATTHR: [40037, 'readUInt32BE'],
  ACTIVE_POWER: [40049, 'readFloatBE'],
  REACTIVE_POWER: [40051, 'readFloatBE'],
  FREQ: [40053, 'readFloatBE'],
  PF: [40055, 'readFloatBE'],
  RUNS: [40225, 'readFloatBE'],
};

function Gems5200Sensor(sensorInfo, options) {
  var self = this;
  var tokens;

  Sensor.call(self, sensorInfo, options);

  tokens = self.id.split('-');
  self.deviceAddress = tokens[1];
  self.sequence = tokens[2];

  if (sensorInfo.model) {
    self.model = sensorInfo.model;
  }

  self.dataType = Gems5200Sensor.properties.dataTypes[self.model][0];
}

Gems5200Sensor.properties = {
  supportedNetworks: ['modbus-tcp-gems5200'],
  dataTypes: {
    'gems5200Voltage': ['voltage'],
    'gems5200Current': ['current'],
    'gems5200CurrentMilli': ['current'],
    'gems5200Imbalance': ['percent'],
    'gems5200TimeDuration': ['timeDuration'],
    'gems5200ElectricEnergy': ['electricEnergy'],
    'gems5200ElectricActivePower': ['electricPower'],
    'gems5200ElectricReactivePower': ['electricPower'],
    'gems5200Frequency': ['frequency'],
    'gems5200PowerFactor': ['powerFactor'],
    'gems5200Count': ['count']
  },
  discoverable: false,
  addressable: true,
  recommendedInterval: 60000,
  maxInstances: 32,
  maxRetries: 8,
  idTemplate: '{gatewayId}-{deviceAddress}-{sequence}',
  models: [
    'gems5200Voltage',
    'gems5200Current',
    'gems5200CurrentMilli',
    'gems5200Imbalance',
    'gems5200TimeDuration',
    'gems5200ElectricEnergy',
    'gems5200ElectricActivePower',
    'gems5200ElectricReactivePower',
    'gems5200Frequency',
    'gems5200PowerFactor',
    'gems5200Count'
  ],
  category: 'sensor'
};

util.inherits(Gems5200Sensor, Sensor);

Gems5200Sensor.prototype._get = function (cb) {
  var self = this;
  var result = {
    status: 'on',
    id: self.id,
    result: {},
    time: {}
  };

  logger.debug('Called _get():', self.id);

  gems5200.getValue(self.deviceAddress, addressTable[self.sequence], function getValueCb(err, value) {
    if (err) {
      result.status = 'error';
      result.message = err.message ? err.message : 'Unknown error(No message)';
    } else {
      if ((self.sequence == 'TOTAL_WATTHR') || (self.sequence == 'ACTIVE_POWER') || (self.sequence == 'REACTIVE_POWER')) {
        result.result[self.dataType] = value / 1000.0;
      }
      else{
        result.result[self.dataType] = value;
      }
      result.time[self.dataType] = Date.now();
    }

    if (cb) {
      return cb(err, result);
    } else {
      self.emit('data', result);
    }
  });
};

Gems5200Sensor.prototype._enableChange = function () {
};

Gems5200Sensor.prototype._clear = function () {
};

module.exports = Gems5200Sensor;
