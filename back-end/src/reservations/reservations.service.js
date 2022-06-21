const knex = require("../db/connection");

function list(){
    return knex("reservations").select("*").orderBy(["reservation_date", "reservation_time"]);
}

function listForDate(date){
    return knex("reservations").select("*").where({ reservation_date: date }).orderBy("reservation_time");
}


function create(reservation) {
    return knex("reservations")
      .insert(reservation)
      .returning("*")
      .then((createdRecords) => createdRecords[0]);
}

function read(reservationId) {
    return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId });
}

function update (updatedReservation) {
    return knex ("reservations")
    .select("*")
    .where({ "reservation_id": updatedReservation.reservation_id })
    .update(updatedReservation, "*")
}

function search(mobile_number) {
    return knex("reservations")
        .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date");
}



module.exports = {
    list,
    listForDate,
    create,
    read,
    update,
    search,
};