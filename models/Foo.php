<?php
namespace bhubr;
use bhubr\REST\Model\Post;

class Foo extends Post {
    static $type = 'post';

    static $singular = 'foo';
    static $plural = 'foos';

    static $name_s = 'Foo';
    static $name_p = 'Foos';

    static $fields = [
        'foo_type'   => 'string',
        'foo_number' => 'integer'
    ];
    static $relations = [
    ];

}