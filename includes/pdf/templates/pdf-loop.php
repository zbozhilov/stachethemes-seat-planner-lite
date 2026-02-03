<?php

namespace StachethemesSeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

?>
<div style="margin: 0; padding: 0; width: 595.28pt; height: 841.89pt;">
    <div style="margin: 10pt auto; width: 580pt; height: 252pt; display: block; border-radius: 8pt; overflow: hidden; border: 1pt solid #000;">
        <div style="padding: 20pt; background-color: #fff; width: 334pt; height: 212pt; float: left;">
            <h1 style="color: #000; font-size: 20pt; margin: 0 0 5pt; font-weight: 600;"><?php echo esc_html_x('Reservation Details', 'PDF Template', 'stachethemes-seat-planner-lite') ?></h1>
            <h2 style="color: #000; font-size: 16pt; margin: 0 0 15pt; font-weight: 400;">{product_title}</h2>
            <table style="width: 100%;">
                <tr>
                    <td style="width: 100%; padding: 12pt 0; margin: 0; color: #000; font-size: 11pt; border-bottom: 1pt dashed #000;"><strong style="color: #000;"><?php echo esc_html_x('Order', 'PDF Template', 'stachethemes-seat-planner-lite') ?>:</strong></td>
                    <td style="width: 100%; padding: 12pt 0; margin: 0; color: #000; font-size: 11pt; border-bottom: 1pt dashed #000; text-align: right;"><span style="color: #000;">#{order_id}</span></td>
                </tr>
                <tr>
                    <td style="width: 100%; padding: 12pt 0; margin: 0; color: #000; font-size: 11pt; border-bottom: 1pt dashed #000;"><strong style="color: #000;"><?php echo esc_html_x('Name', 'PDF Template', 'stachethemes-seat-planner-lite') ?>:</strong></td>
                    <td style="width: 100%; padding: 12pt 0; margin: 0; color: #000; font-size: 11pt; border-bottom: 1pt dashed #000; text-align: right;"><span style="color: #000;">{customer_name}</span></td>
                </tr>
                
                <tr>
                    <td style="width: 100%; padding: 12pt 0; margin: 0; color: #000; font-size: 11pt; border-bottom: 1pt dashed #000;"><strong style="color: #000;"><?php echo esc_html_x('Seat', 'PDF Template', 'stachethemes-seat-planner-lite') ?>:</strong></td>
                    <td style="width: 100%; padding: 12pt 0; margin: 0; color: #000; font-size: 11pt; border-bottom: 1pt dashed #000; text-align: right;"><span style="color: #000;">{seat_id}</span></td>
                </tr>

                {date_or_price_row}

            </table>
        </div>
        <div style="width: 166pt; height: 212pt; padding: 20pt; background-color: #fff; float: left; position: relative; text-align: center; border-left: 4pt dotted #000;">
            <h4 style="margin-top: 0; text-transform: uppercase; letter-spacing: 1px; color: #000; font-size: 10pt; margin-bottom: 10pt; font-weight: normal;"><?php echo esc_html_x('Welcome', 'PDF Template', 'stachethemes-seat-planner-lite') ?></h4>
            <h3 style="margin-top: 0; text-transform: uppercase; letter-spacing: 1px; color: #000; font-size: 14pt; margin-bottom: 16pt;"><?php echo esc_html_x('Admit One', 'PDF Template', 'stachethemes-seat-planner-lite') ?></h3>
            <div style="width: 124pt; height: 124pt; margin-left: 22pt; margin-bottom: 20pt;">
                <?php // phpcs:ignore: PluginCheck.CodeAnalysis.ImageFunctions.NonEnqueuedImage 
                ?>
                <img src="{qrcode}" style="width: 120pt; height: 120pt; border-radius: 8pt; border: 2pt solid #000;" />
            </div>
            <p style="margin: 0; font-size: 10pt; color: #000;"><strong style="color: #000; font-weight: 600;"><?php echo esc_html_x('Seat', 'PDF Template', 'stachethemes-seat-planner-lite') ?>: </strong><span style="color: #000; font-size: 12pt;">{seat_id}</span></p>
        </div>
    </div>
</div>