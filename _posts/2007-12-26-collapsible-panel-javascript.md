---
layout: post
title: Collapsible Panel JavaScript
date: 2007-12-26 00:13
author: osbornm
comments: true
categories: []
---
<p>When Microsoft first released its AJAX framework codename Atlas, at the time, they also released a collection of community created controls called the AJAX Control Toolkit. This toolkit has become quite popular and highly useful, however, I found that one of the most popular controls that I was using was the collapsible panel extender. This gave the user an easy way to create a simple collapsing effect within their website. This is nice but I found I wanted to implement this effect on sites that I was not using any of the other AJAX features. So I set out to create my own library that I could import that mocked the basic functionality of the collapsible panel extender but did not have the overhead of implementing the full Microsoft AJAX framework. This is what I came up with.</p>
<p>The principle is simple you have a simple html div tag that has content inside that you would like to hide or show with a collapsing effect on a given action. The easiest way to implement this is to make the function call on a click event. The way I prefer to implement this is to use two divs stacked on on top of the other.  Using the top one as the header and trigger and the bottom as the content.  Here is an example of how I set it up.</p>
<div class="csharpcode">
<pre><span class="lnum">   1:  </span><span class="kwrd">&lt;</span><span class="html">div</span> <span class="attr">id</span><span class="kwrd">="divHeader"</span> <span class="attr">style</span><span class="kwrd">="cursor: pointer;"</span> <span class="attr">onclick</span><span class="kwrd">="toggleDiv('divContent', 'img1')"</span><span class="kwrd">&gt;</span></pre>
<pre><span class="lnum">   2:  </span>    <span class="kwrd">&lt;</span><span class="html">img</span> <span class="attr">id</span><span class="kwrd">="img1"</span> <span class="attr">alt</span><span class="kwrd">="Exapnad"</span> <span class="attr">src</span><span class="kwrd">="expand.gif"</span> <span class="kwrd">/&gt;</span> Header</pre>
<pre><span class="lnum">   3:  </span><span class="kwrd">&lt;/</span><span class="html">div</span><span class="kwrd">&gt;</span></pre>
<pre><span class="lnum">   4:  </span><span class="kwrd">&lt;</span><span class="html">div</span> <span class="attr">id</span><span class="kwrd">="divContent"</span> <span class="attr">style</span><span class="kwrd">="overflow:hidden; display:none;"</span><span class="kwrd">&gt;</span></pre>
<pre><span class="lnum">   5:  </span>    Content<span class="kwrd">&lt;</span><span class="html">br</span> <span class="kwrd">/&gt;</span>Content<span class="kwrd">&lt;</span><span class="html">br</span> <span class="kwrd">/&gt;</span>Content<span class="kwrd">&lt;</span><span class="html">br</span> <span class="kwrd">/&gt;</span>Content<span class="kwrd">&lt;</span><span class="html">br</span> <span class="kwrd">/&gt;</span></pre>
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
<p>There is one thing in this piece of html code that I haven't explained.   The image in the Header is used to display an altering graphic depending on the state of the content div.  Now that If you do not want to implement it just omit it from the method call. Now it is time to import that .js file and configure the setting.  Here is the configuration section of the .js file that you will need to change.   </p>
<div class="csharpcode">
<pre><span class="lnum">   1:  </span><span class="rem">//Configuration section</span></pre>
<pre><span class="lnum">   2:  </span><span class="rem">//********************************************************</span></pre>
<pre><span class="lnum">   3:  </span><span class="kwrd">var</span> ExpandImageSrc = <span class="str">'expand.gif'</span>; <span class="rem">//image location to display when Div is collapsed</span></pre>
<pre><span class="lnum">   4:  </span><span class="kwrd">var</span> CollapseImageSrc = <span class="str">'collapse.gif'</span>; <span class="rem">//image location to display when Div is Expanded</span></pre>
<pre><span class="lnum">   5:  </span><span class="kwrd">var</span> speed = 15; <span class="rem">//how often the div refreshes to the new height</span></pre>
<pre><span class="lnum">   6:  </span><span class="kwrd">var</span> incriment = 5; <span class="rem">//each time the div refreshes height will be increased or deceased by this amount</span></pre>
<pre><span class="lnum">   7:  </span><span class="rem">//********************************************************</span></pre>
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
<p><br />
ExpandImageSrc &amp; CollapseImageSrc are the locations of the images that will be alternating.  Speed is how often the animation will refresh and increment is the amount the height of the div will change.  By changing these two variables you have control over the look and feel of collapsing animation. Hopefully this will help those of you looking for a simple way to implement collapsible panel animation.</p>
<div class="wlWriterSmartContent" id="scid:fb3a1972-4489-4e52-abe7-25a00bb07fdf:079277e7-dee5-41f5-b7fd-f15770f60576" style="PADDING-RIGHT: 0px; DISPLAY: inline; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-TOP: 0px">
<p>Download the .js file <a target="_blank" href="http://www.osbornm.com/blog/files/CollapsiblePanelJavaScript_E415/collapseableDIV.js">here</a></p>
</div>
