# MQTT handlers

## Devices

This is a handler to recive device informations and store it in a system

### Example

#### Create or update

```json
{
	"name": "my-device",
	"type": "ESP",
	"mac_addres": "9a:da:76:f9:f0:3e",
	"to": "Device",
	"from": "Device",
	"event": "DEVICE_CREATE"
}
```

## Sensors

This is a handler to recive from arduino or another device info about a new sensor has been store in system

### Example

#### Create

```json
{
	"mac_addres": "9a:da:76:f9:f0:3e",
	"Sensor": {
		"port": "10",
		"type": "wather-sensor",
		"name": "sensor low"
	},
	"to": "Sesnor",
	"from": "Device",
	"event": "SENSOR_CREATE"
}
```

#### Update

```json
{
	"mac_addres": "9a:da:76:f9:f0:3e",
	"Sensor": {
		"port": "10",
		"type": "wather-sensor",
		"name": "sensor low",
		"value": { "data": 12, "entity": "number", "unity": "J" }
	},
	"to": "Sensor",
	"from": "Device",
	"event": "SENSOR_UPDATE"
}
```

## Actors

This is a handler to recive from arduino or another device info about a new actor has been store in system

### Example

#### Create

```json
{
	"mac_addres": "9a:da:76:f9:f0:3e",
	"Actor": {
		"port": "10",
		"type": "engine",
		"name": "actor low"
	},
	"to": "Actor",
	"from": "Device",
	"event": "ACTOR_CREATE"
}
```

#### Update

```json
{
	"mac_addres": "9a:da:76:f9:f0:3e",
	"Actor": {
		"port": "10",
		"type": "engine",
		"name": "actor low",
		"value": { "data": false, "entity": "boolean", "unity": "engage" }
	},
	"to": "Actor",
	"from": "Device",
	"event": "ACTOR_UPDATE"
}
```
