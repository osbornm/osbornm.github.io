---
layout: post
title: New and Improved Templates in WebMatrix
date: 2010-10-06 18:22
author: osbornm
comments: true
categories: []
---
With the latest release of WebMatrix and ASP.NET WebPages I am proud to announce that we have been working to clean up the HTML, CSS, JavaScript, and general file and folder structures of the templates that we ship with the product. One of the major objectives was to provide general guidance on how a developer might actually set up a production website. This means we wanted to get ride of the “this is just a sample” mentality and really write some good code. That being said we also wanted to be able to slowly move users into more complex concepts. For instance one common optimization is to use CSS Sprites on websites. The problem is that this can be confusing when you are just starting to learn HTML and CSS. So we tried to come up with a good balance of production code and easy to understand code. When we were working on the templates we came up with the concept of a level system where Starter Site was entry level and you worked your way up through Fourth Coffee and Link Directory (in this release we didn't have time to get to Link Directory) to Photo Gallery and Wish List (Also didn’t have time to get to this one in this release).

So what are some of the improvements we made? Well the biggest and most prevalent is something called progressive enhancements. That means that if you view the website in a browser that supports HTML5 and CSS3 you get an even better experience but down level browsers still work and look great. We also took a look at some common practices used by the types of sites and tried to incorporate them. For instance ecommerce sites like Fourth Coffee often have featured products and photo galleries normal reduce the amount of text and focus on the images themselves. One on the improvements that I am most proud of is that now all of the templates that we worked on this release pass HTML5 validation and CSS3 validation (CSS3 validation shows errors due to the namespaced selectors used by most browsers, but this is common practice). In addition to all of this we spent a lot of time cleaning up code and making sure that it was readable and easy to understand.

When we started doing all of these improvements we decided that we were going to create a guideline document that we could use to define how templates should be developed. This document wasn’t a be all end all guide but it was a starting point. Some of the rules might need to be broke from time to time (sometimes to make things more understandable). Overall it was a good starting point and I would like to share an example of the rules we came up with. If you have your own I’d love to hear them!

<ul>
    <li>
<h6>Accessibility</h6>
<ul>
    <li>Templates need to pass the accessibility tests at: <a href="http://wave.webaim.org/">http://wave.webaim.org/</a></li>
    <li>Templates will satisfy all requirements of WCAG 2.0 level AA.</li>
</ul>
</li>
    <li>
<h6>Validation</h6>
<ul>
    <li>Templates need to pass validation at: <a href="http://validator.w3.org/">http://validator.w3.org/</a> (Both HTML &amp; CSS)</li>
</ul>
</li>
    <li>
<h6>Images</h6>
<ul>
    <li>Photos are .JPEG</li>
    <li>Graphics are .PNG</li>
    <li>Consider using sprites when possible</li>
</ul>
</li>
    <li>
<h6>Formatting</h6>
<ul>
    <li>Four spaces should be used instead of tabs</li>
    <li>Colors defined in a comment in the top in CSS</li>
    <li>Nest child selectors in CSS</li>
    <li>Shorthand used when possible in CSS
<ul>
    <li>Color codes ("#fe8" instead of "#ffee88")</li>
    <li>Collapsed properties ("border: solid 1px red" instead of "border-width: 1px; border-color: red; ...")</li>
</ul>
</li>
    <li>Use lowercase for color codes in CSS</li>
</ul>
</li>
    <li>
<h6>File Names</h6>
<ul>
    <li>All files names should use CamelCase
<ul>
    <li>_MyLayout.cshtml</li>
    <li>AddContact.vbhtml</li>
    <li>APageWithAReallyLongName.cshtml</li>
</ul>
</li>
</ul>
</li>
    <li>
<h6>Code</h6>
<ul>
    <li>DO: Keep the application logic at the top of the page before the markup</li>
    <li>DO: Follow the <a href="http://en.wikipedia.org/wiki/Indent_style#Variant:_1TBS">1TBS Style</a> variant of K&amp;R</li>
    <li>DO: Use one space after statement keywords</li>
    <li>DO NOT: Use one space after open parenthesis or before close parenthesis.</li>
</ul>
</li>
</ul>

<h3>Links</h3>
<ul>
    <li><a href="http://www.microsoft.com/web/webmatrix/">Download WebMatrix Beta 2</a></li>
    <li><a href="http://weblogs.asp.net/scottgu/archive/2010/10/06/announcing-nupack-asp-net-mvc-3-beta-and-webmatrix-beta-2.aspx">The ScottGu Post on it all</a></li>
</ul>
