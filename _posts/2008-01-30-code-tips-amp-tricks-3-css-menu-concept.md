---
layout: post
title: Code Tips & Tricks 3: CSS Menu Concept
date: 2008-01-30 01:54
author: osbornm
comments: true
categories: []
---
<p>This is an interesting idea for a navigation menu.  This is a pure concept and I'm not sure if it would work with any site design but I learned everything I know about CSS from experimenting and coming up with useless ideas.  So, the idea is that the menu bar looks normal till you hover over it.  Once you have over it, all the links appear to blur while the item that is being hovered over remains the same.  This is how I choose to implement this, however, you could make the non-selected items smaller, change color, or even rotate.  The possibilities are endless, so experiment with it and let me know what interesting things you come up with.</p>  <p><a href="http://blog.osbornm.com/images/blog_osbornm_com/WindowsLiveWriter/CodeTipsTricks3CSSMenuConcept_FA0A/btn_2.png"><img style="border-top-width: 0px; border-left-width: 0px; border-bottom-width: 0px; margin: 0px 10px 0px 0px; border-right-width: 0px" height="74" alt="btn" src="http://blog.osbornm.com/images/blog_osbornm_com/WindowsLiveWriter/CodeTipsTricks3CSSMenuConcept_FA0A/btn_thumb.png" width="74" align="left" border="0" /></a> <strong>Step 1:</strong> Create your images for the menu. In this case I am using images because I wanted a blurring effect, if you just want to do simple text manipulation then there is no need for images. The image should look something like the image on the left.  Refer to my previous <a href="http://blog.osbornm.com/archive/2008/01/13/code-tips-amp-tricks-2-pure-css-roll-over.aspx" target="_blank">post</a> to understand why both states are in one image.</p>  <p><strong></strong></p>  <p><strong>STEP 2: </strong>Now it is time to create the HTML which is pretty straight forward.  I have simplified it, so some it is not an optimized menu but you should be able to get the idea. It consists of a simple div container with the links placed inside.</p>  <div class="csharpcode">   <pre class="alt"><span class="lnum">   1:  </span><span class="kwrd">&lt;</span><span class="html">div</span> <span class="attr">id</span><span class="kwrd">="nav"</span><span class="kwrd">&gt;</span></pre>

  <pre><span class="lnum">   2:  </span>     <span class="kwrd">&lt;</span><span class="html">a</span> <span class="attr">href</span><span class="kwrd">="#"</span> <span class="attr">id</span><span class="kwrd">="LINK1"</span><span class="kwrd">&gt;</span>LINK<span class="kwrd">&lt;/</span><span class="html">a</span><span class="kwrd">&gt;</span></pre>

  <pre class="alt"><span class="lnum">   3:  </span>     <span class="kwrd">&lt;</span><span class="html">a</span> <span class="attr">href</span><span class="kwrd">="#"</span> <span class="attr">id</span><span class="kwrd">="LINK2"</span><span class="kwrd">&gt;</span>LINK<span class="kwrd">&lt;/</span><span class="html">a</span><span class="kwrd">&gt;</span></pre>

  <pre><span class="lnum">   4:  </span>     <span class="kwrd">&lt;</span><span class="html">a</span> <span class="attr">href</span><span class="kwrd">="#"</span> <span class="attr">id</span><span class="kwrd">="LINK3"</span><span class="kwrd">&gt;</span>LINK<span class="kwrd">&lt;/</span><span class="html">a</span><span class="kwrd">&gt;</span></pre>

  <pre class="alt"><span class="lnum">   5:  </span>     <span class="kwrd">&lt;</span><span class="html">a</span> <span class="attr">href</span><span class="kwrd">="#"</span> <span class="attr">id</span><span class="kwrd">="LINK4"</span><span class="kwrd">&gt;</span>LINK<span class="kwrd">&lt;/</span><span class="html">a</span><span class="kwrd">&gt;</span></pre>

  <pre><span class="lnum">   6:  </span><span class="kwrd">&lt;/</span><span class="html">div</span><span class="kwrd">&gt;</span></pre>
</div>
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

<p><strong></strong></p>

<p><strong>STEP 3:</strong> Now comes the magic, it is time to create the styles for the links.  You can implement these in line or in a style sheet.  There are three main styles to implement.  The default style for the link, the hover style for the container, and the hover style for the links inside the container.  One strange thing that I have done is set the text-indent property to -9999999px.  What this does is is allow me to have the link text for SEO but also not have it displayed on top of the images.</p>

<div class="csharpcode">
  <pre class="alt"><span class="lnum">   1:  </span><span class="kwrd">&lt;</span><span class="html">style</span> <span class="attr">type</span><span class="kwrd">="text/css"</span><span class="kwrd">&gt;</span></pre>

  <pre><span class="lnum">   2:  </span>     #nav a </pre>

  <pre class="alt"><span class="lnum">   3:  </span>     { </pre>

  <pre><span class="lnum">   4:  </span>          text-indent: -999999px; text-decoration:none; display:block; </pre>

  <pre class="alt"><span class="lnum">   5:  </span>          height:50px; width:100px; background: URL('images/btn.png'); float:left; </pre>

  <pre><span class="lnum">   6:  </span>     }</pre>

  <pre class="alt"><span class="lnum">   7:  </span>     #nav:hover a {background-position:0 -50px;}</pre>

  <pre><span class="lnum">   8:  </span>     #nav a:hover {text-decoration: underline; background-position:0 0;}</pre>

  <pre class="alt"><span class="lnum">   9:  </span><span class="kwrd">&lt;/</span><span class="html">style</span><span class="kwrd">&gt;</span> </pre>
</div>

<p><strong></strong></p>
<link href="http://www.osbornm.com/blog/files/menu2.css" type="text/css" rel="stylesheet" />

<div id="nav"><a id="LINK1" href="#">LINK</a> <a id="LINK2" href="#">LINK</a> <a id="LINK3" href="#">LINK</a> <a id="LINK4" href="#">LINK</a> </div>
