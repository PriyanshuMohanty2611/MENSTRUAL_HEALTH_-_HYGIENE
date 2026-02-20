const mqtt = require('mqtt');
const { VendingMachine, Washroom, Incinerator, Alert } = require('../models');

let mqttClient = null;

const connectMQTT = () => {
  const options = {
    clientId: 'menstrucare_backend_' + Math.random().toString(16).substr(2, 8),
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
  };

  // Add authentication if provided
  if (process.env.MQTT_USERNAME && process.env.MQTT_PASSWORD) {
    options.username = process.env.MQTT_USERNAME;
    options.password = process.env.MQTT_PASSWORD;
  }

  mqttClient = mqtt.connect(process.env.MQTT_BROKER, options);

  mqttClient.on('connect', () => {
    console.log('✓ Connected to MQTT Broker');
    console.log(`  Broker: ${process.env.MQTT_BROKER}`);
    
    // Subscribe to device topics
    mqttClient.subscribe('devices/vending/+/data', { qos: 1 });
    mqttClient.subscribe('devices/washroom/+/data', { qos: 1 });
    mqttClient.subscribe('devices/incinerator/+/data', { qos: 1 });
    mqttClient.subscribe('devices/+/+/alert', { qos: 1 });
    
    console.log('  Subscribed to device topics');
  });

  mqttClient.on('error', (error) => {
    console.error('MQTT connection error:', error);
  });

  mqttClient.on('reconnect', () => {
    console.log('Reconnecting to MQTT broker...');
  });

  mqttClient.on('message', async (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
      const topicParts = topic.split('/');
      const deviceType = topicParts[1];
      const deviceId = topicParts[2];
      const messageType = topicParts[3];

      console.log(`MQTT Message received: ${topic}`);

      if (messageType === 'data') {
        await handleDeviceData(deviceType, deviceId, data);
      } else if (messageType === 'alert') {
        await handleDeviceAlert(deviceType, deviceId, data);
      }
    } catch (error) {
      console.error('Error processing MQTT message:', error);
    }
  });

  return mqttClient;
};

const handleDeviceData = async (deviceType, deviceId, data) => {
  try {
    if (deviceType === 'vending') {
      await handleVendingMachineData(deviceId, data);
    } else if (deviceType === 'washroom') {
      await handleWashroomData(deviceId, data);
    } else if (deviceType === 'incinerator') {
      await handleIncineratorData(deviceId, data);
    }
  } catch (error) {
    console.error(`Error handling ${deviceType} data:`, error);
  }
};

const handleVendingMachineData = async (machineId, data) => {
  const machine = await VendingMachine.findOne({ machineId });
  
  if (machine) {
    machine.stockLevel = data.stockLevel;
    machine.sensorData = {
      temperature: data.temperature,
      humidity: data.humidity,
      lastUpdate: new Date()
    };

    // Update status based on stock level
    if (data.stockLevel < 5) {
      machine.status = 'low-stock';
      await createAlert({
        alertType: 'low-stock',
        deviceId: machineId,
        deviceType: 'vending',
        message: `Critical stock level: ${data.stockLevel} units remaining`,
        severity: 'critical'
      });
    } else if (data.stockLevel < 15) {
      machine.status = 'low-stock';
      await createAlert({
        alertType: 'low-stock',
        deviceId: machineId,
        deviceType: 'vending',
        message: `Low stock: ${data.stockLevel} units remaining`,
        severity: 'medium'
      });
    } else {
      machine.status = 'operational';
    }

    await machine.save();
    console.log(`Updated vending machine ${machineId}: stock=${data.stockLevel}`);
  }
};

const handleWashroomData = async (washroomId, data) => {
  const washroom = await Washroom.findOne({ washroomId });
  
  if (washroom) {
    washroom.airQuality = data.airQuality;
    washroom.humidity = data.humidity;
    washroom.temperature = data.temperature;
    washroom.occupancyStatus = data.occupied;
    washroom.gasLevels = {
      co2: data.co2 || 0,
      ammonia: data.ammonia || 0
    };

    // Determine status based on air quality
    if (data.airQuality < 40) {
      washroom.status = 'needs-cleaning';
      await createAlert({
        alertType: 'hygiene',
        deviceId: washroomId,
        deviceType: 'washroom',
        message: `Poor air quality: ${data.airQuality}% - Immediate cleaning required`,
        severity: 'high'
      });
    } else if (data.airQuality < 60) {
      washroom.status = 'needs-cleaning';
    } else if (data.airQuality < 70) {
      washroom.status = 'good';
    } else {
      washroom.status = 'excellent';
    }

    await washroom.save();
    console.log(`Updated washroom ${washroomId}: airQuality=${data.airQuality}%`);
  }
};

const handleIncineratorData = async (incineratorId, data) => {
  const incinerator = await Incinerator.findOne({ incineratorId });
  
  if (incinerator) {
    incinerator.temperature = data.temperature;
    incinerator.emissionLevel = data.emissions;
    incinerator.wasteProcessed = data.wasteProcessed;
    incinerator.status = data.status;

    // Check for anomalies
    if (data.temperature > 900) {
      await createAlert({
        alertType: 'safety',
        deviceId: incineratorId,
        deviceType: 'incinerator',
        message: `High temperature: ${data.temperature}°C - Safety check required`,
        severity: 'high'
      });
    }

    if (data.emissions === 'high') {
      await createAlert({
        alertType: 'maintenance',
        deviceId: incineratorId,
        deviceType: 'incinerator',
        message: `High emission levels detected - Maintenance required`,
        severity: 'medium'
      });
    }

    await incinerator.save();
    console.log(`Updated incinerator ${incineratorId}: temp=${data.temperature}°C`);
  }
};

const handleDeviceAlert = async (deviceType, deviceId, data) => {
  await createAlert({
    alertType: data.alertType || 'emergency',
    deviceId,
    deviceType,
    message: data.message,
    severity: data.severity || 'high'
  });
};

const createAlert = async (alertData) => {
  // Check if similar unresolved alert already exists
  const existingAlert = await Alert.findOne({
    deviceId: alertData.deviceId,
    alertType: alertData.alertType,
    resolved: false
  });

  if (!existingAlert) {
    const alert = new Alert(alertData);
    await alert.save();
    console.log(`Alert created: ${alertData.alertType} for ${alertData.deviceId}`);
  }
};

const publishMessage = (topic, message) => {
  if (mqttClient && mqttClient.connected) {
    mqttClient.publish(topic, JSON.stringify(message), { qos: 1 });
    return true;
  }
  return false;
};

const disconnectMQTT = () => {
  if (mqttClient) {
    mqttClient.end();
    console.log('MQTT client disconnected');
  }
};

module.exports = {
  connectMQTT,
  publishMessage,
  disconnectMQTT,
  getMQTTClient: () => mqttClient
};