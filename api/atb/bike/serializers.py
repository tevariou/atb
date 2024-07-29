from django.contrib.auth import models as django_models
from guardian.shortcuts import remove_perm
from guardian.utils import get_anonymous_user
from rest_framework import serializers
from rest_framework_guardian import serializers as guardian_serializers

from atb.bike import models


class ComponentObjectPermissionsAssignmentMixin(
    guardian_serializers.ObjectPermissionsAssignmentMixin
):
    def get_permissions_map(self, created):
        owner = self.instance.owner
        staff = django_models.Group.objects.get_or_create(name="staff")
        users = django_models.Group.objects.get_or_create(name="users")
        anon = get_anonymous_user()

        permissions_map = {
            f"add_{self.Meta.model.__name__.lower()}": [],
            f"view_{self.Meta.model.__name__.lower()}": [],
            f"change_{self.Meta.model.__name__.lower()}": [],
            f"delete_{self.Meta.model.__name__.lower()}": [],
        }

        if created:
            # clear old permissions
            for perm in permissions_map.keys():
                for assignee in [owner, staff, users, anon]:
                    remove_perm(perm, assignee, self.instance)

        status = self.validated_data.get("status")
        match status:
            case models.Component.StatusChoices.PRIVATE:
                permissions_map = {
                    f"add_{self.Meta.model.__name__.lower()}": [
                        owner,
                    ],
                    f"view_{self.Meta.model.__name__.lower()}": [
                        owner,
                    ],
                    f"change_{self.Meta.model.__name__.lower()}": [
                        owner,
                    ],
                    f"delete_{self.Meta.model.__name__.lower()}": [
                        owner,
                    ],
                }
            case models.Component.StatusChoices.PUBLIC:
                permissions_map = {
                    f"add_{self.Meta.model.__name__.lower()}": [
                        owner,
                    ],
                    f"view_{self.Meta.model.__name__.lower()}": [
                        anon,
                        users,
                        staff,
                    ],
                    f"change_{self.Meta.model.__name__.lower()}": [
                        owner,
                    ],
                    f"delete_{self.Meta.model.__name__.lower()}": [
                        owner,
                    ],
                }
            case (
                models.Component.StatusChoices.AWAITING_APPROVAL
                | models.Component.StatusChoices.REJECTED
            ):
                permissions_map = {
                    f"add_{self.Meta.model.__name__.lower()}": [
                        staff,
                    ],
                    f"view_{self.Meta.model.__name__.lower()}": [
                        owner,
                        staff,
                    ],
                    f"change_{self.Meta.model.__name__.lower()}": [
                        staff,
                    ],
                    f"delete_{self.Meta.model.__name__.lower()}": [
                        staff,
                        owner,
                    ],
                }
            case models.Component.StatusChoices.PUBLISHED:
                permissions_map = {
                    f"add_{self.Meta.model.__name__.lower()}": [
                        staff,
                    ],
                    f"view_{self.Meta.model.__name__.lower()}": [
                        anon,
                        users,
                        staff,
                    ],
                    f"change_{self.Meta.model.__name__.lower()}": [
                        staff,
                    ],
                    f"delete_{self.Meta.model.__name__.lower()}": [
                        staff,
                    ],
                }

        return permissions_map


class BikeSerializer(
    ComponentObjectPermissionsAssignmentMixin, serializers.ModelSerializer
):
    class Meta:
        model = models.Bike
        fields = "__all__"


class BrandSerializer(
    ComponentObjectPermissionsAssignmentMixin, serializers.ModelSerializer
):
    class Meta:
        model = models.Brand
        fields = "__all__"


class FrameSerializer(
    ComponentObjectPermissionsAssignmentMixin, serializers.ModelSerializer
):
    class Meta:
        model = models.Frame
        fields = "__all__"


class ForkSerializer(
    ComponentObjectPermissionsAssignmentMixin, serializers.ModelSerializer
):
    class Meta:
        model = models.Fork
        fields = "__all__"


class SaddleSerializer(
    ComponentObjectPermissionsAssignmentMixin, serializers.ModelSerializer
):
    class Meta:
        model = models.Saddle
        fields = "__all__"


class SeatpostSerializer(
    ComponentObjectPermissionsAssignmentMixin, serializers.ModelSerializer
):
    class Meta:
        model = models.Seatpost
        fields = "__all__"


class CrankSerializer(
    ComponentObjectPermissionsAssignmentMixin, serializers.ModelSerializer
):
    class Meta:
        model = models.Crank
        fields = "__all__"


class PedalSerializer(
    ComponentObjectPermissionsAssignmentMixin, serializers.ModelSerializer
):
    class Meta:
        model = models.Pedal
        fields = "__all__"


class TireSetSerializer(
    ComponentObjectPermissionsAssignmentMixin, serializers.ModelSerializer
):
    class Meta:
        model = models.TireSet
        fields = "__all__"


class WheelSetSerializer(
    ComponentObjectPermissionsAssignmentMixin, serializers.ModelSerializer
):
    class Meta:
        model = models.WheelSet
        fields = "__all__"


class ChainringSerializer(
    ComponentObjectPermissionsAssignmentMixin, serializers.ModelSerializer
):
    class Meta:
        model = models.Chainring
        fields = "__all__"


class CassetteSerializer(
    ComponentObjectPermissionsAssignmentMixin, serializers.ModelSerializer
):
    class Meta:
        model = models.Cassette
        fields = "__all__"


class StemSerializer(
    ComponentObjectPermissionsAssignmentMixin, serializers.ModelSerializer
):
    class Meta:
        model = models.Stem
        fields = "__all__"


class ExternalHeadsetSerializer(
    ComponentObjectPermissionsAssignmentMixin, serializers.ModelSerializer
):
    class Meta:
        model = models.ExternalHeadset
        fields = "__all__"


class HandlebarSerializer(
    ComponentObjectPermissionsAssignmentMixin, serializers.ModelSerializer
):
    class Meta:
        model = models.Handlebar
        fields = "__all__"
