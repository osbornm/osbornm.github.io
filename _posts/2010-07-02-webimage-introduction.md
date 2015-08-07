---
layout: post
title: Introduction to WebImage
date: 2010-07-02 18:31
author: Matthew Osborn
comments: true
header-img: "img/post-bg-code.png"
---
One common operation that pretty much every website in the world does is either accepting, creating, editing, or displaying images. This could be something as simple as a user’s profile picture or as complex a full blown image gallery. Either way if you have every had implement these functionalities in a website you know that they are not the easiest thing to create. Well, here is where the <em>WebPages </em>team comes in to save the day! We have wrapped what we think are some of the most common image manipulation operations into a brand new fancy <em>WebImage</em> helper. </p>

Okay so what can the <em>WebImage</em> helper do for you, well a few things:

<ul>
    <li>Get an image from the request </li>
    <li>Resize </li>
    <li>Crop </li>
    <li>Add a watermark (text and image) </li>
    <li>Flip vertical and horizontal </li>
    <li>Rotate right and left </li>
    <li>Save and convert formats </li>
    <li>Some other more boring stuff like get the array of bytes, blah blah blah. </li>
</ul>

Okay so now that I got you all excited about the <em>WebImage</em> helper (it’s okay if you’re not I will forgive you) let jump into some code.

So one of the more common things to do is to allow a user to upload an image and then save it off somewhere, either to a database or the file system. So I am going to stop here and say that for the rest of the article I will assume you have a basic understand of HTML and that I don’t need to show you how to create a file upload input on your page.

<div style="PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-LEFT: 0px; PADDING-RIGHT: 0px; DISPLAY: inline; FLOAT: none; PADDING-TOP: 0px" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:0225dd65-4257-49b8-83bc-131c29bcff6c" class="wlWriterEditableSmartContent">
<div style="BORDER-BOTTOM: #000080 1px solid; BORDER-LEFT: #000080 1px solid; FONT-FAMILY: &quot;Courier New&quot;, Courier, Monospace; COLOR: #000; FONT-SIZE: 10pt; BORDER-TOP: #000080 1px solid; BORDER-RIGHT: #000080 1px solid">
<div style="BACKGROUND: #ddd; MAX-HEIGHT: 300px; OVERFLOW: auto">
<ol style="PADDING-BOTTOM: 0px; MARGIN: 0px 0px 0px 2em; PADDING-LEFT: 5px; PADDING-RIGHT: 0px; BACKGROUND: #ffffff; PADDING-TOP: 0px">
    <li><span style="COLOR: #0000ff">var</span> photoToDatabase = <span style="COLOR: #2b91af">WebImage</span>.GetImageFromRequest(<span style="COLOR: #a31515">"FileUploadNameHere"</span>);</li>
    <li style="BACKGROUND: #f3f3f3">repo.SaveToDatabase(photoToDatabase.GetBytes());</li>
    <li> </li>
    <li style="BACKGROUND: #f3f3f3"><span style="COLOR: #008000">/* OR */</span></li>
    <li> </li>
    <li style="BACKGROUND: #f3f3f3"><span style="COLOR: #0000ff">var</span> photoToFileSystem = <span style="COLOR: #2b91af">WebImage</span>.GetImageFromRequest(<span style="COLOR: #a31515">"FileUploadNameHere"</span>);</li>
    <li><span style="COLOR: #0000ff">string</span> newFileName = <span style="COLOR: #2b91af">Guid</span>.NewGuid().ToString() + <span style="COLOR: #a31515">"_"</span> + photoToFileSystem.FileName;</li>
    <li style="BACKGROUND: #f3f3f3">photoToFileSystem.Save(<span style="COLOR: #a31515">"~\\images\\"</span> + newFileName);</li>
</ol>
</div>
</div>
</div>

In the code sample above you can see two different ways to grab the uploaded file from the request (the input has a name of ‘<em>FileUploadNameHere’</em>) and save it off, either to a database or to the file system. The first example shows how to save it up to a database. Most of the time the API for saving to a database just take a Byte[] of the image, for instance see the <em>Simple Data</em> demo. The second one that save the image off to the file system is the much more interesting sample. For right now ignore the man behind the current (line number seven) in the sample that just ensures a unique file name. The team to trying to see what we can do to make this a better story but no promises. So if you’ll notice there is a native API that we are called, called <em>Save. </em>This method takes in a path, which can be a relative path like it is in the sample or a a full path (you would <em>PhysicalApplicationPath</em> to create such a path), and saves a copy of the image to the file system.

Okay so let’s do something a little more interesting, let’s talk about what you how you would take that image that you just saved off and then create a thumbnail version of it.

<div style="PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-LEFT: 0px; PADDING-RIGHT: 0px; DISPLAY: inline; FLOAT: none; PADDING-TOP: 0px" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:f0c6009f-966a-4564-a624-9ed0e1b8a696" class="wlWriterEditableSmartContent">
<div style="PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-LEFT: 0px; PADDING-RIGHT: 0px; DISPLAY: inline; FLOAT: none; PADDING-TOP: 0px" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:a1424bc2-34f6-441f-a194-62f222ee8097" class="wlWriterEditableSmartContent">
<div style="BORDER-BOTTOM: #000080 1px solid; BORDER-LEFT: #000080 1px solid; FONT-FAMILY: &quot;Courier New&quot;, Courier, Monospace; COLOR: #000; FONT-SIZE: 10pt; BORDER-TOP: #000080 1px solid; BORDER-RIGHT: #000080 1px solid">
<div style="BACKGROUND: #ddd; MAX-HEIGHT: 300px; OVERFLOW: auto">
<ol style="PADDING-BOTTOM: 0px; MARGIN: 0px 0px 0px 2em; PADDING-LEFT: 5px; PADDING-RIGHT: 0px; BACKGROUND: #ffffff; PADDING-TOP: 0px">
    <li><span style="COLOR: #0000ff">var</span> photoToDatabase = <span style="COLOR: #2b91af">WebImage</span>.GetImageFromRequest(<span style="COLOR: #a31515">"FileUploadNameHere"</span>); </li>
    <li style="BACKGROUND: #f3f3f3">photoToDatabase.Clone().Resize(128, 128, preserveAspectRatio: <span style="COLOR: #0000ff">true</span>);</li>
</ol>
</div>
</div>
</div>


In this example there are two APIs that I would like to take the time to point out. The first is the call to the <em>Clone</em> method, this effectively create a copy of the image in memory. The reason for this is that we want to still have the original image preserved, assuming we are also going to save it of. The second is the call to the <em>Resize</em> method, it takes a height and a width and has a two optional parameters. In this example I am using the <em>preserveAspectRatio</em> parameter, which will choose a height and a width that matches as closely to the values you passed in while still keeping the aspect ratio.

This would be a good time to stop and point out that all the <em>WebImage</em> APIs are designed to return a <em>WebImage</em> so you get a fluent design when using them. In the example above you can see how I was able to chain multiple API calls together into one line, which in my humble opinion looks much cleaner. Now that you have a basic understanding of how the <em>WebImage</em> API works, and can explore the remaining APIs, I’d like to leave you with a sample how you can write a page that takes an users uploaded photo adds whatever text they provided as a watermark and then allows them to download the image.

<div style="PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-LEFT: 0px; PADDING-RIGHT: 0px; DISPLAY: inline; FLOAT: none; PADDING-TOP: 0px" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:12452135-c5b1-4726-84c2-6ac2a60515a1" class="wlWriterEditableSmartContent">
<div style="BORDER-BOTTOM: #000080 1px solid; BORDER-LEFT: #000080 1px solid; FONT-FAMILY: &quot;Courier New&quot;, Courier, Monospace; COLOR: #000; FONT-SIZE: 10pt; BORDER-TOP: #000080 1px solid; BORDER-RIGHT: #000080 1px solid">
<div style="BACKGROUND: #ddd; OVERFLOW: auto">
<ol style="PADDING-BOTTOM: 0px; MARGIN: 0px 0px 0px 2.5em; PADDING-LEFT: 5px; PADDING-RIGHT: 0px; BACKGROUND: #ffffff; PADDING-TOP: 0px">
    <li><span style="BACKGROUND: #ffff00">@{</span></li>
    <li style="BACKGROUND: #f3f3f3">        <span style="BACKGROUND: #d3d3d3">WebImage photo = null;</span></li>
    <li>        <span style="BACKGROUND: #d3d3d3"><span style="BACKGROUND: #d3d3d3; COLOR: #0000ff">var</span><span style="BACKGROUND: #d3d3d3"> newFileName = </span><span style="BACKGROUND: #d3d3d3; COLOR: #a31515">""</span><span style="BACKGROUND: #d3d3d3">;</span></span></li>
    <li style="BACKGROUND: #f3f3f3">        <span style="BACKGROUND: #d3d3d3"><span style="BACKGROUND: #d3d3d3; COLOR: #0000ff">var</span><span style="BACKGROUND: #d3d3d3"> imagePath = </span><span style="BACKGROUND: #d3d3d3; COLOR: #a31515">""</span><span style="BACKGROUND: #d3d3d3">;</span></span></li>
    <li>        <span style="BACKGROUND: #d3d3d3"><span style="BACKGROUND: #d3d3d3; COLOR: #0000ff">var</span><span style="BACKGROUND: #d3d3d3"> imageThumbPath  = </span><span style="BACKGROUND: #d3d3d3; COLOR: #a31515">""</span><span style="BACKGROUND: #d3d3d3">;</span></span></li>
    <li style="BACKGROUND: #f3f3f3">        <span style="BACKGROUND: #d3d3d3"><span style="BACKGROUND: #d3d3d3; COLOR: #0000ff">if</span><span style="BACKGROUND: #d3d3d3">(IsPost){</span></span></li>
    <li>            <span style="BACKGROUND: #d3d3d3">photo = WebImage.GetImageFromRequest(</span><span style="BACKGROUND: #d3d3d3; COLOR: #a31515">"Image"</span><span style="BACKGROUND: #d3d3d3">);</span></li>
    <li style="BACKGROUND: #f3f3f3">            <span style="BACKGROUND: #d3d3d3"><span style="BACKGROUND: #d3d3d3; COLOR: #0000ff">if</span><span style="BACKGROUND: #d3d3d3">(photo != null){</span></span></li>
    <li>                <span style="BACKGROUND: #d3d3d3"><span style="BACKGROUND: #d3d3d3; COLOR: #008000">/*Setup Correct Image Paths*/</span></span></li>
    <li style="BACKGROUND: #f3f3f3">                <span style="BACKGROUND: #d3d3d3">newFileName = Guid.NewGuid().ToString() + </span><span style="BACKGROUND: #d3d3d3; COLOR: #a31515">"_"</span><span style="BACKGROUND: #d3d3d3"> + Path.GetFileName(photo.FileName);</span></li>
    <li>                <span style="BACKGROUND: #d3d3d3">imagePath = </span><span style="BACKGROUND: #d3d3d3; COLOR: #a31515">"~\\images\\"</span><span style="BACKGROUND: #d3d3d3"> + newFileName;</span></li>
    <li style="BACKGROUND: #f3f3f3">                <span style="BACKGROUND: #d3d3d3">imageThumbPath = </span><span style="BACKGROUND: #d3d3d3; COLOR: #a31515">"~\\images\\thumbs\\"</span><span style="BACKGROUND: #d3d3d3"> + newFileName;</span></li>
    <li>                <span style="BACKGROUND: #d3d3d3"><span style="BACKGROUND: #d3d3d3; COLOR: #008000">/*Add Text Watermark*/</span></span></li>
    <li style="BACKGROUND: #f3f3f3">                <span style="BACKGROUND: #d3d3d3"><span style="BACKGROUND: #d3d3d3; COLOR: #0000ff">var</span><span style="BACKGROUND: #d3d3d3"> text = Request[</span><span style="BACKGROUND: #d3d3d3; COLOR: #a31515">"Text"</span><span style="BACKGROUND: #d3d3d3">];</span></span></li>
    <li>                <span style="BACKGROUND: #d3d3d3"><span style="BACKGROUND: #d3d3d3; COLOR: #0000ff">var</span><span style="BACKGROUND: #d3d3d3"> opacity = Request[</span><span style="BACKGROUND: #d3d3d3; COLOR: #a31515">"Opacity"</span><span style="BACKGROUND: #d3d3d3">].AsInt();</span></span></li>
    <li style="BACKGROUND: #f3f3f3">                <span style="BACKGROUND: #d3d3d3"><span style="BACKGROUND: #d3d3d3; COLOR: #0000ff">var</span><span style="BACKGROUND: #d3d3d3"> fontSize = Request[</span><span style="BACKGROUND: #d3d3d3; COLOR: #a31515">"FontSize"</span><span style="BACKGROUND: #d3d3d3">].AsInt();</span></span></li>
    <li>                <span style="BACKGROUND: #d3d3d3">photo.AddTextWatermark(text, fontSize: fontSize, opacity: opacity);</span></li>
    <li style="BACKGROUND: #f3f3f3">                <span style="BACKGROUND: #d3d3d3"><span style="BACKGROUND: #d3d3d3; COLOR: #008000">/*Add Image Watermark*/</span></span></li>
    <li>                <span style="BACKGROUND: #d3d3d3"><span style="BACKGROUND: #d3d3d3; COLOR: #0000ff">var</span><span style="BACKGROUND: #d3d3d3"> WMImage = WebImage.GetImageFromRequest(</span><span style="BACKGROUND: #d3d3d3; COLOR: #a31515">"WMImage"</span><span style="BACKGROUND: #d3d3d3">);</span></span></li>
    <li style="BACKGROUND: #f3f3f3">                <span style="BACKGROUND: #d3d3d3"><span style="BACKGROUND: #d3d3d3; COLOR: #0000ff">if</span><span style="BACKGROUND: #d3d3d3">(WMImage != null){</span></span></li>
    <li>                    <span style="BACKGROUND: #d3d3d3">photo.AddImageWatermark(WMImage, verticalAlign: </span><span style="BACKGROUND: #d3d3d3; COLOR: #a31515">"Top"</span><span style="BACKGROUND: #d3d3d3">, opacity: opacity);</span></li>
    <li style="BACKGROUND: #f3f3f3">                <span style="BACKGROUND: #d3d3d3">}</span></li>
    <li>                <span style="BACKGROUND: #d3d3d3"><span style="BACKGROUND: #d3d3d3; COLOR: #008000">/*Save and Create Thumbnail*/</span></span></li>
    <li style="BACKGROUND: #f3f3f3">                <span style="BACKGROUND: #d3d3d3"><span style="BACKGROUND: #d3d3d3">photo.Save(imagePath);</span></span></li>
    <li>                <span style="BACKGROUND: #d3d3d3">photo.Resize(350, 350, preserveAspectRatio: true).Save(imageThumbPath);</span></li>
    <li style="BACKGROUND: #f3f3f3">            <span style="BACKGROUND: #d3d3d3">}</span></li>
    <li>        <span style="BACKGROUND: #d3d3d3">}</span></li>
    <li style="BACKGROUND: #f3f3f3"><span style="BACKGROUND: #d3d3d3">}</span></li>
    <li> </li>
    <li style="BACKGROUND: #f3f3f3">&lt;!DOCTYPE html&gt;</li>
    <li> </li>
    <li style="BACKGROUND: #f3f3f3">&lt;<span style="COLOR: #800000">html</span> <span style="COLOR: #ff0000">xmlns</span>="<span style="COLOR: #0000ff">http://www.w3.org/1999/xhtml</span>"&gt;</li>
    <li>&lt;<span style="COLOR: #800000">head</span>&gt;</li>
    <li style="BACKGROUND: #f3f3f3">    &lt;<span style="COLOR: #800000">title</span>&gt;ASP.NET WebPages | WebImage Demo&lt;/<span style="COLOR: #800000">title</span>&gt;</li>
    <li>    &lt;<span style="COLOR: #800000">link</span> <span style="COLOR: #ff0000">type</span>="<span style="COLOR: #0000ff">text/css</span>" <span style="COLOR: #ff0000">rel</span>="<span style="COLOR: #0000ff">Stylesheet</span>" <span style="COLOR: #ff0000">href</span>="<span style="COLOR: #0000ff">default.css</span>" /&gt;</li>
    <li style="BACKGROUND: #f3f3f3">&lt;/<span style="COLOR: #800000">head</span>&gt;</li>
    <li>&lt;<span style="COLOR: #800000">body</span>&gt;</li>
    <li style="BACKGROUND: #f3f3f3">    &lt;<span style="COLOR: #800000">form</span> <span style="COLOR: #ff0000">action</span>=""  <span style="COLOR: #ff0000">method</span>="<span style="COLOR: #0000ff">post</span>" <span style="COLOR: #ff0000">enctype</span>="<span style="COLOR: #0000ff">multipart/form-data</span>"&gt;</li>
    <li>        &lt;<span style="COLOR: #800000">fieldset</span>&gt;</li>
    <li style="BACKGROUND: #f3f3f3">            &lt;<span style="COLOR: #800000">legend</span>&gt;WebImage Demo&lt;/<span style="COLOR: #800000">legend</span>&gt;</li>
    <li>                &lt;<span style="COLOR: #800000">label</span> <span style="COLOR: #ff0000">for</span>="<span style="COLOR: #0000ff">Image</span>"&gt;Image&lt;/<span style="COLOR: #800000">label</span>&gt;</li>
    <li style="BACKGROUND: #f3f3f3">                &lt;<span style="COLOR: #800000">input</span> <span style="COLOR: #ff0000">type</span>="<span style="COLOR: #0000ff">file</span>" <span style="COLOR: #ff0000">name</span>="<span style="COLOR: #0000ff">Image</span>" /&gt;</li>
    <li>                &lt;<span style="COLOR: #800000">label</span> <span style="COLOR: #ff0000">for</span>="<span style="COLOR: #0000ff">Text</span>"&gt;Watermark Image&lt;/<span style="COLOR: #800000">label</span>&gt;</li>
    <li style="BACKGROUND: #f3f3f3">                &lt;<span style="COLOR: #800000">input</span> <span style="COLOR: #ff0000">type</span>="<span style="COLOR: #0000ff">file</span>" <span style="COLOR: #ff0000">name</span>="<span style="COLOR: #0000ff">WMImage</span>" /&gt;</li>
    <li>                &lt;<span style="COLOR: #800000">label</span> <span style="COLOR: #ff0000">for</span>="<span style="COLOR: #0000ff">Text</span>"&gt;Watermark Text&lt;/<span style="COLOR: #800000">label</span>&gt;</li>
    <li style="BACKGROUND: #f3f3f3">                &lt;<span style="COLOR: #800000">input</span> <span style="COLOR: #ff0000">type</span>="<span style="COLOR: #0000ff">text</span>" <span style="COLOR: #ff0000">name</span>="<span style="COLOR: #0000ff">Text</span>" <span style="COLOR: #ff0000">value</span>="<span style="COLOR: #0000ff">WebImage Demo</span>" /&gt;</li>
    <li>                &lt;<span style="COLOR: #800000">label</span> <span style="COLOR: #ff0000">for</span>="<span style="COLOR: #0000ff">Opacity</span>"&gt;Opacity (0-100)&lt;/<span style="COLOR: #800000">label</span>&gt;</li>
    <li style="BACKGROUND: #f3f3f3">                &lt;<span style="COLOR: #800000">input</span> <span style="COLOR: #ff0000">type</span>="<span style="COLOR: #0000ff">text</span>" <span style="COLOR: #ff0000">name</span>="<span style="COLOR: #0000ff">Opacity</span>" <span style="COLOR: #ff0000">value</span>="<span style="COLOR: #0000ff">80</span>" /&gt;</li>
    <li>                &lt;<span style="COLOR: #800000">label</span> <span style="COLOR: #ff0000">for</span>="<span style="COLOR: #0000ff">FontSize</span>"&gt;Font Size&lt;/<span style="COLOR: #800000">label</span>&gt;</li>
    <li style="BACKGROUND: #f3f3f3">                &lt;<span style="COLOR: #800000">input</span> <span style="COLOR: #ff0000">type</span>="<span style="COLOR: #0000ff">text</span>" <span style="COLOR: #ff0000">name</span>="<span style="COLOR: #0000ff">FontSize</span>" <span style="COLOR: #ff0000">value</span>="<span style="COLOR: #0000ff">60</span>" /&gt;</li>
    <li>                &lt;<span style="COLOR: #800000">input</span> <span style="COLOR: #ff0000">type</span>="<span style="COLOR: #0000ff">submit</span>" <span style="COLOR: #ff0000">value</span>="<span style="COLOR: #0000ff">Try It Out</span>" /&gt;</li>
    <li style="BACKGROUND: #f3f3f3">        &lt;/<span style="COLOR: #800000">fieldset</span>&gt;</li>
    <li>    &lt;/<span style="COLOR: #800000">form</span>&gt;</li>
    <li style="BACKGROUND: #f3f3f3">    <span style="BACKGROUND: #ffff00">@</span><span style="BACKGROUND: #d3d3d3; COLOR: #0000ff">if</span><span style="BACKGROUND: #d3d3d3">(imagePath != </span><span style="BACKGROUND: #d3d3d3; COLOR: #a31515">""</span><span style="BACKGROUND: #d3d3d3">){</span></li>
    <li>    &lt;<span style="COLOR: #800000">div</span> <span style="COLOR: #ff0000">class</span>="<span style="COLOR: #0000ff">result</span>"&gt;        </li>
    <li style="BACKGROUND: #f3f3f3">        &lt;<span style="COLOR: #800000">img</span> <span style="COLOR: #ff0000">src</span>="<span style="BACKGROUND: #ffff00">@</span><span style="BACKGROUND: #d3d3d3">Href(imageThumbPath)</span>" <span style="COLOR: #ff0000">alt</span>="<span style="COLOR: #0000ff">Your image with a watermarl</span>" /&gt;</li>
    <li>        &lt;<span style="COLOR: #800000">a</span> <span style="COLOR: #ff0000">href</span>="<span style="BACKGROUND: #ffff00">@</span><span style="BACKGROUND: #d3d3d3">Href(imagePath)</span>" <span style="COLOR: #ff0000">target</span>="<span style="COLOR: #0000ff">_blank</span>" <span style="COLOR: #ff0000">class</span>="<span style="COLOR: #0000ff">download</span>"&gt;Download Full Size&lt;/<span style="COLOR: #800000">a</span>&gt;</li>
    <li style="BACKGROUND: #f3f3f3">    &lt;/<span style="COLOR: #800000">div</span>&gt;</li>
    <li>    }</li>
    <li style="BACKGROUND: #f3f3f3">&lt;/<span style="COLOR: #800000">body</span>&gt;</li>
    <li>&lt;/<span style="COLOR: #800000">html</span>&gt;</li>
</ol>
</div>
</div>
</div>

<h3>Q&amp;A:</h3>
<p><strong>Question:</strong> Where can I find the dll that has WebImage?<br />
<strong>Answer:</strong> WebImage is part of the WebMatrix stack, specifically ASP.NET WebPages. WebImage is in the Microsoft.WebPages.Helpers assembly that is GAC'd and also drop in program files when you install the stack.</p>
</div>
