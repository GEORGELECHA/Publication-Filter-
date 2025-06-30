// Add this to your theme's functions.php file
function enqueue_filter_scripts() {
    wp_localize_script('jquery', 'wpAjax', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('filter_posts_nonce')
    ));
}
add_action('wp_enqueue_scripts', 'enqueue_filter_scripts');

// AJAX handler to get posts and filter data
function get_filtered_posts() {
    // Verify nonce for security
    if (!wp_verify_nonce($_POST['nonce'], 'filter_posts_nonce')) {
        wp_die('Security check failed');
    }
    
    // Only these will appear in dropdowns
    $allowed_categories = array('at', 'blanditis', 'Blog', 'illo', 'numquam', 'Uncategorized', 'voluptatem');
    $allowed_tags = array('eligendi', 'in', 'reiciendis', 'veniam', 'voluptatem');
    $allowed_authors = array(
        'buckridge.ashlee',
        'ciara.huels', 
        'heller.gudrun',
        'herzog.jarret',
        'qzemlak',
        'rice.fritz',
        'tevin26',
        'yasmine.auer',
        'yhartmann',
        'zbauch'
    );
    
    // Get all posts
    $posts = get_posts(array(
        'post_type' => 'post', // Change to your post type
        'posts_per_page' => -1,
        'post_status' => 'publish'
    ));
    
    $formatted_posts = array();
    $all_categories = array();
    $all_tags = array();
    $all_authors = array();
    
    foreach ($posts as $post) {
        setup_postdata($post);
        
        // Get categories
        $categories = get_the_category($post->ID);
        $post_categories = array();
        $post_category_names = array();
        foreach ($categories as $cat) {
            // Only include allowed categories
            if (in_array($cat->slug, $allowed_categories)) {
                $post_categories[] = $cat->slug;
                $post_category_names[] = $cat->name;
                if (!in_array($cat->slug, array_column($all_categories, 'slug'))) {
                    $all_categories[] = array('slug' => $cat->slug, 'name' => $cat->name);
                }
            }
        }
        
        // Get tags
        $tags = get_the_tags($post->ID);
        $post_tags = array();
        $post_tag_names = array();
        if ($tags) {
            foreach ($tags as $tag) {
                // Only include allowed tags
                if (in_array($tag->slug, $allowed_tags)) {
                    $post_tags[] = $tag->slug;
                    $post_tag_names[] = $tag->name;
                    if (!in_array($tag->slug, array_column($all_tags, 'slug'))) {
                        $all_tags[] = array('slug' => $tag->slug, 'name' => $tag->name);
                    }
                }
            }
        }
        
        // Get author
        $author_id = $post->post_author;
        $author_name = get_the_author_meta('display_name', $author_id);
        $author_slug = get_the_author_meta('user_nicename', $author_id);
        
        // Only include allowed authors
        if (in_array($author_slug, $allowed_authors)) {
            if (!in_array($author_slug, array_column($all_authors, 'slug'))) {
                $all_authors[] = array('slug' => $author_slug, 'name' => $author_name);
            }
        }
        
        // Get featured image
        $featured_image = array(
            'url' => '',
            'alt' => '',
            'sizes' => array()
        );
        
        if (has_post_thumbnail($post->ID)) {
            $thumbnail_id = get_post_thumbnail_id($post->ID);
            $featured_image['url'] = get_the_post_thumbnail_url($post->ID, 'full');
            $featured_image['alt'] = get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true);
            
            // Get different image sizes
            $image_sizes = array('thumbnail', 'medium', 'medium_large', 'large', 'full');
            foreach ($image_sizes as $size) {
                $image_data = wp_get_attachment_image_src($thumbnail_id, $size);
                if ($image_data) {
                    $featured_image['sizes'][$size] = array(
                        'url' => $image_data[0],
                        'width' => $image_data[1],
                        'height' => $image_data[2]
                    );
                }
            }
        }
        
        // Only include posts that have at least one allowed category, tag, or author
        if (!empty($post_categories) || !empty($post_tags) || in_array($author_slug, $allowed_authors)) {
            $formatted_posts[] = array(
                'id' => $post->ID,
                'title' => get_the_title($post->ID),
                'excerpt' => get_the_excerpt($post->ID),
                'link' => get_permalink($post->ID),
                'date' => get_the_date('F j, Y', $post->ID),
                'author' => $author_slug,
                'author_name' => $author_name,
                'categories' => $post_categories,
                'category_names' => $post_category_names,
                'tags' => $post_tags,
                'tag_names' => $post_tag_names,
                'featured_image' => $featured_image
            );
        }
    }
    
    wp_reset_postdata();
    
    wp_send_json_success(array(
        'posts' => $formatted_posts,
        'filters' => array(
            'categories' => $all_categories,
            'tags' => $all_tags,
            'authors' => $all_authors
        )
    ));
}
add_action('wp_ajax_get_filtered_posts', 'get_filtered_posts');
add_action('wp_ajax_nopriv_get_filtered_posts', 'get_filtered_posts');














