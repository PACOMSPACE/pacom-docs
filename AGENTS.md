# PACOM documentation project instructions

## Project

- This is PACOM's public documentation site, built on Mintlify.
- The repository is `PACOMSPACE/pacom-docs`; the publishing branch is `main`.
- Use Simplified Chinese for the initial site.
- Keep two top-level entries: 产品文档 for customers, installers, and operators; 开发文档 for developers and integrators.
- Pages are MDX files with YAML frontmatter. Site configuration is in `docs.json`.
- Use the Mintlify `mint` theme and PACOM's approved light/dark logo assets. The brand navy is `#202A44`.

## Content

- Keep sentences concise and explain the next action clearly.
- Use bold text for UI labels and code formatting for file names, commands, paths, and identifiers.
- Use verified product manuals and interface specifications for technical claims.
- Do not invent product specifications, API endpoints, authentication methods, protocol support, or release status.
- Keep customer/project records, credentials, commercial materials, and internal planning out of this public site.
- Until product-specific sources are selected, limit content to general preparation guidance and navigation.

## Maintenance

- Check Mintlify's official documentation for component and configuration behavior.
- Update navigation when adding pages and check referenced files and internal links.
- Keep the original template license when retaining template code.
- Preview and validate changes with the current `mint` CLI before publication when available.
