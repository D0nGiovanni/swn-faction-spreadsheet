# Stars Without Number Faction Spreadsheet

## Introduction

Hey there! Thanks for checking out this SWN faction sheet! I hope you’ll like it! ;)If there’s a bug, or something else you don’t like - tell me! You can leave a comment on my sheet, leave an issue here, or dm me on discord! I’m DonGiovanni#2682 over there.

I want to thank BryLotz and warpig for answering my many pesky questions regarding the old sheet and SectorsWithoutNumber.
Also, thank you to everyone else who gave me valuable input on how to design the sheet!
And thank you mom, dad, and… ok I’ll stop now.

Check out all the things!

## What the heck is this?

Hello, fellow space traveler. We are in the world of [Stars Without Number](http://www.drivethrurpg.com/product/226996/Stars-Without-Number-Revised-Edition), a tabletop roleplaying game made by Kevin Crawford.

This project aims to be the best resource for your faction management. It should be functional and easy to use. But it shouldshould also be something to get you hyped! It shouldn't look like a hackjob you did for a school assignment. If you don't feel like the current design does that, please tell me! We can improve it together! I'm not a design person, I'm a code person. :)

This project is based on [BryLotz' faction spreadsheet](https://docs.google.com/spreadsheets/d/1aRmQOS4WZ0ECFQ8RxXk0LsZ3Lq_gZqI_RODbXo5GvmU/edit#gid=1402214138), which in turn is based on the [original spreadsheet](https://www.reddit.com/r/itmejp/comments/2dbqkh/swan_song_faction_sheets_20/) made by IksPort with the help of several contributors.

I completely rewrote the original script and added some new features. There is no diff, but you can check out the reddit-post above, if you're interested. I am still a typescript noob, but I am learning.

## Changelog

### 1.2

* added: import campaigns

### 1.2

* fixed: missing formula in random cell of asset hp/max hp
* fixed: upkeep now calculates correctly for all factions

### 1.1

* fixed: system coords are now imported correctly

### 1.0

* release

## Getting Started

### Where Can I Find This Sorcery?

Glad you asked! You can find the [current version here](https://docs.google.com/spreadsheets/d/1fpee1O4d-pSfq5Y9qqfOsVUBichT6hF6AVc3Lx56D0M/edit?usp=sharing).

### Activating Scripts

Some of the juicier features are only available through scripts! I would assure you they’re safe, but who am I anyway? After you’ve made your own copy, a new menu point called “SWN Faction Helper” should appear after a few seconds (can take upward of 10s). Click any of the options there. If you’re impatient, you can also go to Tools > Script editor, and save the script.

Either way, you’ll get some warnings before you can enable it. One obscure page says “This app isn’t verified”. Click Advanced (ignore the big blue BACK TO SAFETY button), and then Go to Swan Song Helper.Everything else should be pretty straightforward.

Congrats! You just unlocked your first achievement: Script Kiddie! Now you can check out what they do!

### Import Sector Map

You can import your generated sector map from [Sectors Without Number](https://sectorswithoutnumber.com/)! Activate scripts and click **Import sector map** in **the menu**.

Please note: currently, you need to download the map as a JSON file, upload it to your google drive and then enter the name of the file, e.g. **Acheron Rho.json** (spaces allowed). You may delete the file afterwards. Yes, Google Apps Scripts is weird...

In the future I’m hoping to add a way to import the map in a less roundabout way.

### Import Your Existing Campaign

Import your existing campaign!

If you are using my sheet from version 1.0 on up, you don't need to do anything special. Just select the option **Import campaign** in **the menu** and do what the pop-up tells you.

You might get a warning that your spreadsheet got an error and that it needs to reload. Don't worry, it just can't handle the Awesomeness of your campaign. Just hit **OK** and let it reload your spreadsheet.

This is useful if you want the newest features, but don't want to copy everything over by hand.

#### Import From Your Own Homebrew Spreadsheet

As much as I hate to say it, this feature is not (yet) supported.

If you're wondering: in the background I'm doing some magic with named ranges, so you would have to add all the relevant named ranges. But at that point just copying everything by hand is just as quick.

## All the Automation - Almost

Most things in the sheet are automated.

The sheet automagically calculates total income based on assets owned, upkeep costs, and income penalty for too many assets. You still need to add income from asset actions.

You may hide columns if they’re distracting, BUT DON’T DELETE THEM! The magic won’t work otherwise. Oh, and you may see some warnings when you hide columns. Don’t worry. Just don’t change any values of protected cells (the ones you'll get a warning for).

### Faction Cred Payout

Pay out FacCreds for all factions at once - with the help of some script magic. Click **Pay out faction income** in **the menu**. No more forgetting about poor factions!
If you made a blunder and - let’s say - paid out FacCreds twice, you can click **Subtract faction income**. It will update all faction balances just as magically.

### Helpful Notes

You want notes for things? We got notes for things! Select the area you want to update the notes in and click **Update notes for selection** in **the menu** and voilà! Now with super-improved efficiency! God, I love clean code!

Alternatively, you can click **Add notes automatically**.

## What Is Not Automated - yet?

When a base of influence loses hit points, the owning faction should loose that much health as well. This is not implemented currently. It will probably need a sprinkle of script dust, but I'm open to other suggestions.

Most other stuff should be automated. If it isn't, let me now! (Unless I've already mentioned it somewhere here)

## Development

Coming soon(tm)...
