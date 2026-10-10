#!/bin/bash
# Full v2 render in 4 chunks (chapter boundaries, frame-exact), H.264 + PCM in MKV so the audio joins without gaps;
# then one loudnorm pass (-14 LUFS, TP -1.5) and one AAC encode. Re-running skips chunks that already exist.
set -e
cd <PROJECT_ROOT>/V2/remotion
export PATH="<NODE_DIR>:<FFMPEG_BIN>:$PATH" TEMP='<TEMP_DIR>' TMP='<TEMP_DIR>'
OUT=../out/film
mkdir -p $OUT
RANGES=("0-11418" "11419-31389" "31390-45926" "45927-63773")
for i in 0 1 2 3; do
  f=$OUT/part$i.mkv
  [ -s $f ] && { echo "skip $f"; continue; }
  echo "$(date +%T) render part$i ${RANGES[$i]}"
  npx remotion render src/index.ts Film $f.tmp.mkv --codec=h264-mkv --frames=${RANGES[$i]} --concurrency=4 --x264-preset=veryfast --crf=18 --log=error
  mv $f.tmp.mkv $f
done
printf "file 'part0.mkv'\nfile 'part1.mkv'\nfile 'part2.mkv'\nfile 'part3.mkv'\n" > $OUT/list.txt
ffmpeg -v error -y -f concat -safe 0 -i $OUT/list.txt -c copy $OUT/joined.mkv
J=$(ffmpeg -hide_banner -i $OUT/joined.mkv -vn -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p' | tr -d '\n\t ')
g() { echo "$J" | sed "s/.*\"$1\":\"\([^\"]*\)\".*/\1/"; }
ffmpeg -v error -y -i $OUT/joined.mkv -vf "scale=in_range=full:out_range=tv,format=yuv420p" -c:v libx264 -preset veryfast -crf 17 -g 60 -color_range tv -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):linear=true,aresample=48000" \
  -c:a aac -b:a 256k -movflags +faststart ../out/LAUFER108_V2_OPUS55_FINAL.mp4
echo "$(date +%T) DONE"
ffprobe -v error -show_entries format=duration -of csv=p=0 ../out/LAUFER108_V2_OPUS55_FINAL.mp4
