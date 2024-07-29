from atb.bike import filters, models, serializers
from atb.common import views as common_views


class BikeViewSet(common_views.DjangoGuardianModelViewSet):
    queryset = models.Bike.objects.all()
    serializer_class = serializers.BikeSerializer
    filerset_class = filters.BikeFilterSet


class BrandViewSet(common_views.DjangoGuardianModelViewSet):
    queryset = models.Brand.objects.all()
    serializer_class = serializers.BrandSerializer


class FrameViewSet(common_views.DjangoGuardianModelViewSet):
    queryset = models.Frame.objects.all()
    serializer_class = serializers.FrameSerializer


class ForkViewSet(common_views.DjangoGuardianModelViewSet):
    queryset = models.Fork.objects.all()
    serializer_class = serializers.ForkSerializer


class SeatpostViewSet(common_views.DjangoGuardianModelViewSet):
    queryset = models.Seatpost.objects.all()
    serializer_class = serializers.SeatpostSerializer


class SaddleViewSet(common_views.DjangoGuardianModelViewSet):
    queryset = models.Saddle.objects.all()
    serializer_class = serializers.SaddleSerializer


class CrankViewSet(common_views.DjangoGuardianModelViewSet):
    queryset = models.Crank.objects.all()
    serializer_class = serializers.CrankSerializer


class PedalViewSet(common_views.DjangoGuardianModelViewSet):
    queryset = models.Pedal.objects.all()
    serializer_class = serializers.PedalSerializer


class TireSetViewSet(common_views.DjangoGuardianModelViewSet):
    queryset = models.TireSet.objects.all()
    serializer_class = serializers.TireSetSerializer


class WheelSetViewSet(common_views.DjangoGuardianModelViewSet):
    queryset = models.WheelSet.objects.all()
    serializer_class = serializers.WheelSetSerializer


class ChainringViewSet(common_views.DjangoGuardianModelViewSet):
    queryset = models.Chainring.objects.all()
    serializer_class = serializers.ChainringSerializer


class CassetteViewSet(common_views.DjangoGuardianModelViewSet):
    queryset = models.Cassette.objects.all()
    serializer_class = serializers.CassetteSerializer


class StemViewSet(common_views.DjangoGuardianModelViewSet):
    queryset = models.Stem.objects.all()
    serializer_class = serializers.StemSerializer


class ExternalHeadsetViewSet(common_views.DjangoGuardianModelViewSet):
    queryset = models.ExternalHeadset.objects.all()
    serializer_class = serializers.ExternalHeadsetSerializer


class HandlebarViewSet(common_views.DjangoGuardianModelViewSet):
    queryset = models.Handlebar.objects.all()
    serializer_class = serializers.HandlebarSerializer
