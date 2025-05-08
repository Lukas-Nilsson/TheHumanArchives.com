# scripts/gen-blur-map.sh
outfile="blur-map.js"
echo "// auto-generated – DO NOT EDIT by hand
export const blurMap = {" > $outfile

for f in public/*.png; do
  key="${f#public/}"                       # strip leading path
  b64=$(base64 < "$f" | tr -d '\n')        # macOS base64 = no -w flag
  printf '  "%s":"data:image/png;base64,%s",\n' "$key" "$b64" >> $outfile
done

sed -i '' '$ s/,$//' $outfile   # remove trailing comma (GNU→use -i'' '')
echo "};" >> $outfile