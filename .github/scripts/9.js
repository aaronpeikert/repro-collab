module.exports = async function ({ github, context, core, env }) {
    core.setOutput('validated', 'false');
    const [owner, repo] = process.env.FORK_REPO.split('/');
    
    // 1) Check for 2 commit authors (excluding upstream contributors)
    
    // Get upstream contributors to exclude
    let upstreamLogins = [];
    try {
        const { data: upstreamContributors } = await github.rest.repos.listContributors({
            owner: context.repo.owner,
            repo: context.repo.repo,
            per_page: 100
        });
        upstreamLogins = upstreamContributors.map(c => c.login.toLowerCase());
    } catch (error) {
        console.log('Could not fetch upstream contributors:', error.message);
        // Continue with empty array as fallback
    }
    
    // Skip check if comment was made by an upstream contributor
    const isUpstreamContributor = upstreamLogins.includes(context.actor.toLowerCase());
    
    if (!isUpstreamContributor) {
        // Use Commits API instead of Contributors API (much less caching!)
        let validCommitAuthors = [];
        
        try {
            const { data: commits } = await github.rest.repos.listCommits({
                owner, repo,
                per_page: 100  // Check last 100 commits
            });
            
            // Get unique commit authors excluding upstream contributors
            const commitAuthors = [...new Set(
                commits
                .map(c => c.author?.login)
                .filter(login => login && !upstreamLogins.includes(login.toLowerCase()))
            )];
            
            validCommitAuthors = commitAuthors;
            console.log('Valid commit authors found:', commitAuthors);
            
        } catch (error) {
            console.log('Commits API error:', error.message);
        }
        
        if (validCommitAuthors.length < 2) {
            await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                body: `🚫 Milestone 9 not complete. Found ${validCommitAuthors.length} partner(s) with commits: ${validCommitAuthors.join(', ')}. Both partners need to make commits (upload files, edit files, etc.). Then run \`/done 9\` again. Note this check will fail for person A unless you choose to merge back all changes from person B.`
            });
            return;
        }
        
        console.log(`✅ Found ${validCommitAuthors.length} valid commit authors:`, validCommitAuthors);
    }
    
    // 2) Check for Data folder with files
    let dataFiles = [];
    try {
        const { data: contents } = await github.rest.repos.getContent({
            owner, repo,
            path: 'data'
        });
        
        if (Array.isArray(contents)) {
            dataFiles = contents.filter(item => 
                item.type === 'file' && 
                (item.name.endsWith('.csv') || item.name.endsWith('.txt') || item.name.endsWith('.json'))
            );
        }
    } catch (error) {
        try {
            const { data: contents } = await github.rest.repos.getContent({
                owner, repo,
                path: 'Data'
            });
            
            if (Array.isArray(contents)) {
                dataFiles = contents.filter(item => 
                    item.type === 'file' && 
                    (item.name.endsWith('.csv') || item.name.endsWith('.txt') || item.name.endsWith('.json'))
                );
            }
        } catch (error2) {
            // Data folder doesn't exist
        }
    }
    
    if (dataFiles.length < 2) {
        await github.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.issue.number,
            body: '🚫 Milestone 9 not complete.\n\nCreate a "data" folder and upload at least 2 data files from the Shiny app from two different people. Then run `/done 9` again.'
        });
        return;
    }

    // ✅ Validations passed - now close the data generation issue
    const { data: openIssues } = await github.rest.issues.listForRepo({
        owner, repo,
        state: 'open',
        per_page: 100
    });

    const dataGenIssue = openIssues.find(i => 
        i.title === 'Generate and add research data'
    );

    if (dataGenIssue) {
        await github.rest.issues.update({
            owner, repo,
            issue_number: dataGenIssue.number,
            state: 'closed'
        });

        await github.rest.issues.createComment({
            owner, repo,
            issue_number: dataGenIssue.number,
            body: '✅ This issue has been automatically closed.\n\nMilestone 9 is being completed.'
        });

        console.log(`Automatically closed data generation issue #${dataGenIssue.number}`);
    }

    core.setOutput('validated', 'true');

    // Fetch the latest issue body to avoid stale data
    const { data: currentIssue } = await github.rest.issues.get({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number
    });

    // Update main issue - mark milestone 9 complete
    const updatedBody = currentIssue.body
    .replace(/^(\s*-\s*\[)\s\](\s*9\..*)$/m, '$1x]$2');

    await github.rest.issues.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: updatedBody,
        state: 'open'
    });
    
    // Combined success comment for both milestones
    const completionBodyLines = [
        '**Great job on completing milestone 9** 🎉',
        '',
        'With milestone 9 you have completed the tutorial!',
        'You have accomplished to learn all the fundamentals we wanted you to learn.',
        'You can test your knowledge in milestone 10 or learn more skills in the milestones 10+',
    ];
    
    await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: completionBodyLines.join('\n')
    });
}
