const express = require('express');
const swaggerUi = require('swagger-ui-express');
const app = express();
const PORT = process.env.PORT || 3000;

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
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Western Province' }
        }
      },
      District: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Colombo' },
          province_id: { type: 'integer', example: 1 }
        }
      },
      Station: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Colombo Police Station' },
          district_id: { type: 'integer', example: 1 }
        }
      },
      Vehicle: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          register_number: { type: 'string', example: 'HB-6168' },
          device_id: { type: 'string', example: 'TUK-DEV-520651' },
          station_id: { type: 'integer', example: 4 },
          last_ping: {
            $ref: '#/components/schemas/Ping',
            nullable: true
          }
        }
      },
      Ping: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          vehicle_id: { type: 'integer', example: 1 },
          latitude: { type: 'number', example: 7.312694 },
          longitude: { type: 'number', example: 80.60383 },
          timestamp: { type: 'string', format: 'date-time', example: '2026-06-14T00:00:00Z' }
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
    '/provinces/{provinceId}': {
      get: {
        summary: 'Get province by ID',
        parameters: [{ name: 'provinceId', in: 'path', required: true, schema: { type: 'integer' } }],
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
    '/districts/{districtId}': {
      get: {
        summary: 'Get district by ID',
        parameters: [{ name: 'districtId', in: 'path', required: true, schema: { type: 'integer' } }],
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
    '/stations/{stationId}': {
      get: {
        summary: 'Get station by ID',
        parameters: [{ name: 'stationId', in: 'path', required: true, schema: { type: 'integer' } }],
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
    '/vehicles/{vehicleId}': {
      get: {
        summary: 'Get vehicle by ID',
        parameters: [{ name: 'vehicleId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { content: { 'application/json': { schema: { $ref: '#/components/schemas/Vehicle' } } } },
          '404': { content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      }
    },
    '/vehicles/{vehicleId}/pings': {
      get: {
        summary: 'Get ping history for a vehicle',
        parameters: [{ name: 'vehicleId', in: 'path', required: true, schema: { type: 'integer' } }],
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
function enrichVehicle(v) {
    const pings = seedData.pings.filter(p => String(p.vehicle_id) === String(v.id));
    let lastPing = null;
    if (pings.length > 0) {
        lastPing = pings.reduce((latest, current) => {
            return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest;
        }, pings[0]);
    }
    return { ...v, last_ping: lastPing };
}

// --- ROUTES ---
app.get('/', (req, res) => {
    res.json({ status: 'ok', session: 'NB6007CEM' });
});

app.get('/provinces', (req, res) => res.json(seedData.provinces));
app.get('/provinces/:provinceId', (req, res) => {
    const province = seedData.provinces.find(p => String(p.id) === String(req.params.provinceId));
    if (!province) return res.status(404).json({ error: 'Province not found' });
    res.json(province);
});

app.get('/districts', (req, res) => res.json(seedData.districts));
app.get('/districts/:districtId', (req, res) => {
    const district = seedData.districts.find(d => String(d.id) === String(req.params.districtId));
    if (!district) return res.status(404).json({ error: 'District not found' });
    res.json(district);
});

app.get('/stations', (req, res) => res.json(seedData.stations));
app.get('/stations/:stationId', (req, res) => {
    const station = seedData.stations.find(s => String(s.id) === String(req.params.stationId));
    if (!station) return res.status(404).json({ error: 'Station not found' });
    res.json(station);
});

app.get('/vehicles', (req, res) => res.json(seedData.vehicles.map(enrichVehicle)));
app.get('/vehicles/:vehicleId', (req, res) => {
    const vehicle = seedData.vehicles.find(v => String(v.id) === String(req.params.vehicleId));
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(enrichVehicle(vehicle));
});

app.get('/vehicles/:vehicleId/pings', (req, res) => {
    const vehicle = seedData.vehicles.find(v => String(v.id) === String(req.params.vehicleId));
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    const pings = seedData.pings.filter(p => String(p.vehicle_id) === String(req.params.vehicleId));
    res.json(pings);
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