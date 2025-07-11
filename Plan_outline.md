# Show Git and GitHub for collaborative writing.

## Contribution

Szene: We work on a preregistration to replicate the stevens power curve for comparing size.

Szene: Your supervisor did something, you review it.

0. I passiv: Explain Fork and Issue.
1. U: Create a GitHub account or login.
2. I & U activ: Fork the repo. ☑️
3. C: Create issue in upstream telling them to enable issues in their fork. 
4. TODO: Wir lassen das issue offen und automatisieren ein feedback loop, welcher im original issue bei jedem schritt ein update kommentiert. damit trigger auf main repro.
5. U: Activate issues in your fork. ☑️
6. C: Create issue telling user to create issue "Introduction needed". ☑️
7. U: create "Introduction needed" issue. ☑️
8. C: Check that there is an issue called "introduction needed", if not, issue with "We need that, for real". @Hannes
9. C: react to issue called introduction needed by creating PR that proposes the changes. The PR asks the user to supply their real name under collaborators. @Aaron
10. I: GIF how to suggest changes.
11. C: Count up to three comments. Then comments "Looks good, ready to merge."
12. U: Merges the pull request (perhaps with applied changes). Goal 1. 60. TBD: Some detour for fast people. Perhaps look at the PDF creation process.
13. I: Explain: Teams of two, working one after the other. Use the “weaker” person’s fork.
14. U: Form a pair and decide whose fork to use (choose the person less familiar with GitHub).
15. U: Together, edit the preregistration draft in this fork, making meaningful commits and following the collaborative writing cheat sheet. Open a pull request for each substantial change, and review and discuss suggestions.
16. U: Resolve any conflicts and open discussions before merging. Repeat the process for further changes, always working sequentially in the same fork.
17. U: git checkout upstream
18. U: git branch -B data
19. U: start with "Study", everyone is doing the Steven experiment in there own fork, own branch.
20. U: git commit/ git push
21. U: create PR
22. C: merging only data folder fork into data branch aaronpeikert/repro-collab

Idea: two person teams, weaker person forks is used. doing a colobaration **sequential**. Going trough a checklist. Everything in the UI. Everything in main.
For example: each person opens an issue and works on the issue of the other (sequential, so make clear that one is reviewer and one is editor first, and then change roles)?

xx. Commit, push data to their fork, open PR, pr merged automatically.


## Collab

Szene: Users have added data and have changed prereg in unpredictiable ways.
Goal: Users add data to upstream, merge all data into their fork:

1. U: 

# Questions
- Can we have a PDF rendering in the forked repo?

# Not shown so far

- assigning people to issues


# Collaborative Writing Cheat Sheet

## Writing

- Write one sentence per line.
- Every sentence ends with a period, colon, semicolon.
- Keep paragraphs focused on a single idea.
- Use clear and concise language.
- Use consistent terminology and tense throughout the document.

## Commits & Changes

- Summarize your changes in meaningful commit messages.
- Do not delete large sections without prior discussion.
- When opening a pull request, describe what you changed and why.

## Collaboration & Review

- Review your partner’s changes constructively and suggest improvements.
- Discuss any uncertainties or disagreements in pull request comments.
- Ask for feedback if you are unsure about your changes.
- Resolve all open discussions before merging.

