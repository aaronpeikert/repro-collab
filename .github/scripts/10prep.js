module.exports = async function ({ github, context, core, env }) {
    const [owner, repo] = process.env.FORK_REPO.split('/');
    // the titles are used in check 10!!!
    // Create three collaboration issues in the fork
    const issue1 = await github.rest.issues.create({
        owner, repo,
        title: 'Milestone 10: Decide on meta-comment',
        body: [
            '## Decide on meta-comment',
            '',
            'The quote in the study overview is kind of funny, but should we really keep it?',
            '- [ ] Make a decision to keep or remove it',
            '- [ ] Justify your decision',
        ].join('\n')
    });
    
    const issue2 = await github.rest.issues.create({
        owner, repo,
        title: 'Milestone 10: Update number of participants',
        body: [
            '## Update number of participants',
            '',
            'The preregistration currently says we\’ll collect data from five participants. But that number is clearly outdated — look how many we are!',
            '- [ ] Count the number of participants in the room',
            '- [ ] Update the number in the preregistration',
        ].join('\n')
    });
    
    const issue3 = await github.rest.issues.create({
        owner, repo,
        title: 'Milestone 10: Correct materials\' description',
        body: [
            '## Correct materials\' description',
            '',
            'Some things have changed since the original study or the original study did not entail sufficient information for an exact replication.',
            'These things need to be incorporated:',
            '- We are using a different data collection tool',
            '- We randomly generated the size of the comparison squares from a uniform distribution',
        ].join('\n')
    });
    
    const issue4 = await github.rest.issues.create({
        owner, repo,
        title: 'Milestone 10: Clarify procedure',
        body: [
            '## Clarify procedure',
            '',
            'The procedure description also needs a refresh:', 
            '- We didn\'t use a tachistoscope',
            '- We didn\'t categorize stimuli into three difficulty levels', 
            '- None of us will ever complete 6,850 (!!) trials', 
        ].join('\n')
    });
    
    const issue5 = await github.rest.issues.create({
        owner, repo,
        title: 'Milestone 10: Improve data analysis plan',
        body: [
            '## Improve data analysis plan',
            '',
            'So far, the preregistration says we\'ll plot the results for each participant and visually inspect the data.', 
            'That’s... certainly *one* way to approach it, but does anyone have a better idea?'
        ].join('\n')
    });

    // Get tracking issue URL
    const trackingIssueUrl = context.payload.issue.html_url;
    const preregistrationUrl = 'https://github.com/' + owner + '/' + repo + '/main/preregistration.md'

    // Combined success comment for both milestones
    const body10 = [
        '**Milestone 10**',
        '',
        'Here we want you to simply try out a more messy, less structured collaboration with your partner by revising the preregistration. This is where you bring together everything you\'ve learned.',
        'Both of you should please work on the preregistration document that is stored in the fork of Person B (i.e., the less experienced partner), which is called [preregistration.md](${preregistrationUrl}).',
        'To help you get started, we\'ve created a set of issues that outline specific improvements to make. Use these issues to assign tasks and coordinate your work.',
        '',
        '**Task**: Revise the preregistration together',
        '* Use issues to **assign tasks**.',
        `1. [Decide on meta-comment](${issue1.data.html_url})`,
        `2. [Update number of participants](${issue2.data.html_url})`,
        `3. [Correct materials' description](${issue3.data.html_url})`,
        `4. [Clarify procedure](${issue4.data.html_url})`,
        `5. [Improve data analysis plan](${issue5.data.html_url})`,
        '* Work individually in your **own branch or fork**.',
        '* **Create PRs** when you\'re ready for feedback.',
        '* Use PRs to **discuss and improve** the changes.',
        '* **Close issues** once tasks are complete.',
        '',
        `**When done:** Comment \`/done 10\` [in the tracking issue](${trackingIssueUrl})`, 
        '',
        'However, there is so much to learn! From here on, you can choose to work on a number of **OPTIONAL** milestones, in **whatever order** you want.',
        'So you could do `/done 14` and then `/done 10` if you wanted.',
        'Simply pick milestones that teach some skills you find useful. Everything >10 are delightful side quests.',
        '',
        '*It is unlikely that you manage to finish all sidequests in a day, they are for those who really want to dig deep.*',
        '', 
        'If you would like some guidance on how to proceed today, we offer a few recommendations below. Thematically, the remaining milestones can be grouped into two broader themes, but you can mix and match them depending on what you\'d like to practice.',
        '', 
        '**Track 1: Understanding Git (the system behind GitHub)**',
        'If you\'d like to deepen your understanding of how Git works, these milestones are a great next step. They don\'t require you to have Git installed locally (see Milestone 11).',
        '* Milestone 15 – Learn Branching Interactively: a playful way to explore branching, suitable for all levels.', 
        '* Milestone 16 – Time Travel in Git: explore version history and recovery (works in GitHub or Codespaces).',
        '* Milestone 18 – Cherry-Pick Commits: makes most sense if you have Git installed locally and already feel more confident with it.', 
        '', 
        '**Track 2: Collaborative Practice on GitHub**', 
        'If you\'d like to explore how teams use GitHub for research collaboration, try these. They vary in structure — some you can do solo, others with a partner.', 
        '* Milestone 11 – Learn about GitHub Codespaces: recommended for everyone who doesn\'t know Codespaces before working jointly — you\'ll likely gladly use it during the exercises.Especially, the live sharing feature feels very collaborative.', 
        '* Milestone 12 – Create Private and Public Repositories: relevant when preparing papers or projects not yet public.', 
        '* Milestone 13 – Work with People Who Don\'t Use Git/GitHub: includes a collaborative mini-exercise, similar to Milestone 10 but less structured.',
        '* Milestone 14 – Use GitHub Labels: individual task, but very helpful for organizing teamwork.',
        '* Milestone 17 – Force Complete File Reviews: collaborative feature practice, though not a joint workshop task.'
    ];

    await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: body10.join('\n')
    });
}
