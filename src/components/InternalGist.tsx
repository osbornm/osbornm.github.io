'use client'

import { useMemo } from "react";

export default function Gist2({ id, file }: { id: string; file?: string }) {
  const iFrameHtml = useMemo(() => {
    const fileArg = file ? `?file=${file}` : "";
    const gistLink = `https://gist.github.com/${id}.js${fileArg}`
    const gistScript = `<script type="text/javascript" src="${gistLink}"></script>`;
    const styles = "<style>*{font-size:12px;}</style>";
    const elementId = file ? `gist-${id}-${file}` : `gist-${id}`;
    //const resizeScript = `onload="parent.document.getElementById('${elementId}').style.height=document.body.scrollHeight + 'px'"`;
    const resizeScript = `onload="parent.document.getElementById('${elementId}').style.height=(document.body.scrollHeight + 20)+ 'px'"`;
    return `<html><head><base target="_parent">${styles}</head><body ${resizeScript}>${gistScript}</body></html>`;

  }, [file, id]);

  return (
    <>
      <iframe
        width="100%"
        id={file ? `gist-${id}-${file}` : `gist-${id}`}
        srcDoc={iFrameHtml} />
    </>
  );
}