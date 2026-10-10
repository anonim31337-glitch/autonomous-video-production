#!/bin/bash
# Full film, exactly as the transcript (M11) instructs: chunks at chapter boundaries (h264-mkv + PCM), existing chunks are
# skipped (move a chunk away to re-render it), concat with stream copy, loudnorm measured, one final pass with the
# full→tv range conversion. Output: remotion/out/film_final.mp4     usage: bash render_film.sh
set -e
export PATH="<NODE_DIR>:<FFMPEG_BIN>:$PATH"
cd <PROJECT_ROOT>/remotion
RANGES=$(python -c "
import json
tl=json.load(open('src/data/timeline.json',encoding='utf-8'))
st={s['id']:s['start'] for s in tl['segments']}
c=[0,st['M4'],st['M8'],st['M13'],tl['total']]
print(' '.join(f'{a}-{b-1}' for a,b in zip(c,c[1:])))")
mkdir -p out/film
i=0
for R in $RANGES; do
  if [ -f "out/film/part$i.mkv" ]; then echo "skip part$i"; else
    echo "$(date +%H:%M:%S) render part$i frames $R"
    npx remotion render src/index.ts Film "out/film/part$i.mkv" --codec=h264-mkv --frames=$R --concurrency=4 --x264-preset=veryfast --crf=18 --log=error
  fi
  i=$((i+1))
done
rm -f out/film/list.txt; for p in out/film/part*.mkv; do echo "file '$(basename $p)'" >> out/film/list.txt; done
ffmpeg -v error -y -f concat -safe 0 -i out/film/list.txt -c copy out/film/joined.mkv
M=$(ffmpeg -hide_banner -i out/film/joined.mkv -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$M" | python -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i out/film/joined.mkv -vf "scale=in_range=full:out_range=tv,format=yuv420p" -c:v libx264 -preset veryfast -crf 17 -g 60 -color_range tv \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" \
  -c:a aac -b:a 256k -movflags +faststart out/film_final.mp4
echo "$(date +%H:%M:%S) FILM_DONE"
