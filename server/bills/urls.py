from bills.views import (
    AppointmentBillView,
    DownloadBillsCSVView,
    DownloadSpecificPatientBillsCSVView,
    SpecificPatientTotalBillView,
)
from django.urls import path

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
    path(
        "download_all_bills/",
        DownloadBillsCSVView.as_view(),
        name="download-all-bills",
    ),
    path(
        "download_specific_patient_bills/",
        DownloadSpecificPatientBillsCSVView.as_view(),
        name="download-specific-patient-bills",
    ),
]
