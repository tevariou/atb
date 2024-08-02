import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const apiBaseQuery = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000",
    credentials: "same-origin",
    prepareHeaders: (headers) => {
      headers.set("X-Requested-With", "XMLHttpRequest");
      const token = Cookies.get("django_csrftoken");
      if (token) {
        headers.set("X-CSRFToken", token);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
});
