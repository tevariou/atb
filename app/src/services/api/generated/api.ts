import { apiBaseQuery as api } from "../apiBaseQuery"
const injectedRtkApi = api.injectEndpoints({
  endpoints: build => ({
    bikesList: build.query<BikesListApiResponse, BikesListApiArg>({
      query: () => ({ url: `/bikes/` }),
    }),
    bikesCreate: build.mutation<BikesCreateApiResponse, BikesCreateApiArg>({
      query: queryArg => ({
        url: `/bikes/`,
        method: "POST",
        body: queryArg.bikeRequest,
      }),
    }),
    bikesRetrieve: build.query<BikesRetrieveApiResponse, BikesRetrieveApiArg>({
      query: queryArg => ({ url: `/bikes/${queryArg.id}/` }),
    }),
    bikesUpdate: build.mutation<BikesUpdateApiResponse, BikesUpdateApiArg>({
      query: queryArg => ({
        url: `/bikes/${queryArg.id}/`,
        method: "PUT",
        body: queryArg.bikeRequest,
      }),
    }),
    bikesPartialUpdate: build.mutation<
      BikesPartialUpdateApiResponse,
      BikesPartialUpdateApiArg
    >({
      query: queryArg => ({
        url: `/bikes/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.patchedBikeRequest,
      }),
    }),
    bikesDestroy: build.mutation<BikesDestroyApiResponse, BikesDestroyApiArg>({
      query: queryArg => ({ url: `/bikes/${queryArg.id}/`, method: "DELETE" }),
    }),
    brandsList: build.query<BrandsListApiResponse, BrandsListApiArg>({
      query: () => ({ url: `/brands/` }),
    }),
    brandsCreate: build.mutation<BrandsCreateApiResponse, BrandsCreateApiArg>({
      query: queryArg => ({
        url: `/brands/`,
        method: "POST",
        body: queryArg.brandRequest,
      }),
    }),
    brandsRetrieve: build.query<
      BrandsRetrieveApiResponse,
      BrandsRetrieveApiArg
    >({
      query: queryArg => ({ url: `/brands/${queryArg.id}/` }),
    }),
    brandsUpdate: build.mutation<BrandsUpdateApiResponse, BrandsUpdateApiArg>({
      query: queryArg => ({
        url: `/brands/${queryArg.id}/`,
        method: "PUT",
        body: queryArg.brandRequest,
      }),
    }),
    brandsPartialUpdate: build.mutation<
      BrandsPartialUpdateApiResponse,
      BrandsPartialUpdateApiArg
    >({
      query: queryArg => ({
        url: `/brands/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.patchedBrandRequest,
      }),
    }),
    brandsDestroy: build.mutation<
      BrandsDestroyApiResponse,
      BrandsDestroyApiArg
    >({
      query: queryArg => ({ url: `/brands/${queryArg.id}/`, method: "DELETE" }),
    }),
    cassettesList: build.query<CassettesListApiResponse, CassettesListApiArg>({
      query: () => ({ url: `/cassettes/` }),
    }),
    cassettesCreate: build.mutation<
      CassettesCreateApiResponse,
      CassettesCreateApiArg
    >({
      query: queryArg => ({
        url: `/cassettes/`,
        method: "POST",
        body: queryArg.cassetteRequest,
      }),
    }),
    cassettesRetrieve: build.query<
      CassettesRetrieveApiResponse,
      CassettesRetrieveApiArg
    >({
      query: queryArg => ({ url: `/cassettes/${queryArg.id}/` }),
    }),
    cassettesUpdate: build.mutation<
      CassettesUpdateApiResponse,
      CassettesUpdateApiArg
    >({
      query: queryArg => ({
        url: `/cassettes/${queryArg.id}/`,
        method: "PUT",
        body: queryArg.cassetteRequest,
      }),
    }),
    cassettesPartialUpdate: build.mutation<
      CassettesPartialUpdateApiResponse,
      CassettesPartialUpdateApiArg
    >({
      query: queryArg => ({
        url: `/cassettes/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.patchedCassetteRequest,
      }),
    }),
    cassettesDestroy: build.mutation<
      CassettesDestroyApiResponse,
      CassettesDestroyApiArg
    >({
      query: queryArg => ({
        url: `/cassettes/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    chainringsList: build.query<
      ChainringsListApiResponse,
      ChainringsListApiArg
    >({
      query: () => ({ url: `/chainrings/` }),
    }),
    chainringsCreate: build.mutation<
      ChainringsCreateApiResponse,
      ChainringsCreateApiArg
    >({
      query: queryArg => ({
        url: `/chainrings/`,
        method: "POST",
        body: queryArg.chainringRequest,
      }),
    }),
    chainringsRetrieve: build.query<
      ChainringsRetrieveApiResponse,
      ChainringsRetrieveApiArg
    >({
      query: queryArg => ({ url: `/chainrings/${queryArg.id}/` }),
    }),
    chainringsUpdate: build.mutation<
      ChainringsUpdateApiResponse,
      ChainringsUpdateApiArg
    >({
      query: queryArg => ({
        url: `/chainrings/${queryArg.id}/`,
        method: "PUT",
        body: queryArg.chainringRequest,
      }),
    }),
    chainringsPartialUpdate: build.mutation<
      ChainringsPartialUpdateApiResponse,
      ChainringsPartialUpdateApiArg
    >({
      query: queryArg => ({
        url: `/chainrings/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.patchedChainringRequest,
      }),
    }),
    chainringsDestroy: build.mutation<
      ChainringsDestroyApiResponse,
      ChainringsDestroyApiArg
    >({
      query: queryArg => ({
        url: `/chainrings/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    cranksList: build.query<CranksListApiResponse, CranksListApiArg>({
      query: () => ({ url: `/cranks/` }),
    }),
    cranksCreate: build.mutation<CranksCreateApiResponse, CranksCreateApiArg>({
      query: queryArg => ({
        url: `/cranks/`,
        method: "POST",
        body: queryArg.crankRequest,
      }),
    }),
    cranksRetrieve: build.query<
      CranksRetrieveApiResponse,
      CranksRetrieveApiArg
    >({
      query: queryArg => ({ url: `/cranks/${queryArg.id}/` }),
    }),
    cranksUpdate: build.mutation<CranksUpdateApiResponse, CranksUpdateApiArg>({
      query: queryArg => ({
        url: `/cranks/${queryArg.id}/`,
        method: "PUT",
        body: queryArg.crankRequest,
      }),
    }),
    cranksPartialUpdate: build.mutation<
      CranksPartialUpdateApiResponse,
      CranksPartialUpdateApiArg
    >({
      query: queryArg => ({
        url: `/cranks/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.patchedCrankRequest,
      }),
    }),
    cranksDestroy: build.mutation<
      CranksDestroyApiResponse,
      CranksDestroyApiArg
    >({
      query: queryArg => ({ url: `/cranks/${queryArg.id}/`, method: "DELETE" }),
    }),
    externalHeadsetsList: build.query<
      ExternalHeadsetsListApiResponse,
      ExternalHeadsetsListApiArg
    >({
      query: () => ({ url: `/external-headsets/` }),
    }),
    externalHeadsetsCreate: build.mutation<
      ExternalHeadsetsCreateApiResponse,
      ExternalHeadsetsCreateApiArg
    >({
      query: queryArg => ({
        url: `/external-headsets/`,
        method: "POST",
        body: queryArg.externalHeadsetRequest,
      }),
    }),
    externalHeadsetsRetrieve: build.query<
      ExternalHeadsetsRetrieveApiResponse,
      ExternalHeadsetsRetrieveApiArg
    >({
      query: queryArg => ({ url: `/external-headsets/${queryArg.id}/` }),
    }),
    externalHeadsetsUpdate: build.mutation<
      ExternalHeadsetsUpdateApiResponse,
      ExternalHeadsetsUpdateApiArg
    >({
      query: queryArg => ({
        url: `/external-headsets/${queryArg.id}/`,
        method: "PUT",
        body: queryArg.externalHeadsetRequest,
      }),
    }),
    externalHeadsetsPartialUpdate: build.mutation<
      ExternalHeadsetsPartialUpdateApiResponse,
      ExternalHeadsetsPartialUpdateApiArg
    >({
      query: queryArg => ({
        url: `/external-headsets/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.patchedExternalHeadsetRequest,
      }),
    }),
    externalHeadsetsDestroy: build.mutation<
      ExternalHeadsetsDestroyApiResponse,
      ExternalHeadsetsDestroyApiArg
    >({
      query: queryArg => ({
        url: `/external-headsets/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    forksList: build.query<ForksListApiResponse, ForksListApiArg>({
      query: () => ({ url: `/forks/` }),
    }),
    forksCreate: build.mutation<ForksCreateApiResponse, ForksCreateApiArg>({
      query: queryArg => ({
        url: `/forks/`,
        method: "POST",
        body: queryArg.forkRequest,
      }),
    }),
    forksRetrieve: build.query<ForksRetrieveApiResponse, ForksRetrieveApiArg>({
      query: queryArg => ({ url: `/forks/${queryArg.id}/` }),
    }),
    forksUpdate: build.mutation<ForksUpdateApiResponse, ForksUpdateApiArg>({
      query: queryArg => ({
        url: `/forks/${queryArg.id}/`,
        method: "PUT",
        body: queryArg.forkRequest,
      }),
    }),
    forksPartialUpdate: build.mutation<
      ForksPartialUpdateApiResponse,
      ForksPartialUpdateApiArg
    >({
      query: queryArg => ({
        url: `/forks/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.patchedForkRequest,
      }),
    }),
    forksDestroy: build.mutation<ForksDestroyApiResponse, ForksDestroyApiArg>({
      query: queryArg => ({ url: `/forks/${queryArg.id}/`, method: "DELETE" }),
    }),
    framesList: build.query<FramesListApiResponse, FramesListApiArg>({
      query: () => ({ url: `/frames/` }),
    }),
    framesCreate: build.mutation<FramesCreateApiResponse, FramesCreateApiArg>({
      query: queryArg => ({
        url: `/frames/`,
        method: "POST",
        body: queryArg.frameRequest,
      }),
    }),
    framesRetrieve: build.query<
      FramesRetrieveApiResponse,
      FramesRetrieveApiArg
    >({
      query: queryArg => ({ url: `/frames/${queryArg.id}/` }),
    }),
    framesUpdate: build.mutation<FramesUpdateApiResponse, FramesUpdateApiArg>({
      query: queryArg => ({
        url: `/frames/${queryArg.id}/`,
        method: "PUT",
        body: queryArg.frameRequest,
      }),
    }),
    framesPartialUpdate: build.mutation<
      FramesPartialUpdateApiResponse,
      FramesPartialUpdateApiArg
    >({
      query: queryArg => ({
        url: `/frames/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.patchedFrameRequest,
      }),
    }),
    framesDestroy: build.mutation<
      FramesDestroyApiResponse,
      FramesDestroyApiArg
    >({
      query: queryArg => ({ url: `/frames/${queryArg.id}/`, method: "DELETE" }),
    }),
    handlebarsList: build.query<
      HandlebarsListApiResponse,
      HandlebarsListApiArg
    >({
      query: () => ({ url: `/handlebars/` }),
    }),
    handlebarsCreate: build.mutation<
      HandlebarsCreateApiResponse,
      HandlebarsCreateApiArg
    >({
      query: queryArg => ({
        url: `/handlebars/`,
        method: "POST",
        body: queryArg.handlebarRequest,
      }),
    }),
    handlebarsRetrieve: build.query<
      HandlebarsRetrieveApiResponse,
      HandlebarsRetrieveApiArg
    >({
      query: queryArg => ({ url: `/handlebars/${queryArg.id}/` }),
    }),
    handlebarsUpdate: build.mutation<
      HandlebarsUpdateApiResponse,
      HandlebarsUpdateApiArg
    >({
      query: queryArg => ({
        url: `/handlebars/${queryArg.id}/`,
        method: "PUT",
        body: queryArg.handlebarRequest,
      }),
    }),
    handlebarsPartialUpdate: build.mutation<
      HandlebarsPartialUpdateApiResponse,
      HandlebarsPartialUpdateApiArg
    >({
      query: queryArg => ({
        url: `/handlebars/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.patchedHandlebarRequest,
      }),
    }),
    handlebarsDestroy: build.mutation<
      HandlebarsDestroyApiResponse,
      HandlebarsDestroyApiArg
    >({
      query: queryArg => ({
        url: `/handlebars/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    loginCreate: build.mutation<LoginCreateApiResponse, LoginCreateApiArg>({
      query: queryArg => ({
        url: `/login/`,
        method: "POST",
        body: queryArg.userRequest,
      }),
    }),
    logoutCreate: build.mutation<LogoutCreateApiResponse, LogoutCreateApiArg>({
      query: () => ({ url: `/logout/`, method: "POST" }),
    }),
    pedalsList: build.query<PedalsListApiResponse, PedalsListApiArg>({
      query: () => ({ url: `/pedals/` }),
    }),
    pedalsCreate: build.mutation<PedalsCreateApiResponse, PedalsCreateApiArg>({
      query: queryArg => ({
        url: `/pedals/`,
        method: "POST",
        body: queryArg.pedalRequest,
      }),
    }),
    pedalsRetrieve: build.query<
      PedalsRetrieveApiResponse,
      PedalsRetrieveApiArg
    >({
      query: queryArg => ({ url: `/pedals/${queryArg.id}/` }),
    }),
    pedalsUpdate: build.mutation<PedalsUpdateApiResponse, PedalsUpdateApiArg>({
      query: queryArg => ({
        url: `/pedals/${queryArg.id}/`,
        method: "PUT",
        body: queryArg.pedalRequest,
      }),
    }),
    pedalsPartialUpdate: build.mutation<
      PedalsPartialUpdateApiResponse,
      PedalsPartialUpdateApiArg
    >({
      query: queryArg => ({
        url: `/pedals/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.patchedPedalRequest,
      }),
    }),
    pedalsDestroy: build.mutation<
      PedalsDestroyApiResponse,
      PedalsDestroyApiArg
    >({
      query: queryArg => ({ url: `/pedals/${queryArg.id}/`, method: "DELETE" }),
    }),
    profileList: build.query<ProfileListApiResponse, ProfileListApiArg>({
      query: () => ({ url: `/profile/` }),
    }),
    registerCreate: build.mutation<
      RegisterCreateApiResponse,
      RegisterCreateApiArg
    >({
      query: queryArg => ({
        url: `/register/`,
        method: "POST",
        body: queryArg.userRequest,
      }),
    }),
    saddlesList: build.query<SaddlesListApiResponse, SaddlesListApiArg>({
      query: () => ({ url: `/saddles/` }),
    }),
    saddlesCreate: build.mutation<
      SaddlesCreateApiResponse,
      SaddlesCreateApiArg
    >({
      query: queryArg => ({
        url: `/saddles/`,
        method: "POST",
        body: queryArg.saddleRequest,
      }),
    }),
    saddlesRetrieve: build.query<
      SaddlesRetrieveApiResponse,
      SaddlesRetrieveApiArg
    >({
      query: queryArg => ({ url: `/saddles/${queryArg.id}/` }),
    }),
    saddlesUpdate: build.mutation<
      SaddlesUpdateApiResponse,
      SaddlesUpdateApiArg
    >({
      query: queryArg => ({
        url: `/saddles/${queryArg.id}/`,
        method: "PUT",
        body: queryArg.saddleRequest,
      }),
    }),
    saddlesPartialUpdate: build.mutation<
      SaddlesPartialUpdateApiResponse,
      SaddlesPartialUpdateApiArg
    >({
      query: queryArg => ({
        url: `/saddles/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.patchedSaddleRequest,
      }),
    }),
    saddlesDestroy: build.mutation<
      SaddlesDestroyApiResponse,
      SaddlesDestroyApiArg
    >({
      query: queryArg => ({
        url: `/saddles/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    seatpostsList: build.query<SeatpostsListApiResponse, SeatpostsListApiArg>({
      query: () => ({ url: `/seatposts/` }),
    }),
    seatpostsCreate: build.mutation<
      SeatpostsCreateApiResponse,
      SeatpostsCreateApiArg
    >({
      query: queryArg => ({
        url: `/seatposts/`,
        method: "POST",
        body: queryArg.seatpostRequest,
      }),
    }),
    seatpostsRetrieve: build.query<
      SeatpostsRetrieveApiResponse,
      SeatpostsRetrieveApiArg
    >({
      query: queryArg => ({ url: `/seatposts/${queryArg.id}/` }),
    }),
    seatpostsUpdate: build.mutation<
      SeatpostsUpdateApiResponse,
      SeatpostsUpdateApiArg
    >({
      query: queryArg => ({
        url: `/seatposts/${queryArg.id}/`,
        method: "PUT",
        body: queryArg.seatpostRequest,
      }),
    }),
    seatpostsPartialUpdate: build.mutation<
      SeatpostsPartialUpdateApiResponse,
      SeatpostsPartialUpdateApiArg
    >({
      query: queryArg => ({
        url: `/seatposts/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.patchedSeatpostRequest,
      }),
    }),
    seatpostsDestroy: build.mutation<
      SeatpostsDestroyApiResponse,
      SeatpostsDestroyApiArg
    >({
      query: queryArg => ({
        url: `/seatposts/${queryArg.id}/`,
        method: "DELETE",
      }),
    }),
    stemsList: build.query<StemsListApiResponse, StemsListApiArg>({
      query: () => ({ url: `/stems/` }),
    }),
    stemsCreate: build.mutation<StemsCreateApiResponse, StemsCreateApiArg>({
      query: queryArg => ({
        url: `/stems/`,
        method: "POST",
        body: queryArg.stemRequest,
      }),
    }),
    stemsRetrieve: build.query<StemsRetrieveApiResponse, StemsRetrieveApiArg>({
      query: queryArg => ({ url: `/stems/${queryArg.id}/` }),
    }),
    stemsUpdate: build.mutation<StemsUpdateApiResponse, StemsUpdateApiArg>({
      query: queryArg => ({
        url: `/stems/${queryArg.id}/`,
        method: "PUT",
        body: queryArg.stemRequest,
      }),
    }),
    stemsPartialUpdate: build.mutation<
      StemsPartialUpdateApiResponse,
      StemsPartialUpdateApiArg
    >({
      query: queryArg => ({
        url: `/stems/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.patchedStemRequest,
      }),
    }),
    stemsDestroy: build.mutation<StemsDestroyApiResponse, StemsDestroyApiArg>({
      query: queryArg => ({ url: `/stems/${queryArg.id}/`, method: "DELETE" }),
    }),
    tiresList: build.query<TiresListApiResponse, TiresListApiArg>({
      query: () => ({ url: `/tires/` }),
    }),
    tiresCreate: build.mutation<TiresCreateApiResponse, TiresCreateApiArg>({
      query: queryArg => ({
        url: `/tires/`,
        method: "POST",
        body: queryArg.tireSetRequest,
      }),
    }),
    tiresRetrieve: build.query<TiresRetrieveApiResponse, TiresRetrieveApiArg>({
      query: queryArg => ({ url: `/tires/${queryArg.id}/` }),
    }),
    tiresUpdate: build.mutation<TiresUpdateApiResponse, TiresUpdateApiArg>({
      query: queryArg => ({
        url: `/tires/${queryArg.id}/`,
        method: "PUT",
        body: queryArg.tireSetRequest,
      }),
    }),
    tiresPartialUpdate: build.mutation<
      TiresPartialUpdateApiResponse,
      TiresPartialUpdateApiArg
    >({
      query: queryArg => ({
        url: `/tires/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.patchedTireSetRequest,
      }),
    }),
    tiresDestroy: build.mutation<TiresDestroyApiResponse, TiresDestroyApiArg>({
      query: queryArg => ({ url: `/tires/${queryArg.id}/`, method: "DELETE" }),
    }),
    wheelsList: build.query<WheelsListApiResponse, WheelsListApiArg>({
      query: () => ({ url: `/wheels/` }),
    }),
    wheelsCreate: build.mutation<WheelsCreateApiResponse, WheelsCreateApiArg>({
      query: queryArg => ({
        url: `/wheels/`,
        method: "POST",
        body: queryArg.wheelSetRequest,
      }),
    }),
    wheelsRetrieve: build.query<
      WheelsRetrieveApiResponse,
      WheelsRetrieveApiArg
    >({
      query: queryArg => ({ url: `/wheels/${queryArg.id}/` }),
    }),
    wheelsUpdate: build.mutation<WheelsUpdateApiResponse, WheelsUpdateApiArg>({
      query: queryArg => ({
        url: `/wheels/${queryArg.id}/`,
        method: "PUT",
        body: queryArg.wheelSetRequest,
      }),
    }),
    wheelsPartialUpdate: build.mutation<
      WheelsPartialUpdateApiResponse,
      WheelsPartialUpdateApiArg
    >({
      query: queryArg => ({
        url: `/wheels/${queryArg.id}/`,
        method: "PATCH",
        body: queryArg.patchedWheelSetRequest,
      }),
    }),
    wheelsDestroy: build.mutation<
      WheelsDestroyApiResponse,
      WheelsDestroyApiArg
    >({
      query: queryArg => ({ url: `/wheels/${queryArg.id}/`, method: "DELETE" }),
    }),
  }),
  overrideExisting: false,
})
export { injectedRtkApi as enhancedApi }
export type BikesListApiResponse = /** status 200  */ BikeRead[]
export type BikesListApiArg = void
export type BikesCreateApiResponse = /** status 201  */ BikeRead
export type BikesCreateApiArg = {
  bikeRequest: BikeRequest
}
export type BikesRetrieveApiResponse = /** status 200  */ BikeRead
export type BikesRetrieveApiArg = {
  /** A unique integer value identifying this bike. */
  id: number
}
export type BikesUpdateApiResponse = /** status 200  */ BikeRead
export type BikesUpdateApiArg = {
  /** A unique integer value identifying this bike. */
  id: number
  bikeRequest: BikeRequest
}
export type BikesPartialUpdateApiResponse = /** status 200  */ BikeRead
export type BikesPartialUpdateApiArg = {
  /** A unique integer value identifying this bike. */
  id: number
  patchedBikeRequest: PatchedBikeRequest
}
export type BikesDestroyApiResponse = unknown
export type BikesDestroyApiArg = {
  /** A unique integer value identifying this bike. */
  id: number
}
export type BrandsListApiResponse = /** status 200  */ BrandRead[]
export type BrandsListApiArg = void
export type BrandsCreateApiResponse = /** status 201  */ BrandRead
export type BrandsCreateApiArg = {
  brandRequest: BrandRequest
}
export type BrandsRetrieveApiResponse = /** status 200  */ BrandRead
export type BrandsRetrieveApiArg = {
  /** A unique integer value identifying this brand. */
  id: number
}
export type BrandsUpdateApiResponse = /** status 200  */ BrandRead
export type BrandsUpdateApiArg = {
  /** A unique integer value identifying this brand. */
  id: number
  brandRequest: BrandRequest
}
export type BrandsPartialUpdateApiResponse = /** status 200  */ BrandRead
export type BrandsPartialUpdateApiArg = {
  /** A unique integer value identifying this brand. */
  id: number
  patchedBrandRequest: PatchedBrandRequest
}
export type BrandsDestroyApiResponse = unknown
export type BrandsDestroyApiArg = {
  /** A unique integer value identifying this brand. */
  id: number
}
export type CassettesListApiResponse = /** status 200  */ CassetteRead[]
export type CassettesListApiArg = void
export type CassettesCreateApiResponse = /** status 201  */ CassetteRead
export type CassettesCreateApiArg = {
  cassetteRequest: CassetteRequest
}
export type CassettesRetrieveApiResponse = /** status 200  */ CassetteRead
export type CassettesRetrieveApiArg = {
  /** A unique integer value identifying this cassette. */
  id: number
}
export type CassettesUpdateApiResponse = /** status 200  */ CassetteRead
export type CassettesUpdateApiArg = {
  /** A unique integer value identifying this cassette. */
  id: number
  cassetteRequest: CassetteRequest
}
export type CassettesPartialUpdateApiResponse = /** status 200  */ CassetteRead
export type CassettesPartialUpdateApiArg = {
  /** A unique integer value identifying this cassette. */
  id: number
  patchedCassetteRequest: PatchedCassetteRequest
}
export type CassettesDestroyApiResponse = unknown
export type CassettesDestroyApiArg = {
  /** A unique integer value identifying this cassette. */
  id: number
}
export type ChainringsListApiResponse = /** status 200  */ ChainringRead[]
export type ChainringsListApiArg = void
export type ChainringsCreateApiResponse = /** status 201  */ ChainringRead
export type ChainringsCreateApiArg = {
  chainringRequest: ChainringRequest
}
export type ChainringsRetrieveApiResponse = /** status 200  */ ChainringRead
export type ChainringsRetrieveApiArg = {
  /** A unique integer value identifying this chainring. */
  id: number
}
export type ChainringsUpdateApiResponse = /** status 200  */ ChainringRead
export type ChainringsUpdateApiArg = {
  /** A unique integer value identifying this chainring. */
  id: number
  chainringRequest: ChainringRequest
}
export type ChainringsPartialUpdateApiResponse =
  /** status 200  */ ChainringRead
export type ChainringsPartialUpdateApiArg = {
  /** A unique integer value identifying this chainring. */
  id: number
  patchedChainringRequest: PatchedChainringRequest
}
export type ChainringsDestroyApiResponse = unknown
export type ChainringsDestroyApiArg = {
  /** A unique integer value identifying this chainring. */
  id: number
}
export type CranksListApiResponse = /** status 200  */ CrankRead[]
export type CranksListApiArg = void
export type CranksCreateApiResponse = /** status 201  */ CrankRead
export type CranksCreateApiArg = {
  crankRequest: CrankRequest
}
export type CranksRetrieveApiResponse = /** status 200  */ CrankRead
export type CranksRetrieveApiArg = {
  /** A unique integer value identifying this crank. */
  id: number
}
export type CranksUpdateApiResponse = /** status 200  */ CrankRead
export type CranksUpdateApiArg = {
  /** A unique integer value identifying this crank. */
  id: number
  crankRequest: CrankRequest
}
export type CranksPartialUpdateApiResponse = /** status 200  */ CrankRead
export type CranksPartialUpdateApiArg = {
  /** A unique integer value identifying this crank. */
  id: number
  patchedCrankRequest: PatchedCrankRequest
}
export type CranksDestroyApiResponse = unknown
export type CranksDestroyApiArg = {
  /** A unique integer value identifying this crank. */
  id: number
}
export type ExternalHeadsetsListApiResponse =
  /** status 200  */ ExternalHeadsetRead[]
export type ExternalHeadsetsListApiArg = void
export type ExternalHeadsetsCreateApiResponse =
  /** status 201  */ ExternalHeadsetRead
export type ExternalHeadsetsCreateApiArg = {
  externalHeadsetRequest: ExternalHeadsetRequest
}
export type ExternalHeadsetsRetrieveApiResponse =
  /** status 200  */ ExternalHeadsetRead
export type ExternalHeadsetsRetrieveApiArg = {
  /** A unique integer value identifying this external headset. */
  id: number
}
export type ExternalHeadsetsUpdateApiResponse =
  /** status 200  */ ExternalHeadsetRead
export type ExternalHeadsetsUpdateApiArg = {
  /** A unique integer value identifying this external headset. */
  id: number
  externalHeadsetRequest: ExternalHeadsetRequest
}
export type ExternalHeadsetsPartialUpdateApiResponse =
  /** status 200  */ ExternalHeadsetRead
export type ExternalHeadsetsPartialUpdateApiArg = {
  /** A unique integer value identifying this external headset. */
  id: number
  patchedExternalHeadsetRequest: PatchedExternalHeadsetRequest
}
export type ExternalHeadsetsDestroyApiResponse = unknown
export type ExternalHeadsetsDestroyApiArg = {
  /** A unique integer value identifying this external headset. */
  id: number
}
export type ForksListApiResponse = /** status 200  */ ForkRead[]
export type ForksListApiArg = void
export type ForksCreateApiResponse = /** status 201  */ ForkRead
export type ForksCreateApiArg = {
  forkRequest: ForkRequest
}
export type ForksRetrieveApiResponse = /** status 200  */ ForkRead
export type ForksRetrieveApiArg = {
  /** A unique integer value identifying this fork. */
  id: number
}
export type ForksUpdateApiResponse = /** status 200  */ ForkRead
export type ForksUpdateApiArg = {
  /** A unique integer value identifying this fork. */
  id: number
  forkRequest: ForkRequest
}
export type ForksPartialUpdateApiResponse = /** status 200  */ ForkRead
export type ForksPartialUpdateApiArg = {
  /** A unique integer value identifying this fork. */
  id: number
  patchedForkRequest: PatchedForkRequest
}
export type ForksDestroyApiResponse = unknown
export type ForksDestroyApiArg = {
  /** A unique integer value identifying this fork. */
  id: number
}
export type FramesListApiResponse = /** status 200  */ FrameRead[]
export type FramesListApiArg = void
export type FramesCreateApiResponse = /** status 201  */ FrameRead
export type FramesCreateApiArg = {
  frameRequest: FrameRequest
}
export type FramesRetrieveApiResponse = /** status 200  */ FrameRead
export type FramesRetrieveApiArg = {
  /** A unique integer value identifying this frame. */
  id: number
}
export type FramesUpdateApiResponse = /** status 200  */ FrameRead
export type FramesUpdateApiArg = {
  /** A unique integer value identifying this frame. */
  id: number
  frameRequest: FrameRequest
}
export type FramesPartialUpdateApiResponse = /** status 200  */ FrameRead
export type FramesPartialUpdateApiArg = {
  /** A unique integer value identifying this frame. */
  id: number
  patchedFrameRequest: PatchedFrameRequest
}
export type FramesDestroyApiResponse = unknown
export type FramesDestroyApiArg = {
  /** A unique integer value identifying this frame. */
  id: number
}
export type HandlebarsListApiResponse = /** status 200  */ HandlebarRead[]
export type HandlebarsListApiArg = void
export type HandlebarsCreateApiResponse = /** status 201  */ HandlebarRead
export type HandlebarsCreateApiArg = {
  handlebarRequest: HandlebarRequest
}
export type HandlebarsRetrieveApiResponse = /** status 200  */ HandlebarRead
export type HandlebarsRetrieveApiArg = {
  /** A unique integer value identifying this handlebar. */
  id: number
}
export type HandlebarsUpdateApiResponse = /** status 200  */ HandlebarRead
export type HandlebarsUpdateApiArg = {
  /** A unique integer value identifying this handlebar. */
  id: number
  handlebarRequest: HandlebarRequest
}
export type HandlebarsPartialUpdateApiResponse =
  /** status 200  */ HandlebarRead
export type HandlebarsPartialUpdateApiArg = {
  /** A unique integer value identifying this handlebar. */
  id: number
  patchedHandlebarRequest: PatchedHandlebarRequest
}
export type HandlebarsDestroyApiResponse = unknown
export type HandlebarsDestroyApiArg = {
  /** A unique integer value identifying this handlebar. */
  id: number
}
export type LoginCreateApiResponse = /** status 201  */ User
export type LoginCreateApiArg = {
  userRequest: UserRequest
}
export type LogoutCreateApiResponse = unknown
export type LogoutCreateApiArg = void
export type PedalsListApiResponse = /** status 200  */ PedalRead[]
export type PedalsListApiArg = void
export type PedalsCreateApiResponse = /** status 201  */ PedalRead
export type PedalsCreateApiArg = {
  pedalRequest: PedalRequest
}
export type PedalsRetrieveApiResponse = /** status 200  */ PedalRead
export type PedalsRetrieveApiArg = {
  /** A unique integer value identifying this pedal. */
  id: number
}
export type PedalsUpdateApiResponse = /** status 200  */ PedalRead
export type PedalsUpdateApiArg = {
  /** A unique integer value identifying this pedal. */
  id: number
  pedalRequest: PedalRequest
}
export type PedalsPartialUpdateApiResponse = /** status 200  */ PedalRead
export type PedalsPartialUpdateApiArg = {
  /** A unique integer value identifying this pedal. */
  id: number
  patchedPedalRequest: PatchedPedalRequest
}
export type PedalsDestroyApiResponse = unknown
export type PedalsDestroyApiArg = {
  /** A unique integer value identifying this pedal. */
  id: number
}
export type ProfileListApiResponse = /** status 200  */ User[]
export type ProfileListApiArg = void
export type RegisterCreateApiResponse = /** status 201  */ User
export type RegisterCreateApiArg = {
  userRequest: UserRequest
}
export type SaddlesListApiResponse = /** status 200  */ SaddleRead[]
export type SaddlesListApiArg = void
export type SaddlesCreateApiResponse = /** status 201  */ SaddleRead
export type SaddlesCreateApiArg = {
  saddleRequest: SaddleRequest
}
export type SaddlesRetrieveApiResponse = /** status 200  */ SaddleRead
export type SaddlesRetrieveApiArg = {
  /** A unique integer value identifying this saddle. */
  id: number
}
export type SaddlesUpdateApiResponse = /** status 200  */ SaddleRead
export type SaddlesUpdateApiArg = {
  /** A unique integer value identifying this saddle. */
  id: number
  saddleRequest: SaddleRequest
}
export type SaddlesPartialUpdateApiResponse = /** status 200  */ SaddleRead
export type SaddlesPartialUpdateApiArg = {
  /** A unique integer value identifying this saddle. */
  id: number
  patchedSaddleRequest: PatchedSaddleRequest
}
export type SaddlesDestroyApiResponse = unknown
export type SaddlesDestroyApiArg = {
  /** A unique integer value identifying this saddle. */
  id: number
}
export type SeatpostsListApiResponse = /** status 200  */ SeatpostRead[]
export type SeatpostsListApiArg = void
export type SeatpostsCreateApiResponse = /** status 201  */ SeatpostRead
export type SeatpostsCreateApiArg = {
  seatpostRequest: SeatpostRequest
}
export type SeatpostsRetrieveApiResponse = /** status 200  */ SeatpostRead
export type SeatpostsRetrieveApiArg = {
  /** A unique integer value identifying this seatpost. */
  id: number
}
export type SeatpostsUpdateApiResponse = /** status 200  */ SeatpostRead
export type SeatpostsUpdateApiArg = {
  /** A unique integer value identifying this seatpost. */
  id: number
  seatpostRequest: SeatpostRequest
}
export type SeatpostsPartialUpdateApiResponse = /** status 200  */ SeatpostRead
export type SeatpostsPartialUpdateApiArg = {
  /** A unique integer value identifying this seatpost. */
  id: number
  patchedSeatpostRequest: PatchedSeatpostRequest
}
export type SeatpostsDestroyApiResponse = unknown
export type SeatpostsDestroyApiArg = {
  /** A unique integer value identifying this seatpost. */
  id: number
}
export type StemsListApiResponse = /** status 200  */ StemRead[]
export type StemsListApiArg = void
export type StemsCreateApiResponse = /** status 201  */ StemRead
export type StemsCreateApiArg = {
  stemRequest: StemRequest
}
export type StemsRetrieveApiResponse = /** status 200  */ StemRead
export type StemsRetrieveApiArg = {
  /** A unique integer value identifying this stem. */
  id: number
}
export type StemsUpdateApiResponse = /** status 200  */ StemRead
export type StemsUpdateApiArg = {
  /** A unique integer value identifying this stem. */
  id: number
  stemRequest: StemRequest
}
export type StemsPartialUpdateApiResponse = /** status 200  */ StemRead
export type StemsPartialUpdateApiArg = {
  /** A unique integer value identifying this stem. */
  id: number
  patchedStemRequest: PatchedStemRequest
}
export type StemsDestroyApiResponse = unknown
export type StemsDestroyApiArg = {
  /** A unique integer value identifying this stem. */
  id: number
}
export type TiresListApiResponse = /** status 200  */ TireSetRead[]
export type TiresListApiArg = void
export type TiresCreateApiResponse = /** status 201  */ TireSetRead
export type TiresCreateApiArg = {
  tireSetRequest: TireSetRequest
}
export type TiresRetrieveApiResponse = /** status 200  */ TireSetRead
export type TiresRetrieveApiArg = {
  /** A unique integer value identifying this tire set. */
  id: number
}
export type TiresUpdateApiResponse = /** status 200  */ TireSetRead
export type TiresUpdateApiArg = {
  /** A unique integer value identifying this tire set. */
  id: number
  tireSetRequest: TireSetRequest
}
export type TiresPartialUpdateApiResponse = /** status 200  */ TireSetRead
export type TiresPartialUpdateApiArg = {
  /** A unique integer value identifying this tire set. */
  id: number
  patchedTireSetRequest: PatchedTireSetRequest
}
export type TiresDestroyApiResponse = unknown
export type TiresDestroyApiArg = {
  /** A unique integer value identifying this tire set. */
  id: number
}
export type WheelsListApiResponse = /** status 200  */ WheelSetRead[]
export type WheelsListApiArg = void
export type WheelsCreateApiResponse = /** status 201  */ WheelSetRead
export type WheelsCreateApiArg = {
  wheelSetRequest: WheelSetRequest
}
export type WheelsRetrieveApiResponse = /** status 200  */ WheelSetRead
export type WheelsRetrieveApiArg = {
  /** A unique integer value identifying this wheel set. */
  id: number
}
export type WheelsUpdateApiResponse = /** status 200  */ WheelSetRead
export type WheelsUpdateApiArg = {
  /** A unique integer value identifying this wheel set. */
  id: number
  wheelSetRequest: WheelSetRequest
}
export type WheelsPartialUpdateApiResponse = /** status 200  */ WheelSetRead
export type WheelsPartialUpdateApiArg = {
  /** A unique integer value identifying this wheel set. */
  id: number
  patchedWheelSetRequest: PatchedWheelSetRequest
}
export type WheelsDestroyApiResponse = unknown
export type WheelsDestroyApiArg = {
  /** A unique integer value identifying this wheel set. */
  id: number
}
export type StatusEnum =
  | "private"
  | "public"
  | "awaiting_approval"
  | "published"
  | "rejected"
export type Bike = {
  model?: string
  size: string
  gtin?: number | null
  mpn: string | null
  status?: StatusEnum
  front_center?: number
  wheelbase?: number
  spacers?: number
  brand: number | null
  owner?: number | null
  cassette?: number | null
  pedal?: number | null
}
export type BikeRead = {
  id: number
  model?: string
  size: string
  gtin?: number | null
  mpn: string | null
  status?: StatusEnum
  created_at: string
  updated_at: string
  front_center?: number
  wheelbase?: number
  spacers?: number
  brand: number | null
  owner?: number | null
  cassette?: number | null
  pedal?: number | null
}
export type BikeRequest = {
  model?: string
  size: string
  gtin?: number | null
  mpn: string | null
  status?: StatusEnum
  front_center?: number
  wheelbase?: number
  spacers?: number
  brand: number | null
  owner?: number | null
  cassette?: number | null
  pedal?: number | null
}
export type PatchedBikeRequest = {
  model?: string
  size?: string
  gtin?: number | null
  mpn?: string | null
  status?: StatusEnum
  front_center?: number
  wheelbase?: number
  spacers?: number
  brand?: number | null
  owner?: number | null
  cassette?: number | null
  pedal?: number | null
}
export type Brand = {
  name: string
}
export type BrandRead = {
  id: number
  name: string
  created_at: string
  updated_at: string
}
export type BrandRequest = {
  name: string
}
export type PatchedBrandRequest = {
  name?: string
}
export type Cassette = {
  model?: string
  size: string
  gtin?: number | null
  mpn: string | null
  status?: StatusEnum
  gears: number[]
  brand: number | null
  owner?: number | null
}
export type CassetteRead = {
  id: number
  model?: string
  size: string
  gtin?: number | null
  mpn: string | null
  status?: StatusEnum
  created_at: string
  updated_at: string
  gears: number[]
  brand: number | null
  owner?: number | null
}
export type CassetteRequest = {
  model?: string
  size: string
  gtin?: number | null
  mpn: string | null
  status?: StatusEnum
  gears: number[]
  brand: number | null
  owner?: number | null
}
export type PatchedCassetteRequest = {
  model?: string
  size?: string
  gtin?: number | null
  mpn?: string | null
  status?: StatusEnum
  gears?: number[]
  brand?: number | null
  owner?: number | null
}
export type Chainring = {
  gears: number[]
  bike: number
}
export type ChainringRead = {
  id: number
  gears: number[]
  bike: number
}
export type ChainringRequest = {
  gears: number[]
  bike: number
}
export type PatchedChainringRequest = {
  gears?: number[]
  bike?: number
}
export type Crank = {
  length: number
  q_factor: number
  bike: number
}
export type CrankRead = {
  id: number
  length: number
  q_factor: number
  bike: number
}
export type CrankRequest = {
  length: number
  q_factor: number
  bike: number
}
export type PatchedCrankRequest = {
  length?: number
  q_factor?: number
  bike?: number
}
export type ExternalHeadset = {
  upper_cup_stack_height: number
  lower_cup_stack_height: number
  bike: number
}
export type ExternalHeadsetRead = {
  id: number
  upper_cup_stack_height: number
  lower_cup_stack_height: number
  bike: number
}
export type ExternalHeadsetRequest = {
  upper_cup_stack_height: number
  lower_cup_stack_height: number
  bike: number
}
export type PatchedExternalHeadsetRequest = {
  upper_cup_stack_height?: number
  lower_cup_stack_height?: number
  bike?: number
}
export type Fork = {
  offset: number
  crown_to_axle: number
  steerer_tube: number
  travel: number
  bike: number
}
export type ForkRead = {
  id: number
  offset: number
  crown_to_axle: number
  steerer_tube: number
  travel: number
  bike: number
}
export type ForkRequest = {
  offset: number
  crown_to_axle: number
  steerer_tube: number
  travel: number
  bike: number
}
export type PatchedForkRequest = {
  offset?: number
  crown_to_axle?: number
  steerer_tube?: number
  travel?: number
  bike?: number
}
export type Frame = {
  reach: number
  stack: number
  chainstay: number
  head_tube: number
  head_tube_angle: string
  actual_seat_tube_angle: string
  effective_seat_tube_angle: string
  seat_tube: number
  bb_drop: number
  bike: number
}
export type FrameRead = {
  id: number
  reach: number
  stack: number
  chainstay: number
  head_tube: number
  head_tube_angle: string
  actual_seat_tube_angle: string
  effective_seat_tube_angle: string
  seat_tube: number
  bb_drop: number
  bike: number
}
export type FrameRequest = {
  reach: number
  stack: number
  chainstay: number
  head_tube: number
  head_tube_angle: string
  actual_seat_tube_angle: string
  effective_seat_tube_angle: string
  seat_tube: number
  bb_drop: number
  bike: number
}
export type PatchedFrameRequest = {
  reach?: number
  stack?: number
  chainstay?: number
  head_tube?: number
  head_tube_angle?: string
  actual_seat_tube_angle?: string
  effective_seat_tube_angle?: string
  seat_tube?: number
  bb_drop?: number
  bike?: number
}
export type Handlebar = {
  width: number
  rise: number
  reach: number
  backsweep: string
  upsweep: string
  drop_flare: string
  drop_flare_out: string
  drop_width: number
  bike: number
}
export type HandlebarRead = {
  id: number
  width: number
  rise: number
  reach: number
  backsweep: string
  upsweep: string
  drop_flare: string
  drop_flare_out: string
  drop_width: number
  bike: number
}
export type HandlebarRequest = {
  width: number
  rise: number
  reach: number
  backsweep: string
  upsweep: string
  drop_flare: string
  drop_flare_out: string
  drop_width: number
  bike: number
}
export type PatchedHandlebarRequest = {
  width?: number
  rise?: number
  reach?: number
  backsweep?: string
  upsweep?: string
  drop_flare?: string
  drop_flare_out?: string
  drop_width?: number
  bike?: number
}
export type User = {
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: string
  password: string
}
export type UserRequest = {
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: string
  password: string
}
export type Pedal = {
  model?: string
  size: string
  gtin?: number | null
  mpn: string | null
  status?: StatusEnum
  stack_height: number
  pedal_center: number
  brand: number | null
  owner?: number | null
}
export type PedalRead = {
  id: number
  model?: string
  size: string
  gtin?: number | null
  mpn: string | null
  status?: StatusEnum
  created_at: string
  updated_at: string
  stack_height: number
  pedal_center: number
  brand: number | null
  owner?: number | null
}
export type PedalRequest = {
  model?: string
  size: string
  gtin?: number | null
  mpn: string | null
  status?: StatusEnum
  stack_height: number
  pedal_center: number
  brand: number | null
  owner?: number | null
}
export type PatchedPedalRequest = {
  model?: string
  size?: string
  gtin?: number | null
  mpn?: string | null
  status?: StatusEnum
  stack_height?: number
  pedal_center?: number
  brand?: number | null
  owner?: number | null
}
export type Saddle = {
  offset: number
  bike: number
}
export type SaddleRead = {
  id: number
  offset: number
  bike: number
}
export type SaddleRequest = {
  offset: number
  bike: number
}
export type PatchedSaddleRequest = {
  offset?: number
  bike?: number
}
export type Seatpost = {
  length: number
  offset: number
  bike: number
}
export type SeatpostRead = {
  id: number
  length: number
  offset: number
  bike: number
}
export type SeatpostRequest = {
  length: number
  offset: number
  bike: number
}
export type PatchedSeatpostRequest = {
  length?: number
  offset?: number
  bike?: number
}
export type Stem = {
  length: number
  angle: string
  steerer_height: number
  bike: number
}
export type StemRead = {
  id: number
  length: number
  angle: string
  steerer_height: number
  bike: number
}
export type StemRequest = {
  length: number
  angle: string
  steerer_height: number
  bike: number
}
export type PatchedStemRequest = {
  length?: number
  angle?: string
  steerer_height?: number
  bike?: number
}
export type TireSet = {
  front_diameter: number
  front_width: number
  rear_diameter: number
  rear_width: number
  bike: number
}
export type TireSetRead = {
  id: number
  front_diameter: number
  front_width: number
  rear_diameter: number
  rear_width: number
  bike: number
}
export type TireSetRequest = {
  front_diameter: number
  front_width: number
  rear_diameter: number
  rear_width: number
  bike: number
}
export type PatchedTireSetRequest = {
  front_diameter?: number
  front_width?: number
  rear_diameter?: number
  rear_width?: number
  bike?: number
}
export type WheelSet = {
  front_diameter: number
  rear_diameter: number
  bike: number
}
export type WheelSetRead = {
  id: number
  front_diameter: number
  rear_diameter: number
  bike: number
}
export type WheelSetRequest = {
  front_diameter: number
  rear_diameter: number
  bike: number
}
export type PatchedWheelSetRequest = {
  front_diameter?: number
  rear_diameter?: number
  bike?: number
}
export const {
  useBikesListQuery,
  useBikesCreateMutation,
  useBikesRetrieveQuery,
  useBikesUpdateMutation,
  useBikesPartialUpdateMutation,
  useBikesDestroyMutation,
  useBrandsListQuery,
  useBrandsCreateMutation,
  useBrandsRetrieveQuery,
  useBrandsUpdateMutation,
  useBrandsPartialUpdateMutation,
  useBrandsDestroyMutation,
  useCassettesListQuery,
  useCassettesCreateMutation,
  useCassettesRetrieveQuery,
  useCassettesUpdateMutation,
  useCassettesPartialUpdateMutation,
  useCassettesDestroyMutation,
  useChainringsListQuery,
  useChainringsCreateMutation,
  useChainringsRetrieveQuery,
  useChainringsUpdateMutation,
  useChainringsPartialUpdateMutation,
  useChainringsDestroyMutation,
  useCranksListQuery,
  useCranksCreateMutation,
  useCranksRetrieveQuery,
  useCranksUpdateMutation,
  useCranksPartialUpdateMutation,
  useCranksDestroyMutation,
  useExternalHeadsetsListQuery,
  useExternalHeadsetsCreateMutation,
  useExternalHeadsetsRetrieveQuery,
  useExternalHeadsetsUpdateMutation,
  useExternalHeadsetsPartialUpdateMutation,
  useExternalHeadsetsDestroyMutation,
  useForksListQuery,
  useForksCreateMutation,
  useForksRetrieveQuery,
  useForksUpdateMutation,
  useForksPartialUpdateMutation,
  useForksDestroyMutation,
  useFramesListQuery,
  useFramesCreateMutation,
  useFramesRetrieveQuery,
  useFramesUpdateMutation,
  useFramesPartialUpdateMutation,
  useFramesDestroyMutation,
  useHandlebarsListQuery,
  useHandlebarsCreateMutation,
  useHandlebarsRetrieveQuery,
  useHandlebarsUpdateMutation,
  useHandlebarsPartialUpdateMutation,
  useHandlebarsDestroyMutation,
  useLoginCreateMutation,
  useLogoutCreateMutation,
  usePedalsListQuery,
  usePedalsCreateMutation,
  usePedalsRetrieveQuery,
  usePedalsUpdateMutation,
  usePedalsPartialUpdateMutation,
  usePedalsDestroyMutation,
  useProfileListQuery,
  useRegisterCreateMutation,
  useSaddlesListQuery,
  useSaddlesCreateMutation,
  useSaddlesRetrieveQuery,
  useSaddlesUpdateMutation,
  useSaddlesPartialUpdateMutation,
  useSaddlesDestroyMutation,
  useSeatpostsListQuery,
  useSeatpostsCreateMutation,
  useSeatpostsRetrieveQuery,
  useSeatpostsUpdateMutation,
  useSeatpostsPartialUpdateMutation,
  useSeatpostsDestroyMutation,
  useStemsListQuery,
  useStemsCreateMutation,
  useStemsRetrieveQuery,
  useStemsUpdateMutation,
  useStemsPartialUpdateMutation,
  useStemsDestroyMutation,
  useTiresListQuery,
  useTiresCreateMutation,
  useTiresRetrieveQuery,
  useTiresUpdateMutation,
  useTiresPartialUpdateMutation,
  useTiresDestroyMutation,
  useWheelsListQuery,
  useWheelsCreateMutation,
  useWheelsRetrieveQuery,
  useWheelsUpdateMutation,
  useWheelsPartialUpdateMutation,
  useWheelsDestroyMutation,
} = injectedRtkApi
