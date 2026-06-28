const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const http = require('http');

const app = express();
const SWAGGER_PORT = 3001;
const TARGET_PORT = 3000;

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Web API Dev Test - REST API Documentation',
    version: '1.0.0',
    description: 'API documentation for server.js serving Sri Lanka provinces, districts, police stations, vehicles, and GPS pings.'
  },
  servers: [
    {
      url: `http://localhost:${SWAGGER_PORT}`,
      description: 'Swagger Proxy Server (Bypasses CORS)'
    },
    {
      url: `http://localhost:${TARGET_PORT}`,
      description: 'Direct API Server (server.js)'
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
        description: 'Returns API status and student session ID.',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    session: { type: 'string', example: 'NB6007CEM' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/provinces': {
      get: {
        summary: 'Get all provinces',
        description: 'Retrieves a list of all provinces.',
        responses: {
          '200': {
            description: 'A list of provinces',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Province' }
                }
              }
            }
          }
        }
      }
    },
    '/provinces/{provinceId}': {
      get: {
        summary: 'Get province by ID',
        description: 'Retrieves details of a specific province by its ID.',
        parameters: [
          {
            name: 'provinceId',
            in: 'path',
            required: true,
            description: 'ID of the province to retrieve',
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '200': {
            description: 'Province details found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Province' }
              }
            }
          },
          '404': {
            description: 'Province not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/districts': {
      get: {
        summary: 'Get all districts',
        description: 'Retrieves a list of all districts.',
        responses: {
          '200': {
            description: 'A list of districts',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/District' }
                }
              }
            }
          }
        }
      }
    },
    '/districts/{districtId}': {
      get: {
        summary: 'Get district by ID',
        description: 'Retrieves details of a specific district by its ID.',
        parameters: [
          {
            name: 'districtId',
            in: 'path',
            required: true,
            description: 'ID of the district to retrieve',
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '200': {
            description: 'District details found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/District' }
              }
            }
          },
          '404': {
            description: 'District not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/stations': {
      get: {
        summary: 'Get all police stations',
        description: 'Retrieves a list of all police stations.',
        responses: {
          '200': {
            description: 'A list of police stations',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Station' }
                }
              }
            }
          }
        }
      }
    },
    '/stations/{stationId}': {
      get: {
        summary: 'Get station by ID',
        description: 'Retrieves details of a specific police station by its ID.',
        parameters: [
          {
            name: 'stationId',
            in: 'path',
            required: true,
            description: 'ID of the station to retrieve',
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '200': {
            description: 'Station details found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Station' }
              }
            }
          },
          '404': {
            description: 'Station not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/vehicles': {
      get: {
        summary: 'Get all vehicles',
        description: 'Retrieves a list of all vehicles along with their latest GPS ping.',
        responses: {
          '200': {
            description: 'A list of vehicles',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Vehicle' }
                }
              }
            }
          }
        }
      }
    },
    '/vehicles/{vehicleId}': {
      get: {
        summary: 'Get vehicle by ID',
        description: 'Retrieves details of a specific vehicle along with its latest GPS ping.',
        parameters: [
          {
            name: 'vehicleId',
            in: 'path',
            required: true,
            description: 'ID of the vehicle to retrieve',
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '200': {
            description: 'Vehicle details found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Vehicle' }
              }
            }
          },
          '404': {
            description: 'Vehicle not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/vehicles/{vehicleId}/pings': {
      get: {
        summary: 'Get ping history for a vehicle',
        description: 'Retrieves all GPS ping records associated with a specific vehicle ID.',
        parameters: [
          {
            name: 'vehicleId',
            in: 'path',
            required: true,
            description: 'ID of the vehicle whose pings to retrieve',
            schema: { type: 'integer', example: 1 }
          }
        ],
        responses: {
          '200': {
            description: 'Ping records retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Ping' }
                }
              }
            }
          },
          '404': {
            description: 'Vehicle not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    }
  }
};

// Save swagger.json to disk for reference or external tools
fs.writeFileSync('./swagger.json', JSON.stringify(swaggerDocument, null, 2), 'utf8');

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Redirect root to /api-docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Proxy handler: forward all API requests to server.js on TARGET_PORT (3000)
app.use((req, res) => {
  const options = {
    hostname: 'localhost',
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `localhost:${TARGET_PORT}` }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    res.status(502).json({
      error: 'Proxy Error: Could not connect to server.js on port ' + TARGET_PORT,
      details: err.message
    });
  });

  if (req.body) {
    proxyReq.write(req.body);
  }
  req.pipe(proxyReq, { end: true });
});

if (require.main === module) {
  app.listen(SWAGGER_PORT, () => {
    console.log(`Swagger UI is running at http://localhost:${SWAGGER_PORT}/api-docs`);
    console.log(`API requests are proxied to server.js at http://localhost:${TARGET_PORT}`);
  });
}

module.exports = { app, swaggerDocument };
