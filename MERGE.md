# How to Merge `feature/frontend-development` to `main`

## 🚀 GitHub Pull Request (Recommended)

1. **Push your branch to GitHub** (if not already pushed):
   ```bash
   git push origin feature/frontend-development
   ```
2. **Go to your repository on GitHub**
3. You should see a prompt to create a Pull Request for `feature/frontend-development`
4. Click **"Compare & pull request"**
5. Add a descriptive title and summary (see commit message for inspiration)
6. Click **"Create pull request"**
7. After review, click **"Merge pull request"**
8. Delete the branch if desired

---

## 🛠️ GitHub CLI (Terminal)

1. **Push your branch to GitHub** (if not already pushed):
   ```bash
   git push origin feature/frontend-development
   ```
2. **Create a pull request from the terminal:**
   ```bash
   gh pr create --base main --head feature/frontend-development --title "feat(frontend): build modern chat UI with Next.js, streaming, and OpenAI integration" --body "Adds a modern, responsive chat frontend with streaming OpenAI integration. See commit for details."
   ```
3. **Merge the pull request:**
   ```bash
   gh pr merge --merge
   ```

---

## 📝 Notes
- Always review the PR before merging.
- Make sure both backend and frontend work as expected after merging.
- If you have any issues, check the commit history or ask for help! 