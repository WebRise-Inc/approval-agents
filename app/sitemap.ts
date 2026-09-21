import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/book", "/privacy"].map((path) => ({
    url: new URL(path, "https://approvalagents.ca").toString(),
  }));
}
