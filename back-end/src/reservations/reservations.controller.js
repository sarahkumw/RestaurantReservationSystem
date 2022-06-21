const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const isATime = require("../helpers/isATime");
const isADate = require("../helpers/isADate");
const getDate = require("../helpers/getDate");

const validProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
];

function hasValidFirstName(req, res,next){
  if(!req.body.data){
    next({
      status: 400,
      message: "Please fill in required fields"
    })
  }
  const reqFirstName = req.body.data.first_name;
  if(reqFirstName && reqFirstName.length > 0){
    return next();
  }
  next({
    status: 400,
    message: "Reservation must include a first_name"
  });
};

function hasValidLastName(req, res, next){
  const reqLastName = req.body.data.last_name;
  if(reqLastName && reqLastName.length > 0){
    return next();
  }
  next({
    status: 400,
    message: "Reservation must include a last_name"
  });
};

function hasValidPhoneNumber(req, res, next){
  const reqPhoneNumber = req.body.data.mobile_number;
  if(reqPhoneNumber && reqPhoneNumber.length > 0){
    return next();
  }
  next({
    status: 400,
    message: "Reservation must include a mobile_number"
  });
};

function hasValidDate(req, res, next){
  const reqDate = req.body.data.reservation_date;
  if(reqDate && reqDate.length > 0 && isADate(reqDate)){
    return next();
  }
  next({
    status: 400,
    message: "Reservation must include a reservation_date"
  });
};

function hasValidTime(req, res, next){
  const reqTime = req.body.data.reservation_time;
  if(reqTime && reqTime.length > 0 && isATime(reqTime)){
    return next();
  }
  next({
    status: 400,
    message: "Reservation must include a reservation_time"
  });
}

function hasValidPeople(req, res, next){
  const reqPeople = req.body.data.people;
  if(reqPeople && reqPeople !== 0 && typeof reqPeople === "number"){
    return next();
  }
  next({
    status: 400,
    message: "Reservation must include people"
  });
}

function hasEligibleDateTime(req, res, next){
  const reqDate = req.body.data.reservation_date;
  const reqTime = req.body.data.reservation_time;
  const date = getDate(reqDate, reqTime);
  const todaysDate = new Date();
  let errorMessage = [];
  if(todaysDate >= date){
    errorMessage.push("Reservation must be on future date and time")
  }
  if(date.toString().includes("Tue")){
    errorMessage.push("Restaurant is closed on Tuesdays");
  }

  if(date.getHours() < 10 || (date.getHours() === 10 && date.getMinutes() < 30)){
    errorMessage.push("Restaurant does not open until 10:30")
  }
  if(date.getHours() > 21 || (date.getHours() === 21 && date.getMinutes() > 30)){
    errorMessage.push("Reservation too close to closing time")
  }
  if(errorMessage.length === 0){
    return next();
  }
  next({
    status: 400,
    message: errorMessage.join(", ")
  });
}


function hasStatus(req, res, next){
  const reqStatus = req.body.data.status;
  if(!reqStatus || reqStatus === "booked"){
    return next()
  }
  next({
    status: 400, 
    message: `Reservation has invalid status: ${reqStatus}`
  });
}


function hasValidStatus(req, res, next){
  const validStatus = ["booked", "seated", "finished", "cancelled"];
  if(res.locals.reservation.status === "finished"){
    return next({
      status: 400,
      message: "Cannot update reservation which is 'finished"
    })
  }
  if(validStatus.includes(req.body.data.status)){
    return next();
  }
  next({
    status: 400,
    message: `${req.body.data.status} is not a valid status`
  })
}


async function list(req, res, next) {
  if(req.query.date){
    const date = req.query.date;
    reservationsService
    .listForDate(date)
    .then((data) => {
      data = data.filter((reservation) => reservation.status !== "finished");
      return res.json({ data })
    })
    .catch(next)
  }
  if(req.query.mobile_number){
    const mobile_number = req.query.mobile_number;
    reservationsService
    .search(mobile_number)
    .then((data)=>{
      return res.json({ data })
    })
    .catch(next)
  }

  
  reservationsService
  .list()
  .then((data) => {
    return res.json({ data })
  })
  .catch(next);
};


async function create(req, res, next){
  reservationsService
  .create(req.body.data)
  .then((data) => res.status(201).json({ data }))
  .catch(next);
};


function reservationExists(req, res, next) {
  reservationsService
  .read(req.params.reservation_id)
  .then((reservation) => {
      if (reservation.length > 0) {
        res.locals.reservation = reservation[0];
        return next();
      }
      else {
          next({ status: 404, message: `Reservation ${req.params.reservation_id} cannot be found.` });
      }
    })
  .catch(next);
}


async function read(req, res){
  const { reservation: data } = res.locals;
    res.json({ data });
};


async function update(req, res, next){
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  reservationsService
    .update(updatedReservation)
    .then((data) => {
      data = data[0];
      return res.json({ data });;
    })
    .catch(next);
}


async function updateStatus(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  reservationsService
    .update(updatedReservation)
    .then((data) => {
      data = data[0];
      return res.json({ data });;
    })
    .catch(next);
};


module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasValidFirstName, 
    hasValidLastName,
    hasValidPhoneNumber,
    hasValidDate,
    hasValidTime,
    hasValidPeople,
    hasEligibleDateTime,
    hasStatus,
    asyncErrorBoundary(create)
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    asyncErrorBoundary(reservationExists),
    hasValidFirstName, 
    hasValidLastName,
    hasValidPhoneNumber,
    hasValidDate,
    hasValidTime,
    hasValidPeople,
    hasEligibleDateTime,
    hasStatus,
    asyncErrorBoundary(update)
  ],
  updateStatus: [asyncErrorBoundary(reservationExists), hasValidStatus, asyncErrorBoundary(updateStatus)]
};
