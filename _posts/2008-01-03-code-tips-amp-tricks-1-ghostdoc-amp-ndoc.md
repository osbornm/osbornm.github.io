---
layout: post
title: Code Tips & Tricks 1: GhostDoc & NDoc
date: 2008-01-03 22:01
author: osbornm
comments: true
categories: []
---
<p>Documentation is the coders best and worst friend.  It is a two sided sword, it makes your life easier but no one likes writing it.  So coders do what we do best and find a way to make the computer do it for us. There are two tools which I use on a regular basis when I'm working on a project.  while these tools do not work perfectly they do cut down the amount of work it takes to get good project documentation.</p>

<p>The first step and probably the most useful to a coder is XML comments.  These are the comments above a method that are used to generate the handy intelisense comments.  One of the first code practices I believe you should implement is providing XML comments for every method and class.  I know you're saying great that just doubles my work load but not quite. Roland Weigelt has come to the rescue by creating a tool he calls <a target="_blank" href="http://www.roland-weigelt.de/ghostdoc/legalStuff.htm">GhostDoc</a>.  <a target="_blank" href="http://www.roland-weigelt.de/ghostdoc/legalStuff.htm">GhostDoc</a> is a plug in for Visual Studio that generates XML comments for you.  It uses some basic configurable rules to determine what the comment should be.  If you have a standard naming scheme for your methods and classes you can create rules to generate the comments you want.  I'd like to take a disclaimer here and say you should not just download <a target="_blank" href="http://www.roland-weigelt.de/ghostdoc/legalStuff.htm">GhostDoc</a> and comment everything with the default comments.  While it works good it does not work great and sometimes requires some editing, however, you can eliminate most of this by creating custom rules. </p>

<div class="csharpcode">
<pre><span class="lnum">   1:  </span><span class="rem">/// &lt;summary&gt;</span></pre>
<pre><span class="lnum">   2:  </span><span class="rem">/// Gets the ghost doc URL.</span></pre>
<pre><span class="lnum">   3:  </span><span class="rem">/// &lt;/summary&gt;</span></pre>
<pre><span class="lnum">   4:  </span><span class="rem">/// &lt;param name="peram1"&gt;The peram1.&lt;/param&gt;</span></pre>
<pre><span class="lnum">   5:  </span><span class="rem">/// &lt;returns&gt;URL to download GhostDoc&lt;/returns&gt;</span></pre>
<pre><span class="lnum">   6:  </span><span class="kwrd">public</span> <span class="kwrd">string</span> GetGhostDocURL(<span class="kwrd">int</span> peram1)</pre>
<pre><span class="lnum">   7:  </span>{</pre>
<pre><span class="lnum">   8:  </span>    <span class="kwrd">return</span> <span class="str">@"http://www.roland-weigelt.de/ghostdoc/legalStuff.htm"</span>;</pre>
<pre><span class="lnum">   9:  </span>}</pre>
</div>
<p> </p>
<style type="text/css">





.csharpcode, .csharpcode pre
{
    font-size: small;
    color: black;
    font-family: consolas, "Courier New", courier, monospace;
    background-color: #ffffff;
    /*white-space: pre;*/
}
.csharpcode pre { margin: 0em; }
.csharpcode .rem { color: #008000; }
.csharpcode .kwrd { color: #0000ff; }
.csharpcode .str { color: #006080; }
.csharpcode .op { color: #0000c0; }
.csharpcode .preproc { color: #cc6633; }
.csharpcode .asp { background-color: #ffff00; }
.csharpcode .html { color: #800000; }
.csharpcode .attr { color: #ff0000; }
.csharpcode .alt
{
    background-color: #f4f4f4;
    width: 100%;
    margin: 0em;
}
.csharpcode .lnum { color: #606060; }</style>

<p>The next tool came in very handy when I was still in school and I was required to create documentation for every project that I did.  I have always used XML comments because I often reuse libraries and I hated going back to figure out what a method I had written 2 years earlier did. The tool that will save you time when creating documentation is NDoc.  It is an open source project that looks at your XML comments in your code and creates .cfm help files as well as MSDN styled web pages.  The styles can be customized to fit your companies page or to simply put you logo in the corner.  This is by no means a be all end all of documentation generation but it gives you a good boiler plate. NDoc can be downloading <a target="_blank" href="http://http://ndoc.sourceforge.net/">here</a>.</p>
<p>The use of these two tools should make the documentation process a  little less painful for you and if not you can always hire an intern to do it for you. </p>
