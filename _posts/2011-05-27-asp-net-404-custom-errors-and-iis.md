---
layout: post
title: ASP.NET 404 Custom Errors & IIS
date: 2011-05-27 18:12
author: Matthew Osborn
comments: true
header-img: "img/post-bg-code.png"
---

Recently I have been spending a fair amount of time working on the <a href="http://docs.nuget.org/">NuGet Documentation site</a>. One of the improvements I wanted to make to it was to add useful error pages. You know more than the YSOD (yellow screen of death). One of the major issues for me was creating a useful and informative 404 page. I wanted the page to tell the user why they got there, offer suggestions about what page they may be looking for, and allow them to search the site. So I did the development work committed the changes and had the CI machine push to the server (in the case app harbor).

<div class="wlWriterEditableSmartContent" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:fe25d6ec-ceef-4967-9092-df597ae1e310" style="margin: 0px; display: inline; float: none; padding: 0px;">
<div style="border: #000080 1px solid; color: #000; font-family: 'Courier New', Courier, Monospace; font-size: 10pt;">
<div style="background: #ddd; max-height: 300px; overflow: auto;">
<ol style="background: #ffffff; margin: 0 0 0 2em; padding: 0 0 0 5px; white-space: nowrap;">
    <li><span style="color: #0000ff;">&lt;</span><span style="color: #a31515;">system.web</span><span style="color: #0000ff;">&gt;</span></li>
    <li style="background: #f3f3f3;">    <span style="color: #0000ff;">&lt;</span><span style="color: #a31515;">compilation</span><span style="color: #ff0000;">debug</span><span style="color: #0000ff;">=</span>"<span style="color: #0000ff;">true</span>"<span style="color: #ff0000;">targetFramework</span><span style="color: #0000ff;">=</span>"<span style="color: #0000ff;">4.0</span>"<span style="color: #0000ff;"> /&gt;</span></li>
    <li>    <span style="color: #0000ff;">&lt;</span><span style="color: #a31515;">customErrors</span><span style="color: #ff0000;">mode</span><span style="color: #0000ff;">=</span>"<span style="color: #0000ff;">On</span>"<span style="color: #ff0000;">defaultRedirect</span><span style="color: #0000ff;">=</span>"<span style="color: #0000ff;">~/error</span>"<span style="color: #0000ff;">&gt;</span></li>
    <li style="background: #f3f3f3;">        <span style="color: #0000ff;">&lt;</span><span style="color: #a31515;">error</span><span style="color: #ff0000;">statusCode</span><span style="color: #0000ff;">=</span>"<span style="color: #0000ff;">404</span>"<span style="color: #ff0000;">redirect</span><span style="color: #0000ff;">=</span>"<span style="color: #0000ff;">~/404</span>"<span style="color: #0000ff;"> /&gt;</span></li>
    <li>    <span style="color: #0000ff;">&lt;/</span><span style="color: #a31515;">customErrors</span><span style="color: #0000ff;">&gt;</span></li>
    <li style="background: #f3f3f3;"><span style="color: #0000ff;">&lt;/</span><span style="color: #a31515;">system.web</span><span style="color: #0000ff;">&gt;</span></li>
</ol>
</div>
</div>
</div>

But I was still seeing the generic IIS sever errors! I did some searching on the internet and Twitter and found a helpful property of the response object.

<div class="wlWriterEditableSmartContent" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:5750d989-a9b5-4806-956e-d202058a42eb" style="margin: 0px; display: inline; float: none; padding: 0px;">
<div style="border: #000080 1px solid; color: #000; font-family: 'Courier New', Courier, Monospace; font-size: 10pt;">
<div style="background: #ddd; max-height: 300px; overflow: auto;">
<ol style="background: #ffffff; margin: 0 0 0 2em; padding: 0 0 0 5px; white-space: nowrap;">
    <li>Response.TrySkipIisCustomErrors = <span style="color: #0000ff;">true</span>;</li>
</ol>
</div>
</div>
</div>

By default IIS will see an response with an error status code (400-500) and will automatically change the content of the response to its default error page. What this property does it tell IIS not to do that if there is already content in the body of the page. Well that was easy, right? So I made the change and pushed it to the server, and navigated to a page that didn’t exist. Well the server still returned me the default 404 page, but on a 500 it would give me my custom error page. So what gives? Well here is the deal, the way routing works is that if ASP.NET cannot find a file that matches the requested URL the request is given back to IIS to handle. So in the case of a 404 ASP.NET can’t find the file so its given back to IIS who uses the default static file handler to serve the request. This would be slightly different if the route had matched but then say somewhere in our code we set the status to 404. In this case it would already be in the ASP.NET pipeline and ASP.NET would server the custom 404 page.

There are two ways to solve this problem. First is the easiest which is to open up IIS Manger and go to the “Error Pages” settings under IIS and change the 404 page there to use your custom 404 page.

![IIS](/img/posts/IIS_thumb.png)

This is fine if you can remote into the server or you’re not running in the cloud where multiple instances can be started. So how then do you make that work? Well lucky for us starting with IIS7 and later these settings can be added to your web.config file under the <em>System.WebServer</em> node.

<div class="wlWriterEditableSmartContent" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:931bb6ce-8973-4f42-ad01-3e7baba5c17f" style="margin: 0px; display: inline; float: none; padding: 0px;">
<div style="border: #000080 1px solid; color: #000; font-family: 'Courier New', Courier, Monospace; font-size: 10pt;">
<div style="background: #ddd; max-height: 300px; overflow: auto;">
<ol style="background: #ffffff; margin: 0 0 0 2em; padding: 0 0 0 5px; white-space: nowrap;">
    <li><span style="color: #0000ff;">&lt;</span><span style="color: #a31515;">system.webServer</span><span style="color: #0000ff;">&gt;</span></li>
    <li style="background: #f3f3f3;">    <span style="color: #0000ff;">&lt;</span><span style="color: #a31515;">httpErrors</span><span style="color: #ff0000;">errorMode</span><span style="color: #0000ff;">=</span>"<span style="color: #0000ff;">Custom</span>"<span style="color: #0000ff;"> &gt;</span></li>
    <li>        <span style="color: #0000ff;">&lt;</span><span style="color: #a31515;">remove</span><span style="color: #ff0000;">statusCode</span><span style="color: #0000ff;">=</span>"<span style="color: #0000ff;">404</span>"<span style="color: #ff0000;">subStatusCode</span><span style="color: #0000ff;">=</span>"<span style="color: #0000ff;">-1</span>"<span style="color: #0000ff;">/&gt;</span></li>
    <li style="background: #f3f3f3;">        <span style="color: #0000ff;">&lt;</span><span style="color: #a31515;">error</span><span style="color: #ff0000;">statusCode</span><span style="color: #0000ff;">=</span>"<span style="color: #0000ff;">404</span>"<span style="color: #ff0000;">path</span><span style="color: #0000ff;">=</span>"<span style="color: #0000ff;">/404</span>"<span style="color: #ff0000;">responseMode</span><span style="color: #0000ff;">=</span>"<span style="color: #0000ff;">ExecuteURL</span>"<span style="color: #0000ff;"> /&gt;</span></li>
    <li>    <span style="color: #0000ff;">&lt;/</span><span style="color: #a31515;">httpErrors</span><span style="color: #0000ff;">&gt;</span></li>
    <li style="background: #f3f3f3;"><span style="color: #0000ff;">&lt;/</span><span style="color: #a31515;">system.webServer</span><span style="color: #0000ff;">&gt;</span></li>
</ol>
</div>
</div>
</div>

So lets dig into what some of this code means and tell you about the tricky parts that you need to know. Before you can add a custom page you need to remove the entry for the status code as there can only be one entry per status code. The tricky bit here is knowing to set <em>SubStatusCode</em> to <em>–1</em>. This basically means all the possible sub statuses. If you like you could remove only the specific one you needed and set only the specific one. Also if you are playing around with the config you might find that there is a <em>defaultPath</em> attribute on the <em>httpErrors </em>node. This defines a “default” error page should an entry not be found in the list. The problem is that by default this is “locked” and cannot be set in an applications web.config and instead needs to be set at the machine level.  Once you add these settings to your config you should be able to see your custom error page when you navigate to a page that does not exist. As a side note this just drives home the importance of IIS Express and why you should use it for development. This would have been discovered prior to pushing changes to the live server that way.
