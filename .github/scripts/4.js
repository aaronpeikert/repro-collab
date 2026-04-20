module.exports = async function ({ github, context, core, env }) {
    const [owner, repo] = process.env.FORK_REPO.split('/');
    const target = 'preregistration needed';
    
    // 1) Grab the last 10 issues (all states)
    const { data: recent } = await github.rest.issues.listForRepo({
        owner, repo,
        state: 'all',
        per_page: 10,
        sort: 'created',
        direction: 'desc'
    });
    
    // 2) Try exact match
    let found = recent.find(i => i.title.toLowerCase() === target);
    
    // 3) If no exact, run Levenshtein ≤3
    if (!found) {
        const lev = (a, b) => {
            const dp = Array.from({ length: a.length + 1 }, () => []);
            for (let i = 0; i <= a.length; i++) dp[i][0] = i;
            for (let j = 0; j <= b.length; j++) dp[0][j] = j;
            for (let i = 1; i <= a.length; i++) {
                for (let j = 1; j <= b.length; j++) {
                    dp[i][j] = a[i-1] === b[j-1]
                    ? dp[i-1][j-1]
                    : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
                }
            }
            return dp[a.length][b.length];
        };
        found = recent.find(i => lev(i.title.toLowerCase(), target) <= 3);
    }
    
    // 4) If still not found, check if accidentally created in upstream
    if (!found) {
        // Check if issue was created in main repo instead
        const { data: upstreamIssues } = await github.rest.issues.listForRepo({
            owner: context.repo.owner,
            repo: context.repo.repo,
            state: 'all',
            per_page: 20,
            sort: 'created',
            direction: 'desc'
        });
        
        // Check for exact match or close match in upstream
        let foundInUpstream = upstreamIssues.find(i => 
            i.title.toLowerCase() === target && 
            i.user.login === context.actor
        );
        
        if (!foundInUpstream) {
            const lev = (a, b) => {
                const dp = Array.from({ length: a.length + 1 }, () => []);
                for (let i = 0; i <= a.length; i++) dp[i][0] = i;
                for (let j = 0; j <= b.length; j++) dp[0][j] = j;
                for (let i = 1; i <= a.length; i++) {
                    for (let j = 1; j <= b.length; j++) {
                        dp[i][j] = a[i-1] === b[j-1]
                        ? dp[i-1][j-1]
                        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
                    }
                }
                return dp[a.length][b.length];
            };
            foundInUpstream = upstreamIssues.find(i => 
                lev(i.title.toLowerCase(), target) <= 3 && 
                i.user.login === context.actor
            );
        }
        
        // Different error messages based on where issue was found
        if (foundInUpstream) {
            await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                body: `❌ Milestone 4 not complete. You created the issue "${foundInUpstream.title}" in the main repository instead of your fork. Please create an issue called "Preregistration needed" in YOUR FORK (${owner}/${repo}), not in the main repository. Then run \`/done 4\` again.`
            });
        } else {
            await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                body: `❌ Milestone 4 not complete. Please open an issue called "Preregistration needed" in your fork and then run \`/done 4\` again.`
            });
        }
        return;
    }
    
    
    // 5) Cross off “4.”, reveal “5.”
    const updated = context.payload.issue.body
    .replace(/^(\s*-\s*\[)\s\](\s*4\..*)$/m, '$1x]$2')
    + '\n- [ ] 5. Close an issue - 🟢 Easy';
    
    //.replace(/\n*<img[^>]*>.*$/m, `\n- [ ] 5. Close an issue\n\n<img src="https://${context.repo.owner}.github.io/${context.repo.repo}/assets/close_issue.gif" alt="Close Issue GIF">`);
    
    await github.rest.issues.update({
        owner: context.repo.owner,
        repo:  context.repo.repo,
        issue_number: context.issue.number,
        body: updated,
        state: 'open'
    });
    
    // 6) Celebrate
    const forkIssues = await github.rest.issues.listForRepo({
        owner, repo,
        state: 'all',
        per_page: 10
    });
    const firstIssue = forkIssues.data.find(i =>
        i.title.toLowerCase() === 'create your own first issue'
    );
    const firstIssueUrl = firstIssue.html_url;
    const milestone4BodyLines = [
        '🎉 Milestone 4 complete - "Open a issue"!',
        '',
        `**Task:** Milestone 5 - 🟢 Easy is now available, go back to the issue you just solved (there are two issues in your fork, which of those tasks have you just resolved?), read the new comment, and close the issue: ${firstIssueUrl}`,
        '',
        'Click the "Close issue" button.',
        '',
        `**Afterwards:** Comment \`/done 5\` here.`,
    ];
    await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo:  context.repo.repo,
        issue_number: context.issue.number,
        body: milestone4BodyLines.join('\n')
    });
    
    // 7) Notify the "Create your own first issue" in the fork
    const preregistrationUrl = context.payload.issue.html_url;
    if (firstIssue) {
        const milestone4NotificationBodyLines = [
            `@${context.actor}, you've completed milestone 4!`,
            '',
            'Imagine your collaborators saw your reminder and quickly put together a first draft of the preregistration (how efficient!).',
            'In the next part of the workshop, you will help refine this preregistration.',
            'But first, **close this issue** since you completed the task. Closing issues when they are no longer needed is good practice for keeping your repository organized.',
            '',
            '**Task:** Close this issue.',
            '',
            `**Afterwards:** When you closed the issue, comment \`/done 5\` here: ${preregistrationUrl}!`
        ];
        
        await github.rest.issues.createComment({
            owner, repo,
            issue_number: firstIssue.number,
            body: milestone4NotificationBodyLines.join('\n')
        });
    }
}
