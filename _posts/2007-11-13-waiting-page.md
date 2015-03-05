---
layout: post
title: Waiting Page
date: 2007-11-13 18:00
author: osbornm
comments: true
categories: []
---
<div>Today I was tasked with creating a simple wait page that could be used throughout our web application. This is very simple and can be quite robust with some simple Java scripting. However, here comes the bombshell, we have clients that are using Windows 95 so anything that is implemented in java script has to have an alternative. So I thought for awhile, I figured that the clients that where using Windows 95 would be used to waiting so showing them a waiting page was not very important to me. So here is the solution I came up with.</div>
<div> </div>
<div>If you take a look at the response object there is an interesting method, Flush(), this method sends all the currently buffered content to the client. So at the beginning of an operation that will take awhile I can write some simple html to the response and send it to the client. Here is how I choose to implement it. </div>
<div></div>
<div></div>
<div><!--
{\rtf1\ansi\ansicpg\lang1024\noproof1252\uc1 \deff0{\fonttbl{\f0\fnil\fcharset0\fprq1 Courier New;}}{\colortbl;??\red0\green0\blue255;\red255\green255\blue255;\red0\green0\blue0;\red43\green145\blue175;\red163\green21\blue21;}??\fs20 \cf1 public\cf0  \cf1 static\cf0  \cf1 class\cf0  \cf4 load\par ??\cf0 \tab \{\par ??\tab \tab \cf1 public\cf0  \cf1 static\cf0  \cf1 void\cf0  ShowLoad(\cf1 string\cf0  p_imgSrc, System.Web.\cf4 HttpResponse\cf0  Response)\par ??\tab \tab \{\par ??\tab \tab \tab Response.Write(\cf5 "&lt;div id=\\"divWaiting\\" style=\\"Display:none;\\"&gt;"\cf0 );\par ??\tab \tab \tab Response.Write(\cf5 "&lt;img src=\\""\cf0 +p_imgSrc+\cf5 "\\" /&gt;"\cf0 );\par ??\tab \tab \tab Response.Write(\cf5 "&lt;/div&gt;"\cf0 );\par ??\tab \tab \tab Response.Write(\cf5 "&lt;script language=javascript&gt;"\cf0 );\par ??\tab \tab \tab Response.Write(\cf5 "function Start_Wait()"\cf0 );\par ??\tab \tab \tab Response.Write(\cf5 "\{"\cf0 );\par ??\tab \tab \tab Response.Write(\cf5 "\tab document.getElementById(\\"divWaiting\\").style.display = \\"block\\";"\cf0 );\par ??\tab \tab \tab Response.Write(\cf5 "\}"\cf0 );\tab \tab \tab \tab \par ??\tab \tab \tab Response.Write(\cf5 "function Stop_Wait()"\cf0 );\par ??\tab \tab \tab Response.Write(\cf5 "\{ "\cf0 );\par ??\tab \tab \tab Response.Write(\cf5 "\tab document.getElementById(\\"divWaiting\\").style.display = \\"none\\";"\cf0 );\par ??\tab \tab \tab Response.Write(\cf5 "\}"\cf0 );\par ??\tab \tab \tab Response.Write(\cf5 "Start_Wait();"\cf0 );\par ??\tab \tab \tab Response.Write(\cf5 "&lt;/script&gt;"\cf0 );\par ??\tab \tab \tab Response.Flush();\par ??\tab \tab \}\par ??\tab \}}
-->
<div style="FONT-SIZE: 10pt; BACKGROUND: white; COLOR: black; FONT-FAMILY: Courier New"><span style="COLOR: #2b91af">
<div style="FONT-SIZE: 10pt; BACKGROUND: white; COLOR: black; FONT-FAMILY: Courier New">
<p style="MARGIN: 0px"><span style="COLOR: #2b91af">   </span></p>
<div style="FONT-SIZE: 10pt; BACKGROUND: white; COLOR: black; FONT-FAMILY: Courier New">
<p style="MARGIN: 0px"><span style="COLOR: blue">public</span> <span style="COLOR: blue">static</span> <span style="COLOR: blue">class</span> <span style="COLOR: #2b91af">load</span></p>
<p style="MARGIN: 0px">{</p>
<p style="MARGIN: 0px">  <span style="COLOR: blue">public</span> <span style="COLOR: blue">static</span> <span style="COLOR: blue">void</span> ShowLoad(<span style="COLOR: blue">string</span> p_imgSrc, System.Web.<span style="COLOR: #2b91af">HttpResponse</span> Response)</p>
<p style="MARGIN: 0px">  {</p>
<p style="MARGIN: 0px">    Response.Write(<span style="COLOR: #a31515">"&lt;div id=\"divWaiting\" style=\"Display:none;\"&gt;"</span>);</p>
<p style="MARGIN: 0px">    Response.Write(<span style="COLOR: #a31515">"&lt;img src=\""</span>+p_imgSrc+<span style="COLOR: #a31515">"\" /&gt;"</span>);</p>
<p style="MARGIN: 0px">    Response.Write(<span style="COLOR: #a31515">"&lt;/div&gt;"</span>);</p>
<p style="MARGIN: 0px">    Response.Write(<span style="COLOR: #a31515">"&lt;script language=javascript&gt;"</span>);</p>
<p style="MARGIN: 0px">    Response.Write(<span style="COLOR: #a31515">"function Start_Wait()"</span>);</p>
<p style="MARGIN: 0px">    Response.Write(<span style="COLOR: #a31515">"{"</span>);</p>
<p style="MARGIN: 0px">    Response.Write(<span style="COLOR: #a31515">"document.getElementById(\"divWaiting\").style.display = \"block\";"</span>);</p>
<p style="MARGIN: 0px">    Response.Write(<span style="COLOR: #a31515">"}"</span>);        </p>
<p style="MARGIN: 0px">    Response.Write(<span style="COLOR: #a31515">"function Stop_Wait()"</span>);</p>
<p style="MARGIN: 0px">    Response.Write(<span style="COLOR: #a31515">"{ "</span>);</p>
<p style="MARGIN: 0px">    Response.Write(<span style="COLOR: #a31515">"document.getElementById(\"divWaiting\").style.display = \"none\";"</span>);</p>
<p style="MARGIN: 0px">    Response.Write(<span style="COLOR: #a31515">"}"</span>);</p>
<p style="MARGIN: 0px">    Response.Write(<span style="COLOR: #a31515">"Start_Wait();"</span>);</p>
<p style="MARGIN: 0px">    Response.Write(<span style="COLOR: #a31515">"&lt;/script&gt;"</span>);</p>
<p style="MARGIN: 0px">    Response.Flush();</p>
<p style="MARGIN: 0px">  }</p>
<p style="MARGIN: 0px">}<!--EndFragment--></p>
</div>
</div>
</span></div>
</div>
<div> </div>
<div>
<div style="MARGIN: 0in 0in 0pt; LINE-HEIGHT: normal"><span style="FONT-SIZE: 9pt">With this simple helper class there are two things that you have to do to implement the wait page.  First, at the top of you HTML page put a script tag that calls the stop_Wait function.</span></div>
<div style="MARGIN: 0in 0in 0pt; LINE-HEIGHT: normal"><span style="FONT-SIZE: 9pt"></span></div>
<div style="MARGIN: 0in 0in 0pt; LINE-HEIGHT: normal"><span style="FONT-SIZE: 9pt"><font size="2"></font><font color="#a31515" size="2"><font color="#0000ff">&lt;</font>script</font><font size="2"> </font><font color="#ff0000" size="2">language</font><font color="#0000ff" size="2">="javascript"</font><font size="2"> </font><font color="#ff0000" size="2">type</font><font color="#0000ff" size="2">="text/javascript"&gt;</font><font size="2">Stop_Wait();</font><font color="#0000ff" size="2">&lt;/</font><font color="#a31515" size="2">script</font><font color="#0000ff" size="2">&gt;</font></span></div>
<div style="MARGIN: 0in 0in 0pt; LINE-HEIGHT: normal"><span style="FONT-SIZE: 9pt"><font color="#0000ff" size="2"></font></span></div>
<div style="MARGIN: 0in 0in 0pt; LINE-HEIGHT: normal"><span style="FONT-SIZE: 9pt"></span></div>
<div style="MARGIN: 0in 0in 0pt; LINE-HEIGHT: normal"><span style="FONT-SIZE: 9pt">Second, in the server side code at the beginning of a lengthy operation make a call to ShowLoad. </span></div>
<div style="MARGIN: 0in 0in 0pt; LINE-HEIGHT: normal"><span style="FONT-SIZE: 9pt"></span></div>
<div style="MARGIN: 0in 0in 0pt; LINE-HEIGHT: normal"><span style="FONT-SIZE: 9pt">
<div style="FONT-SIZE: 10pt; BACKGROUND: white; COLOR: black; FONT-FAMILY: Courier New">
<p style="MARGIN: 0px"><span style="COLOR: #2b91af">load</span>.ShowLoad(<span style="COLOR: #a31515">"Images/progress.gif"</span>);</p>
</div>
<!--EndFragment--></span></div>
<div style="MARGIN: 0in 0in 0pt; LINE-HEIGHT: normal"> </div>
<div style="MARGIN: 0in 0in 0pt; LINE-HEIGHT: normal"><span style="FONT-SIZE: 9pt">That’s it you’re done now you have a simple wait page that will display to the user if they have Java Script enabled. If they don’t they simple will not notice anything. However there is one more issue with this method. If you are using the response object to redirect on the client side the HTTP headers have been sent so you will receive an error message.</span></div>
<div style="MARGIN: 0in 0in 0pt; LINE-HEIGHT: normal"> </div>
<div style="MARGIN: 0in 0in 0pt; LINE-HEIGHT: normal"><span style="FONT-SIZE: 9pt">To get around this problem you can use a little bit of tricky HTML. And create your own redirect method.</span></div>
<div style="MARGIN: 0in 0in 0pt; LINE-HEIGHT: normal"> </div>
<div style="MARGIN: 0in 0in 0pt; LINE-HEIGHT: normal"><!--
{\rtf1\ansi\ansicpg\lang1024\noproof1252\uc1 \deff0{\fonttbl{\f0\fnil\fcharset0\fprq1 Courier New;}}{\colortbl;??\red0\green0\blue255;\red255\green255\blue255;\red0\green0\blue0;\red163\green21\blue21;}??\fs20 \cf1 public\cf0  \cf1 void\cf0  redirect(\cf1 string\cf0  p_redirectURI)\par ??\tab \tab \{\par ??\tab \tab \tab Response.ClearContent();\par ??\tab \tab \tab Response.Write(\cf4 "&lt;head&gt;"\cf0 );\par ??\tab \tab \tab Response.Write(\cf4 "&lt;meta http-equiv=\\"REFRESH\\" content=\\"0;url="\cf0  + p_redirectURI + \cf4 "\\"&gt;"\cf0 );\par ??\tab \tab \tab Response.Write(\cf4 "&lt;/head&gt;"\cf0 );\par ??\tab \tab \tab Response.Flush();\par ??\tab \tab \}}
-->
<div style="FONT-SIZE: 10pt; BACKGROUND: white; COLOR: black; FONT-FAMILY: Courier New">
<p style="MARGIN: 0px"><span style="COLOR: blue">public</span> <span style="COLOR: blue">void</span> redirect(<span style="COLOR: blue">string</span> p_redirectURI)</p>
<p style="MARGIN: 0px">{</p>
<p style="MARGIN: 0px">      Response.ClearContent();</p>
<p style="MARGIN: 0px">      Response.Write(<span style="COLOR: #a31515">"&lt;head&gt;"</span>);</p>
<p style="MARGIN: 0px">      Response.Write(<span style="COLOR: #a31515">"&lt;meta http-equiv=\"REFRESH\" content=\"0;url="</span> + p_redirectURI + <span style="COLOR: #a31515">"\"&gt;"</span>);</p>
<p style="MARGIN: 0px">      Response.Write(<span style="COLOR: #a31515">"&lt;/head&gt;"</span>);</p>
<p style="MARGIN: 0px">      Response.Flush();</p>
<p style="MARGIN: 0px">}</p>
</div>
</div>
<div style="MARGIN: 0in 0in 0pt; LINE-HEIGHT: normal"> </div>
<div style="MARGIN: 0in 0in 0pt; LINE-HEIGHT: normal"><span style="FONT-SIZE: 9pt">This is my solution to the problem. You have any ideas or question please feel free to let me know.</span></div>
</div>
