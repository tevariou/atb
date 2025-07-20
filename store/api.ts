import { emptySplitApi as api } from "./emptyApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    bikeGeometryFromImageBikeGeometryImagePost: build.mutation<
      BikeGeometryFromImageBikeGeometryImagePostApiResponse,
      BikeGeometryFromImageBikeGeometryImagePostApiArg
    >({
      query: (queryArg) => ({
        url: `/bike-geometry/image/`,
        method: "POST",
        body: queryArg.bodyBikeGeometryFromImageBikeGeometryImagePost,
      }),
    }),
    bikeGeometryFromTextBikeGeometryTextPost: build.mutation<
      BikeGeometryFromTextBikeGeometryTextPostApiResponse,
      BikeGeometryFromTextBikeGeometryTextPostApiArg
    >({
      query: (queryArg) => ({
        url: `/bike-geometry/text/`,
        method: "POST",
        body: queryArg.bikeGeometryTextRequest,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };
export type BikeGeometryFromImageBikeGeometryImagePostApiResponse =
  /** status 200 Successful Response */ BikeSize[];
export type BikeGeometryFromImageBikeGeometryImagePostApiArg = {
  bodyBikeGeometryFromImageBikeGeometryImagePost: BodyBikeGeometryFromImageBikeGeometryImagePost;
};
export type BikeGeometryFromTextBikeGeometryTextPostApiResponse =
  /** status 200 Successful Response */ BikeSize[];
export type BikeGeometryFromTextBikeGeometryTextPostApiArg = {
  bikeGeometryTextRequest: BikeGeometryTextRequest;
};
export type Unit = "cm" | "mm" | "deg";
export type BikeField = {
  value: number | null;
  unit: Unit | null;
};
export type BikeSize = {
  size: string;
  stack: BikeField | null;
  reach: BikeField | null;
  head_tube: BikeField | null;
  head_tube_angle: BikeField | null;
  chain_stay: BikeField | null;
  actual_seat_tube_angle: BikeField | null;
  effective_seat_tube_angle: BikeField | null;
  seat_tube: BikeField | null;
  bottom_bracket_drop: BikeField | null;
  front_center: BikeField | null;
  wheel_base: BikeField | null;
  fork_axle_to_crown: BikeField | null;
  fork_offset: BikeField | null;
  fork_travel: BikeField | null;
  fork_sag: BikeField | null;
  crank_length: BikeField | null;
  crank_q_factor: BikeField | null;
  spacers: BikeField | null;
  stem_length: BikeField | null;
  stem_angle: BikeField | null;
  seat_offset: BikeField | null;
  handlebar_width: BikeField | null;
  handlebar_reach: BikeField | null;
  handlebar_rise: BikeField | null;
  tire_front_width: BikeField | null;
  tire_rear_width: BikeField | null;
  wheel_front_diameter: BikeField | null;
  wheel_rear_diameter: BikeField | null;
};
export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
};
export type HttpValidationError = {
  detail?: ValidationError[];
};
export type BodyBikeGeometryFromImageBikeGeometryImagePost = {
  image: Blob;
};
export type BikeGeometryTextRequest = {
  text: string;
};
export const {
  useBikeGeometryFromImageBikeGeometryImagePostMutation,
  useBikeGeometryFromTextBikeGeometryTextPostMutation,
} = injectedRtkApi;
