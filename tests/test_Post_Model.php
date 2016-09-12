<?php

/**
 * Class PostModelTest
 *
 * @package Sandbox_Plugin
 */

/**
 * Sample test case.
 */
class PostModelTest extends WP_UnitTestCase {

    /**
     * A single example test.
     * @-expectedException PHPUnit_Framework_Error
     */
    function test_create_and_read() {
        // Replace this with some actual testing code.
        // bhubr\Base_Model::register_type('pouet', 'Pouet', ['foo', 'bar']);
        // bhubr\Base_Model::register_taxonomy('pouet_tax', 'Pouet Taxonomy', 'pouet', ['baz']);
        $rbp = bhubr\REST_Plugin_Boilerplate::get_instance(realpath(__DIR__ . '/..'));
        $rbp->create_term_meta_tables('rbp-test-plugin');
        $model = bhubr\Post_Model::create('foo', ['name' => 'Pouet 1', 'baz' => 'poop', 'bee' => 'poy', 'boo' => 'yap']);
        $expected_model = [
            'id' => 3, 'name' => 'Pouet 1', 'slug' => 'pouet-1',
            'baz' => 'poop', 'bee' => 'poy', 'boo' => 'yap'
        ];
        $this->assertEquals($expected_model, $model);
        $read_model = bhubr\Post_Model::read('foo', 3);
        $this->assertEquals($expected_model, $read_model);
    }

}
