'use client'

import dynamic from "next/dynamic";
import React from "react";
import InternalGistLoading from "./internalGistLoading";


const GistNoSSR = dynamic(() => import('./InternalGist'), {
  ssr: false,
  loading: () => <InternalGistLoading />,
})

export default function Gist(props: { id: string; file?: string }) {
  return <GistNoSSR {...props} />;
}
