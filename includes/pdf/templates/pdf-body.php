<?php

namespace StachethemesSeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

?>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        <?php
        // Here devs can add custom CSS for the PDF body like adding custom fonts
        do_action('stachesepl_pdf_body_style');
        ?>@page {
            margin: 0;
            padding: 0;
            size: A4;
            line-height: 1;
        }

        html {
            padding: 0;
            margin: 0;
            width: 100%;
            height: auto;
        }

        body {
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
        }
    </style>
</head>

<body>
    <div style="display: table; text-align: center; margin: 0; padding: 0; width: 595.28pt; height: 841.89pt;">
        <div style="display: table-cell; vertical-align: middle; padding: 40pt;">
            <h1 style="font-size: 24pt; margin-bottom: 25pt; margin: 0; padding: 0; color: #000; margin-bottom: 25pt;">
                <?php
                echo esc_html_x('Thank You for Your Purchase!', 'PDF Template', 'stachethemes-seat-planner-lite');
                ?></h1>
            <p style="font-size: 14pt; margin-bottom: 25pt; line-height: 1.2; margin: 0; padding: 0; color: #000;  margin-bottom: 25pt;">
                <?php
                echo esc_html_x('This document contains the details of your ticket(s).', 'PDF Template', 'stachethemes-seat-planner-lite');
                ?>
                <br />
                <?php
                echo esc_html_x('Please review the information carefully.', 'PDF Template', 'stachethemes-seat-planner-lite');
                ?>
            </p>
            <p style="font-size: 12pt; margin-bottom: 25pt; line-height: 1.2; margin: 0; padding: 0; color: #000;  margin-bottom: 25pt;">
                <?php
                echo esc_html_x('To ensure smooth entry, bring a printed or digital copy of your ticket.', 'PDF Template', 'stachethemes-seat-planner-lite');
                ?>
                <br />
                <?php
                echo esc_html_x('Each ticket has a unique QR code for quick validation at the venue.', 'PDF Template', 'stachethemes-seat-planner-lite');
                ?>
            </p>
            <p style="font-size: 12pt; font-weight: bold; line-height: 1.2; margin: 0; padding: 0; color: #000;">
                <?php
                echo esc_html_x('Enjoy the event!', 'PDF Template', 'stachethemes-seat-planner-lite');
                ?>
            </p>
        </div>
    </div>
    {template_loop}
</body>

</html>