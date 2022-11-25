from django.db import models
from django.utils import timezone

from multi_user.models import Doctor, Patient


class Appointment(models.Model):
    class DepartmentType(models.TextChoices):
        DENTISRTY = ("Dentistry", "Dentistry")
        CARDIOLOGY = ("Cardiology", "Cardiology")
        ASTROLOGY = ("Astrology", "Astrology")
        NEUROANATOMY = ("Neuroanatomy", "Neuroanatomy")
        OPHTHALMOLOGY = ("Ophthalmogoly", "Ophthalmogoly")
        GYNECOLOGY = ("Gynecology", "Gynecology")

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    hospital_name = models.CharField(max_length=100)
    department = models.CharField(choices=DepartmentType.choices, max_length=100)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.patient.full_name} {self.doctor.full_name} {self.department} {self.start_time}"
