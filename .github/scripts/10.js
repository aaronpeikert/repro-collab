module.exports = async function ({ github, context, core, env }) {
    const [owner, repo] = process.env.FORK_REPO.split('/');

    // Verify all 5 issues from milestone 9 are closed
    const requiredIssueTitles = [
        'Milestone 10: Decide on meta-comment',
        'Milestone 10: Update number of participants',
        'Milestone 10: Correct materials\' description',
        'Milestone 10: Clarify procedure',
        'Milestone 10: Improve data analysis plan'
    ];

    // Get all issues (open and closed)
    const { data: allIssues } = await github.rest.issues.listForRepo({
        owner, repo,
        state: 'all',
        per_page: 100
    });

    const openRequiredIssues = [];

    for (const title of requiredIssueTitles) {
        const issue = allIssues.find(i => i.title === title);

        if (!issue) {
            openRequiredIssues.push(`"${title}" (not found)`);
        } else if (issue.state === 'open') {
            openRequiredIssues.push(`[${title}](${issue.html_url})`);
        }
    }

    if (openRequiredIssues.length > 0) {
        await github.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.issue.number,
            body: `🚫 Milestone 10 not complete. The following issues are still open:\n\n${openRequiredIssues.map(i => `- ${i}`).join('\n')}\n\nClose all 5 issues before running \`/done 10\` again.`
        });
        return;
    }

    // All issues are closed - mark milestone 10 complete
    const updatedBody = context.payload.issue.body
        .replace(/^(\s*-\s*\[)\s\](\s*10\..*)$/m, '$1x]$2');

    await github.rest.issues.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: updatedBody,
        state: 'open'
    });

    await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: '**Congratulations on completing milestone 10!** 🎉\n\nYou\'ve successfully collaborated on all the issues and revised the preregistration together. Great teamwork!'
    });
}
