---
layout: post
title: Using SimpleMembership With ASP.NET WebPages
date: 2010-07-21 19:42
author: Matthew Osborn
comments: true
header-img: "img/headers/code.jpg"
redirect_from:
  - /2010/07/21/using-simplemembership-with-asp.net-webpages/
  - /archive/2010/07/21/using-simplemembership-with-asp.net-webpages.aspx/
---
With the introduction of ASP.NET WebPages and the WebMatrix stack our team has really be focusing on making things simpler for the developer. Based on a lot of customer feedback one of the areas that we wanted to improve was the built in security in ASP.NET. So with this release we took that time to create a new built in (and default for ASP.NET WebPages) security provider. I say provider because the new stuff is still built on the existing ASP.NET framework. So what do we call this new hotness that we have created? Well, none other than <em>SimpleMembership</em>. <em>SimpleMembership</em> is an umbrella term for both <em>SimpleMembership</em> and <em>SimpleRoles</em>.

![diagram](/img/posts/diagram_thumb.jpg)

To the left is a diagram (you can click on it to see a bigger version) I often use when explaining how <em>SimpleMembership</em> works to other team members. I will admit I spent time making sure my boxes looked like boxes and had four points just for you guys. The middle section dotted in blue is the existing Membership APIs in the ASP.NET Framework. The <em>SimpleMembership</em> APIs are implemented as providers that are plugged into the core ASP.NET APIs. <em>SimpleRoleProvider </em>simply implements the <em>RoleProvider</em> abstract base class and does not add anything more. <em>SimpleMembershipProvider</em> is a bit trickier. To be able to support features I will discuss later in the post we needed to add additional functionality so we created a new <em>ExtendedMembershipProvider</em> abstract class. The <em>ExtendedMembershipProvider</em> abstract class inherits from the core ASP.NET <em>MembershipProvider</em> abstract base class. When you are using ASP.NET WebPages both of these new providers are registered as the default Membership and Role Providers. We also added a new <em>WebSecurity</em> class which provides a nice façade to <em>SimpleMembershipProvider</em>. This class is a helper class designed to make some of the more common tasks easy when you are trying to secure your website. <em>WebSecuirty</em> also holds APIs for some of the new functionality that we have added. For instance confirming an account and initializing the database (I’ll talk about that in just a minute). That is the basic overview of the internals to the new <em>SimpleMembership</em> feature.

Okay now that you have a basic understanding of how and why we created <em>SimpleMembership</em> I would like to spend some time walking you through how you can use it to secure your brand new ASP.NET WebPages site. There’s too much to cover in a single blog post so I’ll skim over some areas and ignore others, but will provide you enough information so that you can get started using <em>SimpleMembership</em> on your own. Also I do assume that you have a basic working knowledge of ASP.NET WebPages and the patterns that are used with this type of framework. Okay so what am I going to show? I will walk you through how to set up the database, create a registration page, create the login and logout pages, create a profile page, and finally create a simple admin section to control it all.

Before we start the first step of setting up your database I would like to give you some background information. One of the biggest complaints from customers has been the lack of control over the users table. The default provider in ASP.NET gave you some generic information and then the ability to store other information in a “blob”. This worked out well if you were not trying to do anything complicated but, if you wanted to something complicated it wasn’t that easy. With <em>SimpleMembership</em> we decided that it was easier to allow you, the developer, to have control of the users table and let <em>SimpleMembership</em> handle storing the authentication credentials. For example, you might already have a users table and want to integrate it with <em>SimpleMembership</em>. All <em>SimpleMembership</em> requires is that there are two columns on your users table so that we can hook up to it – an “ID” column and a “username” column. The important part here is that they can be named whatever you want. For instance username doesn't have to be an alias it could be an email column you just have to tell <em>SimpleMembership</em> to treat that as the “username” used to log in.

![user table](/img/posts/UsersTable.png) Okay so let’s get started creating our users table. In this example I will be using the new SQL CE 4 Database Engine so in WebMatrix add a new database file (this can be done on the database manager tab), name it whatever you like in this example I chose “SecurityDemo.sdf”.  Add a new table called “Users” (once again you can call the tables and columns whatever you want I’m just guiding you through my example). The only two columns you most have are some ID column and some username column in this case I chose the very clever names “UserID” and “Username”. Also add any other columns for data you would like to store, when you’re done you’ll have something like the table in the image to the left. Although if you want to follow along add all the columns I have that way it will be easier to copy and paste code.

Now that we have created our users table we need to wire it up to <em>SimpleMembership</em> so that <em>SimpleMembership</em> knows what columns to use. Now I’m going to introduce a new feature of ASP.NET WebPages that you may or may not know about which is the start page. This is a specially named page that will get run the first time an application starts. So create a page with the name “_start.cshtml” in your site, remove all the markup leaving only the code block at the top, and put the following code in that code block.


<div class="wlWriterEditableSmartContent" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:1c1e19bb-a903-41ae-b3af-3048f7ec08c8" style="margin: 0px; display: inline; float: none; padding: 0px;">
<div style="border: #000080 1px solid; color: #000; font-family: 'Courier New', Courier, Monospace; font-size: 10pt;">
<div style="background: #ddd; max-height: 300px; overflow: auto;">
<ol style="background: #ffffff; margin: 0 0 0 2em; padding: 0 0 0 5px;">
    <li> //Set up Simple Membership</li>
    <li style="background: #f3f3f3;">WebSecurity.InitializeDatabaseFile("SecurityDemo.sdf", "Users", "UserID", "Username", true);</li>
</ol>
</div>
</div>
</div>

![user table](/img/posts/MembershipTablesCreated.png) The parameters are rather self-explanatory but they are, in the following order,  name of the database file, name of the table you are using for the users table, name of the column being used for the ID, and name of the column you are using for the username. If you notice I left the last one off because it isn’t really self-explanatory, it is a <em>bool</em> value telling <em>SimpleMembership</em> to create the tables it needs if they are not present. These are tables that are used under the covers to make everything work, for instance the roles table. Every table created by SimpleMembership will start with “<em>webpages_</em>” in the name. As a general rule of thumb for later on if you have to manually query one of the tables with “<em>webpages_</em>” in the name there is probably a better API to be calling. Now it’s time to run your site once, these will cause <em>SimpleMembership</em> to go and create the tables we need. When you’re done you will have the tables in the image to the left in your database.

Okay so now you’re all set up and SimpleMembership is wired up to your table. The next logical step is to create a page where users can register for your site. Due to the fact that his post is already getting long I’m not going to show you the whole page, just the key pieces of code and if you’d like to see the whole page you can download the sample and use it to follow along. At this point create a register page with input fields for each of the columns in your user table. When the page is posted to you want to do some sort of validation on the values, you can download the sample and see the pattern I use. If all the posted values are valid call the following code, where the anonymous object represents the columns in your users table.

<div class="wlWriterEditableSmartContent" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:78d0f466-2d32-458b-91c7-02d9a9bd1a09" style="margin: 0px; display: inline; float: none; padding: 0px;">
<div style="border: #000080 1px solid; color: #000; font-family: 'Courier New', Courier, Monospace; font-size: 10pt;">
<div style="background: #ddd; max-height: 300px; overflow: auto;">
<ol style="background: #ffffff; margin: 0 0 0 2em; padding: 0 0 0 5px;">
    <li>WebSecurity.CreateUserAndAccount(username, password</li>
    <li style="background: #f3f3f3;">   new{FirstName = fname, LastName = lname, Email = email, StartDate = DateTime.Now, Bio = bio});</li>
</ol>
</div>
</div>
</div>

Now is the perfect time to talk about the words User and Account. Basically the word user maps to the user table you create while the word account maps to the table <em>SimpleMembership</em> uses to store things like password salts and confirmation tokens. You can choose to use your own SQL insert statement to insert into your users table and then just wire that entry up to <em>SimpleMembership</em> but as this is a rather common task we created a helper for it.

The next logical set would be to create a way to login and logout of your site. Let’s start with the login page. Once again I’m skipping all the simple HTML markup and post data validation since we have a lot to cover.

<div class="wlWriterEditableSmartContent" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:07bc2f78-4eb8-460c-a564-43522553286a" style="margin: 0px; display: inline; float: none; padding: 0px;">
<div style="border: #000080 1px solid; color: #000; font-family: 'Courier New', Courier, Monospace; font-size: 10pt;">
<div style="background: #ddd; max-height: 300px; overflow: auto;">
<ol style="background: #ffffff; margin: 0 0 0 2em; padding: 0 0 0 5px;">
    <li>if(WebSecurity.Login(username, password)){</li>
    <li style="background: #f3f3f3;">   var returnUrl = Request.QueryString["ReturnUrl"];</li>
    <li>   if(returnUrl.IsEmpty()){</li>
    <li style="background: #f3f3f3;">       Response.Redirect("~/Account/Profile");</li>
    <li>   } else {</li>
    <li style="background: #f3f3f3;">       Response.Redirect(returnUrl);</li>
    <li>   }</li>
    <li style="background: #f3f3f3;">}</li>
</ol>
</div>
</div>
</div>

There is a helper method that hangs off of the <em>WebSecurity</em> class that you use to login a user and it will return true of false based on if the username and password combination is valid. There is one thing that I wanted to make sure that I pointed out here. If you remember that SimpleMembership is built on the core ASP.NET Membership APIs when a user visits a part of the site that requires authentication (I’ll cover how to set that up in just a minute) they will be redirected to the the login page (default is “~\account\login”). When they are redirect the framework tacks on a query string parameter of “<em>ReturnUrl</em>” that can be used to return the user to the URL that they were trying to navigate to after they are logged in. You’ll notice that in the code I check for that and if it’s not empty I redirect them to that URL otherwise they get redirect to their profile page.

Now that you can login to the site you need someone to be able to logout right? Logging out is much simpler, in fact the logout page does not have any markup it is simply a page that the website posts to and then the request is redirected after the user is logged out.

<div class="wlWriterEditableSmartContent" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:53f2facc-43da-400b-b87d-3773c9740f3e" style="margin: 0px; display: inline; float: none; padding: 0px;">
<div style="border: #000080 1px solid; color: #000; font-family: 'Courier New', Courier, Monospace; font-size: 10pt;">
<div style="background: #ddd; max-height: 300px; overflow: auto;">
<ol style="background: #ffffff; margin: 0 0 0 2em; padding: 0 0 0 5px;">
    <li> WebSecurity.Logout();</li>
    <li style="background: #f3f3f3;">var returnUrl = Request.QueryString["ReturnUrl"];</li>
    <li>if(returnUrl.IsEmpty()){</li>
    <li style="background: #f3f3f3;">    Response.Redirect("~/");</li>
    <li>} else {</li>
    <li style="background: #f3f3f3;">    Response.Redirect(returnUrl);</li>
    <li>}</li>
</ol>
</div>
</div>
</div>

I choose to keep the concept of a return URL because I wanted a user to be returned to the page where they clicked on the link to logout. This makes for a nice touch and can really help user experience but it’s not necessary, you could simple redirect them to the root of the site.

What good is having a login and logout page if there is no part of your site that requires a user to be authenticated? In this example I choose to kill two birds with one stone and say that if a user is logged in and they visit their profile page they will be able to change their password. This way I get to show you guys two APIs instead of just one. For a cleaner look I have a conditional statement in the HTML markup that will leave out the Change Password markup if “<em>isCurrentUser</em>” is false.

<div class="wlWriterEditableSmartContent" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:f895de26-3408-4c13-810c-0be97ab1def9" style="margin: 0px; display: inline; float: none; padding: 0px;">
<div style="border: #000080 1px solid; color: #000; font-family: 'Courier New', Courier, Monospace; font-size: 10pt;">
<div style="background: #ddd; max-height: 300px; overflow: auto;">
<ol style="background: #ffffff; margin: 0 0 0 2.5em; padding: 0 0 0 5px;">
    <li> //Get the username from the URL e.g. account/profile/osbornm</li>
    <li style="background: #f3f3f3;">var UserName = UrlData[0] != string.Empty ? UrlData[0] : WebSecurity.CurrentUserName;</li>
    <li>var isCurrentUser = UserName == WebSecurity.CurrentUserName;</li>
    <li style="background: #f3f3f3;"></li>
    <li>if(IsPost &amp;&amp; isCurrentUser){</li>
    <li style="background: #f3f3f3;">    //If everything checks out try to change the password</li>
    <li>     if(val.Count == 0){</li>
    <li style="background: #f3f3f3;">         if(!WebSecurity.ChangePassword(WebSecurity.CurrentUserName, oldPassword, newPassword)){</li>
    <li>             val.Add("Unable to change password.");</li>
    <li style="background: #f3f3f3;">         }</li>
    <li>     }</li>
    <li style="background: #f3f3f3;"> }</li>
</ol>
</div>
</div>
</div>
<span style="line-height: 1.6em;">There are a couple of APIs that I would like to point out in the code above. First off is that </span><em style="line-height: 1.6em;">CurrentUserName</em><span style="line-height: 1.6em;"> property hanging off of </span><em style="line-height: 1.6em;">WebSecurity</em><span style="line-height: 1.6em;">. If a user is logged in this will be there username and if they are not logged in it will be an empty string. Also there are plenty of these helpers methods that you can use including one that requires an authenticated user that you can put at the top of your page to require a user to be logged in to see that page. The second API I want to call out is </span><em style="line-height: 1.6em;">ChangePassword</em><span style="line-height: 1.6em;">, also hanging off of </span><em style="line-height: 1.6em;">WebSecurity</em><span style="line-height: 1.6em;">. This will return true is the change was successful or false if there was a problem.</span>

Now that we have the basic functionality the only thing left is to spice it up by adding some roles and a special section for administrators to do administrator stuff. The way I’m going to tackle this problem is to create parts of the admin section and then use them to add the role and add users to the role, once that's done we will change it so only people in the admin role can access that page. Just like before I will leave off the simple HTML markup and you can download the sample if you would like to see it.

<div class="wlWriterEditableSmartContent" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:4fd91e81-ac13-49c7-8fe9-aa6a89df0608" style="margin: 0px; display: inline; float: none; padding: 0px;">
<div style="border: #000080 1px solid; color: #000; font-family: 'Courier New', Courier, Monospace; font-size: 10pt;">
<div style="background: #ddd; max-height: 300px; overflow: auto;">
<ol style="background: #ffffff; margin: 0 0 0 2em; padding: 0 0 0 5px;">
    <li> //Code to add a role</li>
    <li style="background: #f3f3f3;">var roleName = Request["roleName"];</li>
    <li>if(roleName != null){</li>
    <li style="background: #f3f3f3;">    if(roleName == string.Empty){</li>
    <li>        //Validation Message</li>
    <li style="background: #f3f3f3;">    } else {</li>
    <li>        Roles.CreateRole(roleName);</li>
    <li style="background: #f3f3f3;">    }</li>
    <li>}</li>
</ol>
</div>
</div>
</div>

The first thing I would like to point out is that pattern that I am using for this page. I wanted to have all the functionality on one page so that means there will be many forms all posting to this page. So how to I tell the difference from a post to add a role from a post to add a user to a role? I use the values that come in with the request. If the post has a value named “<em>roleName</em>” I know that it must have come from that form, that is what line three is testing. While this isn’t fool proof, it is simple and works most of the time and its fine for this sample. You’ll notice that in the code sample we have reached a point where we aren't using the <em>WebSecurity</em> class anymore, that's because the core ASP.NET APIs work just fine. So we call the static “<em>CreateRole</em>” method on the <em>Roles</em> object, which under the covers ends up calling the <em>SimpleRoleProvider</em> to create the role.

Now that we can create a role we need a way to add a user to that role otherwise there is no reason to have roles. I choose a simple UI for this task that probably isn’t the most efficient for adding lots of users to lots of roles but it works fine for this example. So you’ll notice in the code below that I grab all the users and all the roles so that a <em>dropdownlist</em> can be populated with the values.

<div class="wlWriterEditableSmartContent" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:898d0ce4-6bd9-42f4-91ba-45f621fbf01d" style="margin: 0px; display: inline; float: none; padding: 0px;">
<div style="border: #000080 1px solid; color: #000; font-family: 'Courier New', Courier, Monospace; font-size: 10pt;">
<div style="background: #ddd; max-height: 300px; overflow: auto;">
<ol style="background: #ffffff; margin: 0 0 0 2.5em; padding: 0 0 0 5px;">
    <li> //Code to get all users</li>
    <li style="background: #f3f3f3;">dynamic users;</li>
    <li>using(var db =  Database.Open("SecurityDemo")){</li>
    <li style="background: #f3f3f3;">     users = db.Query("SELECT * FROM [Users]");</li>
    <li> }</li>
    <li style="background: #f3f3f3;"></li>
    <li>//Get the current roles in the system</li>
    <li style="background: #f3f3f3;">var roles = Roles.GetAllRoles();</li>
    <li></li>
    <li style="background: #f3f3f3;">//Code to add a user to a role</li>
    <li>var userToAddTo = Request["userToAddTo"];</li>
    <li style="background: #f3f3f3;">var roleToAdd = Request["roleToAdd"];</li>
    <li>if(!userToAddTo.IsEmpty() &amp;&amp; !roleToAdd.IsEmpty()){</li>
    <li style="background: #f3f3f3;">    Roles.AddUserToRole(userToAddTo, roleToAdd);</li>
    <li>}</li>
</ol>
</div>
</div>
</div>

The reason I choose to query for all the users myself is I wanted to show you that the developer really does own the users table so you can issue normal SQL queries to get info like this without having to go through all the Membership APIs. Again, I followed the pattern of detecting values that came in from the request to determine what action needed to be performed. Once again the core ASP.NET APIs are good enough for adding a user to a role so you can simply call the static method on the <em>Roles</em> object.

Now that we have can go create the admin role and add our user to it, navigate to the page and do so, it’s okay I’ll wait for you. Done? Good. So now that you’re an admin on your own site let’s go lock down this admin section of the site so only users that are in the admin role can access it. This is easiest done by moving that page to an admin folder and then using an <em>init</em> <em>page</em>. This is another one of those specially named pages that you may or may not already know about. Basically you create a page with the name <em>“_init.cshtml</em>” in a folder and that page will run first before any other page in that folder for every request. This is useful for doing operations such as requiring an authenticated user or requiring a specific role because the code is in one location and not spread across every page.

<div class="wlWriterEditableSmartContent" id="scid:9ce6104f-a9aa-4a17-a79f-3a39532ebf7c:6c2e4b19-20d0-435e-b7df-a91ec92c182f" style="margin: 0px; display: inline; float: none; padding: 0px;">
<div style="border: #000080 1px solid; color: #000; font-family: 'Courier New', Courier, Monospace; font-size: 10pt;">
<div style="background: #ddd; max-height: 300px; overflow: auto;">
<ol style="background: #ffffff; margin: 0 0 0 2em; padding: 0 0 0 5px;">
    <li>WebSecurity.RequireAuthenticatedUser();</li>
    <li style="background: #f3f3f3;">if(!WebSecurity.IsCurrentUserInRole("Admin")){</li>
    <li>    Response.Redirect("~/Account/unauthorized");</li>
    <li style="background: #f3f3f3;">}</li>
</ol>
</div>
</div>
</div>

Just like the <em>“_start.cshtml</em>” file there is no markup just a code block at the top. This code does two things; the first is to require an authenticated user this means if you visit part of the admin section and you aren’t logged in you will get a nice prompt for your password. The second is that if a user is authenticated but they aren’t in the “admin” role they will be redirect to an unauthorized page I created that displays a nice error message explaining why they can see that part of the site. You don’t have to do it that way you could redirect anywhere you wanted for even set the status code to 404 so it looked like there wasn’t anything there, it’s all up to you.

Well now you’re done, you have a very simple implementation that secures your site and can store user information. The sky really is the limit here, there is so much more you can do, there was just too much to cover in one blog post. If you have requests for how to do something I’d be glad to add an example or even create a new post about if you just have to let me know. Also in the downloadable source there is quite a bit more than what I covered here! I have examples of requiring a confirmation email to be sent, deleting user and roles, using a layout page to display a login/logout status widget, and how to implement some simple validation based on the way ASP.NET MVC does its validation.
