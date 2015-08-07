---
layout: post
title: MVC Script & Css Helpers
date: 2009-10-13 06:46
author: Matthew Osborn
comments: true
header-img: "img/post-bg-code.png"
---

During development of MVC 2 Preview 2 I was lucky enough (I’m on the QA team after all) to get to code and check in a feature that I wanted to MVC Futures. In all actuality it is two separate “features” that basically do the same thing. Okay, I think I might be blowing it out of proportion they are basically two new HTML helpers “<em>Script</em>” and “<em>Css</em>”

###The Problem:

When you add links to to files (aka Scripts and CSS) the URLs are normally relative to the current page’s URL. This means that if you have “../../Scripts/jquery-1.3.2.js” it means go up two segments then down to the scripts segment. This works great but when you start using routing the pattern starts to fall apart. By this I mean that because routes change often and don’t map nicely to folders going up two segments and down one might not get you to the right folder on all your pages. To get around this most people use app rooted paths <em>“~/Script/jquery-1.3.2.js</em>”. The “<em>~</em>” basically means go to the app root and then go down. However, this is not a concept that browsers understand “<em>~</em>” is handled by the web framework in this case ASP.NET and ends up getting converted to the proper relative path before being sent to the client. Like I just said HTML has no concept of what “<em>~</em>” means when you use it in the <em>href</em> or <em>src</em> of and HTML element “most” of the time the framework detects that and converts it for you. For instance ASP.NET will convert Link tags if they are in the head tag with the attribute “<em>runat</em>” set to “server”. However other tags like Script tags will not have their paths converted. So to get around this it is best practice to use the “<em>Content</em>” method hanging off the “<em>URL</em>” helper which will convert an app rooted path to the correct path.

<div style="PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-LEFT: 0px; PADDING-RIGHT: 0px; DISPLAY: inline; FLOAT: left; PADDING-TOP: 0px" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:aa5b1d23-6e2c-4840-87d0-c86c182576c3" class="wlWriterEditableSmartContent">
<div style="BORDER-BOTTOM: #000080 1px solid; BORDER-LEFT: #000080 1px solid; FONT-FAMILY: &quot;Courier New&quot;, Courier, Monospace; COLOR: #000; FONT-SIZE: 10pt; BORDER-TOP: #000080 1px solid; BORDER-RIGHT: #000080 1px solid">
<div style="BACKGROUND: #ddd; MAX-HEIGHT: 300px; OVERFLOW: auto">
<ol style="PADDING-BOTTOM: 0px; MARGIN: 0px 0px 0px 2em; PADDING-LEFT: 5px; PADDING-RIGHT: 0px; BACKGROUND: #ffffff; PADDING-TOP: 0px">
    <li><span style="COLOR: #0000ff">&lt;</span><span style="COLOR: #a31515">head</span> <span style="COLOR: #ff0000">runat</span><span style="COLOR: #0000ff">="server"&gt;</span></li>
    <li style="BACKGROUND: #f3f3f3">    <span style="COLOR: #0000ff">&lt;</span><span style="COLOR: #a31515">title</span><span style="COLOR: #0000ff">&gt;&lt;</span><span style="COLOR: #a31515">asp</span><span style="COLOR: #0000ff">:</span><span style="COLOR: #a31515">ContentPlaceHolder</span> <span style="COLOR: #ff0000">ID</span><span style="COLOR: #0000ff">="TitleContent"</span> <span style="COLOR: #ff0000">runat</span><span style="COLOR: #0000ff">="server"</span> <span style="COLOR: #0000ff">/&gt;&lt;/</span><span style="COLOR: #a31515">title</span><span style="COLOR: #0000ff">&gt;</span></li>
    <li>    <span style="COLOR: #0000ff">&lt;</span><span style="COLOR: #a31515">link</span> <span style="COLOR: #ff0000">href</span><span style="COLOR: #0000ff">="~/Content/site.css"</span> <span style="COLOR: #ff0000">rel</span><span style="COLOR: #0000ff">="stylesheet"</span> <span style="COLOR: #ff0000">type</span><span style="COLOR: #0000ff">="text/css"</span> <span style="COLOR: #0000ff">/&gt;</span></li>
    <li style="BACKGROUND: #f3f3f3">    <span style="COLOR: #0000ff">&lt;</span><span style="COLOR: #a31515">script</span> <span style="COLOR: #ff0000">src</span><span style="COLOR: #0000ff">="</span><span style="BACKGROUND: #ffee62">&lt;%</span>= Url.Content("~/Scripts/jquery-1.3.2.js")<span style="BACKGROUND: #ffee62">%&gt;</span><span style="COLOR: #0000ff">"</span> <span style="COLOR: #ff0000">type</span><span style="COLOR: #0000ff">="text/javascript"&gt;&lt;/</span><span style="COLOR: #a31515">script</span><span style="COLOR: #0000ff">&gt;</span></li>
    <li><span style="COLOR: #0000ff">&lt;/</span><span style="COLOR: #a31515">head</span><span style="COLOR: #0000ff">&gt;</span></li>
</ol>
</div>
</div>
</div>


###The Solution:

So you can see for yourself how this can make your code look ugly and then you have that “runat” attribute on the head tag that is some kind of left over from your web forms programming days. I soon grew very tried of copy and pasting the same tag over and over for each script and just changing the name. so I figured that the ASP.NET MVC framework had helpers for everything else so why not Scripts and CSS? So after a little bit of clever coding there is now a Script helper and a CSS helper.

There are a couple of ways to use them first and the most simple to to just give it a file name or a folder that is inside the default location. For Scripts that is <em>“~/Scripts</em>” and for CSS that is “<em>~/Content</em>”.

<div style="PADDING-BOTTOM: 0px; MARGIN: 0px; PADDING-LEFT: 0px; PADDING-RIGHT: 0px; DISPLAY: inline; FLOAT: none; PADDING-TOP: 0px" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:19153eed-1aa6-475f-af51-7984fcf494c6" class="wlWriterEditableSmartContent">
<div style="BORDER-BOTTOM: #000080 1px solid; BORDER-LEFT: #000080 1px solid; FONT-FAMILY: &quot;Courier New&quot;, Courier, Monospace; COLOR: #000; FONT-SIZE: 10pt; BORDER-TOP: #000080 1px solid; BORDER-RIGHT: #000080 1px solid">
<div style="BACKGROUND: #ddd; MAX-HEIGHT: 300px; OVERFLOW: auto">
<ol style="PADDING-BOTTOM: 0px; MARGIN: 0px 0px 0px 2em; PADDING-LEFT: 5px; PADDING-RIGHT: 0px; BACKGROUND: #ffffff; PADDING-TOP: 0px">
    <li><span style="COLOR: #0000ff">&lt;</span><span style="COLOR: #a31515">head</span><span style="COLOR: #0000ff">&gt;</span></li>
    <li style="BACKGROUND: #f3f3f3">    <span style="COLOR: #0000ff">&lt;</span><span style="COLOR: #a31515">title</span><span style="COLOR: #0000ff">&gt;&lt;</span><span style="COLOR: #a31515">asp</span><span style="COLOR: #0000ff">:</span><span style="COLOR: #a31515">ContentPlaceHolder</span> <span style="COLOR: #ff0000">ID</span><span style="COLOR: #0000ff">="TitleContent"</span> <span style="COLOR: #ff0000">runat</span><span style="COLOR: #0000ff">="server"</span> <span style="COLOR: #0000ff">/&gt;&lt;/</span><span style="COLOR: #a31515">title</span><span style="COLOR: #0000ff">&gt;</span></li>
    <li>    <span style="BACKGROUND: #ffee62">&lt;%</span><span style="COLOR: #0000ff">=</span> Html.Css(<span style="COLOR: #a31515">"BlueTheme/site.css"</span>) <span style="BACKGROUND: #ffee62">%&gt;</span></li>
    <li style="BACKGROUND: #f3f3f3">    <span style="BACKGROUND: #ffee62"><span style="BACKGROUND: #ffee62">&lt;%</span><font style="BACKGROUND-COLOR: #ffffff"><span style="COLOR: #0000ff">=</span> Html.Script(<span style="COLOR: #a31515">"jquery-1.3.2.js"</span>) </font><span style="BACKGROUND: #ffee62">%&gt;</span></span></li>
    <li><span style="COLOR: #0000ff">&lt;/</span><span style="COLOR: #a31515">head</span><span style="COLOR: #0000ff">&gt;</span></li>
</ol>
</div>
</div>
</div>

Basically there is some very simple logic that says if the path doesn’t start with “<em>~</em>”, “<em>../</em>”, “<em>HTTP</em>”, or “<em>HTTPS</em>” it is a file name or a path that is under the default folder for each type. That leads me to my next point which is that if the path you give the helper looks like you are trying to give it a full path (aka the strings mentioned above) then it will still create the nice tag for you but wont add to the file path. This means that you can use this with the <a href="http://weblogs.asp.net/scottgu/archive/2009/09/15/announcing-the-microsoft-ajax-cdn.aspx">New AJAX CDN</a> and still have all your script tags look the same at that top of the page. Hey call me vain but I like to have pretty code.

<div style="PADDING-BOTTOM: 20px; MARGIN: 0px; PADDING-LEFT: 0px; PADDING-RIGHT: 0px; DISPLAY: inline; FLOAT: none; PADDING-TOP: 0px" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:2d72f22d-fdcc-4931-a67f-18fe55ad76b9" class="wlWriterEditableSmartContent">
<div style="BORDER-BOTTOM: #000080 1px solid; BORDER-LEFT: #000080 1px solid; FONT-FAMILY: &quot;Courier New&quot;, Courier, Monospace; COLOR: #000; FONT-SIZE: 10pt; BORDER-TOP: #000080 1px solid; BORDER-RIGHT: #000080 1px solid">
<div style="BACKGROUND: #ddd; MAX-HEIGHT: 300px; OVERFLOW: auto">
<ol style="PADDING-BOTTOM: 0px; MARGIN: 0px 0px 0px 2em; PADDING-LEFT: 5px; PADDING-RIGHT: 0px; BACKGROUND: #ffffff; PADDING-TOP: 0px">
    <li><span style="COLOR: #0000ff">&lt;</span><span style="COLOR: #a31515">head</span><span style="COLOR: #0000ff">&gt;</span></li>
    <li style="BACKGROUND: #f3f3f3">    <span style="COLOR: #0000ff">&lt;</span><span style="COLOR: #a31515">title</span><span style="COLOR: #0000ff">&gt;&lt;</span><span style="COLOR: #a31515">asp</span><span style="COLOR: #0000ff">:</span><span style="COLOR: #a31515">ContentPlaceHolder</span> <span style="COLOR: #ff0000">ID</span><span style="COLOR: #0000ff">="TitleContent"</span> <span style="COLOR: #ff0000">runat</span><span style="COLOR: #0000ff">="server"</span> <span style="COLOR: #0000ff">/&gt;&lt;/</span><span style="COLOR: #a31515">title</span><span style="COLOR: #0000ff">&gt;</span></li>
    <li>    <span style="BACKGROUND: #ffee62">&lt;%</span><span style="COLOR: #0000ff">=</span> Html.Css(<span style="COLOR: #a31515">"~/myThemes/BlueTheme/site.css"</span>) <span style="BACKGROUND: #ffee62">%&gt;</span></li>
    <li style="BACKGROUND: #f3f3f3">    <span style="BACKGROUND: #ffee62"><span style="BACKGROUND: #ffee62">&lt;%</span><font style="BACKGROUND-COLOR: #ffffff"><span style="COLOR: #0000ff">=</span> Html.Script("<span style="COLOR: #a31515">http://ajax.microsoft.com/ajax/jquery/jquery-1.3.2.js"</span>) </font><span style="BACKGROUND: #ffee62">%&gt;</span></span></li>
    <li><span style="COLOR: #0000ff">&lt;/</span><span style="COLOR: #a31515">head</span><span style="COLOR: #0000ff">&gt;</span></li>
</ol>
</div>
</div>
</div>

However there is an extra overload that the CSS helper that allows you to pass a media type. For those unfamiliar with CSS every time you link to a StyleSheet you can add the media type attribute that allows you to specify when to apply that style. The most common use of this is to define a “<em>Print</em>” style so when a user goes to print out part of your page the website will optimize itself for printing. If you choose not to specify a media type that style will be used for all the media that doesn’t have a StyleSheet defined for it (no media type is the helpers default).

<div style="PADDING-BOTTOM: 20px; MARGIN: 0px; PADDING-LEFT: 0px; PADDING-RIGHT: 0px; DISPLAY: inline; FLOAT: none; PADDING-TOP: 0px" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:6af4025e-0f26-4d68-ba9c-a086d6c10e7e" class="wlWriterEditableSmartContent">
<div style="BORDER-BOTTOM: #000080 1px solid; BORDER-LEFT: #000080 1px solid; FONT-FAMILY: &quot;Courier New&quot;, Courier, Monospace; COLOR: #000; FONT-SIZE: 10pt; BORDER-TOP: #000080 1px solid; BORDER-RIGHT: #000080 1px solid">
<div style="BACKGROUND: #ddd; MAX-HEIGHT: 300px; OVERFLOW: auto">
<ol style="PADDING-BOTTOM: 0px; MARGIN: 0px 0px 0px 2em; PADDING-LEFT: 5px; PADDING-RIGHT: 0px; BACKGROUND: #ffffff; PADDING-TOP: 0px">
    <li><span style="COLOR: #0000ff">&lt;</span><span style="COLOR: #a31515">head</span><span style="COLOR: #0000ff">&gt;</span></li>
    <li style="BACKGROUND: #f3f3f3">    <span style="COLOR: #0000ff">&lt;</span><span style="COLOR: #a31515">title</span><span style="COLOR: #0000ff">&gt;&lt;</span><span style="COLOR: #a31515">asp</span><span style="COLOR: #0000ff">:</span><span style="COLOR: #a31515">ContentPlaceHolder</span> <span style="COLOR: #ff0000">ID</span><span style="COLOR: #0000ff">="TitleContent"</span> <span style="COLOR: #ff0000">runat</span><span style="COLOR: #0000ff">="server"</span> <span style="COLOR: #0000ff">/&gt;&lt;/</span><span style="COLOR: #a31515">title</span><span style="COLOR: #0000ff">&gt;</span></li>
    <li>    <span style="BACKGROUND: #ffee62">&lt;%</span><span style="COLOR: #0000ff">=</span> Html.Css(<span style="COLOR: #a31515">"~/myThemes/BlueTheme/site.css"</span>, <span style="COLOR: #a31515">"screen"</span>) <span style="BACKGROUND: #ffee62">%&gt;</span></li>
    <li style="BACKGROUND: #f3f3f3">    <span style="BACKGROUND: #ffee62"><span style="BACKGROUND: #ffee62">&lt;%</span><font style="BACKGROUND-COLOR: #ffffff"><span style="COLOR: #0000ff">=</span> Html.Css(<span style="COLOR: #a31515">"~/myThemes/BlueTheme/print.css"</span>, <span style="COLOR: #a31515">"print"</span>) </font><span style="BACKGROUND: #ffee62">%&gt;</span></span></li>
    <li><span style="COLOR: #0000ff">&lt;/</span><span style="COLOR: #a31515">head</span><span style="COLOR: #0000ff">&gt;</span></li>
</ol>
</div>
</div>
</div>

Also as I mentioned before notice that you no longer need to include the “<em>runat</em>” attribute on the head tag. This isn’t anything special but hey it looks cleaner.

###The drawback:
Okay so this solution isn’t perfect, sorry I know I got you all excited and now I’m letting you down. The problem is that Visual Studio does not know to parse these new helpers when it updates intellisense. So yes that means not intellisense, sorry! However if you followed best practice and used the URL helpers you wouldn’t have got intellisense either. Previously I found myself not using the URL helper when I was developing and then just changing it to use the URL helper after I was done and I do the same thing with the new helpers.

###Conclusion:

Like I said its not perfect but its a small improvement over the way things were done before. I would love to continue to improve these and maybe even bring them into the main framework if there is enough requests for them so please let me know what you think! But be nice this is my first try at coding a “feature”. You can download MVC Futures <a href="http://aspnet.codeplex.com/releases/view/41742">here</a>.
