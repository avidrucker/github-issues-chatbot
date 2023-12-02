const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

async function postGreeting() {
  const issueNumber = process.env.ISSUE_NUMBER;
  const repoName = process.env.GITHUB_REPOSITORY;
  const issueCreator = process.env.ISSUE_CREATOR;

  if (!issueNumber || !repoName || !issueCreator) {
    console.error('Required environment variables are missing');
    process.exit(1);
  }

  const [owner, repo] = repoName.split('/');

  // query for contributions guidelines
  const response = await octokit.repos.getContent({
    owner: owner,
    repo: repo,
    path: 'CONTRIBUTING.md'
  });

  // extract the link to the contribution guidelines
  const contributionsLink = response.data.html_url;

  const contributionDocInfoString = contributionsLink ? `Please follow our [contribution guidelines](${contributionsLink}).` : `This repository does not yet have a contribution guidelines document.`;

  const message = `Hello @${issueCreator}! Thanks for creating an issue. ${contributionDocInfoString} If you have any questions, feel free to create new issues.`;

  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body: message
  });
}

postGreeting().catch(err => console.error(err));

