import mongoose from 'mongoose';
import { Router } from 'express';
import Housing from '../model/housing';

export default({ config, db }) => {
  let api = Router();

/**     CRUD
  Create Read Update Delete
**/

  // Create
  // '/housing/add'
  api.post('/add', (req, res) => {
    let newHouse = new Housing();
    newHouse.SaleID = req.body.SaleID;
    newHouse.ZPID = req.body.ZPID;
    newHouse.Address = req.body.Address;
    newHouse.Locality = req.body.Locality;
    newHouse.State = req.body.State;
    newHouse.ZipCode = req.body.ZipCode;
    newHouse.Price = req.body.Price;
    newHouse.Latitude = req.body.Latitude;
    newHouse.Longitude = req.body.Longitude;
    newHouse.Bedrooms = req.body.Bedrooms;
    newHouse.Bathrooms = req.body.Bathrooms;
    newHouse.EstimatedRent = req.body.EstimatedRent;

    newHouse.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Housing saved successfully'});
    });
  });

 // filter by state 'housing/bed/bath/area/price/erp'
  api.get('/:State/Bed=:Bedrooms/Bath=:Bathrooms/Area=:AreaSpace_SQFT/Price=:Price/estRent=:EstimatedRent/', (req, res) => {
    let st  = req.params.State;
    let bed = req.params.Bedrooms;
    let bath = req.params.Bathrooms;
    let area = req.params.AreaSpace_SQFT;
    let price = req.params.Price;
    let estRent = req.params.EstimatedRent;
    Housing.find({'State' : st, 'Bedrooms' : {$eq : bed}, 'Bathrooms' : {$eq : bath}, 'AreaSpace_SQFT' : {$lte : area}, 'Price' : {$lte : price}, 'EstimatedRent' : {$lte : estRent}}, {'Address': 1, 'State' : 1, 'Locality': 1, 'ZipCode' : 1, 'Price':1, 'AreaSpace_SQFT' :1, 'EstimatedRent' :1}, (err, housings) => {
      if (err){
        res.send(err);
      }
      res.send(housings);
      });
  });

  // filter by state and Locality 'housing/bed/bath/area/price/erp'
   api.get('/:State/:Locality/Bed=:Bedrooms/Bath=:Bathrooms/Area=:AreaSpace_SQFT/Price=:Price/estRent=:EstimatedRent', (req, res) => {
     let st  = req.params.State;
     let lc  = req.params.Locality;
     let bed = req.params.Bedrooms;
     let bath = req.params.Bathrooms;
     let area = req.params.AreaSpace_SQFT;
     let price = req.params.Price;
     let estRent = req.params.EstimatedRent;
     Housing.find({'State' : st, 'Locality' : lc, 'Bedrooms' : {$eq : bed}, 'Bathrooms' : {$eq : bath}, 'AreaSpace_SQFT' : {$lte : area}, 'Price' : {$lte : price}, 'EstimatedRent' : {$lte : estRent}}, {'Address': 1, 'State' : 1, 'Locality': 1, 'ZipCode' : 1, 'Price':1, 'AreaSpace_SQFT' :1, 'EstimatedRent' :1}, (err, housings) => {
       if (err){
         res.send(err);
       }
       res.send(housings);
       });
   });

   // filter by state and Locality and zipCode 'housing/bed/bath/area/price/erp'
    api.get('/:State/:Locality/:ZipCode/Bed=:Bedrooms/Bath=:Bathrooms/Area=:AreaSpace_SQFT/Price=:Price/estRent=:EstimatedRent', (req, res) => {
      let st  = req.params.State;
      let lc = req.params.Locality;
      let zp  = req.params.ZipCode;
      let bed = req.params.Bedrooms;
      let bath = req.params.Bathrooms;
      let area = req.params.AreaSpace_SQFT;
      let price = req.params.Price;
      let estRent = req.params.EstimatedRent;
        Housing.find({ 'State': st, 'Locality': lc, 'ZipCode': zp, 'Bedrooms': { $eq: bed }, 'Bathrooms': { $eq: bath }, 'AreaSpace_SQFT': { $lte: area }, 'Price': { $lte: price }, 'EstimatedRent': { $lte: estRent } }, { 'Address': 1, 'State': 1, 'Locality': 1, 'ZipCode': 1, 'Price': 1, 'AreaSpace_SQFT': 1, 'EstimatedRent': 1, 'ZPID': 1}, (err, housings) => {
        if (err){
          res.send(err);
        }
        res.send(housings);
        });
    });

  // 'housing/address' - get estimated rent price of address with fields HouseType, zipCode, Area, Price, Estimated Rent
  api.get('/:Address/', (req, res) => {
      Housing.find({ 'Address': { $regex: req.params.Address, $options: '#' } }, { 'Address': 1, 'Locality': 1, 'State': 1, 'ZipCode': 1, 'Price': 1, 'AreaSpace_SQFT': 1, 'EstimatedRent': 1, 'Status': 1, 'ZPID': 1, 'Avg_Rent' : 1}, (err, housings) => {
      if (err) {
        res.send(err);
      }
      res.send(housings);
    });
  });


  // '/housing - Read all houses and return the selected fields Address, Locality, State, ZipCode and Price
  api.get('/', (req, res) => {
      Housing.find({}, { 'Address': 1, 'Locality': 1, 'State': 1, 'ZipCode': 1, 'Price': 1, 'AreaSpace_SQFT': 1, 'EstimatedRent': 1, 'Status': 1, 'ZPID': 1}, (err, housings) => {
      if (err) {
        res.send(err);
      }
      res.send(housings);
    }).limit(100);
  });

  // '/housing/:State' - Read all houses filtered by State and return the selected fields Address, Locality, State, ZipCode, Price, Area and EstimatedRent
  api.get('/State=:State/:p', (req, res) => {
      Housing.find({ 'State': req.params.State }, { 'Address': 1, 'Locality': 1, 'State': 1, 'ZipCode': 1, 'Price': 1, 'AreaSpace_SQFT': 1, 'EstimatedRent': 1, 'Status': 1, 'ZPID': 1}, {skip : parseInt(req.params.p), limit : parseInt(10)}, (err, housings) => {
      if (err) {
        res.send(err);
      }
      res.send(housings);
    });//.skip(parseInt(req.params.p)).limit(10);
  });

  // 'housing/State=:State?Locality=:Locality' - Read all houses filtered by State, Locality and return the selected fields Address, Locality, State, ZipCode, Price, Area and EstimatedRent
  api.get('/State=:State/Locality=:Locality/:p', (req, res) => {
      Housing.find({ 'State': req.params.State, 'Locality': req.params.Locality }, { 'Address': 1, 'Locality': 1, 'State': 1, 'ZipCode': 1, 'Price': 1, 'AreaSpace_SQFT': 1, 'EstimatedRent': 1, 'Status': 1, 'ZPID': 1}, {skip : parseInt(req.params.p), limit : parseInt(10)}, (err, housings) => {
      if (err) {
        res.send(err);
      }
      res.send(housings);
    });
  });


  // 'housing/State=:State&Locality=:Locality&ZipCode=:ZipCode' - Read all houses filtered by State, Locality, ZipCode and return the selected fields Address, Locality, State, ZipCode, Price, Area and EstimatedRent
  api.get('/State=:State/Locality=:Locality/ZipCode=:ZipCode/:p', (req, res) => {
      Housing.find({ 'State': req.params.State, 'Locality': req.params.Locality, 'ZipCode': req.params.ZipCode }, { 'Address': 1, 'Locality': 1, 'State': 1, 'ZipCode': 1, 'Price': 1, 'AreaSpace_SQFT': 1, 'EstimatedRent': 1, 'Status': 1, 'ZPID': 1}, {skip: parseInt(req.params.p), limit : parseInt(10)}, (err, housings) => {
      if (err) {
        res.send(err);
      }
      res.send(housings);
    });
  });
  
    // 'housing/Address=:Address' - Read all houses search filtered by Address and return the selected fields Address, Locality, State, ZipCode, Price, Area, EstimatedRent
  api.get('/Address=:Address/:p', (req, res) => {
      Housing.find({ 'Address': { $regex: req.params.Address, $options: '#' } }, { 'Address': 1, 'Locality': 1, 'State': 1, 'ZipCode': 1, 'Price': 1, 'AreaSpace_SQFT': 1, 'EstimatedRent': 1, 'Status': 1, 'Description': 1, 'Bedrooms': 1, 'Bathrooms': 1, 'Fact': 1, 'ZPID': 1, 'Avg_Rent' : 1 }, {skip: parseInt(req.params.p), limit : parseInt(10)}, (err, housings) => {
      if (err) {
        res.send(err);
      }
      res.send(housings);
    });
  });

  // '/housing/Coordinates - Read all houses and return the Coordinates ( Longitude and Latitude )
  api.get('/Coordinates/:p', (req, res) => {
    Housing.find({}, {'_id' : 0, 'Longitude' : 1, 'Latitude' : 1}, {skip : parseInt(req.params.p), limit : parseInt(10)},  (err, housings) => {
      if (err) {
        res.send(err);
      }
      res.send(housings);
    });
  });

  // '/housing/Coordinates/:State' - Read all houses filtered by State and return the Coordinates ( Longitude and Latitude )
  api.get('/Coordinates/State=:State/:p', (req, res) => {
    Housing.find({'State': req.params.State}, {'_id' : 0, 'Longitude' : 1, 'Latitude' : 1}, {skip : parseInt(req.params.p), limit : parseInt(10)}, (err, housings) => {
      if (err) {
        res.send(err);
      }
      res.send(housings);
    });
  });


  // 'housing/Coordinates/State=:State?Locality=:Locality' - Read all houses filtered by State, Locality and return the Coordinates ( Longitude and Latitude )
  api.get('/Coordinates/State=:State/Locality=:Locality/:p', (req, res) => {
    Housing.find({'State': req.params.State, 'Locality': req.params.Locality}, {'_id' : 0, 'Longitude' : 1, 'Latitude' : 1}, {skip : parseInt(req.params.p), limit : parseInt(10)}, (err, housings) => {
      if (err) {
        res.send(err);
      }
      res.send(housings);
    });
  });


  // 'housing/Coordinates/State=:State&Locality=:Locality&ZipCode=:ZipCode' - Read all houses filtered by State, Locality, ZipCode and return the Coordinates ( Longitude and Latitude )
  api.get('/Coordinates/State=:State/Locality=:Locality/ZipCode=:ZipCode/:p', (req, res) => {
    Housing.find({'State': req.params.State, 'Locality': req.params.Locality, 'ZipCode': req.params.ZipCode}, {'_id' : 0, 'Longitude' : 1, 'Latitude' : 1}, {skip : parseInt(req.params.p), limit : parseInt(10)}, (err, housings) => {
      if (err) {
        res.send(err);
      }
      res.send(housings);
    });
  });


  //tejasviadded
   // '/housing/Coordinates/:State' - Read all houses filtered by State and return the Coordinates ( Longitude and Latitude )
  api.get('/Coordinates/State=:State/Bed=:Bedrooms/Bath=:Bathrooms/Area=:AreaSpace_SQFT/Price=:Price/estRent=:EstimatedRent/', (req, res) => {
    Housing.find({'State': req.params.State, 'Bedrooms' : {$eq : req.params.Bedrooms}, 'Bathrooms' : {$eq : req.params.Bathrooms}, 'AreaSpace_SQFT' : {$lte : req.params.AreaSpace_SQFT}, 'Price' : {$lte : req.params.Price}, 'EstimatedRent' : {$lte : req.params.EstimatedRent}}, {'_id' : 0, 'Longitude' : 1, 'Latitude' : 1}, {skip : parseInt(req.params.p), limit : parseInt(10)}, (err, housings) => {
      if (err) {
        res.send(err);
      }
      res.send(housings);
    });
  });


  // 'housing/Coordinates/State=:State?Locality=:Locality' - Read all houses filtered by State, Locality and return the Coordinates ( Longitude and Latitude )
  api.get('/Coordinates/State=:State/Locality=:Locality/Bed=:Bedrooms/Bath=:Bathrooms/Area=:AreaSpace_SQFT/Price=:Price/estRent=:EstimatedRent/', (req, res) => {
    Housing.find({'State': req.params.State, 'Locality': req.params.Locality, 'Bedrooms' : {$eq : req.params.Bedrooms}, 'Bathrooms' : {$eq : req.params.Bathrooms}, 'AreaSpace_SQFT' : {$lte : req.params.AreaSpace_SQFT}, 'Price' : {$lte : req.params.Price}, 'EstimatedRent' : {$lte : req.params.EstimatedRent} }, {'_id' : 0, 'Longitude' : 1, 'Latitude' : 1}, {skip : parseInt(req.params.p), limit : parseInt(10)}, (err, housings) => {
      if (err) {
        res.send(err);
      }
      res.send(housings);
    });
  });


  // 'housing/Coordinates/State=:State&Locality=:Locality&ZipCode=:ZipCode' - Read all houses filtered by State, Locality, ZipCode and return the Coordinates ( Longitude and Latitude )
  api.get('/Coordinates/State=:State/Locality=:Locality/ZipCode=:ZipCode/Bed=:Bedrooms/Bath=:Bathrooms/Area=:AreaSpace_SQFT/Price=:Price/estRent=:EstimatedRent/', (req, res) => {
    Housing.find({'State': req.params.State, 'Locality': req.params.Locality, 'ZipCode': req.params.ZipCode, 'Bedrooms' : {$eq : req.params.Bedrooms}, 'Bathrooms' : {$eq : req.params.Bathrooms}, 'AreaSpace_SQFT' : {$lte : req.params.AreaSpace_SQFT}, 'Price' : {$lte : req.params.Price}, 'EstimatedRent' : {$lte : req.params.EstimatedRent}}, {'_id' : 0, 'Longitude' : 1, 'Latitude' : 1}, {skip : parseInt(req.params.p), limit : parseInt(10)}, (err, housings) => {
      if (err) {
        res.send(err);
      }
      res.send(housings);
    });
  });

    // 'housing/Coordinates/Address=:Address' - Read all houses filtered by State, Locality, ZipCode and return the Coordinates ( Longitude and Latitude )
    api.get('/Coordinates/Address=:Address/Bed=:Bedrooms/Bath=:Bathrooms/Area=:AreaSpace_SQFT/Price=:Price/estRent=:EstimatedRent/', (req, res) => {
        Housing.find({ 'Address': { $regex: req.params.Address, $options : '#' }, 'Bedrooms': { $eq: req.params.Bedrooms }, 'Bathrooms': { $eq: req.params.Bathrooms }, 'AreaSpace_SQFT': { $lte: req.params.AreaSpace_SQFT }, 'Price': { $lte: req.params.Price }, 'EstimatedRent': { $lte: req.params.EstimatedRent } }, { '_id': 0, 'Longitude': 1, 'Latitude': 1 }, { skip: parseInt(req.params.p), limit: parseInt(10) }, (err, housings) => {
            if (err) {
                res.send(err);
            }
            res.send(housings);
        });
    });
  //tejasviadded
  
    
  
  // 'housing/:id' - Read
  api.get('/:id', (req, res) => {
    Housing.findById(req.params.id, (err, housing) => {
      if (err) {
        res.send(err);
      }
      res.send(housing);
    });
  });


  // 'housing/:id' - update
  api.put('/:id', (req, res) => {
    Housing.findById(req.params.id, (err, housing) => {
      if (err) {
        res.send(err);
      }
      housing.name = req.body.name;
      housing.save(err => {
        if (err) {
          res.send(err);
        }
        res.json({message: "Housing info updated"});
      });
    });
  });


  // 'housing/:id' - Delete
  api.delete('/:id', (req, res) => {
    Housing.findById(req.params.id, (err, housing) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (housing === null) {
        res.status(404).send("Housing not Found");
        return;
      }
      Housing.remove({
        _id: req.params.id
      }, (err, housing) => {
        if (err) {
          res.status(500).send(err);
          return;
        }
      res.json({ message: "Housing successfully deleted!"});
      });
    });
  });


  return api;
}
