module.exports = async function ({ github, context, core, env }) {
    const UpOctokit = github.constructor;
    const up = new UpOctokit({ auth: env.UPSTREAM_TOKEN });     // upstream PAT
    const x  = new UpOctokit({ auth: env.CROSSREPO_TOKEN });    // cross-repo PAT
    
    const [forkOwner, forkRepo] = (process.env.FORK_REPO || '').split('/');
    if (!forkOwner || !forkRepo) {
        throw new Error('FORK_REPO missing or malformed');
    }
    
    const targetprereg = 'preregistration needed';
    
    // ------- 5.1 Verify "Create your own first issue" is closed in the fork
    const { data: issues } = await x.rest.issues.listForRepo({
        owner: forkOwner, repo: forkRepo, state: 'all', per_page: 100
    });
    
    const intro = issues.find(i => i.title.toLowerCase() === 'create your own first issue');
    
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
    
    let foundprereg = issues.find(i => i.title.toLowerCase() === targetprereg)
    || issues.find(i => lev(i.title.toLowerCase(), targetprereg) <= 3);
    
    if (!intro || intro.state !== 'closed') {
        const url = intro ? intro.html_url : `https://github.com/${forkOwner}/${forkRepo}/issues`;
        const msg = (foundprereg && foundprereg.state !== 'open')
        ? `🚫 Milestone 5 not complete. You have instead closed "preregistration needed" but this task is not done yet, please reopen it and close ["Create your own first issue"](${url}) in your fork, then run \`/done 5\` again.`
        : `🚫 Milestone 5 not complete. Please close ["Create your own first issue"](${url}) in your fork, then run \`/done 5\` again.`;
        
        await x.rest.issues.createComment({
            owner: context.repo.owner, repo: context.repo.repo, issue_number: context.issue.number, body: msg
        });
        return; // stop here
    }
    
    // ------- 5.2 Prepare data for branch creation in upstream
    const issueBody = context.payload.issue.body || '';
    const shaMatch = issueBody.match(/Fork sha:\s*`([a-f0-9]{40})`/);
    if (!shaMatch) throw new Error('Could not find fork SHA in issue body');
    const forkSha = shaMatch[1]; // (You read it; below we start from main, as in your original)
    
    const timestamp  = Date.now();
    const branchName = `preregistration/pr-${context.actor}-${timestamp}`;
    
    // ------- 5.3 Create branch and commit in upstream (using UPSTREAM token)
    const { data: mainRef } = await up.rest.git.getRef({
        owner: context.repo.owner, repo: context.repo.repo, ref: 'heads/main'
    });
    const mainSha = mainRef.object.sha;
    
    await up.rest.git.createRef({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: `refs/heads/${branchName}`,
        sha: forkSha
    });
    
    const { data: preregDraft } = await up.rest.repos.getContent({
        owner: context.repo.owner, repo: context.repo.repo, path: 'prereg_draft.md'
    });
    const preregistrationContent = Buffer.from(preregDraft.content, 'base64').toString();
    const contentWithoutFirstLine = preregistrationContent.split('\n').slice(1).join('\n');

    // get current file sha if exists on new branch
    let fileSha = null;
    try {
        const { data: file } = await up.rest.repos.getContent({
            owner: context.repo.owner, repo: context.repo.repo, path: 'preregistration.md', ref: branchName
        });
        fileSha = file.sha;
    } catch (e) { /* not existing is fine */ }
    
    await up.rest.repos.createOrUpdateFileContents({
        owner: context.repo.owner, repo: context.repo.repo, path: 'preregistration.md',
        message: `Update preregistration for ${context.actor}`,
        content: Buffer.from(contentWithoutFirstLine).toString('base64'),
        branch: branchName, sha: fileSha
    });
    
    // ------- 5.4 Create PR in the fork (using CROSSREPO token)
    // find the user's prereg issue in fork
    const { data: recent } = await x.rest.issues.listForRepo({
        owner: forkOwner, repo: forkRepo, state: 'all', per_page: 10, sort: 'created', direction: 'desc'
    });
    let preregIssue = recent.find(i => i.title.toLowerCase() === targetprereg)
    || recent.find(i => lev(i.title.toLowerCase(), targetprereg) <= 3);
    
    // fork default branch
    const { data: forkData } = await x.rest.repos.get({ owner: forkOwner, repo: forkRepo });
    const forkDefaultBranch = forkData.default_branch;
    
    const prBodyLines = [
        '### Congratulations on completing milestone 5!',
        '',
        "Next, we'll have a look at the draft of the preregistration that your (imaginary) collaborators have prepared.",
        'But before doing so, let\'s learn how this situation came about.',
        '',
        'To do so, we need to introduce **branches**. Branches allow collaborators to work independently yet simultaneously on the same project.',
        'How? Each branch is a parallel version of the project where changes can be made without affecting the official version of the project.',
        'The **main branch** usually represents the official version of the project, i.e., the one that reflects the current consensus.',
        'For example, each collaborator might use their own branch to draft sections of a paper, experiment with changes, or revise text without disrupting others\' work.',
        '',
        'Once work in a branch is ready, your collaborators (or you) can create a **pull request (PR)**, which is the main tool for requesting feedback on GitHub.',
        'A pull request shows the changes made in a branch line-by-line and invites collaborators to review, discuss, and suggest improvements.',
        'When the changes are deemed good, they can be added to the official version.',
        'This step is called **merging**: it combines the separate branch with the main branch so that both contain the same version of the project.',
        '\n',
        `You're now inside such a pull request: Your collaborators are waiting for your feedback on their preregistration draft.`,
        preregIssue ? `This PR closes #${preregIssue.number} (${preregIssue.title}).` : '',
        '\n',
        '**Task:** Suggest a change to the preregistration file',
        '1. Go to the **Files changed** tab of this PR.',
        '2. Find the typo in line 12 ("empierically").',
        '3. Click the **"+"** button next to the line.',
        '4. Click the **"Add a Suggestion"** button next to the line. Look for this symbol:',
        '<picture>',
        '  <source srcset="https://raw.githubusercontent.com/aaronpeikert/repro-collab/main/assets/addASuggestionSymbol.png" media="(prefers-color-scheme: dark)">',
        '  <img src="https://raw.githubusercontent.com/aaronpeikert/repro-collab/main/assets/addASuggestionSymbol_white.png" alt="add Suggestion symbol">',
        '</picture>',
        '\n',
        '**Note**: If you are not completely sure how to do it, please refer to the GIF at the end of this comment.',
        '',
        `**Afterwards:** Once you've suggested your change, return to ${context.payload.issue.html_url} and comment \`/done 6\` to continue`,
        '',
        '<img src="https://raw.githubusercontent.com/aaronpeikert/repro-collab/main/assets/make_suggestion.gif" alt="Make Suggestion GIF">'
    ].filter(Boolean);
    
    const { data: pr } = await x.rest.pulls.create({
        owner: forkOwner,
        repo: forkRepo,
        title: 'Review this preregistration update',
        head: `${context.repo.owner}:${branchName}`,  // upstream:branch -> fork:base
        base: forkDefaultBranch,
        body: prBodyLines.join('\n'),
        maintainer_can_modify: true
    });
    
    // ------- 5.5 Update upstream issue checklist & comment (either client works; use x)
    const updatedBody5 =
    (context.payload.issue.body || '')
    .replace(/^(\s*-\s*\[)\s\](\s*5\..*)$/m, '$1x]$2')
    + '\n- [ ] 6. Add a suggestion to the PR - 🟡 Medium';
    
    await x.rest.issues.update({
        owner: context.repo.owner, repo: context.repo.repo, issue_number: context.issue.number,
        body: updatedBody5, state: 'open'
    });
    
    const milestone5BodyLines = [
        '🎉 Milestone 5 complete - "Close an issue"!',
        '',
        `**Task:** Milestone 6 - 🟡 Medium is now available. Review the pull request (PR) I created in your fork: ${pr.html_url}`,
        '',
        "Add a suggestion to improve the code using GitHub's suggestion feature, more detail in our PR.",
        '',
        '**Afterwards:** Comment `/done 6` here.',
    ];
    
    await x.rest.issues.createComment({
        owner: context.repo.owner, repo: context.repo.repo, issue_number: context.issue.number,
        body: milestone5BodyLines.join('\n')
    });
}

