const GistTransformer = {
  name: "Gist",
  shouldTransform(url: string) {
    const { host } = new URL(url);

    return ["gist.github.com"].includes(host);
  },
  getHTML(link: string) {
    const url = new URL(link);
    const id = url.pathname.split("/").pop();
    // If you copy a file-specific URL from the gist, the link ends in #file-lowercasefilename-ext
    // But the gist embed link requires ?file=CorrectlyCasedFilename.ext to target the file
    // There isn't a sensible way to transform the lowercase filename back to CamelCase, kebab-case presumably is fine.
    // So the markdown link will need to be of the form https://gist.github.com/username/id?file=CorrectlyCasedFilename.ext if you want to target a file
    let file;
    if (url.searchParams.get("file")) {
      file = `file="${url.searchParams.get("file")}"`;
    }

    return `<ReactEmbedGist
              gist="${id}"
              ${file}
            />`;
  },
};

export default GistTransformer;
