# Contributing to Reproducible Research Workshop

Thank you for your interest in contributing to our reproducible research workshop! This project teaches collaborative academic writing using GitHub through an interactive, self-paced online experience.

## Quick Start for Workshop Participants

### Simple Workshop Participation

If you just want to participate in the workshop:

1. **Fork this repository** - A simple fork will automatically start the workshop
2. **Enable Issues** in your fork (Settings → Features → Issues checkbox)
3. **Follow the automated instructions** that will appear in issues created in the main repository

The workshop system will automatically create tracking issues and guide you through the collaborative writing process.

### Hosting Your Own Workshop

If you want to use your fork as the base for hosting additional workshops (where others can fork from your repository), you'll need to set up GitHub Personal Access Tokens (PATs).

#### Required GitHub PATs

You need **two different GitHub PATs** with specific permissions:

##### 1. Cross-Repository PAT (`GH_PAT_CROSSREPO`)

- **Type**: Classic Personal Access Token
- **Required Scopes**: `public_repo`, `read:project`
- **Purpose**: Allows the workshop automation to create issues and comments in the main repository when someone forks your repository

##### 2. Upstream PAT (`GH_PAT_UPSTREAM`)

- **Type**: Fine-grained Personal Access Token
- **Target**: Your forked repository
- **Required Permissions**:
  - **Read access**: actions, commit statuses, metadata, pull requests
  - **Read and Write access**: contents, issues
- **Purpose**: Allows the workshop automation to manage the workflow within your forked repository

#### Setting up PATs

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Create both tokens with the permissions specified above
3. Add them as repository secrets in your fork:
   - `GH_PAT_CROSSREPO` (classic token)
   - `GH_PAT_UPSTREAM` (fine-grained token)

If you already have a `GH_PAT_CROSSREPO` secret, create a new classic token with both required scopes and replace the existing repository secret.

#### Activate GitHub Actions

In your fork, go to _Actions_ and activate Actions.
There are a couple of maintainance actions that use time-based triggers; if you want those you have to activate them seperately.

#### Activate GitHub Pages

You need to run the action `publish.yml` and activate _GitHub Pages_.

## License

This project is released under the **CC0 1.0 Universal** license, which means it is dedicated to the public domain. You can:

- Use, modify, and distribute the work freely
- Use it for any purpose, including commercial purposes
- No attribution required (though appreciated)

See [LICENSE.md](LICENSE.md) for the full license text.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all participants. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

Key points:

- Be respectful and inclusive
- Focus on constructive feedback
- Report issues to <peikert@mpib-berlin.mpg.de>
- All community interactions are covered by this code

## Development Setup

### Prerequisites

- R (≥ 4.5.0)
- RStudio (recommended)
- Git
- Make (for build automation)

### Local Development

1. **Clone the repository**:

```bash
git clone https://github.com/your-username/repro-collab.git
cd repro-collab
```

2. **Restore R dependencies**:

 ```bash
 make renv
 # or directly: Rscript -e "renv::restore()"
 ```

3. **Build the workshop site**:

```bash
make publish/
```

### Docker Development

The project includes Docker support for reproducible development:

```bash
docker build -f Dockerfile .
```

Uses `rocker/verse:4.5.0` base image with `renv` for dependency management.

## Project Structure

```
├── self-paced-source/          # Bookdown source files
│   ├── index.Rmd              # Main entry point
│   ├── *.Rmd                  # Workshop chapters
│   ├── functions.R            # Helper functions
│   ├── _bookdown.yml          # Bookdown configuration
│   └── _output.yml            # Output format configuration
├── .github/workflows/         # GitHub Actions automation
│   ├── start.yml             # Fork-triggered welcome
│   ├── continue.yml          # Milestone tracking
│   └── publish.yml           # Site publishing
├── data/                      # CSV data files for examples
├── R/                         # R package functions
└── publish/                   # Final publication directory
```

## Contributing Guidelines

### Bug Reports

1. Check existing issues first
2. Use the issue template if available
3. Include:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (OS, R version, etc.)

### Feature Requests

1. Open an issue to discuss the feature first
2. Explain the use case and benefits
3. Consider backward compatibility
4. Be prepared to implement or help implement

### Code Contributions

1. **Fork and create a feature branch**:

```bash
git checkout -b feature/your-feature-name
```

2. **Follow existing code style**:

- Update relevant `.Rmd` files for content changes
- Update `CLAUDE.md` for development workflow changes
- Keep function documentation current
- Test that all cross-references work

## Workshop Content Guidelines

### Writing Style

- Use clear, scientific language
- Include practical examples
- Make content self-paced
- Provide clear next steps

### Technical Approach

- **Sequential Collaboration**: Teams work one after another
- **Weaker Person's Fork**: Use less experienced person's repository
- **UI-First**: All interactions through GitHub web interface
- **Practical Application**: Real preregistration writing and data collection

### Interactive Elements

- Use whisker templates for dynamic content
- Include progress tracking
- Provide clear success/failure feedback
- Test all automated workflows

## Release Process

1. Test the full workshop workflow
2. Update version numbers if applicable
3. Create a release tag
4. Update documentation
5. Announce changes

## Getting Help

- **Workshop Issues**: Create an issue in this repository
- **Development Questions**: Check existing issues or create new ones
- **Code of Conduct Issues**: Contact peikert@mpib-berlin.mpg.de
- **General Questions**: Open a discussion

## Recognition

Contributors will be acknowledged in the workshop materials. By contributing, you agree to the CC0 license terms and help make reproducible research more accessible to everyone.

🎉 Thank you for helping to improve reproducible research practices! 🎉
