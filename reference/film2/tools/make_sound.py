"""Sound generated in code (no downloads, no licences): effects with the reference parameters and a quiet ambient bed.
The bed loops seamlessly: 64 s, every frequency and LFO completes a whole number of cycles in 64 s.
-> remotion/public/sfx_tick.wav, sfx_whoosh.wav, sfx_hit.wav, bed.wav     usage: python make_sound.py"""
import wave
import numpy as np

SR = 48000
OUT = r'<PROJECT_ROOT>\remotion\public'


def save(name, x):
    x = np.clip(x, -1, 1)
    s = (np.column_stack([x, x]) * 32767 * 0.9).astype('<i2') if x.ndim == 1 else (x * 32767 * 0.9).astype('<i2')
    with wave.open(rf'{OUT}\{name}.wav', 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(s.tobytes())


# effects: tick 1.8 kHz decaying over 90 ms, whoosh of swept filtered noise over 0.55 s, low hit near 55 Hz over 0.7 s
t = np.arange(int(SR * 0.09)) / SR
save('sfx_tick', 0.5 * np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 60) + 0.25 * np.sin(2 * np.pi * 3600 * t) * np.exp(-t * 90))
n = int(SR * 0.55); t = np.arange(n) / SR; noise = np.random.default_rng(7).standard_normal(n)
cut = 200 + 5000 * np.sin(np.pi * t / t[-1]) ** 2; y = np.zeros(n); a = 0.0
for i in range(n):
    a += (1 - np.exp(-2 * np.pi * cut[i] / SR)) * (noise[i] - a); y[i] = a
save('sfx_whoosh', 0.6 * y / np.max(np.abs(y)) * np.sin(np.pi * t / t[-1]) ** 1.5)
t = np.arange(int(SR * 0.7)) / SR
save('sfx_hit', 0.8 * np.sin(2 * np.pi * (55 + 40 * np.exp(-t * 12)) * t) * np.exp(-t * 5))

# bed: a low drone (A1, E2, A2, slow beating pairs) breathing with 16 s and 32 s LFOs, plus air (low-passed noise)
L = 64
t = np.arange(SR * L) / SR
k = lambda f: round(f * L) / L  # snap to a whole number of cycles per loop
lfo1 = 0.5 + 0.5 * np.sin(2 * np.pi * t / 16)
lfo2 = 0.5 + 0.5 * np.sin(2 * np.pi * t / 32 + 1.3)
left = (0.30 * np.sin(2 * np.pi * k(55) * t) + 0.22 * np.sin(2 * np.pi * k(55.25) * t)
        + 0.16 * np.sin(2 * np.pi * k(82.5) * t) * lfo1 + 0.10 * np.sin(2 * np.pi * k(110.125) * t) * lfo2)
right = (0.30 * np.sin(2 * np.pi * k(55) * t) + 0.22 * np.sin(2 * np.pi * k(54.75) * t)
         + 0.16 * np.sin(2 * np.pi * k(82.5) * t) * lfo2 + 0.10 * np.sin(2 * np.pi * k(109.875) * t) * lfo1)
air = np.fft.irfft(np.fft.rfft(np.random.default_rng(3).standard_normal(len(t))) * (np.fft.rfftfreq(len(t), 1 / SR) < 900))  # circular: loops
air = air / np.max(np.abs(air)) * 0.06 * (0.6 + 0.4 * lfo1)
bed = np.column_stack([left + air, right + air])
save('bed', bed / np.max(np.abs(bed)) * 0.8)
assert np.allclose(bed[0], bed[-1], atol=0.05), 'bed does not loop'
print('sound ok: tick, whoosh, hit, bed', L, 's')
