---
layout: post
title: Magic Page Names in ASP.NET WebPages
date: 2010-07-27 23:59
author: osbornm
comments: true
categories: []
---

<span style="font-size: x-large;"><strong>UPDATE: In ASP.NET WebPages Beta 2 moving forward we have changed the name of the of _<em>Init</em> to _<em>PageStart</em> and _<em>Start</em> to _<em>AppStart</em>.</strong></span>

One of the features in ASP.NET WebPages that is super powerful yet super simple is the “magic names” you can give to a page that make that page behave differently. Unfortunately the feature isn’t really called “magic names” (That would be way too cool!). Instead they are broken down into the two variations, <em>Start pages</em> and <em>Init Pages</em>. You may have seen these pages used before in other posts (I used one in my SimpleMembership post) or maybe even covered in one of the tutorials. I just figured that I would give them their own post as they are pretty powerful and could use some further explanation than what is normally given.

So let’s start with <em>Start Pages</em> (see what I did there?). What is the idea behind a <em>Start Page</em>? Well, as the name implies this is a page that will be executed every time your application starts. For those of you familiar with the <em>Application_Start</em> event in ASP.NET this is basically the same thing. This page will execute only once when your application is first started or if you’re running in IIS, when the <em>Application Pool</em> is recycled. So what is the magic file name you have to give a page to make it a <em>Start Page</em>? It’s simple, just name the file “_start.cshtml” or “_start.vbhtml”.

Now would be a good time to stop and talk about what the underscore character at the beginning of the file name does. ASP.NET WebPages use a concept for routing that will automatically wire up pages to nice routes for you. This was originally prototyped as “Smarty Routes” and I will be making a post about how they work later. For now what you should know is that the underscore tells routing not to serve that page up directly, effetely making it unrequestable from a browser. This trick works for any page not just these magically named pages. For instance if you have a “partial page” that contains some common UI and you don’t want the end user to be able to navigate to that page just start the name with an underscore.

Okay so back to <em>Start Pages</em>. <em>Start Pages</em> do not have any output, they are basically just a code block (the <em>@{ }</em> at the top of the file). If for whatever reason there is markup in the file it is just ignored. So what is a <em>Start Page</em> good for? Well it is used to perform programmatic setup of your site. Some of the built in features that need to be configured in a Start Page are SimpleMembership and the Email Helper. The last thing about <em>Start Pages</em> is that there can only be one <em>Start page</em> per website. Below is a sample of what a possible <em>Start page</em> might look like.

<div class="wlWriterEditableSmartContent" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:75506868-1f19-45e6-8fe0-64a65e97d1d8" style="margin: 0px; display: inline; float: none; padding: 0px;">
<div style="border: #000080 1px solid; color: #000; font-family: 'Courier New', Courier, Monospace; font-size: 10pt;">
<div style="background: #ddd; max-height: 300px; overflow: auto;">
<ol style="background: #ffffff; margin: 0 0 0 2.5em; padding: 0 0 0 5px;">
    <li><span style="color: #000000;">@{</span></li>
    <li style="background: #f3f3f3;">   <span style="color: #509610;">//Set up Simple Membership</span></li>
    <li>   <span style="color: #232323;">WebSecurity.InitializeDatabaseFile(</span><span style="color: #823125;">"Demo.sdf"</span><span style="color: #232323;">, </span><span style="color: #823125;">"Users"</span><span style="color: #232323;">, </span><span style="color: #823125;">"UserID"</span><span style="color: #232323;">, </span><span style="color: #823125;">"Username"</span><span style="color: #232323;">, </span><span style="color: #4f76ac;">true</span><span style="color: #232323;">);</span></li>
    <li style="background: #f3f3f3;"></li>
    <li>   <span style="color: #509610;">//Set Up Email Server</span></li>
    <li style="background: #f3f3f3;">   <span style="color: #232323;">Mail.SmtpServer = </span><span style="color: #823125;">"smtp.Server"</span><span style="color: #232323;">;</span></li>
    <li>   <span style="color: #232323;">Mail.SmtpPort = </span><span style="color: #b35bb4;">25</span><span style="color: #232323;">;</span></li>
    <li style="background: #f3f3f3;">   <span style="color: #232323;">Mail.EnableSsl = </span><span style="color: #4f76ac;">true</span><span style="color: #232323;">;</span></li>
    <li>   <span style="color: #232323;">Mail.UserName = </span><span style="color: #823125;">"UserName"</span><span style="color: #232323;">;</span></li>
    <li style="background: #f3f3f3;">   <span style="color: #232323;">Mail.Password = </span><span style="color: #823125;">"Password"</span><span style="color: #232323;">;</span></li>
    <li>   <span style="color: #232323;">Mail.From = </span><span style="color: #823125;">"Demo App"</span><span style="color: #232323;">;</span></li>
    <li style="background: #f3f3f3;"><span style="color: #232323;">}</span></li>
</ol>
</div>
</div>
</div>

Okay so the second “magical name” is “_init.cshtml” or “_init.vbhtml”. For the same reason (not being requestable) <em>Init Pages</em> also begin with an underscore. So what is an <em>Init Page</em>? <em>Init Pages</em> run at the beginning of <strong>each request</strong> prior to the requested page. I bolded the words “each request” in the last sentence because I want you to understand that for each request that comes to the sever this page with execute. So that means it would not be beneficial to put long running setup code in this page, anything you put in an <em>Init Page</em> should run fast. Unlike <em>Start Pages</em> there can be multiple <em>Init Pages</em> in each website. This means that you can have the root contain an <em>Init Page</em> and then a subfolder contain one as well. Earlier I said that they would run for each request that came to the server that is not really 100% true. They will only run if they are in the parent folder chain of the requested page. If you have two subfolder both with <em>Init Pages</em> in them and then request a file from one of the subfolders only the <em>Init Page</em> in that subfolder will run. So you might be asking yourself “what is the order in which they execute?” The easiest way to sum that up would be that the execution starts furthest away from the requested file and works its way down the chain closer to the requested file. There is one last difference between <em>Start Pages</em> and <em>Init Pages</em> that I would like to call out. An<em> Init Page</em> does have an output. This means that if you put mark up in the file it will show up in the output of the request. The output follows the order of execution so an <em>Init Page’s</em> output would appear before the requested files output. A key point to make here is that due to the life cycle of a page if you are using a <em>Layout Page</em> that will appear after the output of the <em>Init Page</em>.

So what is a good use for <em>Init Pages</em>? Well there are a couple examples I’d like to give. First, is to define a <em>Layout Page</em> for the site. This way you do not need to include the setting of the <em>Layout Page</em> in each page in the site but it can still be overridden. You could override the page by placing an additional <em>Init Page</em> “closer” to the page or by simply just setting it to something new in the page you want to look different. The other use that <em>Init Pages</em> are ideal for is securing your website. I talked about this a little in my SimpleMembership post, but you can use an <em>Init Page</em> to require authentication to view the pages in a folder. Also because you can have multiple <em>Init Pages</em> you could add additional security requirements (e.g. require a cretin role) as you go deeper in a folder structure. Below is an example of an <em>Init Page</em> that sets the <em>Layout Page</em> and then requires authentication and the user to be in the “admin” role.

<div class="wlWriterEditableSmartContent" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:03e46b09-31fd-48dd-b44a-2a6c35b77d04" style="margin: 0px; display: inline; float: none; padding: 0px;">
<div style="border: #000080 1px solid; color: #000; font-family: 'Courier New', Courier, Monospace; font-size: 10pt;">
<div style="background: #ddd; max-height: 300px; overflow: auto;">
<ol style="background: #ffffff; margin: 0 0 0 2em; padding: 0 0 0 5px;">
    <li><span style="color: #000000;">@{</span></li>
    <li style="background: #f3f3f3;">   <span style="color: #232323;">LayoutPage = </span><span style="color: #823125;">"~/Account/adminLayout.cshtml"</span><span style="color: #232323;">;</span></li>
    <li>   <span style="color: #232323;">WebSecurity.RequireAuthenticatedUser();</span></li>
    <li style="background: #f3f3f3;">    <span style="color: #4f76ac;">if</span><span style="color: #232323;">(!WebSecurity.IsCurrentUserInRole(</span><span style="color: #823125;">"Admin"</span><span style="color: #232323;">)){</span></li>
    <li>        <span style="color: #232323;">Response.Redirect(</span><span style="color: #823125;">"~/Account/unauthorized"</span><span style="color: #232323;">);</span></li>
    <li style="background: #f3f3f3;">    <span style="color: #232323;">}</span></li>
    <li><span style="color: #232323;">}</span></li>
</ol>
</div>
</div>
</div>

Hopefully this post clears up some of the mystery around these special magical file names that you may have heard about before. If not don’t hesitate to ask your question, the only stupid questions are the ones not asked! I’d like to see the creative ways that you can come up with to use both <em>Start Pages</em> and <em>Init Pages</em> so please feel free to email me your ideas!
