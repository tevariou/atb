from atb.bike.models import Bike
from django.contrib import admin


@admin.register(Bike)
class BikeAdmin(admin.ModelAdmin):
    list_filter = ["is_public", "status"]
