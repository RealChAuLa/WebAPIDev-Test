const mongoose = require('mongoose');

// We use { strict: false } so we don't have to define every field exactly as in seed.json, 
// but we define `id` since we query heavily by `id`.
const ProvinceSchema = new mongoose.Schema({ id: Number }, { collection: 'provinces', strict: false });
const DistrictSchema = new mongoose.Schema({ id: Number }, { collection: 'districts', strict: false });
const StationSchema = new mongoose.Schema({ id: Number }, { collection: 'stations', strict: false });
const VehicleSchema = new mongoose.Schema({ id: Number }, { collection: 'vehicles', strict: false });
const PingSchema = new mongoose.Schema({ id: Number }, { collection: 'pings', strict: false });
const DriverSchema = new mongoose.Schema({ id: Number }, { collection: 'drivers', strict: false });
const TripSchema = new mongoose.Schema({ id: Number }, { collection: 'trips', strict: false });

module.exports = {
  Province: mongoose.model('Province', ProvinceSchema),
  District: mongoose.model('District', DistrictSchema),
  Station: mongoose.model('Station', StationSchema),
  Vehicle: mongoose.model('Vehicle', VehicleSchema),
  Ping: mongoose.model('Ping', PingSchema),
  Driver: mongoose.model('Driver', DriverSchema),
  Trip: mongoose.model('Trip', TripSchema)
};
