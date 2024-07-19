from django.urls import include, path
from rest_framework import routers
from atb.bike import views

router = routers.SimpleRouter()

router.register(r"brands", views.BrandViewSet, basename="brands")
router.register(r"bikes", views.BikeViewSet, basename="bikes")
router.register(r"frames", views.FrameViewSet, basename="frames")
router.register(r"forks", views.ForkViewSet, basename="forks")
router.register(r"saddles", views.SaddleViewSet, basename="saddles")
router.register(r"seatposts", views.SeatpostViewSet, basename="seatposts")
router.register(r"cranks", views.CrankViewSet, basename="cranks")
router.register(r"pedals", views.PedalViewSet, basename="pedals")
router.register(r"tires", views.TireViewSet, basename="tires")
router.register(r"wheels", views.WheelViewSet, basename="wheels")
router.register(r"chainrings", views.ChainringViewSet, basename="chainrings")
router.register(r"cassettes", views.CassetteViewSet, basename="cassettes")
router.register(r"stems", views.StemViewSet, basename="stems")
router.register("external-headset-upper-cups", views.ExternalHeadsetUpperCupViewSet, basename="external-headset-upper-cups")
router.register("external-headset-lower-cups", views.ExternalHeadsetLowerCupViewSet, basename="external-headset-lower-cups")
router.register(r"handlebars", views.HandlebarViewSet, basename="handlebars")

urlpatterns = [
    path("", include(router.urls)),
]
