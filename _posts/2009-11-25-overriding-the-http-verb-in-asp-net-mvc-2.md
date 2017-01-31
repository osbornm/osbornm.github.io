---
layout: post
title: Overriding the HTTP Verb in ASP.NET MVC 2
date: 2009-11-25 07:09
author: Matthew Osborn
comments: true
header-img: "img/headers/code.jpg"
---
### The Problem

Okay so lets start with a little bit of background on what a HTTP verb is. Raise your hand if you know what they are… Okay put it down people in your office are starting to stare at you. So without dragging out the explanation the HTTP verb is basically the way in which a request tells the server what it is trying to do. Most developers are familiar with the concept of a <em>POST</em> and <em>GET</em> request, however those are not the only types of HTTP verbs. There is also <em>PUT</em>, <em>DELETE</em>, and <em>HEAD</em> requests. Up until the advent of the “RESTful” buzz word the only verbs that ever really got used on a large scale were <em>HEAD</em>, <em>GET</em>, and <em>POST</em>. In fact most of the standard browsers can only issue those types of requests.

So what is the problem? We’ll some people out there (including some on ivory towers) like to have very thing be semantic. So if you have an action that deletes a row from the database the request should use the <em>DELETE</em> verb. Now we could argue the relevance of the need to follow this method but I don’t feel like it and its my blog post. If you remember what I said earlier about browsers you’ve probably already figured out the problem. That is right most browser can’t issue a <em>DELETE</em> request.

### The Solution

The solution in ASP.NET MVC 2 is a rather small feature that was added to the framework as the result of the WCF team creating the <a href="http://aspnet.codeplex.com/wikipage?title=WCF%20REST">REST Start Kit for MVC</a>. That feature is the ability to override the HTTP verb in one of several ways so that the client, in this example the browser, is still issuing a <em>POST</em> request but the framework treats the request like the verb specified in the override.

There is three ways in which a developer can choose to override the HTTP verb and they all use the special cased key “<em>x-http-method-override</em>”. First, is to add a HTTP header to the request. This scenario is primarily for AJAX requests and in ASP.NET MVC 2 our AJAX helpers will add this header when need. The Second way is to add a hidden field to the form. The Last way is to use the query string to override the verb. The order of precedence works from the header version to the hidden field version to the query string version. If you are familiar with the way model biding works in ASP.NET MVC this is basically the same order of precedence. There is also some restrictions on what can be override. For instance a <em>GET</em> request cannot be overridden to anything else.
### The Sample Code

#### HTTP Header
When you override the verb using the header method you need to add a http header with the special cased key “<em>x-http-method-override</em>” and the value of what you would like to override the verb to. When you use the AJAX helpers to issue a request this is done for you if you specify one of the verb types that needs to be overriden.

<span style="font-size: xx-small;"><span style="background: #ffee62;">&lt;%</span> <span style="color: blue;">using</span>(Ajax.BeginForm(<span style="color: blue;">new </span><span style="color: #2b91af;">AjaxOptions</span>(){HttpMethod=<span style="color: #a31515;">"Delete"</span>})){ </span><span style="font-size: xx-small;"><span style="background: #ffee62;">%&gt; </span><span style="color: blue;">&lt;</span><span style="color: #a31515;">input </span><span style="color: red;">type</span><span style="color: blue;">="submit" </span><span style="color: red;">value</span></span><span style="font-size: xx-small;"><span style="color: blue;">="Delete Using Http Header" /&gt; </span><span style="background: #ffee62;">&lt;%</span> } <span style="background: #ffee62;">%&gt;</span></span>

Now if you look at the request you can see that there is an additional header added with the new value and ASP.NET MVC will treat that request as that verb type.

#### Hidden Input

This method is basically the same as the header method but instead of a header it is a hidden input with the name and value.

<pre class="code">
 <span style="background: #ffee62;">&lt;%</span> <span style="color: blue;">using </span>(Ajax.BeginForm(<span style="color: blue;">new </span><span style="color: #2b91af;">AjaxOptions</span>())){ <span style="background: #ffee62;">%&gt;
</span>    <span style="color: blue;">&lt;</span><span style="color: #a31515;">input </span><span style="color: red;">type</span><span style="color: blue;">=&quot;hidden&quot; </span><span style="color: red;">name</span><span style="color: blue;">=&quot;x-http-method-override&quot; </span><span style="color: red;">value</span><span style="color: blue;">=&quot;Put&quot; /&gt;
    &lt;</span><span style="color: #a31515;">input </span><span style="color: red;">type</span><span style="color: blue;">=&quot;submit&quot; </span><span style="color: red;">value</span><span style="color: blue;">=&quot;Put Using Hidden Field&quot; /&gt;
</span><span style="background: #ffee62;">&lt;%</span> } <span style="background: #ffee62;">%&gt;</span>

</pre>

#### Query String

Once again this works very similar to the other two methods. All you need to do is add the parameter “<em>x-http-method-override</em>” with the value of the desired override in the query string of URL that form will <em>POST</em> to. In this sample this is done using the overload to <em>BeginForm</em> that takes a <em>RouteValue Collection</em> because if the values are not used in the matching route they will get tacked on the URL in the query string.

<pre class="code"><span style="background: #ffee62;">&lt;%</span> <span style="color: blue;">using</span>(Ajax.BeginForm(<span style="color: #a31515;">"HttpVerbOverride"</span>, <span style="color: blue;">new </span><span style="color: #2b91af;">RouteValueDictionary</span>(){{<span style="color: #a31515;">"x-http-method-override"</span>, <span style="color: #a31515;">"Delete"</span>}}, <span style="color: blue;">new </span><span style="color: #2b91af;">AjaxOptions</span>())){ <span style="background: #ffee62;">%&gt;
</span>    <span style="color: blue;">&lt;</span><span style="color: #a31515;">input </span><span style="color: red;">type</span><span style="color: blue;">="submit" </span><span style="color: red;">value</span><span style="color: blue;">="Delete using Query String" /&gt;
</span><span style="background: #ffee62;">&lt;%</span> } <span style="background: #ffee62;">%&gt;</span></pre>

### Summary

This is a pretty simple solution a problem that not all of you will face but I choose to write about it because it is one of the little know improvements we are making to version two of the framework. If you choose not to use this feature the only impact will be that “<em>x-http-method-override</em>” is now effectively a reserved/key word.
