---
title: How To Name/Organize Stimulus Controllers
date: 2025/06/01
description: Organizing stimulus controllers can feel weird.
tag: web development, UI, Rails 8, Ruby on Rails, Stimulus, Tailwind, CSS
author: Me
---


# Background

I have been doing a bunch of work lately in Rails (as you can see based on my posts). One thing I really have wanted to get away from is React. I do it all day at work, I've been doing it for close to a decade now and honestly, it just isn't that much fun anymore. Furthermore, part of web development is being able to keep up with all 9million new updates every week. Rails has been great to work in, it's been fast and I've never felt more productive.

Unfortunately, that mean's learning a completely new "framework". I say "framework" because compared to React, Stimulus is literally nothing to learn. GREAT! But it still comes with patterns/practices and gotchas.


# Problem

I have a form, the form needs to have these nice cards, the nice cards use a snippet from [TailwindUI](https://tailwindcss.com/plus/ui-blocks/application-ui/forms/radio-groups#component-45612766894822db447a2837d79355f5). Great, how the hell do I do that...

Well, normally in React I would just make a component inside my form (In this case it's my After signup page), and simply put the logic in and boom you're done.

In Stimulus, that doesn't really feel right. What do I call the controller? See I'm a big design guy to a fault. At times this means that I spend an entire afternoon spinning tires and NOT getting good work done. At the end of the day I COULD just make a 1 off Stimulus controller and call it but it always felt out of place to bog down my app with thousands of 1 off controllers (I mean what the hell is an `after-signup-radio-group-controller.js` anyway?).

# Solution

I am a little embarassed to say that I didn't catch this earlier. Enter.... *Identifiers*. [Identifiers](https://stimulus.hotwired.dev/reference/controllers#identifiers) are just how you identify controllers... great. But something caught my eye when trying to (for the hundreth time) decide how to *design* this controller.

Look at the third option: `users/list_item_controller.js   users--list-item`. Wait a minute, you're saying if I want to make a 1 off component I could just namespace it to a specific domain??? Why the hell haven't I been doing this.


# Takeaway

Do NOT do what I do and sit for hours trying to figure out the perfect implementation of a beautiful controller (you won't find it until the abstractions show itself anyways). Do what is best and make your tightly coupled, filled with bloat controller first. Get the feature done, then, when you need, and more importantly, when it's valuable to do so, decide what to take away and put into a higher-level abstraction.


## My implementation 

I needed those nice radio groups but only for a 1-time thing, so I just created my `after-signup/radio-group` controller. Threw my logic in and boom! No fuss, feature done, clean-ish (for what is needed) implementation.

My view:
```erb
  <fieldset data-controller="after-signup--radio">
    <legend class="text-sm/6 font-semibold text-gray-900">Select account type</legend>
    <div class="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
      <label aria-label="Type 1" aria-description="I am user type 1" 
             class="relative flex cursor-pointer rounded-lg border border-gray-100 bg-white p-4 shadow-xs focus:outline-hidden"
             data-after-signup--radio-target="label">
        <input type="radio" 
           name="user[user_type]" 
           value="type-1" 
           class="sr-only" 
           data-after-signup--radio-target="radio"
           data-action="after-signup--radio#select"
           checked>
        <span class="flex flex-1">
          <span class="flex flex-col">
            <span class="block text-sm font-medium text-gray-900">Type 1</span>
            <span class="mt-1 flex items-center text-sm text-gray-500">I am user type 1</span>
          </span>
        </span>
        <svg class="size-5 text-indigo-600 invisible" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
          <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd" />
        </svg>
        <span class="pointer-events-none absolute -inset-px rounded-lg  border-2" aria-hidden="true"></span>
      </label>
      <label aria-label="Type 2" aria-description="I am user type 2" 
             class="relative flex cursor-pointer rounded-lg border-2 border-gray-300 bg-white p-4 shadow-xs focus:outline-hidden"
             data-after-signup--radio-target="label">
        <input type="radio" 
               name="user[user_type]" 
               value="type-2" 
               class="sr-only" 
               data-after-signup--radio-target="radio"
               data-action="after-signup--radio#select">
        <span class="flex flex-1">
          <span class="flex flex-col">
            <span class="block text-sm font-medium text-gray-900">Type 2</span>
            <span class="mt-1 flex items-center text-sm text-gray-500">I am user type 2</span>
          </span>
        </span>
        <svg class="size-5 text-indigo-600 invisible" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
          <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd" />
        </svg>
        <span class="pointer-events-none absolute -inset-px rounded-lg border-2" aria-hidden="true"></span>
      </label>
    </div>
  </fieldset>
```

My controller (conveniently placed in `/app/javascript/controllers/after_signup/radio_controller.js`):

```js
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="after-signup--radio"
export default class extends Controller {
  static targets = ["radio", "label"];

  connect() {
    this.radioTargets.forEach((radio) => {
      if(radio.checked) {
        this.applySelectedStyles(radio)
      }
    })
  }
  select(event) {
    this.radioTargets.forEach(radio => {
      const label = this.findLabelForRadio(radio)
      this.removeSelectedStyles(label)
    })
    // Apply styles to the selected one
    this.applySelectedStyles(event.target)
  }

  applySelectedStyles(radio) {
    const label = this.findLabelForRadio(radio)
    if (!label) {
      return
    }

    label.classList.remove("border-gray-300", "border-2")
    label.classList.add("border-blue-600", "ring-2", "ring-blue-600", "border")
    
    // find and show the checckmark
    const icon = label.querySelector("svg")
    if (icon) icon.classList.remove("invisible")
  }
  
  removeSelectedStyles(label) {
    if (!label) {
      return
    }
    
    label.classList.remove("border-blue-600", "ring-2", "ring-blue-600", "border")
    label.classList.add("border-gray-300", "border-2")
    
    const icon = label.querySelector("svg")
    if (icon) icon.classList.add("invisible")
  }
  
  findLabelForRadio(radio) {
    return radio.closest('label')
  }
}
```

As you can see, theres some coupling here to the classes and styles, those will present themselves as you start to build more pages and see patterns and reusable things. Instead of going nuclear and using [View Components](https://viewcomponent.org/), try and use these simpler tools first. Remember [Done is better than perfect](https://www.goodreads.com/quotes/749769-done-is-better-than-perfect)