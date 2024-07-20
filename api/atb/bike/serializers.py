from rest_framework import serializers

from atb.bike import models


class BikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Bike
        fields = "__all__"


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Brand
        fields = "__all__"


class FrameSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Frame
        fields = "__all__"


class ForkSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Fork
        fields = "__all__"


class SaddleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Saddle
        fields = "__all__"


class SeatpostSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Seatpost
        fields = "__all__"


class CrankSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Crank
        fields = "__all__"


class PedalSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Pedal
        fields = "__all__"


class TireSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tire
        fields = "__all__"


class WheelSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Wheel
        fields = "__all__"


class ChainringSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Chainring
        fields = "__all__"


class CassetteSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Cassette
        fields = "__all__"


class StemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Stem
        fields = "__all__"


class ExternalHeadsetUpperCupSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ExternalHeadsetUpperCup
        fields = "__all__"


class ExternalHeadsetLowerCupSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ExternalHeadsetLowerCup
        fields = "__all__"


class HandlebarSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Handlebar
        fields = "__all__"
