	// Example of how to use the featured image data
posts.forEach(function(post) {
    if (post.featured_image.url) {
        // Post has a featured image
        const imgHtml = `<img src="${post.featured_image.sizes.medium.url}" 
                              alt="${post.featured_image.alt}" 
                              width="${post.featured_image.sizes.medium.width}" 
                              height="${post.featured_image.sizes.medium.height}">`;
    } else {
        // No featured image available
        const imgHtml = '<div class="no-image-placeholder">No Image</div>';
    }
});
