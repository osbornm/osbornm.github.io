---
layout: post
title: Code Tips & Tricks 2: Pure CSS Roll Over
date: 2008-01-14 07:30
author: osbornm
comments: true
categories: []
---
<p>Many of us us roll over images on our navigation or other items in our web pages.  One thing that can be problematically is users with slow connections or larger images can cause a flashing when you roll over when the file is being downloaded.  One way to solve this is to use JavaScript to preload your images on the page.  However, there is a much easier way to do it with just a little CSS.</p>  <p>The first thing to do is to create the images for the roll overs. Once you have these don what you need to do is put on on top of the other so they look something like <a href="http://www.osbornm.com/blog/files/button.gif" target="_blank">this</a>. So the trick comes when setting up the background image in the CSS. </p>  <p> </p>  <div class="csharpcode">   <pre class="alt"><span class="lnum">   1:  </span> <span class="kwrd">&lt;</span><span class="html">style</span><span class="kwrd">&gt;</span></pre>

  <pre><span class="lnum">   2:  </span>    #navigation a{</pre>

  <pre class="alt"><span class="lnum">   3:  </span>        background:url(images/button.gif) no-repeat 0 0;</pre>

  <pre><span class="lnum">   4:  </span>        width:41px;</pre>

  <pre class="alt"><span class="lnum">   5:  </span>        height:45px;</pre>

  <pre><span class="lnum">   6:  </span>        display:block;</pre>

  <pre class="alt"><span class="lnum">   7:  </span>        text-align:center;</pre>

  <pre><span class="lnum">   8:  </span>        float:left;</pre>

  <pre class="alt"><span class="lnum">   9:  </span>        margin:0 5px;</pre>

  <pre><span class="lnum">  10:  </span>        padding-top:10px;</pre>

  <pre class="alt"><span class="lnum">  11:  </span>        text-decoration:none;</pre>

  <pre><span class="lnum">  12:  </span>        color:#333;</pre>

  <pre class="alt"><span class="lnum">  13:  </span>    }</pre>

  <pre><span class="lnum">  14:  </span> </pre>

  <pre class="alt"><span class="lnum">  15:  </span>    #navigation a:hover{</pre>

  <pre><span class="lnum">  16:  </span>        background:url(images/button.gif) no-repeat 0 100%;</pre>

  <pre class="alt"><span class="lnum">  17:  </span>        color:#FFF;</pre>

  <pre><span class="lnum">  18:  </span>    }</pre>

  <pre class="alt"><span class="lnum">  19:  </span> </pre>

  <pre><span class="lnum">  20:  </span><span class="kwrd">&lt;/</span><span class="html">style</span><span class="kwrd">&gt;</span></pre>
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

<p> </p>

<p>What you do is basically change the background position so that only one of the images is displayed at a time.  This means that once the first image is loaded they are both there everything is done on the client side.  While this isn't that great of a trick it is handy in making roll overs with complex images just as reflections.  </p>

<p>Here is a sample:</p>
<link href="http://www.osbornm.com/blog/files/menu.css" type="text/css" rel="stylesheet" />

<div id="navigation"><a href="#">1</a><a href="#">2</a><a href="#">3</a> </div>
