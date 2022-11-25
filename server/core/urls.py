"""server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.shortcuts import render
from django.urls import include, path, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(title="Swagger API Browser", default_version="v1"),
    public=False,
    permission_classes=[permissions.AllowAny],
)


def render_file(request, file_name="index.html"):
    return render(request, file_name)


urlpatterns = [
    re_path(
        r"^swagger/$",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    re_path(r"^redoc/$", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
]

urlpatterns += [
    path("admin/", admin.site.urls),
    path("", render_file),
    path("api/multi_user/", include("multi_user.urls", namespace="api_multi_user")),
    path("api/appointments/", include("appointments.urls", namespace="api_appointment")),
    path("api/bills/", include("bills.urls", namespace="api_bill")),
    re_path("(?!api).*/", render_file),
]

handler404 = "utils.views.error_404"
