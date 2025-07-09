import type { MetadataRoute } from "next";
import { APP_NAME, APP_DEFAULT_TITLE, APP_DESCRIPTION } from "./constants";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [],
  };
}
