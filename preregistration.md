# Replication of Classic Psychophysical Research on Size Discrimination

## Study Overview

Psychophysics is the scientific study of the relationship between physical stimuli (like light, sound, or size) and our psychological perception of them.
A fundamental question in this field is: when something in the world changes by a certain amount, how much does our perception of it change?

> "The tower of Babel was never finished because the workers could not reach an understanding on how they should build it; my psychophysical edifice will stand because the workers will never agree on how to tear it down."  
> — Gustav Fechner (1877)

In this quote, Fechner—the founder of psychophysics—humorously suggests that his framework for understanding how we perceive the physical world will endure precisely because critics cannot agree on a unified approach to challenge it.
Empierically we can challenge it by trying to replicate an original experiment from the time.

This study replicates pioneering work from the 1940s-1950s on visual perception, specifically examining how people judge the relative sizes of objects.
While often associated with Stevens' Power Law (1957), the specific experiment we're replicating focuses on reaction time in discrimination tasks, building on earlier work by researchers like Cattell (1902) and Henmon (1906).
These researchers discovered that the time needed to discriminate between two stimuli follows a predictable mathematical relationship with the size of the difference between them—a finding that helped establish fundamental principles still used in vision science today.

## Background

More background: <https://aaronpeikert.github.io/repro-collab/self-paced/background-on-psychophysics.html>

When judging sizes, our visual system faces a challenge: we need to quickly and accurately compare objects that may differ subtly or dramatically. Previous research has shown that:

1. **Discrimination time** (how long it takes to judge which of two objects is larger) depends on how different the objects are in size
2. For very small differences, discrimination is slow and error-prone
3. As differences increase, discrimination becomes faster and more accurate
4. This relationship may follow a specific mathematical pattern

## Hypotheses

Based on the theoretical framework and prior observations, we predict:

1. **Primary hypothesis**: Discrimination time will show a reciprocal relationship with stimulus difference—that is, as the size difference between two squares increases, the time needed to judge which is larger will decrease following a hyperbolic function.
2. **Threshold hypothesis**: This reciprocal relationship will only hold for stimulus differences above the "just noticeable difference" (JND)—the smallest difference that can be reliably detected. Below this threshold, discrimination time will remain approximately constant regardless of the size difference.
3. **Accuracy hypothesis**: Error rates will be highest for stimuli close to equal in size and will decrease as the size difference increases.

## Methods

### Participants

Five participants with normal or corrected-to-normal vision will complete the study.

### Materials

- **Tachistoscope**: A device that presents visual stimuli for precisely controlled durations
- **Stimuli**: Black squares on a white background
  - Reference square: 9.00 sq.mm (constant)
  - Comparison squares: 39 different sizes ranging from 8.00 to 15.00 sq.mm
  - This range includes squares both smaller and larger than the reference

### Procedure

1. Participants sit at a comfortable viewing distance from the tachistoscope
2. On each trial:
   - Two squares appear simultaneously (reference and comparison)
   - The participant judges which square is larger by pressing a corresponding button
   - Reaction time is recorded from stimulus onset to response
   - The stimuli remain visible until a response is made
3. Trial distribution:
   - 200 trials for comparison sizes very close to the reference (hardest discriminations)
   - 100 trials for intermediate differences
   - 50 trials for the largest differences (easiest discriminations)
   - Total: approximately 6,850 trials per participant
4. Sessions last approximately one hour, with regular breaks to prevent fatigue

### Key Measurements

- **Reaction time**: Time from stimulus presentation to response (in seconds)
- **Accuracy**: Whether the participant correctly identified the larger square
- **Stimulus difference**: The difference in area between comparison and reference squares (in sq.mm)

## Analysis Plan

### Primary Analysis

For each participant individually:

1. Calculate median discrimination times for each stimulus difference
2. Plot median discrimination time (y-axis) against stimulus difference in sq.mm (x-axis)
3. Use hyperbolic coordinates to test whether the data follow the predicted reciprocal function

### Visual Inspection Criteria

We will examine whether the data show:

- A horizontal line (constant discrimination time) for very small stimulus differences
- A transition point (likely corresponding to the JND)
- A negatively sloped line for larger stimulus differences (indicating faster discrimination as difference increases)

### Secondary Analyses

1. Calculate error rates for each stimulus difference
2. Identify the approximate location of the just noticeable difference (JND) as the point where the function transitions from flat to sloped
3. Compare patterns across participants to assess consistency
