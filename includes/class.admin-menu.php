<?php

namespace Stachethemes\SeatPlannerLite;

if (! defined('ABSPATH')) {
    exit;
}

class Admin_Menu {

    public static function init() {

        add_action('admin_menu', [__CLASS__, 'register_menu']);
        add_action('admin_enqueue_scripts', [__CLASS__, 'enqueue_scripts']);
    }

    public static function enqueue_scripts() {

        $screen = get_current_screen();

        if (!$screen) {
            return;
        }

        switch ($screen->id) {
            case 'woocommerce_page_stachesepl_scanner':

                $seat_scanner_deps = require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'assets/admin/seat_scanner/index.bundle.asset.php';

                wp_enqueue_script(
                    'seat-scanner',
                    STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . '/assets/admin/seat_scanner/index.bundle.js',
                    $seat_scanner_deps['dependencies'],
                    $seat_scanner_deps['version'],
                    true
                );

                wp_enqueue_style(
                    'seat-scanner',
                    STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . '/assets/admin/seat_scanner/index.css',
                    [],
                    $seat_scanner_deps['version']
                );

                wp_localize_script(
                    'seat-scanner',
                    'stachesepl_i18n',
                    Translation::get_scanner_strings()
                );

                $inline_script = sprintf(
                    'var seat_scanner = %s;',
                    wp_json_encode([
                        'ajax_url' => admin_url('admin-ajax.php'),
                        'nonce'    => wp_create_nonce('stachethemes_seat_planner')
                    ])
                );

                wp_add_inline_script('seat-scanner', $inline_script, 'before');

                break;


            case 'tools_page_stachesepl_double_booking':

                $seat_planner_check_dbl_booking_deps = require_once STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_DIR . 'assets/admin/check_double_booking/index.bundle.asset.php';

                wp_enqueue_script(
                    'seat-planner-check-double-booking',
                    STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . '/assets/admin/check_double_booking/index.bundle.js',
                    $seat_planner_check_dbl_booking_deps['dependencies'],
                    $seat_planner_check_dbl_booking_deps['version'],
                    [
                        'strategy' => 'defer'
                    ]
                );

                wp_enqueue_style(
                    'seat-planner-check-double-booking',
                    STACHETHEMES_SEAT_PLANNER_LITE_PLUGIN_URL . '/assets/admin/check_double_booking/index.css',
                    [],
                    $seat_planner_check_dbl_booking_deps['version']
                );


                $inline_script = sprintf(
                    'var stachesepl_ajax = %s;',
                    wp_json_encode([
                        'ajax_url' => admin_url('admin-ajax.php'),
                        'nonce'    => wp_create_nonce('stachethemes_seat_planner')
                    ])
                );

                wp_add_inline_script('seat-planner-check-double-booking', $inline_script, 'before');

                $inline_script_admin_url = sprintf(
                    'var stachesepl_admin_url = %s;',
                    wp_json_encode([
                        'admin_url' => admin_url('/')
                    ])
                );

                wp_add_inline_script('seat-planner-check-double-booking', $inline_script_admin_url, 'before');

                wp_localize_script(
                    'seat-planner-check-double-booking',
                    'stachesepl_i18n',
                    Translation::get_check_double_booking_strings()
                );

                break;
        }
    }

    public static function register_menu() {
        add_submenu_page(
            'woocommerce',
            esc_html__('Seat Scanner', 'stachethemes-seat-planner-lite'),
            esc_html__('Seat Scanner', 'stachethemes-seat-planner-lite'),
            'manage_woocommerce',
            'stachesepl_scanner',
            [__CLASS__, 'render_seat_scanner']
        );

        add_management_page(
            esc_html__('Double Booking Checker', 'stachethemes-seat-planner-lite'),
            esc_html__('Double Booking Checker', 'stachethemes-seat-planner-lite'),
            'manage_options',
            'stachesepl_double_booking',
            [__CLASS__, 'render_check_dobule_booking_page']
        );

        add_management_page(
            esc_html__('Seat Planner App Settings', 'stachethemes-seat-planner-lite'),
            esc_html__('Seat Planner App Settings', 'stachethemes-seat-planner-lite'),
            'manage_options',
            'stachesepl_app_settings',
            [__CLASS__, 'render_app_settings_page']
        );

    }

    public static function render_seat_scanner() {
        echo '<div class="wrap"><h1></h1>';
        echo '  <div id="stachesepl-scanner"></div>';
        echo '</wrap>';
    }

    public static function render_check_dobule_booking_page() {
        echo '<div class="wrap">';
        echo '<h1>' . esc_html__('Double Booking Checker', 'stachethemes-seat-planner-lite') . '</h1>';
        echo '<p>' . esc_html__('Use this tool to check for double bookings in your auditorium products.', 'stachethemes-seat-planner-lite') . '</p>';
        echo '<div id="stachesepl-check-double-booking"></div>';
        echo '</div>';
    }

    public static function render_app_settings_page() {
        if (! current_user_can('manage_options')) {
            return;
        }

        if (isset($_POST['stachesepl_app_secret_key_submit'])) {
            check_admin_referer('stachesepl_app_settings');

			$has_error = false;

			// Save enable/disable setting (no individual notice)
			$enabled_value = isset($_POST['stachesepl_app_enabled']) ? 'yes' : 'no';
			update_option('stachesepl_app_enabled', $enabled_value);

            $secret_key = isset($_POST['stachesepl_app_secret_key']) ? sanitize_text_field(wp_unslash($_POST['stachesepl_app_secret_key'])) : '';

			if (strlen($secret_key) < 8) {
                add_settings_error(
                    'stachesepl_app_settings',
                    'stachesepl_app_secret_key_short',
                    esc_html__('Secret key must be at least 8 characters long.', 'stachethemes-seat-planner-lite'),
                    'error'
                );
				$has_error = true;
            } else {
				update_option('stachesepl_app_secret_key', $secret_key);
            }

			// Add a single generic success notice if no errors were encountered
			if (! $has_error) {
				add_settings_error(
					'stachesepl_app_settings',
					'stachesepl_settings_saved',
					esc_html__('Settings saved.', 'stachethemes-seat-planner-lite'),
					'updated'
				);
			}
        }

		$current_key = get_option('stachesepl_app_secret_key', '');
		$current_enabled = get_option('stachesepl_app_enabled', 'yes');
		$enabled_checked_attr = ($current_enabled === 'yes') ? ' checked="checked"' : '';
		$rest_base_url = rest_url('/');

        echo '<div class="wrap">';
        echo '<h1>' . esc_html__('Seat Planner App Settings', 'stachethemes-seat-planner-lite') . '</h1>';
        echo '<p>' . esc_html__('Use this tool to set up the Seat Planner app.', 'stachethemes-seat-planner-lite') . '</p>';

        // Display settings messages
        settings_errors('stachesepl_app_settings');

		// Android app download section
		echo '<h2>' . esc_html__('Android App', 'stachethemes-seat-planner-lite') . '</h2>';
		echo '<p><a class="button button-secondary" disabled="disabled" href="javascript:void(0);" target="_self" rel="noopener">' . esc_html__('Download Android APK', 'stachethemes-seat-planner-lite') . '</a></p>';
        echo '<p class="description">' . esc_html__('Android app is not available in Lite version.', 'stachethemes-seat-planner-lite') . '</p>';

        echo '<form method="post" action="">';
        wp_nonce_field('stachesepl_app_settings');

		echo '<table class="form-table" role="presentation">';
		echo '  <tbody>';
		echo '    <tr>';
		echo '      <th scope="row">' . esc_html__('REST API Base URL', 'stachethemes-seat-planner-lite') . '</th>';
		echo '      <td>';
		echo '        <input type="text" id="stachesepl-rest-base-url" class="regular-text" value="' . esc_attr($rest_base_url) . '" readonly="readonly" /> ';
		echo '        <button type="button" class="button" id="stachesepl-copy-rest-url">' . esc_html__('Copy', 'stachethemes-seat-planner-lite') . '</button>';
		echo '        <p class="description">' . esc_html__('Your REST URL for API integrations.', 'stachethemes-seat-planner-lite') . '</p>';
		echo '      </td>';
		echo '    </tr>';
		echo '    <tr>';
		echo '      <th scope="row">' . esc_html__('Enable/Disable', 'stachethemes-seat-planner-lite') . '</th>';
		echo '      <td>';
		echo '        <label for="stachesepl-app-enabled">';
		echo '          <input type="checkbox" id="stachesepl-app-enabled" name="stachesepl_app_enabled" value="1"' . esc_attr($enabled_checked_attr) . ' /> ' . esc_html__('Enable access', 'stachethemes-seat-planner-lite');
		echo '        </label>';
		echo '        <p class="description">' . esc_html__('Uncheck to temporarily disable access.', 'stachethemes-seat-planner-lite') . '</p>';
		echo '      </td>';
		echo '    </tr>';
        echo '    <tr>';
        echo '      <th scope="row">' . esc_html__('App Secret Key', 'stachethemes-seat-planner-lite') . '</th>';
        echo '      <td>';
        echo '        <input type="text" id="stachesepl-app-secret-key" name="stachesepl_app_secret_key" value="' . esc_attr($current_key) . '" class="regular-text" />';
        echo '        <button type="button" class="button" id="stachesepl-generate-key">' . esc_html__('Generate', 'stachethemes-seat-planner-lite') . '</button>';
        echo '        <p class="description">' . esc_html__('Minimum 8 characters. Store this securely; changing it may invalidate existing tokens.', 'stachethemes-seat-planner-lite') . '</p>';
        echo '      </td>';
        echo '    </tr>';
        echo '  </tbody>';
        echo '</table>';

        echo '<p class="submit">';
        echo '  <input type="submit" name="stachesepl_app_secret_key_submit" id="submit" class="button button-primary" value="' . esc_attr__('Save Changes', 'stachethemes-seat-planner-lite') . '" />';
        echo '</p>';

        echo '</form>';

        // Inline script to generate a secure random key
        echo '<script>';
        echo '(function(){';
        echo '  function generateKey(len){';
        echo '    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";';
        echo '    var result = "";';
        echo '    if (window.crypto && window.crypto.getRandomValues) {';
        echo '      var bytes = new Uint8Array(len);';
        echo '      window.crypto.getRandomValues(bytes);';
        echo '      for (var i = 0; i < len; i++) { result += charset[bytes[i] % charset.length]; }';
        echo '    } else {';
        echo '      for (var j = 0; j < len; j++) { result += charset.charAt(Math.floor(Math.random() * charset.length)); }';
        echo '    }';
        echo '    return result;';
        echo '  }';
		echo '  var btn = document.getElementById("stachesepl-generate-key");';
		echo '  if (btn) {';
		echo '    btn.addEventListener("click", function(){';
        echo '      var input = document.getElementById("stachesepl-app-secret-key");';
        echo '      if (!input) return;';
        echo '      input.value = generateKey(32);';
        echo '    });';
        echo '  }';
		echo '  var copyBtn = document.getElementById("stachesepl-copy-rest-url");';
		echo '  if (copyBtn) {';
		echo '    copyBtn.addEventListener("click", function(){';
		echo '      var restInput = document.getElementById("stachesepl-rest-base-url");';
		echo '      if (!restInput) return;';
		echo '      restInput.select();';
		echo '      restInput.setSelectionRange(0, restInput.value.length);';
		echo '      var copied = false;';
		echo '      if (navigator.clipboard && navigator.clipboard.writeText) {';
		echo '        navigator.clipboard.writeText(restInput.value).then(function(){ copied = true; }, function(){});';
		echo '      }';
		echo '      if (!copied) {';
		echo '        try { copied = document.execCommand("copy"); } catch(e) { copied = false; }';
		echo '      }';
		echo '      if (copied) {';
		echo '        var originalText = copyBtn.textContent;';
		echo '        copyBtn.textContent = "' . esc_js(__('Copied!', 'stachethemes-seat-planner-lite')) . '";';
		echo '        setTimeout(function(){ copyBtn.textContent = originalText; }, 1500);';
		echo '      }';
		echo '    });';
		echo '  }';
        echo '})();';
        echo '</script>';

        echo '</div>';
    }
}

Admin_Menu::init();
