'use strict';

var util = require('util');
var sensorDriver = require('../../index');
var Network = sensorDriver.Network;
var Sensor = sensorDriver.Sensor;

function ModbusTcpGems5200(options) {
  Network.call(this, 'modbus-tcp-gems5200', options);
}

util.inherits(ModbusTcpGems5200, Network);

ModbusTcpGems5200.prototype.discover = function(networkName, options, cb) {
  return cb && cb(new Error('Not supported'));
};

module.exports = new ModbusTcpGems5200();
