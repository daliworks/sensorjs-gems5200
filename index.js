'use strict';

var logger = require('log4js').getLogger('Sensor');

function initDrivers() {
  var gems5200Sensor;

  try {
    gems5200Sensor = require('./driver/gems5200Sensor');
  } catch(e) {
    logger.error('Cannot load ./driver/gems5200Sensor', e);
  }

  return {
    gems5200Sensor: gems5200Sensor
  };
}

function initNetworks() {
  var modbusTcpNteksys;

  try {
    modbusTcpNteksys = require('./network/modbus-tcp-gems5200');
  } catch (e) {
    logger.error('Cannot load ./network/modbus-tcp-gems5200', e);
  }

  return {
    'modbus-tcp-gems5200': modbusTcpNteksys
  };
}

module.exports = {
  networks: ['modbus-tcp-gems5200'],
  drivers: {
    gems5200Sensor: [
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
    ]
  },
  initNetworks: initNetworks,
  initDrivers: initDrivers
};
