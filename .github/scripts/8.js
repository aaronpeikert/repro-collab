module.exports = async function ({ github, context, core, env }) {
    // Cross off "8.", reveal "9."
    const updatedBody8 = context.payload.issue.body
    .replace(/^(\s*-\s*\[)\s\](\s*8\..*)$/m, '$1x]$2')
    + '\n- [ ] 9. Generate and Upload Steven Data - 🔴 Hard';
    
    await github.rest.issues.update({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: updatedBody8,
        state: 'open'
    });
    
    // Create data generation issue in the fork
    const [owner, repo] = process.env.FORK_REPO.split('/');
    const preregistrationUrl = context.payload.issue.html_url;
    
    const dataGenIssue = await github.rest.issues.create({
        owner, repo,
        title: 'Generate and add research data',
        body: [
            '## Collaborative Task: Generate and add data',
            '',
            'For some of the options in this milestone, it\'s important to understand the **difference between Git and GitHub**.',
            'GitHub — where we are now — is a platform built around the version control system Git. You can think of GitHub as cloud storage with collaboration tools, while Git is the underlying system that tracks changes to your files and lets you roll back to earlier versions when needed.', 
            '', 
            'So far, we\'ve only used GitHub to interact with Git in this workshop. In real projects, you’ll also use **Git locally** on your computer to track progress (via commits) and then **push** your changes to GitHub so others can access and contribute. Keep this distinction in mind when evaluating the options below.',
            '', 
            'Before starting, decide between yourselves:',
            '- **Person A:** The **more** experienced',
            '- **Person B:** The **less** experienced',
            '',
            '*Important:* From now on, only Person B can respond with `/done NUMBER`.',
            '',
            '### Step 1: Both Generate Data',
            `Both of you should visit [experiment](https://${context.repo.owner}.github.io/${context.repo.repo}/steven) and **each generate at least 20 trials independently**.`,
            '',
            '- Person A: Generate ≥20 trials',
            '- Person B: Generate ≥20 trials', 
            '- Total: ≥40 trials minimum',
            '',
            '**Note:** The app may take a moment to load (or a long moment depending on internet speed). Please be patient until it is ready.',
            '',
            '### Step 2: Grant Access for Person A',
            '',
            '**Option 1: Add as collaborator (easy)**',
            '1. Person B (repository owner) adds Person A as a collaborator.',
            `2. Person B goes to [Settings → Manage access → Add people.](https://github.com/${owner}/${repo}/settings/access)`,
            '3. Person B enters Person A\'s GitHub username and sends the invitation.',
            '4. Person A checks email or GitHub notifications for the invitation.',
            '5. Person A accepts the invitation.',
            '6. Once accepted, both can directly push changes to the repository.',
            '',
            '**Option 2: Person A works via branch and Pull Request (hard)**',
            '1. Person A makes changes on their branch.',
            `2. Person A creates a pull request after uploading data. [Pull requests → New pull request.](https://github.com/${owner}/${repo}/pulls). Select as base repository person B's repo.`,
            '3. Person B reviews and merges the pull request.',
            '',
            '### Step 3: Both Upload Your Data Files',
            '',
            '**Each person uploads their own generated data to the `data` folder.**',
            '',
            '**Option 1: Drag & Drop (easy)**',
            '1. Navigate to the repository.',
            '2. Go to or create the `data` folder.',
            '3. Click "Add file" → "Upload files".',
            '4. Drag your data files into the upload area.',
            '5. Add a commit message (e.g., "Add Person A/B data") and commit.',
            '',
            '**Option 2: Via github.dev (medium)**',
            `1. Open https://github.dev/${owner}/${repo}/`,
            '2. Drag and drop your data files into the data folder.',
            '3. Go to the Git tab, add a commit message and commit/push.',
            '',
            '**Option 3: Via local git (hard)**',
            '1. Clone the repository locally.',
            '2. Add your data files to the data folder.',
            '3. Add, commit & push.',
            '',
            '<img src="https://raw.githubusercontent.com/aaronpeikert/repro-collab/main/assets/data_PR.gif" alt="Upload data files GIF">',
            '',
            '### Step 4: Close this issue',
            `Once both have uploaded the data file (2 files total), Person B returns to ${preregistrationUrl} and comment \`/done 9\` to continue.`,
            ''
        ].join('\n')
    });
    
    
    // Success comment with link to the data generation issue
    const milestone8BodyLines = [
        '🎉 Congratulation!',
        '',
        '**Milestone 9 - 🔴 Hard is now available: Generate data together**',
        '',
        'In this milestone, you will:',
        '1. Use the experiment app to generate data',
        '2. Upload the data files to the `data` folder in the **less experienced** partner\'s fork',
        '3. Collaborate on managing the data',
        '',
        '**Important:** Only the less experienced GitHub user should run `/done 9` after completing all tasks.',
        '',
        `📋 Guide for generating and uploading data: ${dataGenIssue.data.html_url}`,
        '',
        'Please read it together before proceeding.'
    ];
    
    
    await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: milestone8BodyLines.join('\n')
    });
}
