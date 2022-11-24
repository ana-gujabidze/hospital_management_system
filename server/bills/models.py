from django.db import models
from django.utils import timezone

from appointments.models import Appointment


class Bill(models.Model):

    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, unique=True)
    room_charge = models.IntegerField(default=0)
    doctor_fee = models.IntegerField(default=0)
    medicine_cost = models.IntegerField(default=0)
    other_charge = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.appointment.patient.full_name} {self.appointment.doctor.full_name} {self.appointment.doctor.department} {self.created_at}"
