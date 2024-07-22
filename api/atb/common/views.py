from django_filters import rest_framework as django_filters
from rest_framework import viewsets
from rest_framework.settings import api_settings
from rest_framework_guardian import filters as guardian_filters

from atb.common import permissions


class DjangoGuardianModelViewSet(viewsets.ModelViewSet):
    filter_backends = [
        django_filters.DjangoFilterBackend,
        guardian_filters.ObjectPermissionsFilter,
    ]
    permission_classes = [
        permissions.DjangoGuardianObjectPermissions,
    ] + api_settings.DEFAULT_PERMISSION_CLASSES

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
