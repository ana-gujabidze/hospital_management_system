from django.contrib import admin

from multi_user.models import Doctor, Patient, User

admin.site.register(User)
admin.site.register(Patient)
admin.site.register(Doctor)
