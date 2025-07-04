from flask import request
from flask_restful import Resource
from resources import (
    ClientList,
    TestAPI,
    Login,
    BarberList,
    ServiceList,
    ReviewList,
    AppointmentList,
    AppointmentDetail,
)
from config import app, db, api

# Local imports
from config import app, db, api
from models import Client, Barber, Service, Appointment, Review


# Routes
api.add_resource(TestAPI, "/")
api.add_resource(Login, "/login")
api.add_resource(ClientList, "/clients")
api.add_resource(BarberList, "/barbers")
api.add_resource(ServiceList, "/services")
api.add_resource(ReviewList, "/reviews")
api.add_resource(AppointmentList, "/appointments")
api.add_resource(AppointmentDetail, "/appointments/<int:id>")


if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5555, debug=True)
