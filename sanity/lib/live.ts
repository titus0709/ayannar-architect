import { defineLive } from "next-sanity/live"

import { client } from "./client"
import { readToken } from "../env"

// defineLive powers real-time content updates. Because the dataset is private,
// we pass the Viewer token for both browsing (draft) and server (published) reads.
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: readToken,
  browserToken: readToken,
})
