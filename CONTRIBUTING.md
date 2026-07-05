# Contributing to Zameen360

First of all, thank you for your interest in contributing to Zameen360!

I welcome contributions that improve the project, fix bugs, add features, improve documentation.
## Getting Started

### 1. Fork the Repository

Fork the repository to your own GitHub account and clone it:

```bash
git clone https://github.com/<your-username>/Zameen360.git
cd Zameen360
```

### 2. Install Dependencies

Install the dependencies for each project.

```bash
# Client
cd client
npm install

# Server
cd ../server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the server directory.

Use the provided `.env.example` as a reference.

Never commit your `.env` file!

## Creating a Branch

Create a new branch for every feature or bug fix.

```bash
git checkout -b feature/awesome-feature
```

Donot commit directly to the `main` branch.

## Coding Guidelines

* Write clean and readable code.
* Use meaningful variable and function names.
* SPA 
* Remove unused imports and variables.
* Follow the existing project structure.
* Add comments only where they improve understanding.

## Commit Messages

Use clear and descriptive commit messages.

Examples:

```
feat: add AI property description generation
fix: resolve property image upload issue
refactor: simplify authentication middleware
docs: update README
style: format code with Prettier
```

## Before Submitting

Before creating a Pull Request:

* Ensure the project builds successfully.
* Test your changes.
* Resolve merge conflicts.
* Remove debugging code and console logs.
* Ensure no secrets or API keys are committed.

## Pull Request Guidelines

When opening a Pull Request:

* Clearly describe what was changed.
* Explain why the change was made.
* Include screenshots for UI changes when applicable.
* Keep Pull Requests focused on a single feature or fix.

## Reporting Issues

When reporting an issue, please include:

* A clear description
* Steps to reproduce
* Expected behavior
* Actual behavior
* Screenshots (if applicable)

## Code of Conduct

Be respectful

* Respectful communication
* Helpful feedback
* Collaboration
* Professionalism

## Questions

If you have questions about the project, feel free to open an issue before starting major work.

Happy coding!
