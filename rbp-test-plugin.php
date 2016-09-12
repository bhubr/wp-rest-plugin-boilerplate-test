<?php
namespace bhubr;
require 'vendor/autoload.php';
/*
 * Plugin Name: WP REST Plugin Boilerplate Test Plugin 2
 * Version: 0.1
 * Description: A bloody entangled mess of spaghetti code.
 * Author: T1z
 * Author URI: https://github.com/t1z
 * License: WTFPL
 */

class RBP_Test_Plugin {

    /**
     * Class constant holding the plugin name
     */
    const PLUGIN_NAME = 'rbp-test-plugin';

    /**
     * Class single instance (Singleton)
     */
    protected static $instance = null;

    /**
     * Descriptor holding the types (among other things in the future?)
     */
    protected $plugin_descriptor = [
        'types' => [
            'foo' => [  // key is type name (singular, lower-case)
                'name_s'   => 'Foo',  // label (singular)
                'fields'   => ['blop', 'blap'],
                'taxonomies' => [
                    'foo_cat' => [
                        'name_s' => 'Foo Cat',
                        'fields' => ['baaar', 'caaat']
                    ],
                    'foo_tag' => [
                        'name_s' => 'Foo Tag',
                        'fields' => ['foooo', 'taaag']
                    ]
                ]
            ]
        ]
    ];

    /**
     * Constructor
     */
    private function __construct() {
        // Return existing singleton if exists
        if( !is_null( static::$instance ) ) {
            return static::$instance;
        }

        add_action('admin_menu', [$this, 'register_pages']);
        add_action('admin_enqueue_scripts',  array(&$this, 'admin_pages_enqueue_scripts') );

        $wppc = REST_Plugin_Boilerplate::get_instance(__DIR__);
        $wppc->register_plugin(self::PLUGIN_NAME, $this->plugin_descriptor);
        register_activation_hook( __FILE__, function() use($wppc) {
            $wppc->create_term_meta_tables(self::PLUGIN_NAME);
        });

    }


    /**
     * Get the unique singleton instance
     */
    public static function get_instance( $config = null )
    {
        if( is_null( static::$instance ) ) {
            $class = get_called_class();
            static::$instance = new RBP_Test_Plugin($config);
        }
        return static::$instance;
    }


    /**
     * Register the REST plugin test page
     */
    public function register_pages() {
        add_menu_page('REST Plugin Test', 'REST Plugin Test', 'manage_options', 'rest-plugin-test', [&$this, 'page_rest_plugin_test']);
    }

    /**
     * Enqueue scripts
     */
    public function admin_pages_enqueue_scripts($page) {
        $plugin_dir = basename(dirname(__FILE__));
        if($page === 'toplevel_page_rest-plugin-test') {
            wp_enqueue_script('qunit', plugins_url() . '/' . self::PLUGIN_NAME . '/bower_components/qunit/qunit/qunit.js', []);
            wp_enqueue_script('qunit-test-suite', plugins_url() . '/' . self::PLUGIN_NAME . '/js/tests.js', ['jquery-core', 'qunit']);
            wp_enqueue_style('qunit', plugins_url() . '/' . self::PLUGIN_NAME . '/bower_components/qunit/qunit/qunit.css');
        }
    }

    /**
     * Display the REST plugin test page
     */
    public function page_rest_plugin_test() {
        echo '<div id="qunit" style="margin: 20px 20px 0 0"></div><div id="qunit-fixture"></div>';
    }

}

RBP_Test_Plugin::get_instance();