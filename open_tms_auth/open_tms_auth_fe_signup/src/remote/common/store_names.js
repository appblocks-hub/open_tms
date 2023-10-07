import React from 'react'
import { useSuspense } from '@appblocks/js-sdk'

export default function store_names() {
  return useSuspense(
    process.env.BB_AUTH_ELEMENTS_URL,
    'remotes',
    './store_names',
    React
  )
}
