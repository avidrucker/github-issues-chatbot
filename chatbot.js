const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

async function postGreeting() {
  const issueNumber = process.env.ISSUE_NUMBER;
  const repoName = process.env.GITHUB_REPOSITORY;

  if (!issueNumber || !repoName) {
    console.error('Required environment variables are missing');
    process.exit(1);
  }

  const [owner, repo] = repoName.split('/');

  const message = `Hello! Thanks for creating an issue. Please follow our [contribution guidelines](LINK_TO_YOUR_GUIDELINES). If you have any questions, feel free to create new issues.`;

  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body: message
  });
}

postGreeting().catch(err => console.error(err));

