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

### Data cleaning and exclusions

Before analysis, we will inspect the raw trial data for missing responses, non-responses, and implausible reaction times. Trials with response times below 150 ms will be treated as anticipatory and excluded, and trials above 3,000 ms will be treated as outliers and excluded. We will also exclude trials with missing accuracy codes or invalid stimulus values. Exclusion criteria will be applied uniformly across participants before computing any summary statistics. Descriptive summaries of exclusions will be reported for transparency.

### Primary outcomes

The primary outcomes are:
1. Reaction time (RT) for correct trials, measured in milliseconds from stimulus onset to response.
2. Accuracy (proportion correct) for each stimulus difference.
3. The just noticeable difference (JND), defined as the stimulus difference at which performance shifts from near-chance to above-threshold discrimination.

### Primary analysis

For each participant, we will compute the median RT for correct responses at each absolute stimulus difference between the comparison square and the reference square. We will then plot median RT as a function of stimulus difference and fit a segmented or threshold model that captures the expected psychophysical pattern:
- a relatively flat RT function for very small differences,
- a transition point representing the JND,
- a negative slope for larger differences, indicating faster discrimination as stimulus difference increases.

To formally test the hypothesized relationship, we will fit a participant-level nonlinear regression using a piecewise function, with a change point at the JND. This model estimates the threshold at which RT begins to decrease systematically with stimulus difference. A reciprocal relationship will be considered supported if the fitted function shows a clear asymptotic decrease in RT with increasing difference above threshold.

To account for individual differences across participants, we will also fit a mixed-effects model with participant as a random effect:
- RT ~ stimulus difference + threshold term + (1 | participant)

This model will allow us to estimate whether the overall pattern is consistent across participants while preserving individual variability.

### Accuracy and JND analyses

Accuracy will be analyzed separately for each participant and stimulus difference. We will fit a psychometric function relating accuracy to stimulus difference and estimate the JND as the difference corresponding to a pre-specified performance criterion (e.g., 75% correct). This estimate will be compared with the threshold identified in the RT function. A converging pattern between the RT threshold and the accuracy-based JND would strengthen evidence for the psychophysical interpretation of the data.

### Visual inspection criteria

We will inspect the data for the expected pattern described by the classic psychophysical function:
- near-zero differences yield slow and error-prone judgments,
- RT and error rates decrease as the difference increases,
- the transition from flat to sloped performance marks the JND,
- overall responses are most consistent for larger stimulus differences.

### Secondary analyses

Secondary analyses will include:
1. Comparison of median RT and accuracy across participants to assess consistency of the discrimination function;
2. Examination of individual differences in the estimated JND and slope above threshold;
3. Sensitivity checks excluding participants with unusually high error rates or extreme response variability;
4. Descriptive summaries of mean accuracy, median RT, and the number of excluded trials by participant.

### Reporting

All analyses will be reported with effect estimates, uncertainty intervals, and plots of the fitted RT and accuracy functions. Results will be interpreted based on whether the observed data show the predicted threshold and negative relationship between stimulus difference and discrimination time.
