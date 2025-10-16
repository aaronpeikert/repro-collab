// .github/scripts/parse.js

module.exports = async function ({ github, context, core, env }) {
  // 1) Grab body and regex all numbered tasks
  const body = context.payload.issue.body || '';
  const taskRe = /^\s*-\s*\[[ x]\]\s*(\d+)\./gm;
  let m, nums = [];
  while ((m = taskRe.exec(body)) !== null) nums.push(parseInt(m[1], 10));
  if (nums.length === 0) return '-1';

  // 2) Determine max number from the list
  const max = Math.max(...nums);

  // 3) Parse the /done M command
  const cmd = (context.payload.comment.body || '');
  const trimmedCmd = cmd.trim();
  
  // Check if this is a single-line comment (no newlines)
  const isSingleLine = !trimmedCmd.includes('\n');
  
  // First try exact match with trim (handles trailing/leading whitespace gracefully)
  const strictMatch = /^\/done\s+(\d+)$/.exec(trimmedCmd);

  // If strict parsing succeeds, use it
  if (strictMatch) {
    const num = parseInt(strictMatch[1], 10);

    // 4) Validate range (must be >= 3 and in the list)
    if (num < 3 || !nums.includes(num)) {
      await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo:  context.repo.repo,
        issue_number: context.issue.number,
        body: `🚫 Invalid milestone number. Please pick a number between 3 and ${max}.`
      });
      return '-1';
    }

    console.log(`Milestone ${num}`);
    // 5) OK—return it
    return String(num);
  }

  // Only provide format hint if it's a single-line comment containing "done"
  // and the actor is not an upstream contributor
  if (isSingleLine && /done/i.test(cmd)) {
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

    // Check if actor is an upstream contributor
    const isUpstreamContributor = upstreamLogins.includes(context.actor.toLowerCase());

    // Only show format hint if not an upstream contributor
    if (!isUpstreamContributor) {
      // User tried to use /done but with incorrect format
      await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo:  context.repo.repo,
        issue_number: context.issue.number,
        body: `⚠️ Your comment contains "done" but doesn't match the required format.\n\n` +
              `**Required format:** \`/done N\` where N is the milestone number (3 or higher)\n\n` +
              `**Common mistakes to avoid:**\n` +
              `- Extra text before the command (e.g., \`I am /done 3\`)\n` +
              `- Missing space after \`/done\` (e.g., \`/done3\`)\n` +
              `- Additional text after the number (e.g., \`/done 3 now\`)\n` +
              `- Using backslashes instead of forward slash (e.g., \`\\done 3\`)\n\n` +
              `Please comment again with the correct format.`
      });
    }
  }
  return '-1';
};
