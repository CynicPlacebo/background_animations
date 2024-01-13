This is an homage to the old DVD Screensaver that would bounce around
changing color each time it ricocheted off a wall.
It can do it with 1 or more images.

===== USAGE =====
Your page must include both BounceImg.css, BounceImg.js, & bounce_img.js
Your page must call bounce_img_init() in bounce_img.js

bounce_img_init() doesn't need any parameters.
With zero parameters, it assumes your page has a <div> with ID 'bounce_imgs'
and that all <img> tags you want to animate reside therein.

You can provide parameters: id, explain, speed, colorchange, & jitter
Read the Function Documentation in bounce_img.js for more info on
parameter values.

===== POTENTIAL CSS CONFLICTS =====
BounceImg.css limits its styling to IDs prefixed with 'bounce_img' with a
couple notable exceptions.

It defaults the html background to black.
It does this as part of the homage to the DVD Screensaver.
This can be overridden in your own CSS.

The body is set to fill the viewport & hide overflow to prevent scrollbars.
You are discouraged from altering this without skill & specific intentions.
BounceImg.js ASSUMES these body styles & may break without them.
