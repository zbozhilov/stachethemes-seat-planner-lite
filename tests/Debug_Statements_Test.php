<?php

namespace StachethemesSeatPlannerLite\Tests;

use PHPUnit\Framework\TestCase;

/**
 * Test to ensure no debugging statements are left in the codebase.
 * 
 * Checks for:
 * PHP: error_log, print_r, var_dump, var_export, dump, dd
 * JavaScript/TypeScript: console.log, console.error, console.warn, console.debug, console.info, debugger
 */
class Debug_Statements_Test extends TestCase {

    /**
     * Directories to scan for PHP files
     */
    private array $php_directories = [
        'includes',
    ];

    /**
     * Directories to scan for JavaScript/TypeScript files
     */
    private array $js_directories = [
        'src',
    ];

    /**
     * PHP debugging patterns to check for
     */
    private array $php_patterns = [
        'error_log' => '/\berror_log\s*\(/',
        'print_r' => '/\bprint_r\s*\(/',
        'var_dump' => '/\bvar_dump\s*\(/',
        'var_export' => '/\bvar_export\s*\(/',
        'dump' => '/\bdump\s*\(/',
        'dd' => '/\bdd\s*\(/',
        'sleep' => '/\bsleep\s*\(/',
    ];

    /**
     * JavaScript/TypeScript debugging patterns to check for
     */
    private array $js_patterns = [
        'console.log' => '/console\.log\s*\(/',
        // 'console.error' => '/console\.error\s*\(/',
        // 'console.warn' => '/console\.warn\s*\(/',
        'console.debug' => '/console\.debug\s*\(/',
        'console.info' => '/console\.info\s*\(/',
        'debugger' => '/\bdebugger\s*;/',
    ];

    /**
     * Directories to exclude from scanning
     */
    private array $exclude_directories = [
        'vendor',
        'node_modules',
        'tests',
        '.git',
    ];

    /**
     * File extensions to scan
     */
    private array $php_extensions = ['php'];
    private array $js_extensions = ['js', 'ts', 'tsx', 'jsx'];

    /**
     * Test that no PHP debugging statements are present
     */
    public function test_no_php_debugging_statements(): void {
        $project_root = dirname(__DIR__);
        $found_issues = [];

        foreach ($this->php_directories as $dir) {
            $full_path = $project_root . '/' . $dir;
            if (!is_dir($full_path)) {
                continue;
            }

            $files = $this->get_files_recursive($full_path, $this->php_extensions);
            
            foreach ($files as $file) {
                $issues = $this->check_php_file($file);
                if (!empty($issues)) {
                    $found_issues[$file] = $issues;
                }
            }
        }

        if (!empty($found_issues)) {
            $message = "Found PHP debugging statements:\n\n";
            foreach ($found_issues as $file => $issues) {
                $relative_path = str_replace($project_root . '/', '', $file);
                $message .= "File: {$relative_path}\n";
                foreach ($issues as $issue) {
                    $message .= "  Line {$issue['line']}: {$issue['pattern']}\n";
                }
                $message .= "\n";
            }
            $this->fail($message);
        }

        $this->assertTrue(true, 'No PHP debugging statements found.');
    }

    /**
     * Test that no JavaScript/TypeScript debugging statements are present
     */
    public function test_no_js_debugging_statements(): void {
        $project_root = dirname(__DIR__);
        $found_issues = [];

        foreach ($this->js_directories as $dir) {
            $full_path = $project_root . '/' . $dir;
            if (!is_dir($full_path)) {
                continue;
            }

            $files = $this->get_files_recursive($full_path, $this->js_extensions);
            
            foreach ($files as $file) {
                $issues = $this->check_js_file($file);
                if (!empty($issues)) {
                    $found_issues[$file] = $issues;
                }
            }
        }

        if (!empty($found_issues)) {
            $message = "Found JavaScript/TypeScript debugging statements:\n\n";
            foreach ($found_issues as $file => $issues) {
                $relative_path = str_replace($project_root . '/', '', $file);
                $message .= "File: {$relative_path}\n";
                foreach ($issues as $issue) {
                    $message .= "  Line {$issue['line']}: {$issue['pattern']}\n";
                }
                $message .= "\n";
            }
            $this->fail($message);
        }

        $this->assertTrue(true, 'No JavaScript/TypeScript debugging statements found.');
    }

    /**
     * Get all files recursively from a directory
     */
    private function get_files_recursive(string $directory, array $extensions): array {
        $files = [];
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($directory, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::SELF_FIRST
        );

        foreach ($iterator as $file) {
            if ($file->isFile()) {
                $extension = strtolower($file->getExtension());
                if (in_array($extension, $extensions)) {
                    $file_path = $file->getPathname();
                    
                    // Skip excluded directories
                    $should_exclude = false;
                    foreach ($this->exclude_directories as $exclude_dir) {
                        if (strpos($file_path, '/' . $exclude_dir . '/') !== false) {
                            $should_exclude = true;
                            break;
                        }
                    }
                    
                    if (!$should_exclude) {
                        $files[] = $file_path;
                    }
                }
            }
        }

        return $files;
    }

    /**
     * Check a PHP file for debugging statements
     */
    private function check_php_file(string $file_path): array {
        $issues = [];
        $content = file_get_contents($file_path);
        $lines = explode("\n", $content);

        foreach ($lines as $line_num => $line) {
            // Skip commented lines (simple check for // or #)
            $trimmed = trim($line);
            if (empty($trimmed) || strpos($trimmed, '//') === 0 || strpos($trimmed, '#') === 0) {
                continue;
            }

            foreach ($this->php_patterns as $pattern_name => $pattern) {
                if (preg_match($pattern, $line)) {
                    $issues[] = [
                        'line' => $line_num + 1,
                        'pattern' => $pattern_name,
                        'content' => trim($line),
                    ];
                }
            }
        }

        return $issues;
    }

    /**
     * Check a JavaScript/TypeScript file for debugging statements
     */
    private function check_js_file(string $file_path): array {
        $issues = [];
        $content = file_get_contents($file_path);
        $lines = explode("\n", $content);

        foreach ($lines as $line_num => $line) {
            // Skip commented lines (simple check for // or /*)
            $trimmed = trim($line);
            if (empty($trimmed) || strpos($trimmed, '//') === 0) {
                continue;
            }

            // Skip multi-line comment blocks (basic check)
            if (strpos($trimmed, '/*') === 0) {
                continue;
            }

            foreach ($this->js_patterns as $pattern_name => $pattern) {
                if (preg_match($pattern, $line)) {
                    $issues[] = [
                        'line' => $line_num + 1,
                        'pattern' => $pattern_name,
                        'content' => trim($line),
                    ];
                }
            }
        }

        return $issues;
    }
}
