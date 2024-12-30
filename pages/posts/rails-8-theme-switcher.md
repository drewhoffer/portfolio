---
title: Css Themes for your Rails Apps 
date: 2024/12/29
description: Quick and dirty serverside theme switcher for Rails. Leverage cookies for handling this.
tag: web development, personal, Rails 8, Ruby on Rails, Cookies, Tailwind, CSS
author: Me
---

# Adding Light/Dark Mode to Your Rails 8 App with Tailwind CSS

Light and dark mode support has become a common feature in modern web applications. With Rails 8 and Tailwind CSS, you can quickly implement this functionality in your app. This guide will walk you through the steps to add a toggle for light and dark modes in your Rails 8 app.

## An Aside

This is NOT the best long-term solution, the reason being that this hits your server every single time you update your theme which is kinda unnecessary unless you plan on storing this info long-term. This just uses a clientside cookie to remember your theme meaning this does not persist forever. This is just a quick implementation I threw together. You could just as easily implement this with StimulusJS instead and/or by updating your user schema (or whatever you store user settings in) to persist this as well for long term storage.

Finally, this isn't just limited to light/dark, my original implementation actually used [tailwind catppuccin](https://github.com/catppuccin/tailwindcss) to allow for all the themes they offer.


## Prerequisites
- **Rails**: Version 8.0.1
- **Tailwind CSS**: Version 3.4.1 or greater

---

## Step 1: Create a New Rails App with Tailwind CSS
First, create a new Rails application with Tailwind CSS pre-installed:

```bash
rails new app --css tailwind
```

This command sets up a Rails app with Tailwind CSS.

---

## Step 2: Create a Theme Controller
Next, create a controller to handle theme switching:

```bash
rails g controller theme update
```

In the generated `theme_controller.rb`, paste the following code:

```ruby
class ThemeController < ApplicationController
  def update
    cookies[:theme] = params[:theme]
    redirect_to(request.referrer || root_path)
  end
end
```

This action stores the selected theme (light or dark) in a cookie and redirects the user back to the previous page.

Update your `config/routes.rb` file to include the following route:

```ruby
get "set_theme", to: "theme#update"
```

---

## Step 3: Configure Tailwind for Dark Mode
Modify the `tailwind.config.js` file to enable dark mode using a custom selector:

```javascript
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "selector",
  content: [
    "./public/*.html",
    "./app/helpers/**/*.rb",
    "./app/javascript/**/*.js",
    "./app/views/**/*.{erb,haml,html,slim}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    // Add optional Tailwind plugins here
  ],
};
```

Setting `darkMode: "selector"` allows you to control the theme using a class on the root HTML element.

---

## Step 4: Update the Application Layout
To toggle between light and dark modes, update your `app/views/layouts/application.html.erb` file:

```html
<!DOCTYPE html>
<html class="<%= cookies[:theme] %>">
  <head>
    <title>Rails 8 Themes</title>
    
    <!-- ...other imports go here -->

    <%= stylesheet_link_tag "tailwind", "data-turbo-track": "reload" %>
  </head>
  <body class="bg-white dark:bg-black text-black dark:text-white">
    <main class="container mx-auto mt-28 px-5 flex">
      <%= link_to 'Dark Mode', set_theme_path(theme: 'dark'), class: "mr-4" %>
      <%= link_to 'Light Mode', set_theme_path(theme: 'light') %>
      <%= yield %>
    </main>
  </body>
</html>
```

### Key Points:
1. The `class="<%= cookies[:theme] %>"` on the `<html>` element dynamically applies the selected theme.
2. The `body` tag uses Tailwind's `dark:` variants to style elements based on the current theme.
3. Two links (`Dark Mode` and `Light Mode`) allow users to toggle between themes by sending the selected theme to the `set_theme` route.

---

## Final Thoughts
With these steps, you now have a Rails 8 app that supports light and dark modes. Tailwind CSS makes it easy to style your application for both themes, and cookies ensure the user's preference is remembered across sessions.

Feel free to customize the theme toggle links and styles to fit your app's design!

