# Contributing to deca-delay

Thank you for your interest in contributing to deca-delay! This document provides guidelines and instructions for contributing.

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/deca-delay.git
   cd deca-delay
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run tests to verify setup:
   ```bash
   npm test
   ```

## Development Workflow

### Creating a Feature Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/{epic}-{feature-name}
```

### Making Changes

1. Make your changes following the project's coding standards
2. Follow SOLID principles
3. Write tests for new functionality
4. Ensure all tests pass:
   ```bash
   npm test
   ```

### Committing Changes

Use conventional commit messages:

```
type(scope): description

Types: feat, fix, docs, test, chore, refactor
Scopes: delay, random, until, build, docs, tests
```

Examples:
- `feat(delay): add new delay feature`
- `fix(until): handle edge case in timeout`
- `docs(readme): update API documentation`
- `test(random): add tests for edge cases`

### Creating a Pull Request

1. Push your branch:
   ```bash
   git push -u origin feature/{epic}-{feature-name}
   ```

2. Create a PR on GitHub with:
   - Clear title describing the change
   - Description of what changed and why
   - Link to any related issues

## Publishing (Maintainers Only)

### Pre-publish Checklist

- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Package contents look correct: `npm pack --dry-run`
- [ ] Version bumped appropriately

### Version Bumping

```bash
# Patch release (bug fixes): 1.0.0 -> 1.0.1
npm version patch

# Minor release (new features): 1.0.0 -> 1.1.0
npm version minor

# Major release (breaking changes): 1.0.0 -> 2.0.0
npm version major
```

### Publishing to NPM

```bash
# Login to NPM (one-time setup)
npm login

# Publish the package
npm publish

# If using a scoped package name
npm publish --access public
```

### Post-publish

1. Push the version tag:
   ```bash
   git push origin main --tags
   ```

2. Create a GitHub release with release notes

### Checking Package Name Availability

Before publishing a new package, check if the name is available:

```bash
npm view deca-delay
```

If the name is taken, consider using a scoped name:
- `@yourusername/deca-delay`

## Code Style

- Use TypeScript strict mode
- Avoid `any` type - use `unknown` with type guards
- Keep functions focused (Single Responsibility Principle)
- Write descriptive JSDoc comments for public APIs
- Use meaningful variable and function names

## Testing Guidelines

- Write tests for all new functionality
- Use descriptive test names: `it('should do X when Y')`
- Test edge cases and error conditions
- Aim for >90% code coverage

## Questions?

Feel free to open an issue if you have questions about contributing!
