const express = require('express');
const app = express();

const PORT = 3000;

// Load seed data into memory at startup
const seedData = require('./seed.json');

// Helper to attach last_ping to a vehicle
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

// Define the route
app.get('/', (req, res) => {
    res.json({ status: 'ok', session: 'NB6007CEM' });
});

// Provinces routes
app.get('/provinces', (req, res) => {
    res.json(seedData.provinces);
});

app.get('/provinces/:provinceId', (req, res) => {
    const province = seedData.provinces.find(p => String(p.id) === String(req.params.provinceId));
    if (!province) {
        return res.status(404).json({ error: 'Province not found' });
    }
    res.json(province);
});

// Districts routes
app.get('/districts', (req, res) => {
    res.json(seedData.districts);
});

app.get('/districts/:districtId', (req, res) => {
    const district = seedData.districts.find(d => String(d.id) === String(req.params.districtId));
    if (!district) {
        return res.status(404).json({ error: 'District not found' });
    }
    res.json(district);
});

// Stations routes
app.get('/stations', (req, res) => {
    res.json(seedData.stations);
});

app.get('/stations/:stationId', (req, res) => {
    const station = seedData.stations.find(s => String(s.id) === String(req.params.stationId));
    if (!station) {
        return res.status(404).json({ error: 'Station not found' });
    }
    res.json(station);
});

// Vehicles routes
app.get('/vehicles', (req, res) => {
    res.json(seedData.vehicles.map(enrichVehicle));
});

app.get('/vehicles/:vehicleId', (req, res) => {
    const vehicle = seedData.vehicles.find(v => String(v.id) === String(req.params.vehicleId));
    if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(enrichVehicle(vehicle));
});

app.get('/vehicles/:vehicleId/pings', (req, res) => {
    const vehicle = seedData.vehicles.find(v => String(v.id) === String(req.params.vehicleId));
    if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
    }
    const pings = seedData.pings.filter(p => String(p.vehicle_id) === String(req.params.vehicleId));
    res.json(pings);
});

// Start the server
app.listen(PORT, () => {
    console.log(`API is running at http://localhost:${PORT}`);
});
