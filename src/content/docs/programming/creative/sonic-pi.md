---
title: Sonic PI
---

- Sonic Pi is an open-source live-coding environment designed for creating music by writing code[^1].
    - i.e you write code that runs in real time (and you can tweak it live) to produce music[^3].
- Created by Sam Aaron (initially at the University of Cambridge) with education in mind[^2].

## Basic Building Blocks

### "play" and notes

- Playing notes directly: `play 60` (MIDI number) or `play :C4` .
    - Specifying traditional note names with octave, e.g., `:C4`.

### "sleep"

- After playing a note you typically pause for a certain amount of beats via `sleep`.

```ruby
play :C4
sleep 1 # pause for 1 beat
```

### Synths and Samples

- Use built-in synths (e.g., via `use_synth`) and samples (pre-recorded audio)
- Options allow controlling of parameters of synths or samples, like amplitude (`amp:`), pan (`pan:`), rate (`rate:`), etc.

## Structure & Timing

### Live Loops

- One of the major features: `live_loop :name do … end` which loops code continuously can be modified in real time
- Important to include a `sleep` inside the loop to prevent it from overwhelming the system
    - You'll see a thread_death

### Sync, Threads & Functions

- Define functions via `define :func_name do … end`
- Spawn threads (`in_thread do … end`) or use named threads to run multiple loops concurrently.
- Using `sync` and `cue` allows coordination between loops (one loop sends a cue, another loop waits for it).

### Scales, chords, rings

Sonic Pi supports musical scales and chords (e.g., `scale`, `chord`) which return a "ring", a cyclic list (wraps around).

| Method        | Behavior                                       | Type             | Use Case                        |
| ------------- | ---------------------------------------------- | ---------------- | ------------------------------- |
| `.choose`     | Picks a **random element** each time           | Random           | Variation, generative music     |
| `.tick`       | Advances **sequentially** through ring (loops) | Sequential       | Arpeggios, basslines            |
| `.shuffle`    | Returns a **new ring** with random order       | Randomized order | Random permutations             |
| `.stretch(n)` | Repeats each element **n times**               | Structural       | Slow loops, rhythmic elongation |

### BPM & Tempo

- You can use `use_bpm` (beats per minute) to set tempo.
- Loops and sleeps work relative to beats.

## Sound Design & Effects

### Options/parameters for sounds

- As above: synths/samples accept options like `play :E3, release: 0.5, amp: 0.8`.
    - The `release:` parameter controls how long the note decays.
- Envelope controls (attack, hold, decay, release) allow you to shape the dynamics of a sound.

### Studio FX

- You can apply effects using `with_fx :effect_name, opt1: val1, … do … end`

```ruby
with_fx :echo, phase: 0.5, decay: 8 do
    play :C4
    sleep 0.5
    sample :elec_blip
    sleep 0.5
end
```

- Nest effects to "chain" them (e.g., reverb inside an echo).

### Master Mixer

- There is a "master mixer" which can globally control filters like low-pass/high-pass for the entire sound output: e.g., `set_mixer_control! lpf: 50`.

## Algorithmic & Generative Techniques

- Use of randomness (`rand`, `rrand`) and rings allows generative music but it’s deterministic
    - The random stream is the same each run unless seeded differently
- Polyrhythms multiple live loops running at different sleep values
- Phasing: a loop with sleep 0.3 vs one with sleep 0.4

## Platform

- Ruby for the scripting language, runs on Windows, macOS, Linux (including Raspberry Pi).
- Under the hood, uses synthesizer engines (e.g., SuperCollider) and precise timing models to ensure musical timing is accurate.

## Workflow

1. Start with a `live_loop :drum` that uses a sample (e.g., `:bd_haus`), with a sleep interval for the beat.
2. Add another `live_loop :bass` that plays notes from a ring or scale, perhaps with `tick` to iterate through the ring.
3. Choose a synth (`use_synth :saw`) and set some `amp:` and `release:` to shape it.
4. Add effects (`with_fx :reverb do … end`) around your loops or parts.
5. Use functions or threads to modularise sections (e.g., a `define :melody` function, then spawn a thread that loops calling it).
6. During playback, tweak values live (sleep durations, rates, cutoffs, amp, etc) to evolve the piece.
7. Experiment with randomness and rings (e.g., `notes = (ring :C4, :E4, :G4); play notes.choose`) for variation.
8. Use `sync`/`cue` to coordinate loops (e.g., a loop that cues :bar, other loop waits `sync :bar` then plays).
9. Optionally apply global mixer controls (e.g., `set_mixer_control! hpf: 80`) to affect the overall sound.

## Further Reading & Listening

1. <https://subjectguides.york.ac.uk/coding/sonic-pi>
2. [Developer Voices Interview](https://www.youtube.com/watch?v=r2HbwRj7_w0)
3. My favorite Sam Aaron [performance](https://www.youtube.com/watch?v=G1m0aX9Lpts)

[^1]: <https://sonic-pi.mehackit.org/exercises/en/01-introduction/01-introduction.html> "Introduction - Creative programming workshop with Sonic Pi"
[^2]: <https://projects.raspberrypi.org/en/projects/getting-started-with-sonic-pi> "Getting Started With Sonic Pi - Code Club Projects"
[^3]: <https://sonic-pi.net/tutorial.html> "Sonic Pi - Tutorial"
