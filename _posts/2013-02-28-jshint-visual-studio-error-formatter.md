---
layout: post
title: JSHint Visual Studio Error Formatter
date: 2013-02-28 18:40
header-img: "img/headers/code.jpg"
author: Matthew
comments: true
---
If you don't know what JSHint and/or JSLint is and you write any javascript then do yourself a favor and stop reading this article and go figure that out now. The short descriptions is, JSHint/JSLint is a code review tool that will mock all your hard work, make you cry, and it's frequently used by sadomasochists.

If you have taken the time and care to get JSHint up and running in your builds that's awesome but you've probably noticed that in Visual Studio you can't just double click the error message and go to the line number in the file. This is because the default formatters for JSHint do not output a in "Visual Studio aware format." You can read more about this magic [here](http://blogs.msdn.com/b/msbuild/archive/2006/11/03/msbuild-visual-studio-aware-error-messages-and-message-formats.aspx). Bellow is an image that details the gist of what the format needs to be:

![Error Message Explination](/img/posts/JSHintErrorMessage.png)


If you'd like to have this awesomeness then here you go just modify your runner script (Likely WSH) to include these formatters. Enjoy!

{% gist 4151801 %}
