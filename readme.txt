=== Stachethemes Seat Planner Lite ===
Tags: WooCommerce, Seat, Booking, Event, Venue
Requires: 6.7
Tested up to: 6.9
Requires PHP: 8.2
Stable tag: 1.0.38
License: GPLv2 or later
WC requires at least: 9.5
WC tested up to: 10

A WooCommerce extension for creating & selling seat-based products with a drag & drop seat planner.

== Description ==
A WooCommerce extension that adds a custom Auditorium product type for selecting seats with a drag & drop seat planner.
Easily create and manage seating arrangements for events, venues, or any seat-based products.

== Features ==

- **Interactive Seat Selection**: Customers can select seats in real-time using a dynamic seat map.
- **Seat Reservation**: Seats added to the cart are reserved for a configurable duration, preventing others from selecting them.
- **Handicap Accessible Seating**: Mark seats as "Handicap Seats" and use customizable background colors to highlight accessibility.
- **Easy-to-Use Drag & Drop Editor**: Manage seats effortlessly with a simple drag-and-drop interface. No technical skills required.
- **QR Code Generator for Each Seat**: Automatically generate a unique QR code for each seat purchased, allowing for easy digital validation.
- **QR Code Scanner for Ticket Validation**: Enable quick entry and ensure smooth check-ins for event attendees.
- **Auto Complete Orders**: Option to automatically update the order status to “Completed” when payment is received for orders containing Auditorium products.
- **Auto Redirect to Cart/Checkout Page**: Set up automatic redirection to the cart or to the checkout page after a customer adds a seat to their cart.
- **Cart Timer**: Option to display a timer under each seat in the cart and checkout page.
- **Double Booking Checker**: Detects and flags accidental duplicate seat reservations.
- **Ghost Booking Checker**: Detects and fixes seats that appear free on the front-end but have existing orders.

== Premium Features ==

Upgrade to **Stachethemes Seat Planner Premium** for advanced features:

- **Seat Discounts**: Offer fixed or percentage-based discounts. Option to restrict specific discounts to selected user roles.
- **Date Selection**: Option to select date & time for each individual product.
- **Custom Fields**: Assign additional free or paid features to individual seats via custom fields. 
- **PDF Ticket Attachments**: Attach ticket details & QR Code as a PDF file to the "Order Completed" email.
- **CSV Import & Export Layouts**: Import and export seat layouts in CSV format.
- **CSV Booking Export**: Exports booking data for each reserved seat in CSV format.
- **Mobile App**: Free standalone android app for scanning and validating tickets.

[See all features](https://stachethemes.com/seat-planner/features/)

== Video Demonstration ==
[Watch the demo](https://www.youtube.com/watch?v=o9GExwX6OEo)

== Installation ==

= Installation from within WordPress =

1. Visit **Plugins > Add New**.
2. Click **Upload Plugin** and upload the plugin archive.
3. Install and activate the **Stachethemes Seat Planner Lite** plugin.

= Manual Installation =

1. Upload the entire `stachethemes-seat-planner-lite` folder to the `/wp-content/plugins/` directory.
2. Visit **Plugins**.
3. Activate the **Stachethemes Seat Planner Lite** plugin.

== Source Repository ==
[GitHub Repository](https://github.com/zbozhilov/stachethemes-seat-planner-lite)

== Credits ==
- [Material UI Icons](https://mui.com/material-ui/material-icons/)
- [React Hot Toast](https://react-hot-toast.com/)
- [React Zoom Pan Pinch](https://www.npmjs.com/package/react-zoom-pan-pinch)

== Changelog ==

= 1.0.36 =
- Added new plugin dashboard centralizing settings and features.
- Added new option "Auto-Complete Orders": automatically marks orders as Completed when payment is received for auditorium products.
- Added new option to control whether users are redirected after adding seats to the cart.
- Added new option to choose whether users are redirected to the cart or checkout page.
- Added new option to control whether customers are shown a message during redirection.

= 1.0.35 =
- Added Dashboard Widget showing Seats Sold & Revenue for the last 30 days
- Added Option to Lock objects in the Drag & Drop Editor 
- Added Visual UI for turning grid-snap on/off, grid color, grid size
- Added message when user is redirected to cart/checkout page on the front-end

= 1.0.34 =
- Bug fix where product can be incorrectly flagged as Unavailable

= 1.0.33 =
- Bug fix where deleting a draft order can accidentally release slot reservation
- Other minor bug fixes

= 1.0.32 =
- UI/UX improvements
- Added UI for Auto Incremental Patterns
- Added Booking Integrity Checker Tools
- Added option to check Reservation Details from the front-end if the user has Shop Manager role

= 1.0.28 =
- Minor fixes & improvements
- Enabled option to Scan QR Codes from the Dashboard

= 1.0.5 =
- Add to cart seat validation improvements

= 1.0.4 =
- Initial public release with core seat selection features.