from django_filters import rest_framework as filters

from atb.bike import models


class BikeFilterSet(filters.FilterSet):
    class Meta:
        model = models.Bike
        fields = ["status"]
