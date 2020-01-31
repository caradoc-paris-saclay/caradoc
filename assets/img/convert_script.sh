convert program_caradoc.png \
-filter Triangle \
-define filter:support=2.0 \
-unsharp 0.25x0.08+8.3+0.045 \
-dither None \
-posterize 136 \
-quality 82 \
-define jpeg:fancy-upsampling=off \
-define png:compression-filter=5 \
-define png:compression-level=9 \
-define png:compression-strategy=1 \
-define png:exclude-chunk=all \
-interlace none \
-colorspace sRGB \
-colors 255 \
-strip \
output.png
