---
layout: post
title: SEO Improvements in ASP.NET 4
date: 2010-03-10 00:39
author: Matthew Osborn
comments: true
header-img: "img/post-bg-code.png"
---
In ASP.NET 4 there are a few improvements that have been made to make it easier to make tweaks to improve Search Engine Optimization (SEO) on your pages. I’ll be the first to say it and definitely not the last but these improvements are not ground breaking or “sexy” but it does make your life a little easier. There are three main improvements that have been made. First is that <em>webforms</em> now has a better story for routing your pages to friendly URLs, however I am going to skip that one for now because that is a whole post itself. The other two are simply just properties that hang of the base page class that allow you to specify <a href="http://www.w3.org/TR/html401/struct/global.html#edef-META">meta tags</a>.

Meta tags are a special tag that can be placed in html to provide meta information about that particular page. This information can be anything from the author of the page to an expiration timeout for a caching system. (More information on common/standardized types of information can be found on the <a href="http://www.w3.org/TR/html401/struct/global.html#edef-META">W3C site</a>). For this post the ones that we are concerned with are the “<a href="http://www.w3.org/TR/html401/appendix/notes.html#recs">Keywords</a>” and “<a href="http://www.w3.org/TR/html401/appendix/notes.html#recs">Description</a>” content types. The keyword content type provides information to search engines about what information is on the page. However, for obvious reason most search engines don’t put to much “weight” on this meta tag. The description content type on the other hand is pretty useful, as most search engines include a short description of the site below the link to the site.

In this case most search engines will use the description meta tag as it likely provides more human friendly context to the site.

<div class="wlWriterEditableSmartContent" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:79234b2d-d454-4f9d-b431-539fad280ecd" style="margin: 0px; display: inline; float: none; padding: 0px;">
<div style="border: #000080 1px solid; color: #000; font-family: 'Courier New', Courier, Monospace; font-size: 10pt;">
<div style="background: #ddd; overflow: auto;">
<ol style="background: #ffffff; margin: 0 0 0 2em; padding: 0 0 0 5px;">
    <li><span style="color: #0000ff;">&lt;</span><span style="color: #800000;">meta</span> <span style="color: #ff0000;">content</span><span style="color: #0000ff;">="en-us"</span> <span style="color: #ff0000;">http-equiv</span><span style="color: #0000ff;">="Content-Language"</span> <span style="color: #0000ff;">/&gt;</span></li>
    <li style="background: #f3f3f3;"><span style="color: #0000ff;">&lt;</span><span style="color: #800000;">meta</span> <span style="color: #ff0000;">content</span><span style="color: #0000ff;">="By trade I am a QA member on the Microsoft ASP.NET Team. By choice I host a podcast called Coding QA and work on LTAF."</span> <span style="color: #ff0000;">name</span><span style="color: #0000ff;">="description"</span> <span style="color: #0000ff;">/&gt;</span></li>
</ol>
</div>
</div>
</div>

Okay so know you know what Meta tags are lets talk about how to get them to show up in your ASP.NET pages. There are two new properties that hang off of <em>System.Web.UI.Page</em>;<em> MetaDescription</em> and <em>MetaKeywords</em>. You can set these in the code behind of the page or in the page directive.

<div class="wlWriterEditableSmartContent" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:64762c11-101b-4799-81aa-136a30ee67d9" style="margin: 0px; display: inline; float: none; padding: 0px;">
<div style="border: #000080 1px solid; color: #000; font-family: 'Courier New', Courier, Monospace; font-size: 10pt;">
<div style="background: #ddd; overflow: auto;">
<ol style="background: #ffffff; margin: 0 0 0 2em; padding: 0 0 0 5px;">
    <li><span style="background: #ffff00;">&lt;%</span><span style="color: #0000ff;">@</span> <span style="color: #800000;">Page</span> <span style="color: #ff0000;">Title</span><span style="color: #0000ff;">="Home Page"</span> <span style="color: #ff0000;">Language</span><span style="color: #0000ff;">="C#"</span> <span style="color: #ff0000;">MasterPageFile</span><span style="color: #0000ff;">="~/Site.master"</span> <span style="color: #ff0000;">AutoEventWireup</span><span style="color: #0000ff;">="true"</span></li>
    <li style="background: #f3f3f3;">    <span style="color: #ff0000;">CodeBehind</span><span style="color: #0000ff;">="Default.aspx.cs"</span> <span style="color: #ff0000;">Inherits</span><span style="color: #0000ff;">="WebApplication1._Default"</span></li>
    <li>    <span style="color: #ff0000;">MetaDescription</span><span style="color: #0000ff;">="Description"</span> <span style="color: #ff0000;">MetaKeywords</span><span style="color: #0000ff;">="Keywords"</span> <span style="background: #ffff00;">%&gt;</span></li>
</ol>
</div>
</div>
</div>

Now I’m sure you can imagine a much more creative use for these than static text, like changing them based on the content of the page pulled from the database, but for now we will just use static text.

<div class="wlWriterEditableSmartContent" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:fc650aec-c3f9-4219-bc5f-598b1d2a6267" style="margin: 0px; display: inline; float: none; padding: 0px;">
<div style="border: #000080 1px solid; color: #000; font-family: 'Courier New', Courier, Monospace; font-size: 10pt;">
<div style="background: #ddd; overflow: auto;">
<ol style="background: #ffffff; margin: 0 0 0 2em; padding: 0 0 0 5px;">
    <li><span style="color: #0000ff;">&lt;</span><span style="color: #800000;">head</span><span style="color: #0000ff;">&gt;</span></li>
    <li style="background: #f3f3f3;">    <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">title</span><span style="color: #0000ff;">&gt;</span>Home Page<span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">title</span><span style="color: #0000ff;">&gt;</span></li>
    <li>    <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">link</span> <span style="color: #ff0000;">href</span><span style="color: #0000ff;">="Styles/Site.css"</span> <span style="color: #ff0000;">rel</span><span style="color: #0000ff;">="stylesheet"</span> <span style="color: #ff0000;">type</span><span style="color: #0000ff;">="text/css"</span> <span style="color: #0000ff;">/&gt;</span></li>
    <li style="background: #f3f3f3;">    <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">meta</span> <span style="color: #ff0000;">name</span><span style="color: #0000ff;">="description"</span> <span style="color: #ff0000;">content</span><span style="color: #0000ff;">="Description"</span> <span style="color: #0000ff;">/&gt;</span></li>
    <li>    <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">meta</span> <span style="color: #ff0000;">name</span><span style="color: #0000ff;">="keywords"</span> <span style="color: #ff0000;">content</span><span style="color: #0000ff;">="Keywords"</span> <span style="color: #0000ff;">/&gt;</span></li>
    <li style="background: #f3f3f3;"><span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">head</span><span style="color: #0000ff;">&gt;</span></li>
</ol>
</div>
</div>
</div>


Well, that is all there really is to these two small improvements. Like I said there is nothing ground breaking or “sexy” about them. They were simply designed to help make your life a little more easy.
