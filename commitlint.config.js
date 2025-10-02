module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "type-enum": [
            2,
            "always",
            [
                "feat",     // New feature
                "fix",      // Bug fix
                "docs",     // Documentation only changes
                "style",    // Changes that do not affect the meaning of the code
                "refactor", // Code change that neither fixes a bug nor adds a feature
                "perf",     // Performance improvements
                "test",     // Adding or updating tests
                "build",    // Changes to build system or dependencies
                "ci",       // Changes to CI configuration
                "chore",    // Other changes that don't modify src or test files
                "revert",   // Reverts a previous commit
            ],
        ],
        "type-case": [2, "always", "lower-case"],
        "type-empty": [2, "never"],
        "subject-empty": [2, "never"],
        "subject-full-stop": [2, "never", "."],
        "subject-case": [0], // Allow any case for subject
        "header-max-length": [2, "always", 100],
    },
};

