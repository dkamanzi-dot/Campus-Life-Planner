# Campus Life Planner

A simple web app to help students track their tasks, manage time, and never miss a deadline.

Built with plain HTML, CSS and JavaScript — no frameworks.

## Demo Video link
https://youtu.be/XMw7dIUaaP4

## Live Site
https://dkamanzi-dot.github.io/Campus-Life-Planner

## What it does
- Add tasks with a title, due date, duration and tag
- Edit or delete any task
- Search tasks by typing a word or regex pattern
- Sort tasks by date, title or duration
- See total tasks and total time on the Dashboard
- Save a weekly time target in Settings
- Export your tasks as a JSON file
- Import tasks from a JSON file
- All data is saved in the browser automatically

## How to use
1. Open the live site link above
2. Click Add Task to create your first task
3. Click Tasks to see all your tasks
4. Use the search bar to filter tasks
5. Go to Settings to export or import data

## How to load sample data
1. Go to Settings
2. Click Import JSON
3. Select the seed.json file from the project folder
4. Click Tasks to see the 10 sample tasks

## How to run locally
1. Download or clone this repo
2. Open the folder in VS Code
3. Right click index.html and click Open with Live Server

## Regex rules used

 Field : What it checks |

 Title : No leading or trailing spaces |
 Duration : Valid number like 90 or 1.5 |
 Due Date :Must be in YYYY-MM-DD format |
 Tag : Only letters, spaces or hyphens |
 Duplicate Word : Catches repeated words like "the the" |

## Keyboard navigation
- Press Tab to move between buttons and links
- Press Enter to click the focused item
- Press Shift + Tab to go backwards

## Accessibility
- Skip to main content link at the top
- All form inputs have labels
- Error messages are announced to screen readers
- Visible focus styles on all buttons and links
- Works on mobile, tablet and desktop
