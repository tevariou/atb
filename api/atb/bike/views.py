from atb.bike import models, serializers
from rest_framework import viewsets


class BikeModelViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        if queryset := super().get_queryset():
            return queryset.filter(owner=self.request.user) | queryset.filter(
                is_public=True
            ).filter(status=models.Bike.StatusChoices.APPROVED)


class BikeViewSet(BikeModelViewSet):
    queryset = models.Bike.objects.all()
    serializer_class = serializers.BikeSerializer


class BrandViewSet(BikeModelViewSet):
    queryset = models.Brand.objects.all()
    serializer_class = serializers.BrandSerializer


class FrameViewSet(BikeModelViewSet):
    queryset = models.Frame.objects.all()
    serializer_class = serializers.FrameSerializer


class ForkViewSet(BikeModelViewSet):
    queryset = models.Fork.objects.all()
    serializer_class = serializers.ForkSerializer


class SeatpostViewSet(BikeModelViewSet):
    queryset = models.Seatpost.objects.all()
    serializer_class = serializers.SeatpostSerializer


class SaddleViewSet(BikeModelViewSet):
    queryset = models.Saddle.objects.all()
    serializer_class = serializers.SaddleSerializer


class CrankViewSet(BikeModelViewSet):
    queryset = models.Crank.objects.all()
    serializer_class = serializers.CrankSerializer


class PedalViewSet(BikeModelViewSet):
    queryset = models.Pedal.objects.all()
    serializer_class = serializers.PedalSerializer


class TireViewSet(BikeModelViewSet):
    queryset = models.Tire.objects.all()
    serializer_class = serializers.TireSerializer


class WheelViewSet(BikeModelViewSet):
    queryset = models.Wheel.objects.all()
    serializer_class = serializers.WheelSerializer


class ChainringViewSet(BikeModelViewSet):
    queryset = models.Chainring.objects.all()
    serializer_class = serializers.ChainringSerializer


class CassetteViewSet(BikeModelViewSet):
    queryset = models.Cassette.objects.all()
    serializer_class = serializers.CassetteSerializer


class StemViewSet(BikeModelViewSet):
    queryset = models.Stem.objects.all()
    serializer_class = serializers.StemSerializer


class ExternalHeadsetUpperCupViewSet(BikeModelViewSet):
    queryset = models.ExternalHeadsetUpperCup.objects.all()
    serializer_class = serializers.ExternalHeadsetUpperCupSerializer


class ExternalHeadsetLowerCupViewSet(BikeModelViewSet):
    queryset = models.ExternalHeadsetLowerCup.objects.all()
    serializer_class = serializers.ExternalHeadsetLowerCupSerializer


class HandlebarViewSet(BikeModelViewSet):
    queryset = models.Handlebar.objects.all()
    serializer_class = serializers.HandlebarSerializer
