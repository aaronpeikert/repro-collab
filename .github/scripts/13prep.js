module.exports = async function ({ github, context, core, env }) {
    const [owner, repo] = process.env.FORK_REPO.split('/');
    const trackingIssueUrl = context.payload.issue.html_url;

    const body13 = [
        '',
        '### Task: Incorporate Feedback that comes in less than ideal form.',
        '',
        '**Why this matters:**',
        'Some people do not have the time/energy/capacity/knowledge to use Git and that\'s OK – Science should not depend (too much) on the tools used.',      
        '',
        '### Detailed Steps:',
        '',
        '**Step 1: Look at the feedback**',
        'Prof. Grumpy has kindly provided excellent feedback. They took the liberty to print an old version of the preregistration and provide handwritten notes.',
        'I included an image here:',
        `<img src="https://${context.repo.owner}.github.io/${context.repo.repo}/assets/prereg-1.png" alt="Notes of Prof. Grumpy 1">`,
        `<img src="https://${context.repo.owner}.github.io/${context.repo.repo}/assets/prereg-2.png" alt="Notes of Prof. Grumpy 2">`,
        `<img src="https://${context.repo.owner}.github.io/${context.repo.repo}/assets/prereg-3.png" alt="Notes of Prof. Grumpy 3">`,
        '**Step 2: Decide what is ready for implementation and what needs more work.**',
        '1. Find the things you can/want to change right away.',
        '2. Change them in a branch, open a PR, let your partner review.',
        '3. Bigger things could perhaps use an issue, for discussion and assignment. For example, implementing the 21 word solution is something that requires more work. After that rinse and repeat 2.',
        '',
        '**Expected results:**',
        '- One or more PRs that reflect Prof. Grumpy\'s comments.',
        '',
        '**Discussion:** When does/doesn\'t it make sense to track other people in git?',
        '',
        `**When done:** Comment \`/done 13\` [in the tracking issue](${trackingIssueUrl}).`,
        '',
    ];
    
    await github.rest.issues.create({
        owner: owner,
        repo: repo,
        title: '[optional] Milestone 13: Work with people who don\'t use Git/GitHub - 🟡 Medium',
        body: body13.join('\n'),
        labels: ['enhancement']
    });
}        
