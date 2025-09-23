# Git

This is our approach to Git.

### How to Contribute

1. **Fork the Repository**: Start by forking the repository to your own GitHub account.
2. **Clone the Fork**: Clone your forked repository to your local machine using:
   ```bash
   git clone
   cd <your-forked-repo>
   ```
3. **Create a Branch**: Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-or-bugfix-name
   ```

(The Github CLI streamlines this process with `gh repo fork` and `gh repo clone` commands! We recommend using it. Check out [GitHub CLI](https://cli.github.com/) for more details.)

4. **Make Changes**: Make your changes in the codebase. Ensure your code follows the project's coding style (Prettier) and conventions(ESLint).
5. **Test Your Changes**: Please run exhaustive tests before committing your code.
6. **Commit Your Changes**: Commit your changes with a clear and descriptive commit message:

   ```bash
   git add .
   git commit -m <conventional-commit>
   ```

   We follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages. Here are some examples:
   - `feat: add new feature`
   - `fix: fix a bug`
   - `docs: update documentation`
   - `style: improve code formatting`
   - `refactor: refactor code without changing functionality`

7. **Push Your Changes**: Push your changes to your forked repository:
   ```bash
   git push origin feature-or-bugfix-name
   ```
8. **Create a Pull Request**: Go to the original repository and create a pull request from your forked repository. Provide a clear description of your changes and reference any related issues.
9. **Address Feedback**: Be responsive to any feedback or requests for changes from the project maintainers. Make necessary updates and push them to your branch.

Once again! Thank you for considering contributing to this project. Your efforts help make it better for everyone! If you have any questions or need assistance, feel free to reach out to the project maintainers.
