import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(17);
Config.setChromiumOpenGlRenderer('angle');
Config.setConcurrency(3);
Config.setPixelFormat('yuv420p'); // standard TV range for YouTube (JPEG frames would give yuvj420p)
