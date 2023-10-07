import React from 'react'
import { useSuspense } from '@appblocks/js-sdk'

export default function images() {
  return useSuspense(process.env.BB_AUTH_ELEMENTS_URL, 'remotes', './assets_image', React)
}
