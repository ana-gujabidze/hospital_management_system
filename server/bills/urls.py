from django.urls import path

from bills.views import AppointmentBillView, SpecificPatientTotalBillView

app_name = "bills"

urlpatterns = [
    path(
        "registration/bill/<int:appointment_id>/",
        AppointmentBillView.as_view(),
        name="register-bill",
    ),
    path(
        "get/specific_bills/<int:patient_id>/",
        SpecificPatientTotalBillView.as_view(),
        name="get-specific-bills",
    ),
]
