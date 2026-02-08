# Stachethemes Seat Planner Lite

**Tags:** WooCommerce, Seat, Booking, Event, Venue  
**Requires:** 6.7  
**Tested up to:** 6.9
**Requires PHP:** 8.2  
**Stable tag:** 1.5.2
**License:** GPLv2 or later  
**WC requires at least:** 9.5  
**WC tested up to:** 10 

A WooCommerce extension for creating & selling seat-based products with a drag & drop seat planner.

## Description

Stachethemes Seat Planner is a WooCommerce plugin that allows you to create and sell seat-based products for your customers to choose their seats easily.

**Check out the full version at** [WooCommerce](https://woocommerce.com/products/stachethemes-seat-planner/).

**Documentation:** The documentation is available at [Plugin Documentation](https://woocommerce.com/document/stachethemes-seat-planner/).

**Live Demo:** [Live Demo](https://stachethemes.com/seat-planner/demo/)

## Installation

### Installation from within WordPress

1. Visit **Plugins > Add New**.
2. Click **Upload Plugin** and upload the plugin archive.
3. Install and activate the Stachethemes Seat Planner Lite plugin.

### Manual installation

1. Upload the entire `stachethemes-seat-planner-lite` folder to the `/wp-content/plugins/` directory.
2. Visit **Plugins**.
3. Activate the Stachethemes Seat Planner Lite plugin.

## Credits

- [Material Icons](https://mui.com/material-ui/material-icons/)
- [React Hot Toast](https://react-hot-toast.com/)
- [React Zoom Pan Pinch](https://www.npmjs.com/package/react-zoom-pan-pinch)

### Source repository
https://github.com/zbozhilov/stachethemes-seat-planner-lite

## Changelog

### 1.5.1
- Added option to create Order from the Manager section
- Added new shortcode [stachesepl_count] for displaying the total seat count for auditorium product(s).

### 1.4.1
* Added Seat details tooltip on mobile devices
* Added new option in general settings to show or hide the seat details tooltip
* Other Minor bug fixes

### 1.4.0
- Added Manager section in the Admin Panel
- Added option to hide the QR Code

### 1.3.0
- New tool "Edit Order", enabling admins to modify existing orders data, such as changing seat ID.

### 1.1.0
- New general option "Enforce WooCommerce Cart Calculation". This option helps fix the issue with missing cart price on certain themes.
- Fixed issue where the cart timer may not work properly on certain carts

### 1.0.42
- Fixed a bug where setting a non-existent or invalid product ID in the shortcode caused a crash.

### 1.0.40
- Option to disable the "Select Seat" button on product listings (product loops) such as the Shop page and category pages.
- New Accent Color option for simpler front-end UI color customization. Legacy color customization options have been removed.
- Merged Cart Timer and Add to Cart settings into a new Cart Behaviour tab in the plugin settings.
- Front-end UI now displays the Close button at all times.
- Front-end UI buttons and elements now follow the Accent Color setting.
- Converted the Round Corners option to a slider for better control over element border radius.
- Minor fixes and improvements.

### 1.0.38 
- The Plugin now uses it's own "Select Seat", "View Cart" buttons.
- Added option to change colors for "Select Seat", "View Cart", "Add to Cart" buttons.
- Added Front-end seat tooltip
- Added Compatibility mode for cache plugins (e.g. WP Rocket, LiteSpeed) when lazy loading breaks due to JS optimization.
- Added New editor option "Additional Class Name" allowing custom CSS classes to be attached to objects.
- Improved UI for adding dates to the product.
- "Seat Reservation Time" and "Auto-Complete Orders" options moved to the new General tab in plugin settings.

### 1.0.36
- Added new plugin dashboard centralizing settings and features.
- Added new option "Auto-Complete Orders": automatically marks orders as Completed when payment is received for auditorium products.
- Added new option to control whether users are redirected after adding seats to the cart.
- Added new option to choose whether users are redirected to the cart or checkout page.
- Added new option to control whether customers are shown a message during redirection.

### 1.0.35
- Added Dashboard Widget showing Seats Sold & Revenue for the last 30 days
- Added Option to Lock objects in the Drag & Drop Editor 
- Added Visual UI for turning grid-snap on/off, grid color, grid size
- Added message when user is redirected to cart/checkout page on the front-end

### 1.0.34
- Bug fix where product can be incorrectly flagged as Unavailable

### 1.0.33

- Bug fix where deleting a draft order can accidentally release slot reservation
- Other minor bug fixes

### 1.0.32

- UI/UX improvements
- Added UI for Auto Incremental Patterns
- Added Booking Integrity Checker Tools
- Added option to check Reservation Details from the front-end if the user has Shop Manager role

### 1.0.28

- Minor fixes & improvements
- Enabled option to Scan QR Codes from the Dashboard

### 1.0.5

- Add to cart seat validation improvements

### 1.0.4

- Initial public release with core seat selection features.
