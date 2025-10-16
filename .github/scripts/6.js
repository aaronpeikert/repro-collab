module.exports = async function ({ github, context, core, env }) {
    const [owner, repo] = process.env.FORK_REPO.split('/');
    
    // Find the PR we created
    const { data: prs } = await github.rest.pulls.list({
        owner, repo,
        state: 'all',
        per_page: 20,
        sort: 'created',
        direction: 'desc'
    });
    
    const pr = prs.find(pr =>
        pr.title === 'Review this preregistration update'
    );
    
    if (!pr) {
        await github.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.issue.number,
            body: '🚫 Could not find the PR.\n\nPlease check your fork for the preregistration PR.'
        });
        return;
    }
    
    // Check for review comments with suggestions
    const { data: reviews } = await github.rest.pulls.listReviews({
        owner, repo,
        pull_number: pr.number
    });
    
    let hasSuggestion = false;
    for (const review of reviews) {
        const { data: comments } = await github.rest.pulls.listCommentsForReview({
            owner, repo,
            pull_number: pr.number,
            review_id: review.id
        });
        
        if (comments.some(c => c.body.includes('```suggestion'))) {
            hasSuggestion = true;
            break;
        }
    }
    
    // Also check single comments
    if (!hasSuggestion) {
        const { data: prComments } = await github.rest.pulls.listReviewComments({
            owner, repo,
            pull_number: pr.number
        });
        
        hasSuggestion = prComments.some(c => c.body.includes('```suggestion'));
    }
    
    if (!hasSuggestion) {
        await github.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.issue.number,
            body: `🚫 Milestone 6 not complete.\n\nPlease add a suggestion to the PR using GitHub's suggestion feature. Go to the "Files changed" tab in your PR: ${pr.html_url}, click on a line and add a suggestion, then run \`/done 6\` again.`
        });
        return;
    }
    
    // Update issue body
    const updatedBody6 = context.payload.issue.body
    .replace(/^(\s*-\s*\[)\s\](\s*6\..*)$/m, '$1x]$2')
    + '\n- [ ] 7. Merge the pull request - 🟡 Medium';
    
    await github.rest.issues.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: updatedBody6,
        state: 'open'
    });
    
    // Success comment
    const milestone6BodyLines = [
        '🎉 Milestone 6 complete - "Add a PR suggestion"!',
        '',
        `**Task:** Milestone 7 - 🟡 Medium is now available. Time to merge your pull request: ${pr.html_url}`,
        '',
        'Click the "Merge pull request" button and then "Confirm merge" to complete the PR workflow.',
        '',
        `**Afterwards**: comment \`/done 7\` here.`
    ];
    await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: milestone6BodyLines.join('\n')
    });
}
