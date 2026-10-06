# October packaging refresh

Recreated from the supplied September 29 label artwork, five sachet mockups, and powder references. Generated images were converted to WebP for theme use.

- Homepage hero: `fifteen-new-hero-1500.webp`.
- Product images: `fifteen-new-packets`, `fifteen-new-bag`, and `fifteen-new-spheres` in 240, 600, and maximum-width variants.
- Homepage lifestyle: `fifteen-new-life-{work,car,gym,night}.webp`.

`fifteen-image-asset` maps only three retired Shopify catalog image IDs. `fifteen-image` renders replacements in the homepage, Why 15, product/card galleries, thumbnails, search cards, and cart. New images uploaded in Shopify have different IDs and use the normal pipeline. Shopify product media records, checkout imagery, structured data and external feeds are not rewritten by this theme change.

Lifestyle replacements match only the four previous configured filenames. Selecting a new image in the theme editor takes precedence.

Today's mobile hero spacing and typography are preserved. Existing header logo retains its requested upward arrow.

Validation: parsed all changed Liquid templates; rendered all three mapped image IDs and an unknown-ID fallback; checked git whitespace and image files.
