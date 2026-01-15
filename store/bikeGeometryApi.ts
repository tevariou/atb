import { api } from "./api";
import type { BikeSize, BikeGeometryTextRequest } from "./api";

// Extend the generated API with proper form data handling for image uploads
export const bikeGeometryApi = api.injectEndpoints({
  endpoints: (build) => ({
    bikeGeometryFromImage: build.mutation<
      BikeSize[], // Using the proper response type from the generated API
      { image: File }
    >({
      query: ({ image }) => {
        const formData = new FormData();
        formData.append("image", image);
        return {
          url: `/bike-geometry/image/`,
          method: "POST",
          body: formData,
        };
      },
    }),
    bikeGeometryFromTextBikeGeometryTextPost: build.mutation<
      BikeSize[],
      { bikeGeometryTextRequest: BikeGeometryTextRequest }
    >({
      query: (queryArg) => ({
        url: `/bike-geometry/text/`,
        method: "POST",
        body: queryArg.bikeGeometryTextRequest,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useBikeGeometryFromImageMutation,
  useBikeGeometryFromTextBikeGeometryTextPostMutation,
} = bikeGeometryApi;
