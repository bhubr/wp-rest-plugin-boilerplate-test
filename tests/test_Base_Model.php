<?php

/**
 * Class SampleTest
 *
 * @package Sandbox_Plugin
 */

/**
 * Sample test case.
 */
class BaseModelTest extends WP_UnitTestCase {

    /**
     * A single example test.
     */
    function test_register_type() {
        // Replace this with some actual testing code.
        // bhubr\Base_Model::register_type('pouet', 'Pouet', ['fields' => ['foo', 'bar']]);
        $builtin_types = get_post_types(['_builtin' => true]);
        $all_types = array_merge($builtin_types, ['foo' => 'foo']);
        $this->assertEquals( $all_types, get_post_types() );
    }

}
