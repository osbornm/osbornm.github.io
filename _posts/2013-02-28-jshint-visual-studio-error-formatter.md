---
layout: post
title: JSHint Visual Studio Error Formatter
date: 2013-02-28 18:40
author: osbornm
comments: true
categories: []
---
If you don't know what JSHint and/or JSLint is and you write any javascript then do yourself a favor and stop reading this article and go figure that out now. The short descriptions is, JSHint/JSLint is a code review tool that will mock all your hard work, make you cry, and it's frequently used by sadomasochists.

If you have taken the time and care to get JSHint up and running in your builds thats awesome but you've probably noticed that in Visual Studio you can't just double click the error message and go to the line number in the file. This is because the default formatters for JSHint do not output a in "Visual Studio aware format." You can read more about this magic <a href="http://blogs.msdn.com/b/msbuild/archive/2006/11/03/msbuild-visual-studio-aware-error-messages-and-message-formats.aspx">here</a>.  Bellow is an image that details the gist of what the format needs to be:
<p style="text-align: center;"><a href="http://blog.osbornm.com/wp-content/uploads/2013/02/ErrorMessage.png"><img class="size-medium wp-image-2481 aligncenter" alt="ErrorMessage" src="http://blog.osbornm.com/wp-content/uploads/2013/02/ErrorMessage-300x75.png" width="300" height="75" /></a></p>
If you'd like to have this awesomeness then here you go just modify your runner script (Likely WSH) to include these formatters. Enjoy!

{% gist 4151801 %}
