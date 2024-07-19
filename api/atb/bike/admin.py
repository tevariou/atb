from django.contrib import admin
from atb.bike.models import Bike


@admin.register(Bike)
class BikeAdmin(admin.ModelAdmin):
    list_filter = ["is_public", "status"]
    