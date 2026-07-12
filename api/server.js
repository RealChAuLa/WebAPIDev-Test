const express = require('express');
const swaggerUi = require('swagger-ui-express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Load seed data
const seedData = require('./seed.json');

// --- SWAGGER CONFIGURATION ---
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Web API Dev Test - REST API Documentation',
    version: '1.0.0',
    description: 'API documentation for Sri Lanka provinces, districts, police stations, vehicles, and GPS pings.'
  },
  servers: [
    {
      url: `/`,
      description: 'Vercel Server'
    }
  ],
  components: {
    schemas: {
      Province: {
        type: 'object',
        properties: {
          province_id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Western Province' }
        }
      },
      District: {
        type: 'object',
        properties: {
          district_id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Colombo' },
          province_id: { type: 'integer', example: 1 }
        }
      },
      Station: {
        type: 'object',
        properties: {
          station_id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Colombo Police Station' },
          district_id: { type: 'integer', example: 1 }
        }
      },
      Vehicle: {
        type: 'object',
        properties: {
          vehicle_id: { type: 'integer', example: 1 },
          reg_number: { type: 'string', example: 'HB-6168' },
          device_id: { type: 'string', example: 'TUK-DEV-520651' },
          station_id: { type: 'integer', example: 4 }
        }
      },
      VehicleComposite: {
        type: 'object',
        properties: {
          vehicle_id: { type: 'integer', example: 1 },
          reg_number: { type: 'string', example: 'HB-6168' },
          device_id: { type: 'string', example: 'TUK-DEV-520651' },
          station_id: { type: 'integer', example: 4 },
          last_ping: {
            $ref: '#/components/schemas/Ping',
            nullable: true
          }
        }
      },
      LastPosition: {
        type: 'object',
        properties: {
          vehicle_id: { type: 'integer', example: 1 },
          timestamp: { type: 'string', format: 'date-time', example: '2026-06-14T00:00:00Z' },
          lat: { type: 'number', example: 7.312694 },
          lng: { type: 'number', example: 80.60383 },
          speed: { type: 'number', example: 45.5 }
        }
      },
      Ping: {
        type: 'object',
        properties: {
          ping_id: { type: 'integer', example: 1 },
          vehicle_id: { type: 'integer', example: 1 },
          timestamp: { type: 'string', format: 'date-time', example: '2026-06-14T00:00:00Z' },
          lat: { type: 'number', example: 7.312694 },
          lng: { type: 'number', example: 80.60383 },
          speed: { type: 'number', example: 45.5 }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Resource not found' }
        }
      }
    }
  },
  paths: {
    '/': {
      get: {
        summary: 'Health check endpoint',
        responses: {
          '200': {
            description: 'Successful response',
            content: { 'application/json': { schema: { type: 'object' } } }
          }
        }
      }
    },
    '/provinces': {
      get: {
        summary: 'Get all provinces',
        responses: {
          '200': {
            description: 'A list of provinces',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Province' } } } }
          }
        }
      }
    },
    '/provinces/{id}': {
      get: {
        summary: 'Get province by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { content: { 'application/json': { schema: { $ref: '#/components/schemas/Province' } } } },
          '404': { content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      }
    },
    '/districts': {
      get: {
        summary: 'Get all districts',
        responses: {
          '200': { content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/District' } } } } }
        }
      }
    },
    '/districts/{id}': {
      get: {
        summary: 'Get district by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { content: { 'application/json': { schema: { $ref: '#/components/schemas/District' } } } },
          '404': { content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      }
    },
    '/stations': {
      get: {
        summary: 'Get all police stations',
        responses: {
          '200': { content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Station' } } } } }
        }
      }
    },
    '/stations/{id}': {
      get: {
        summary: 'Get station by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { content: { 'application/json': { schema: { $ref: '#/components/schemas/Station' } } } },
          '404': { content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      }
    },
    '/vehicles': {
      get: {
        summary: 'Get all vehicles',
        responses: {
          '200': { content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Vehicle' } } } } }
        }
      }
    },
    '/vehicles/{id}': {
      get: {
        summary: 'Get vehicle composite by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { content: { 'application/json': { schema: { $ref: '#/components/schemas/VehicleComposite' } } } },
          '404': { content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      }
    },
    '/vehicles/{id}/last-position': {
      get: {
        summary: 'Get most recent position for a vehicle',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { content: { 'application/json': { schema: { $ref: '#/components/schemas/LastPosition' } } } },
          '404': { content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      }
    },
    '/vehicles/{id}/pings': {
      get: {
        summary: 'Get ping history for a vehicle',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Ping' } } } } },
          '404': { content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      }
    }
  }
};

// Serve Swagger UI
const swaggerUiOptions = { customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css' };
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));

// --- HELPER FUNCTIONS ---
const deviceKeys = {
    "v-01": "key_v01",
    "v-02": "key_v02"
};
seedData.vehicles.forEach(v => {
    const idStr = String(v.id);
    const paddedId = idStr.padStart(2, '0');
    deviceKeys[idStr] = `key_v${paddedId}`;
    deviceKeys[`v-${paddedId}`] = `key_v${paddedId}`;
    deviceKeys[`v-${idStr}`] = `key_v${paddedId}`;
    deviceKeys[`key_${idStr}`] = `key_${idStr}`;
});

function findVehicle(vehicleId) {
    const idStr = String(vehicleId);
    return seedData.vehicles.find(v => 
        String(v.id) === idStr || 
        `v-${String(v.id).padStart(2, '0')}` === idStr || 
        `v-${v.id}` === idStr ||
        String(v.id) === idStr.replace(/^v-0*/, '') ||
        String(v.id) === idStr.replace(/^v-/, '')
    );
}

function getLastPing(vehicleId) {
    const pings = seedData.pings
        .filter(p => String(p.vehicle_id) === String(vehicleId))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return pings[0] || null;
}

function mapPing(p) {
    if (!p) return null;
    return {
        ping_id: p.id,
        vehicle_id: p.vehicle_id,
        timestamp: p.timestamp,
        lat: p.latitude,
        lng: p.longitude,
        speed: p.speed !== undefined ? p.speed : null
    };
}

// --- ROUTES ---
app.get('/', (req, res) => {
    res.json({ status: 'ok', session: 'NB6007CEM' });
});

app.get('/provinces', (req, res) => {
    res.json(seedData.provinces.map(p => ({
        province_id: p.id,
        name: p.name
    })));
});

app.get('/provinces/:id', (req, res) => {
    const province = seedData.provinces.find(p => String(p.id) === String(req.params.id));
    if (!province) return res.status(404).json({ error: 'Province not found' });
    res.json({
        province_id: province.id,
        name: province.name
    });
});

app.get('/districts', (req, res) => {
    res.json(seedData.districts.map(d => ({
        district_id: d.id,
        name: d.name,
        province_id: d.province_id
    })));
});

app.get('/districts/:id', (req, res) => {
    const district = seedData.districts.find(d => String(d.id) === String(req.params.id));
    if (!district) return res.status(404).json({ error: 'District not found' });
    res.json({
        district_id: district.id,
        name: district.name,
        province_id: district.province_id
    });
});

app.get('/stations', (req, res) => {
    res.json(seedData.stations.map(s => ({
        station_id: s.id,
        name: s.name,
        district_id: s.district_id
    })));
});

app.get('/stations/:id', (req, res) => {
    const station = seedData.stations.find(s => String(s.id) === String(req.params.id));
    if (!station) return res.status(404).json({ error: 'Station not found' });
    res.json({
        station_id: station.id,
        name: station.name,
        district_id: station.district_id
    });
});

app.get('/vehicles', (req, res) => {
    res.json(seedData.vehicles.map(v => ({
        vehicle_id: v.id,
        reg_number: v.register_number,
        device_id: v.device_id,
        station_id: v.station_id
    })));
});

app.get('/vehicles/:id/last-position', (req, res) => {
    const vehicle = findVehicle(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    const lastPingRaw = getLastPing(vehicle.id);
    if (!lastPingRaw) return res.status(404).json({ error: 'No position history found for this vehicle' });
    res.json({
        vehicle_id: lastPingRaw.vehicle_id,
        timestamp: lastPingRaw.timestamp,
        lat: lastPingRaw.latitude,
        lng: lastPingRaw.longitude,
        speed: lastPingRaw.speed !== undefined ? lastPingRaw.speed : null
    });
});

app.get('/vehicles/:id', (req, res) => {
    const vehicle = findVehicle(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    const lastPingRaw = getLastPing(vehicle.id);
    res.json({
        vehicle_id: vehicle.id,
        reg_number: vehicle.register_number,
        device_id: vehicle.device_id,
        station_id: vehicle.station_id,
        last_ping: mapPing(lastPingRaw)
    });
});

app.get('/vehicles/:id/pings', (req, res) => {
    const vehicle = findVehicle(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    const pings = seedData.pings.filter(p => String(p.vehicle_id) === String(vehicle.id) || String(p.vehicle_id) === String(req.params.id));
    res.json(pings.map(p => ({
        ping_id: p.id,
        vehicle_id: p.vehicle_id,
        timestamp: p.timestamp,
        lat: p.latitude,
        lng: p.longitude,
        speed: p.speed !== undefined ? p.speed : null
    })));
});

app.post('/vehicles/:id/pings', (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).json({ error: 'X-API-Key header is required' });
    }

    const expectedKey = deviceKeys[req.params.id] || (
        String(req.params.id).startsWith('v-') 
            ? `key_${String(req.params.id).replace('-', '')}` 
            : `key_v${String(req.params.id).padStart(2, '0')}`
    );
    if (apiKey !== expectedKey) {
        return res.status(403).json({ error: 'Forbidden: Invalid API key' });
    }

    const vehicle = findVehicle(req.params.id);
    if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
    }

    const { latitude, longitude, speed } = req.body || {};
    if (latitude === undefined || longitude === undefined || speed === undefined ||
        latitude === null || longitude === null || speed === null ||
        Number.isNaN(Number(latitude)) || Number.isNaN(Number(longitude)) || Number.isNaN(Number(speed))) {
        return res.status(400).json({ error: 'Missing or invalid latitude, longitude, or speed' });
    }

    const newPingId = seedData.pings.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0) + 1;
    const timestamp = new Date().toISOString();
    const newPing = {
        id: newPingId,
        vehicle_id: vehicle.id,
        latitude: Number(latitude),
        longitude: Number(longitude),
        speed: Number(speed),
        timestamp: timestamp
    };

    seedData.pings.push(newPing);

    const crypto = require('crypto');
    const etag = `"${crypto.createHash('md5').update(JSON.stringify(newPing)).digest('hex')}"`;
    res.setHeader('Location', `/vehicles/${req.params.id}/pings/${newPingId}`);
    res.setHeader('ETag', etag);
    res.setHeader('Last-Modified', new Date(timestamp).toUTCString());

    return res.status(201).json({
        ping_id: newPingId,
        vehicle_id: vehicle.id,
        timestamp: timestamp,
        lat: Number(latitude),
        lng: Number(longitude),
        speed: Number(speed)
    });
});

// Start the server only for local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`API is running at http://localhost:${PORT}`);
        console.log(`Swagger UI is running at http://localhost:${PORT}/api-docs`);
    });
}

// Export the app for Vercel's serverless environment
module.exports = app;