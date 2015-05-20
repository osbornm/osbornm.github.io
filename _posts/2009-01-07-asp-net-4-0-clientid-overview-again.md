---
layout: post
title: ASP.NET 4.0 ClientID Overview
date: 2009-01-07 01:41
author: osbornm
comments: true
categories: []
---
###Introduction

One of the new features being added to version 4.0 of ASP.NET is the ability to control the client side IDs that are generated by the framework.  Previously the framework would modify the client side IDs to uniquely identify each control.  This some times left you with the ID you defined in markup or sometimes left you with something that looks like this, “ctl00_MasterPageBody_ctl01_Textbox1.”

###The Problem
The modification of the client side id property works great to ensure that each element is uniquely identified, however, to anyone that has tried to do any sort of client side scripting this becomes very frustrating. Chances are that if you have worked in ASP.NET for any time at all you have run into this issue.  The problem is that until runtime you do not what the client side ID could be, making it difficult to do any kind of client side scripting.  In addition any modification of the page, adding removing controls, can result in a different client side ID being generated.

###Old Solution

Again if you have worked with ASP.NET for any amount of time you know there is a work around for this issue.  Each control has a property called ClientID that is a read only and supplies the unique client side ID.  You can use this in a code behind when dynamically adding scripts, or more commonly use inline code (old ASP style) to supply the value to and client side scripts.

<pre class="code"><span style="COLOR: blue">&lt;</span><span style="COLOR: #a31515">script </span><span style="COLOR: red">type</span><span style="COLOR: blue">="text/javascript"&gt;
    function </span>DoSomething(){
        alert(<span style="COLOR: #a31515">'&lt;%= Control.ClientID %&gt;'</span>);
    }
<span style="COLOR: blue">&lt;/</span><span style="COLOR: #a31515">script</span><span style="COLOR: blue">&gt;</span></pre>

###ASP.NET 4.0 Solution

First off let me start by explaining why we decided to tackle this problem in version 4.0 of the framework.  While we provided a way of supplying the developer with the client side ID, with the growth of client side scripting this solution has become some what hacky.  There is not really a clean way to use this with lots of controls and lots of external script files.  Also it might have had something to do with the developer asking for control over this.  Developers do love to have control of everything, weather they use it or not, it’s just our nature :) The solution that we came up has four ‘modes’ that a user can use giving them everything from existing behavior to full control.  The controls ID property is modified according to the ClientIDMode mode and then used as the client side id.

####Modes and what they do
There is now a new property on every control (this includes pages and master pages as they inherit from control) called ClientIDMode that is used to select the behavior of the client side ID.

<pre class="code"><span style="COLOR: blue">&lt;</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">Label </span><span style="COLOR: red">ID</span><span style="COLOR: blue">="Label1" </span><span style="COLOR: red">runat</span><span style="COLOR: blue">="server" </span><span style="COLOR: red">ClientIDMode</span><span style="COLOR: blue">="[Mode Type]" /&gt;</span></pre>

The Mode Types

<ul>
    <li><strong>Legacy</strong>: The default value if ClientIDMode is not set anywhere in the control hierarchy.  This causes client side IDs to behave the way they did in version 2.0 (3.0 and 3.5 did not change this code path) of the framework. This mode will generate an ID similar to “ctl00_MasterPageBody_ctl01_Textbox1.” </li>
    <li><strong>Inherit</strong>: This is the default behavior for every control.  This looks to the controls parent to get its value for ClientIDMode.  You do not need to set this on every control as it is the default, this is used only when the ClientIDMode has been changed and the new desired behavior is to inherit from the controls parent. </li>
    <li><strong>Static</strong>: This mode does exactly what you think it would, it makes the client side ID static. Meaning that what you put for the ID is what will be used for the client side ID.  Warning, this means that if a static ClientIDMode is used in a repeating control the developer is responsible for ensuring client side ID uniqueness. </li>
    <li><strong>Predictable</strong>: This mode is used when the framework needs to ensure uniqueness but it needs to be done so in a predictable way.  The most common use for this mode is on databound controls.  The framework will traverse the control hierarchy prefixing the supplied ID with it’s parent control ID until it reaches a control in the hierarchy whose ClientIDMode is defined as static.  In the event that the control is placed inside a databound control a suffix with a value that identifies that instance will also be added to the supplied ID.  The ClientIDRowSuffix property is used to control the value that will be used as a suffix (see samples).  This mode will generate an ID similar to “Gridview1_Label1_0” </li>
</ul>

###Samples
<p><strong>Legacy Mode</strong></p>

<p>Legacy mode is pretty straight forward, it generates a client side ID the way that it had in version 2.0 of the framework.</p>

<p>markup:</p>

<pre class="code"><span style="COLOR: blue">&lt;</span><span style="COLOR: #a31515">asp</span> <span style="COLOR: blue">:</span><span style="COLOR: #a31515">TextBox </span><span style="COLOR: red">ID</span> <span style="COLOR: blue">="txtEcho" </span><span style="COLOR: red">runat</span> <span style="COLOR: blue">="server" </span><span style="COLOR: red">Width</span> <span style="COLOR: blue">="65%" </span><span style="COLOR: red">ClientIDMode</span> <span style="COLOR: blue">="Legacy" /&gt;</span> </pre>

<p>output:</p>

<pre class="code"><span style="COLOR: blue">&lt;</span><span style="COLOR: #a31515">input </span><span style="COLOR: red">id</span><span style="COLOR: blue">="ctl00_MasterPageBody_ctl00_txtEcho" </span><span style="COLOR: red">style</span><span style="COLOR: blue">="</span><span style="COLOR: red">width</span>: <span style="COLOR: blue">65%" </span><span style="COLOR: red">name</span><span style="COLOR: blue">="ctl00$MasterPageBody$ctl00$txtEcho" /&gt;</span></pre>

<p><strong>Static Mode</strong></p>

<p>Static is the most basic of all ClientIDMode modes, what you give for the ID is what you get for the client side ID. Once again a warning that if a static ClientIDMode is used inside of a repeated control it is the developer’s responsibility to ensure client side ID uniqueness.</p>

<p>markup:</p>

<pre class="code"><span style="COLOR: blue">&lt;</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">TextBox </span><span style="COLOR: red">ID</span><span style="COLOR: blue">="txtEcho2" </span><span style="COLOR: red">runat</span><span style="COLOR: blue">="server" </span><span style="COLOR: red">Width</span><span style="COLOR: blue">="65%" </span><span style="COLOR: red">ClientIDMode</span><span style="COLOR: blue">="Static" /&gt;</span></pre>
<p>output:</p>
<pre class="code"><span style="COLOR: blue">&lt;</span><span style="COLOR: #a31515">input </span><span style="COLOR: red">id</span><span style="COLOR: blue">="txtEcho2" </span><span style="COLOR: red">style</span><span style="COLOR: blue">="</span><span style="COLOR: red">width</span>: <span style="COLOR: blue">65%" </span><span style="COLOR: red">name</span><span style="COLOR: blue">="ctl00$MasterPageBody$ctl00$txtEcho2" /&gt;</span></pre>

<p><strong>Predictable Mode</strong></p>

<p>Predictable mode really tackles the heart of the problem.  The framework previously generated it’s unique IDs to prevent ID collisions and the most common place for these types of collisions are inside databound controls.  Predictable mode is really designed to work with databound controls but does not have to.  There is three ways to uses the predictable mode, each one of these is defined through the ClientIDRowSuffix property that specifies the suffix for each instance.  The ClientIDRowSuffix uses values from the control’s datakeys collection, so if the control does not have a datakeys collection this property is not viable.  If this property is not set or is not available the row index will be used in it’s place. </p>
<p><strong>1.</strong> With no ClientIDRowSuffix defined, this is also the behavior for databound controls without a datakeys collection e.g. Repeater Control.  Notice that the framework has traversed the control hierarchy and prefixed the ID with the parent’s ID and suffixed the ID with row index. </p>

<p>markup:</p>

<pre class="code"><span style="COLOR: blue">&lt;</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">GridView </span><span style="COLOR: red">ID</span><span style="COLOR: blue">="EmployeesNoSuffix" </span><span style="COLOR: red">runat</span><span style="COLOR: blue">="server" </span><span style="COLOR: red">AutoGenerateColumns</span><span style="COLOR: blue">="false" </span><span style="COLOR: red">ClientIDMode</span><span style="COLOR: blue">="Predictable" &gt;
    &lt;</span><span style="COLOR: #a31515">Columns</span><span style="COLOR: blue">&gt;
        &lt;</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">TemplateField </span><span style="COLOR: red">HeaderText</span><span style="COLOR: blue">="ID"&gt;
            &lt;</span><span style="COLOR: #a31515">ItemTemplate</span><span style="COLOR: blue">&gt;
                &lt;</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">Label </span><span style="COLOR: red">ID</span><span style="COLOR: blue">="EmployeeID" </span><span style="COLOR: red">runat</span><span style="COLOR: blue">="server" </span><span style="COLOR: red">Text</span><span style="COLOR: blue">='</span><span style="BACKGROUND: #ffee62">&lt;%</span># Eval("ID") <span style="BACKGROUND: #ffee62">%&gt;</span><span style="COLOR: blue">' /&gt;
            &lt;/</span><span style="COLOR: #a31515">ItemTemplate</span><span style="COLOR: blue">&gt;
        &lt;/</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">TemplateField</span><span style="COLOR: blue">&gt;
        &lt;</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">TemplateField </span><span style="COLOR: red">HeaderText</span><span style="COLOR: blue">="Name"&gt;
            &lt;</span><span style="COLOR: #a31515">ItemTemplate</span><span style="COLOR: blue">&gt;
                &lt;</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">Label </span><span style="COLOR: red">ID</span><span style="COLOR: blue">="EmployeeName" </span><span style="COLOR: red">runat</span><span style="COLOR: blue">="server" </span><span style="COLOR: red">Text</span><span style="COLOR: blue">='</span><span style="BACKGROUND: #ffee62">&lt;%</span># Eval("Name") <span style="BACKGROUND: #ffee62">%&gt;</span><span style="COLOR: blue">' /&gt;
            &lt;/</span><span style="COLOR: #a31515">ItemTemplate</span><span style="COLOR: blue">&gt;
        &lt;/</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">TemplateField</span><span style="COLOR: blue">&gt;
    &lt;/</span><span style="COLOR: #a31515">Columns</span><span style="COLOR: blue">&gt;
&lt;/</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">GridView</span><span style="COLOR: blue">&gt;</span></pre>

<p>output:</p>

<pre class="code"><span style="COLOR: blue">&lt;</span><span style="COLOR: #a31515">table </span><span style="COLOR: red">id</span><span style="COLOR: blue">="EmployeesNoSuffix" </span><span style="COLOR: red">style</span><span style="COLOR: blue">="</span><span style="COLOR: red">border-collapse</span>: <span style="COLOR: blue">collapse" </span><span style="COLOR: red">cellspacing</span><span style="COLOR: blue">="0" </span><span style="COLOR: red">rules</span><span style="COLOR: blue">="all" </span><span style="COLOR: red">border</span><span style="COLOR: blue">="1"&gt;
    &lt;</span><span style="COLOR: #a31515">tbody</span><span style="COLOR: blue">&gt;
        &lt;</span><span style="COLOR: #a31515">tr</span><span style="COLOR: blue">&gt;
            &lt;</span><span style="COLOR: #a31515">th </span><span style="COLOR: red">scope</span><span style="COLOR: blue">="col"&gt;</span>ID<span style="COLOR: blue">&lt;/</span><span style="COLOR: #a31515">th</span><span style="COLOR: blue">&gt;
            &lt;</span><span style="COLOR: #a31515">th </span><span style="COLOR: red">scope</span><span style="COLOR: blue">="col"&gt;</span>Name<span style="COLOR: blue">&lt;/</span><span style="COLOR: #a31515">th</span><span style="COLOR: blue">&gt;
        &lt;/</span><span style="COLOR: #a31515">tr</span><span style="COLOR: blue">&gt;
        &lt;</span><span style="COLOR: #a31515">tr</span><span style="COLOR: blue">&gt;
            &lt;</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;&lt;</span><span style="COLOR: #a31515">span </span><span style="COLOR: red">id</span><span style="COLOR: blue">="EmployeesNoSuffix_EmployeeID_0"&gt;</span>1<span style="COLOR: blue">&lt;/</span><span style="COLOR: #a31515">span</span><span style="COLOR: blue">&gt;&lt;/</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;
            &lt;</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;&lt;</span><span style="COLOR: #a31515">span </span><span style="COLOR: red">id</span><span style="COLOR: blue">="EmployeesNoSuffix_EmployeeName_0"&gt;</span>EmployeeName1<span style="COLOR: blue">&lt;/</span><span style="COLOR: #a31515">span</span><span style="COLOR: blue">&gt;&lt;/</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;
        &lt;/</span><span style="COLOR: #a31515">tr</span><span style="COLOR: blue">&gt;
        </span>...
        <span style="COLOR: blue">&lt;</span><span style="COLOR: #a31515">tr</span><span style="COLOR: blue">&gt;
            &lt;</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;&lt;</span><span style="COLOR: #a31515">span </span><span style="COLOR: red">id</span><span style="COLOR: blue">="EmployeesNoSuffix_EmployeeID_8"&gt;</span>9<span style="COLOR: blue">&lt;/</span><span style="COLOR: #a31515">span</span><span style="COLOR: blue">&gt;&lt;/</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;
            &lt;</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;&lt;</span><span style="COLOR: #a31515">span </span><span style="COLOR: red">id</span><span style="COLOR: blue">="EmployeesNoSuffix_EmployeeName_8"&gt;</span>EmployeeName9<span style="COLOR: blue">&lt;/</span><span style="COLOR: #a31515">span</span><span style="COLOR: blue">&gt;&lt;/</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;
        &lt;/</span><span style="COLOR: #a31515">tr</span><span style="COLOR: blue">&gt;
    &lt;/</span><span style="COLOR: #a31515">tbody</span><span style="COLOR: blue">&gt;
&lt;/</span><span style="COLOR: #a31515">table</span><span style="COLOR: blue">&gt;</span></pre>

<p><strong>2.</strong> With a ClientIDRowSuffix defined, this looks in the control’s datakeys collection for the value and then suffixes the ID with that value.</p>

<p>markup:</p>

<pre class="code"><span style="COLOR: blue">&lt;</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">GridView </span><span style="COLOR: red">ID</span><span style="COLOR: blue">="EmployeesSuffix" </span><span style="COLOR: red">runat</span><span style="COLOR: blue">="server" </span><span style="COLOR: red">AutoGenerateColumns</span><span style="COLOR: blue">="false" </span><span style="COLOR: red">ClientIDMode</span><span style="COLOR: blue">="Predictable" </span><span style="COLOR: red">ClientID<span style="COLOR: red">Row</span>Suffix</span><span style="COLOR: blue">="ID" &gt;
    &lt;</span><span style="COLOR: #a31515">Columns</span><span style="COLOR: blue">&gt;
        &lt;</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">TemplateField </span><span style="COLOR: red">HeaderText</span><span style="COLOR: blue">="ID"&gt;
            &lt;</span><span style="COLOR: #a31515">ItemTemplate</span><span style="COLOR: blue">&gt;
                &lt;</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">Label </span><span style="COLOR: red">ID</span><span style="COLOR: blue">="EmployeeID" </span><span style="COLOR: red">runat</span><span style="COLOR: blue">="server" </span><span style="COLOR: red">Text</span><span style="COLOR: blue">='</span><span style="BACKGROUND: #ffee62">&lt;%</span># Eval("ID") <span style="BACKGROUND: #ffee62">%&gt;</span><span style="COLOR: blue">' /&gt;
            &lt;/</span><span style="COLOR: #a31515">ItemTemplate</span><span style="COLOR: blue">&gt;
        &lt;/</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">TemplateField</span><span style="COLOR: blue">&gt;
        &lt;</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">TemplateField </span><span style="COLOR: red">HeaderText</span><span style="COLOR: blue">="Name"&gt;
            &lt;</span><span style="COLOR: #a31515">ItemTemplate</span><span style="COLOR: blue">&gt;
                &lt;</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">Label </span><span style="COLOR: red">ID</span><span style="COLOR: blue">="EmployeeName" </span><span style="COLOR: red">runat</span><span style="COLOR: blue">="server" </span><span style="COLOR: red">Text</span><span style="COLOR: blue">='</span><span style="BACKGROUND: #ffee62">&lt;%</span># Eval("Name") <span style="BACKGROUND: #ffee62">%&gt;</span><span style="COLOR: blue">' /&gt;
            &lt;/</span><span style="COLOR: #a31515">ItemTemplate</span><span style="COLOR: blue">&gt;
        &lt;/</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">TemplateField</span><span style="COLOR: blue">&gt;
    &lt;/</span><span style="COLOR: #a31515">Columns</span><span style="COLOR: blue">&gt;
&lt;/</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">GridView</span><span style="COLOR: blue">&gt;</span></pre>

<p>output:</p>

<pre class="code"><span style="COLOR: blue">&lt;</span><span style="COLOR: #a31515">table </span><span style="COLOR: red">id</span><span style="COLOR: blue">="EmployeesSuffix" </span><span style="COLOR: red">style</span><span style="COLOR: blue">="</span><span style="COLOR: red">border-collapse</span>: <span style="COLOR: blue">collapse" </span><span style="COLOR: red">cellspacing</span><span style="COLOR: blue">="0" </span><span style="COLOR: red">rules</span><span style="COLOR: blue">="all" </span><span style="COLOR: red">border</span><span style="COLOR: blue">="1"&gt;
    &lt;</span><span style="COLOR: #a31515">tbody</span><span style="COLOR: blue">&gt;
        &lt;</span><span style="COLOR: #a31515">tr</span><span style="COLOR: blue">&gt;
            &lt;</span><span style="COLOR: #a31515">th </span><span style="COLOR: red">scope</span><span style="COLOR: blue">="col"&gt;</span>ID<span style="COLOR: blue">&lt;/</span><span style="COLOR: #a31515">th</span><span style="COLOR: blue">&gt;
            &lt;</span><span style="COLOR: #a31515">th </span><span style="COLOR: red">scope</span><span style="COLOR: blue">="col"&gt;</span>Name<span style="COLOR: blue">&lt;/</span><span style="COLOR: #a31515">th</span><span style="COLOR: blue">&gt;
        &lt;/</span><span style="COLOR: #a31515">tr</span><span style="COLOR: blue">&gt;
        &lt;</span><span style="COLOR: #a31515">tr</span><span style="COLOR: blue">&gt;
            &lt;</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;&lt;</span><span style="COLOR: #a31515">span </span><span style="COLOR: red">id</span><span style="COLOR: blue">="EmployeesSuffix_EmployeeID_1"&gt;</span>1<span style="COLOR: blue">&lt;/</span><span style="COLOR: #a31515">span</span><span style="COLOR: blue">&gt;&lt;/</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;
            &lt;</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;&lt;</span><span style="COLOR: #a31515">span </span><span style="COLOR: red">id</span><span style="COLOR: blue">="EmployeesSuffix_EmployeeName_1"&gt;</span>EmployeeName1<span style="COLOR: blue">&lt;/</span><span style="COLOR: #a31515">span</span><span style="COLOR: blue">&gt;&lt;/</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;
        &lt;/</span><span style="COLOR: #a31515">tr</span><span style="COLOR: blue">&gt;
        </span>...
        <span style="COLOR: blue">&lt;</span><span style="COLOR: #a31515">tr</span><span style="COLOR: blue">&gt;
            &lt;</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;&lt;</span><span style="COLOR: #a31515">span </span><span style="COLOR: red">id</span><span style="COLOR: blue">="EmployeesSuffix_EmployeeID_9"&gt;</span>9<span style="COLOR: blue">&lt;/</span><span style="COLOR: #a31515">span</span><span style="COLOR: blue">&gt;&lt;/</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;
            &lt;</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;&lt;</span><span style="COLOR: #a31515">span </span><span style="COLOR: red">id</span><span style="COLOR: blue">="EmployeesSuffix_EmployeeName_9"&gt;</span>EmployeeName9<span style="COLOR: blue">&lt;/</span><span style="COLOR: #a31515">span</span><span style="COLOR: blue">&gt;&lt;/</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;
        &lt;/</span><span style="COLOR: #a31515">tr</span><span style="COLOR: blue">&gt;
    &lt;/</span><span style="COLOR: #a31515">tbody</span><span style="COLOR: blue">&gt;
&lt;/</span><span style="COLOR: #a31515">table</span><span style="COLOR: blue">&gt;</span></pre>
<p>3. With a ClientIDRowSuffix defined, but instead of just one value a compound value will be used.  Exhibits the same behavior as one value but it will suffix both values onto the ID.</p>
<p>markup:</p>
<pre class="code"><span style="COLOR: blue">&lt;</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">GridView </span><span style="COLOR: red">ID</span><span style="COLOR: blue">="EmployeesCompSuffix" </span><span style="COLOR: red">runat</span><span style="COLOR: blue">="server" </span><span style="COLOR: red">AutoGenerateColumns</span><span style="COLOR: blue">="false" </span><span style="COLOR: red">ClientIDMode</span><span style="COLOR: blue">="Predictable" </span><span style="COLOR: red">ClientIDRowSuffix</span><span style="COLOR: blue">="ID, Name" &gt;
    &lt;</span><span style="COLOR: #a31515">Columns</span><span style="COLOR: blue">&gt;
        &lt;</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">TemplateField </span><span style="COLOR: red">HeaderText</span><span style="COLOR: blue">="ID"&gt;
            &lt;</span><span style="COLOR: #a31515">ItemTemplate</span><span style="COLOR: blue">&gt;
                &lt;</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">Label </span><span style="COLOR: red">ID</span><span style="COLOR: blue">="EmployeeID" </span><span style="COLOR: red">runat</span><span style="COLOR: blue">="server" </span><span style="COLOR: red">Text</span><span style="COLOR: blue">='</span><span style="BACKGROUND: #ffee62">&lt;%</span># Eval("ID") <span style="BACKGROUND: #ffee62">%&gt;</span><span style="COLOR: blue">' /&gt;
            &lt;/</span><span style="COLOR: #a31515">ItemTemplate</span><span style="COLOR: blue">&gt;
        &lt;/</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">TemplateField</span><span style="COLOR: blue">&gt;
        &lt;</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">TemplateField </span><span style="COLOR: red">HeaderText</span><span style="COLOR: blue">="Name"&gt;
            &lt;</span><span style="COLOR: #a31515">ItemTemplate</span><span style="COLOR: blue">&gt;
                &lt;</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">Label </span><span style="COLOR: red">ID</span><span style="COLOR: blue">="EmployeeName" </span><span style="COLOR: red">runat</span><span style="COLOR: blue">="server" </span><span style="COLOR: red">Text</span><span style="COLOR: blue">='</span><span style="BACKGROUND: #ffee62">&lt;%</span># Eval("Name") <span style="BACKGROUND: #ffee62">%&gt;</span><span style="COLOR: blue">' /&gt;
            &lt;/</span><span style="COLOR: #a31515">ItemTemplate</span><span style="COLOR: blue">&gt;
        &lt;/</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">TemplateField</span><span style="COLOR: blue">&gt;
    &lt;/</span><span style="COLOR: #a31515">Columns</span><span style="COLOR: blue">&gt;
&lt;/</span><span style="COLOR: #a31515">asp</span><span style="COLOR: blue">:</span><span style="COLOR: #a31515">GridView</span><span style="COLOR: blue">&gt;</span></pre>
<p>output:</p>
<pre class="code"><span style="COLOR: blue">&lt;</span><span style="COLOR: #a31515">table </span><span style="COLOR: red">id</span><span style="COLOR: blue">="EmployeesCompSuffix" </span><span style="COLOR: red">style</span><span style="COLOR: blue">="</span><span style="COLOR: red">border-collapse</span>: <span style="COLOR: blue">collapse" </span><span style="COLOR: red">cellspacing</span><span style="COLOR: blue">="0" </span><span style="COLOR: red">rules</span><span style="COLOR: blue">="all" </span><span style="COLOR: red">border</span><span style="COLOR: blue">="1"&gt;
    &lt;</span><span style="COLOR: #a31515">tbody</span><span style="COLOR: blue">&gt;
        &lt;</span><span style="COLOR: #a31515">tr</span><span style="COLOR: blue">&gt;
            &lt;</span><span style="COLOR: #a31515">th </span><span style="COLOR: red">scope</span><span style="COLOR: blue">="col"&gt;</span>ID<span style="COLOR: blue">&lt;/</span><span style="COLOR: #a31515">th</span><span style="COLOR: blue">&gt;
            &lt;</span><span style="COLOR: #a31515">th </span><span style="COLOR: red">scope</span><span style="COLOR: blue">="col"&gt;</span>Name<span style="COLOR: blue">&lt;/</span><span style="COLOR: #a31515">th</span><span style="COLOR: blue">&gt;
        &lt;/</span><span style="COLOR: #a31515">tr</span><span style="COLOR: blue">&gt;
        &lt;</span><span style="COLOR: #a31515">tr</span><span style="COLOR: blue">&gt;
            &lt;</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;&lt;</span><span style="COLOR: #a31515">span </span><span style="COLOR: red">id</span><span style="COLOR: blue">="EmployeesCompSuffix_EmployeeID_1_EmployeeName1"&gt;</span>1<span style="COLOR: blue">&lt;/</span><span style="COLOR: #a31515">span</span><span style="COLOR: blue">&gt;&lt;/</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;
            &lt;</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;&lt;</span><span style="COLOR: #a31515">span </span><span style="COLOR: red">id</span><span style="COLOR: blue">="EmployeesCompSuffix_EmployeeName_1_EmployeeName1"&gt;</span>EmployeeName1<span style="COLOR: blue">&lt;/</span><span style="COLOR: #a31515">span</span><span style="COLOR: blue">&gt;&lt;/</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;
        &lt;/</span><span style="COLOR: #a31515">tr</span><span style="COLOR: blue">&gt;
        </span>...
        <span style="COLOR: blue">&lt;</span><span style="COLOR: #a31515">tr</span><span style="COLOR: blue">&gt;
            &lt;</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;&lt;</span><span style="COLOR: #a31515">span </span><span style="COLOR: red">id</span><span style="COLOR: blue">="EmployeesCompSuffix_EmployeeID_9_EmployeeName9"&gt;</span>9<span style="COLOR: blue">&lt;/</span><span style="COLOR: #a31515">span</span><span style="COLOR: blue">&gt;&lt;/</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;
            &lt;</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;&lt;</span><span style="COLOR: #a31515">span </span><span style="COLOR: red">id</span><span style="COLOR: blue">="EmployeesCompSuffix_EmployeeName_9_EmployeeName9"&gt;</span>EmployeeName9<span style="COLOR: blue">&lt;/</span><span style="COLOR: #a31515">span</span><span style="COLOR: blue">&gt;&lt;/</span><span style="COLOR: #a31515">td</span><span style="COLOR: blue">&gt;
        &lt;/</span><span style="COLOR: #a31515">tr</span><span style="COLOR: blue">&gt;
    &lt;/</span><span style="COLOR: #a31515">tbody</span><span style="COLOR: blue">&gt;
&lt;/</span><span style="COLOR: #a31515">table</span><span style="COLOR: blue">&gt;</span></pre>

###Summary
The ability to fully control the client side IDs that are generated by the framework is a request that has not generated much noise but everyone seems to want it when you mention it.  We believe that we have found a good solution to the request and think that it adds some much need functionality for developer that use lots of client side scripting.  There is an early preview and a walk through of this feature in <a href="http://www.microsoft.com/downloads/details.aspx?FamilyID=922b4655-93d0-4476-bda4-94cf5f8d4814&amp;DisplayLang=en">CTP build</a> that we released at PDC 2008.  For more information and a much more detailed description of this feature read Scott Galloway’s blog <a href="http://www.mostlylucid.net/archive/2008/11/03/way-too-much-information-on-control-ids-and-asp.net-4.0.aspx">post</a>.