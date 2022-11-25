from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from rest_framework.authtoken.models import Token


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


# Create your models here.
class User(AbstractUser):
    class UserType(models.TextChoices):
        PATIENT = ("patient", "patient")
        DOCTOR = ("doctor", "doctor")
        ADMINISTRATOR = ("administrator", "administrator")

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    user_type = models.CharField(max_length=64, choices=UserType.choices, null=True)

    def __str__(self):
        return self.username


class Patient(models.Model):
    patient = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True
    )
    full_name = models.CharField(max_length=64)
    mobile = models.CharField(max_length=100)
    admited_at = models.DateTimeField(default=timezone.now)
    released_at = models.DateTimeField(null=True, blank=True)
    days_spent = models.PositiveIntegerField(null=True, blank=True)
    disease = models.CharField(max_length=100)
    symptoms = models.CharField(max_length=125)
    status = models.BooleanField(default=False, null=True, blank=True)

    def __str__(self):
        return self.patient.username


class Doctor(models.Model):
    doctor = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=64)
    mobile = models.CharField(max_length=50)
    address = models.CharField(max_length=100)
    department = models.CharField(max_length=100)

    def __str__(self):
        return self.doctor.username


class Administrator(models.Model):
    administrator = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True
    )
    full_name = models.CharField(max_length=64)

    def __str__(self):
        return self.administrator.username
