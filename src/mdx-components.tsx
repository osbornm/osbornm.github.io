import type { MDXComponents } from 'mdx/types'
import Gist from './components/Gist'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Gist: Gist,
    ...components,
    code: (props) => {
      let classes = props.className || '';
      if (!classes?.includes('hljs')) {
        classes = `hljs ${classes}`;
      }
      return <code {...props} className={classes} />
    },
  }
}