#!/usr/bin/env python3
"""
Quickstart Hub - Copy templates to new projects for rapid MVP development.

Usage:
    python quickstart.py                                    # Interactive mode
    python quickstart.py react-spa-supabase ./my-app        # CLI mode
    python quickstart.py --list                             # List templates
    python quickstart.py react-spa-supabase ./my-app --with-git  # With git init
"""

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

TEMPLATES_DIR = Path(__file__).parent / "templates"
EXCLUDE = {
    ".git",
    "node_modules",
    "__pycache__",
    "dist",
    "build",
    ".env.local",
    ".settings.local",
    ".vite",
    ".turbo",
    "coverage",
    "pnpm-lock.yaml",
    "next-env.d.ts",
}


def list_templates() -> list[str]:
    """Discover available templates in templates/ folder."""
    if not TEMPLATES_DIR.exists():
        return []
    return sorted([d.name for d in TEMPLATES_DIR.iterdir() if d.is_dir()])


def print_templates() -> None:
    """Print available templates with descriptions."""
    templates = list_templates()
    if not templates:
        print("No templates found in templates/ folder.")
        return

    print("\nAvailable templates:\n")
    for template in templates:
        readme_path = TEMPLATES_DIR / template / "README.md"
        description = ""
        if readme_path.exists():
            # Try to extract first line after # heading
            with open(readme_path) as f:
                for line in f:
                    if line.startswith(">"):
                        description = line.strip("> \n")
                        break
        print(f"  {template}")
        if description:
            print(f"    {description}")
        print()


def copy_template(template: str, destination: Path) -> None:
    """Copy template to destination, excluding certain files/folders."""
    source = TEMPLATES_DIR / template

    def ignore_patterns(directory: str, files: list[str]) -> list[str]:
        """Return files to ignore during copy."""
        return [f for f in files if f in EXCLUDE]

    shutil.copytree(source, destination, ignore=ignore_patterns)


def init_git(destination: Path) -> None:
    """Initialize git repository in destination."""
    try:
        subprocess.run(
            ["git", "init"],
            cwd=destination,
            check=True,
            capture_output=True,
        )
        print("  Initialized git repository")
    except subprocess.CalledProcessError as e:
        print(f"  Warning: Failed to initialize git: {e}")


def prompt_template() -> str:
    """Interactively prompt user to select a template."""
    templates = list_templates()
    if not templates:
        print("Error: No templates found.")
        sys.exit(1)

    print("\nAvailable templates:\n")
    for i, template in enumerate(templates, 1):
        print(f"  {i}. {template}")

    print()
    while True:
        try:
            choice = input("Select template (number or name): ").strip()
            if choice.isdigit():
                idx = int(choice) - 1
                if 0 <= idx < len(templates):
                    return templates[idx]
            elif choice in templates:
                return choice
            print("Invalid selection. Try again.")
        except (KeyboardInterrupt, EOFError):
            print("\nAborted.")
            sys.exit(1)


def prompt_destination() -> Path:
    """Interactively prompt user for destination path."""
    while True:
        try:
            dest = input("Destination path: ").strip()
            if dest:
                return Path(dest).resolve()
            print("Please enter a path.")
        except (KeyboardInterrupt, EOFError):
            print("\nAborted.")
            sys.exit(1)


def print_next_steps(template: str, destination: Path) -> None:
    """Print post-copy instructions."""
    print(f"\n{'=' * 50}")
    print(f"Template '{template}' copied to {destination}")
    print("=" * 50)
    print("\nNext steps:\n")
    print(f"  cd {destination}")
    print("  pnpm install")
    print("  cp .env.example .env.local")
    print("  # Edit .env.local with your Supabase credentials")
    print("  pnpm dev")
    print()


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Quickstart Hub - Copy templates to new projects",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python quickstart.py --list
  python quickstart.py react-spa-supabase ./my-app
  python quickstart.py react-spa-supabase ./my-app --with-git
        """,
    )
    parser.add_argument("template", nargs="?", help="Template name to copy")
    parser.add_argument("destination", nargs="?", help="Destination path")
    parser.add_argument(
        "--list", "-l", action="store_true", help="List available templates"
    )
    parser.add_argument(
        "--with-git", action="store_true", help="Initialize git in new project"
    )

    args = parser.parse_args()

    # List templates mode
    if args.list:
        print_templates()
        return

    # Get template (interactive or from args)
    template = args.template
    if not template:
        template = prompt_template()

    # Validate template exists
    templates = list_templates()
    if template not in templates:
        print(f"Error: Template '{template}' not found.")
        print(f"Available: {', '.join(templates)}")
        sys.exit(1)

    # Get destination (interactive or from args)
    destination = Path(args.destination).resolve() if args.destination else prompt_destination()

    # Validate destination doesn't exist
    if destination.exists():
        print(f"Error: Destination '{destination}' already exists.")
        sys.exit(1)

    # Copy template
    print(f"\nCopying {template} to {destination}...")
    try:
        copy_template(template, destination)
        print("  Done!")
    except Exception as e:
        print(f"Error copying template: {e}")
        sys.exit(1)

    # Optional git init
    if args.with_git:
        init_git(destination)

    # Print next steps
    print_next_steps(template, destination)


if __name__ == "__main__":
    main()
