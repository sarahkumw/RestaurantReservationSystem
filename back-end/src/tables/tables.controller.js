const tablesService = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


function reqHasData(req, res, next){
    if(req.body.data){
        return next();
    }
    next({
        status: 400,
        message: "Please fill in required fields."
    })
}


function hasValidTableName(req, res, next){
    const reqTableName = req.body.data.table_name;
        if(reqTableName && (reqTableName.length >= 2)){
            return next();
        }
    next({
        status: 400,
        message: "Table must include table_name"
    })
}


function hasValidCapacity(req, res, next){
    const reqCapacity = req.body.data.capacity;
    if(reqCapacity && reqCapacity >= 1 && typeof reqCapacity === "number"){
        return next();
    }
    next({
        status: 400,
        message: "Table must include capacity"
    });
}


async function tableExists(req, res, next) {
    tablesService
    .read(req.params.table_id)
    .then((table) => {
        if (table.length > 0) {
          res.locals.table = table[0];
          return next();
        }
        else {
            next({ status: 404, message: `Table ${req.params.table_id} cannot be found.` });
        }
      })
    .catch(next);
}


async function hasValidReservation(req, res, next){
    const reservationId = req.body.data.reservation_id;
    if(!reservationId){
       return next({ status: 400, message: `reservation_id is required` });
    };
    reservationsService
    .read(reservationId)
    .then((reservation) => {
        if (reservation.length > 0) {
            res.locals.reservation = reservation[0];
            return next();
        }
        else {
            next({ status: 404, message: `Reservation ${reservationId} cannot be found.` });
        }
    })
    .catch(next);
}


function isSeated(req, res, next){
    if(res.locals.reservation.status === "seated"){
        return next({
            status: 400,
            message: "This reservation has already been seated"
        })
    }
    next();
}


function tableHasCapacity(req, res, next){
    if(res.locals.table.reservation_id){
        next({
            status: 400,
            message: "Table is already occupied"
        })
    }
    if(res.locals.table.capacity < res.locals.reservation.people){
        next({
            status: 400,
            message: "Table does not have enough capacity"
        })
    }
    next()
};


function tableIsOccupied(req, res, next){
    if(res.locals.table.reservation_id){
        return next();
    }
    next({
        status: 400,
        message: "Table is not occupied"
    })
}


async function list(req, res, next){
    tablesService
    .list()
    .then((data) => {
        data.sort((tableA, tableB) => (tableA.table_name > tableB.table_name ? 1 : -1))
        return res.json({ data })
    })
    .catch(next);
}
  

async function create(req, res, next){
    tablesService
    .create(req.body.data)
    .then((data) => {
        return res.status(201).json({ data })
    })
    .catch(next);
};



function read(req, res){
    const { table: data } = res.locals;
      res.json({ data });
};


async function update(req, res, next) {
    const updatedTable = {
      ...req.body.data,
      table_id: res.locals.table.table_id,
    };
    
    tablesService
    .update(updatedTable)
    .then(() => {
        return reservationsService.read(req.body.data.reservation_id)
    })
    .then((foundReservation) => {
        foundReservation = foundReservation[0];
        const updatedReservation = {
            reservation_id: foundReservation.reservation_id,
            status: "seated"
        };
        return reservationsService.update(updatedReservation)
    })
    .then((data) => {
        data = data[0];
        return res.json({ data });;
    })
    .catch(next);
};


async function destroy (req, res,next) {
    const tableId = res.locals.table.table_id;
    tablesService
    .delete(tableId)
    .then(() => {
        return reservationsService.read(res.locals.table.reservation_id)
    })
    .then((foundReservation) => {
        foundReservation = foundReservation[0];
        const updatedReservation = {
            reservation_id: foundReservation.reservation_id,
            status: "finished"
        };
        return reservationsService.update(updatedReservation)
    })
    .then(() => res.sendStatus(200))
    .catch(next);
};




module.exports = {
    list: asyncErrorBoundary(list),
    create: [reqHasData, hasValidTableName, hasValidCapacity, asyncErrorBoundary(create)],
    read: [asyncErrorBoundary(tableExists), read],
    update: [
        reqHasData, 
        asyncErrorBoundary(tableExists), 
        asyncErrorBoundary(hasValidReservation), 
        tableHasCapacity,
        isSeated,
        asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(tableExists), tableIsOccupied, asyncErrorBoundary(destroy)]
};