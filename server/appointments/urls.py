from django.urls import path

from appointments.views import (
    AppointmentListView,
    AppointmentRegistrationView,
    AppointmentUpdateView,
    DoctorAppointmentListView,
    PatientAppointmentListView,
    SpecificAppointmentView,
)

app_name = "appointments"

urlpatterns = [
    path(
        "registration/appointment/<int:patient_id>/<int:doctor_id>/",
        AppointmentRegistrationView.as_view(),
        name="register-appointment",
    ),
    path(
        "appointments_list/",
        AppointmentListView.as_view(),
        name="appointments-list",
    ),
    path(
        "patient_appointments_list/<int:patient_id>/",
        PatientAppointmentListView.as_view(),
        name="patient-appointments-list",
    ),
    path(
        "doctor_appointments_list/<int:doctor_id>/",
        DoctorAppointmentListView.as_view(),
        name="doctor-appointments-list",
    ),
    path(
        "appointment_update/",
        AppointmentUpdateView.as_view(),
        name="appointment-update",
    ),
    path(
        "specific_appointment/<int:appointment_id>/",
        SpecificAppointmentView().as_view(),
        name="appointment-user",
    ),
]
