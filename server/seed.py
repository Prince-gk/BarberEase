#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import Client, Barber, Service, Appointment, Review
from config import db
import random


fake = Faker()

print("🌱 Starting seed...")

with app.app_context():
    # Ensure the tables exist
    db.create_all()

    # Clear existing data
    Review.query.delete()
    Appointment.query.delete()
    Client.query.delete()
    Barber.query.delete()
    Service.query.delete()
    db.session.commit()

    # Barbers
    barbers = []
    for _ in range(5):
       barber = Barber(
           name=fake.name(),
           specialty=random.choice(["Fade", "Beard Trim", "Braids", "Color", "Dreadlocks"]),
           phone=fake.phone_number()  
        )
       barbers.append(barber)
    db.session.add_all(barbers)

    # Clients
    clients = []
    for _ in range(10):
        client = Client(
            name=fake.name(),
            email=fake.unique.email(),
            phone=fake.phone_number()
        )
        clients.append(client)
    db.session.add_all(clients)

    # Services
    services = [
        Service(name="Haircut", price=15.0),
        Service(name="Beard Trim", price=10.0),
        Service(name="Haircut & Beard", price=20.0),
        Service(name="Braiding", price=25.0),
        Service(name="Hair Dye", price=30.0)
    ]
    db.session.add_all(services)
    db.session.commit()

    # Appointments
    appointments = []
    for _ in range(15):
        appointment = Appointment(
            client_id=random.choice(clients).id,
            barber_id=random.choice(barbers).id,
            service_id=random.choice(services).id,
            date_time=fake.date_time_between(start_date='-10d', end_date='+10d'),
            status=random.choice(["Scheduled", "Completed", "Cancelled"])
        )
        appointments.append(appointment)
    db.session.add_all(appointments)
    db.session.commit()

    # Reviews (only for completed appointments)
    reviews = []
    for appt in appointments:
        if appt.status == "Completed":
            review = Review(
                client_id=appt.client_id,
                barber_id=appt.barber_id,
                appointment_id=appt.id,
                rating=random.randint(3, 5),
                comment=fake.sentence()
            )
            reviews.append(review)
    db.session.add_all(reviews)
    db.session.commit()

    print("✅ Done seeding!")