from rest_framework import viewsets
from atb.bike import serializers, models


class BikeViewSet(viewsets.ModelViewSet):
    queryset = models.Bike.objects.all()
    serializer_class = serializers.BikeSerializer


class BrandViewSet(viewsets.ModelViewSet):
    queryset = models.Brand.objects.all()
    serializer_class = serializers.BrandSerializer


class FrameViewSet(viewsets.ModelViewSet):
    queryset = models.Frame.objects.all()
    serializer_class = serializers.FrameSerializer


class ForkViewSet(viewsets.ModelViewSet):
    queryset = models.Fork.objects.all()
    serializer_class = serializers.ForkSerializer


class SaddleViewSet(viewsets.ModelViewSet):
    queryset = models.Saddle.objects.all()
    serializer_class = serializers.SaddleSerializer


class SeatPostViewSet(viewsets.ModelViewSet):
    queryset = models.SeatPost.objects.all()
    serializer_class = serializers.SeatPostSerializer


class CrankViewSet(viewsets.ModelViewSet):
    queryset = models.Crank.objects.all()
    serializer_class = serializers.CrankSerializer


class PedalViewSet(viewsets.ModelViewSet):
    queryset = models.Pedal.objects.all()
    serializer_class = serializers.PedalSerializer


class TireViewSet(viewsets.ModelViewSet):
    queryset = models.Tire.objects.all()
    serializer_class = serializers.TireSerializer


class WheelViewSet(viewsets.ModelViewSet):
    queryset = models.Wheel.objects.all()
    serializer_class = serializers.WheelSerializer


class ChainringViewSet(viewsets.ModelViewSet):
    queryset = models.Chainring.objects.all()
    serializer_class = serializers.ChainringSerializer


class CassetteViewSet(viewsets.ModelViewSet):
    queryset = models.Cassette.objects.all()
    serializer_class = serializers.CassetteSerializer


class StemViewSet(viewsets.ModelViewSet):
    queryset = models.Stem.objects.all()
    serializer_class = serializers.StemSerializer


class ExternalHeadsetUpperCupViewSet(viewsets.ModelViewSet):
    queryset = models.ExternalHeadsetUpperCup.objects.all()
    serializer_class = serializers.ExternalHeadsetUpperCupSerializer


class ExternalHeadsetLowerCupViewSet(viewsets.ModelViewSet):
    queryset = models.ExternalHeadsetLowerCup.objects.all()
    serializer_class = serializers.ExternalHeadsetLowerCupSerializer


class HandlebarViewSet(viewsets.ModelViewSet):
    queryset = models.Handlebar.objects.all()
    serializer_class = serializers.HandlebarSerializer
