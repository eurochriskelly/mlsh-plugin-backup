const LEVEL = 3; // Specify the depth of directory traversal
const START = "/export/Snapshots"; // Starting directory
const EXTRA_IGNORE = ["MarkLogic.old", "MarkLogic"];

// === P L U M B I N G ===
const { filesystemDirectory } = xdmp;
// List of directories to ignore
const ignoreFolders = [
  ...EXTRA_IGNORE,
  "/boot", "/dev", "/home", "/proc", "/run", "/sys", "/tmp", "/var", "/etc",
  "/root", "/usr", "/bin", "/sbin", "/lib", "/lib64", "/media", "/srv", "/.autorelabel",
];

// Function to normalize path and check against ignore list
const shouldIgnore = (path) => {
  const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path;
  const parts = normalizedPath.split("/");
  const isIgnored = parts.some((part) => ignoreFolders.includes(part));
  return isIgnored;
};

// Function to get directories up to a specified depth
const getDirectories = (top, level) => {
  if (level > LEVEL) return []; // Stop recursion when the max level is exceeded
  const currentDirs = Array.from(filesystemDirectory(top));
  let result = [];
  currentDirs.forEach((dir) => {
    // if any of part of the ignore list is in the current path, skip it
    if (shouldIgnore(dir.pathname)) return;
    result.push(dir.pathname); //  Add current path
    result = result.concat(getDirectories(dir.pathname, level + 1)); // Recurse deeper
  });
  return result;
};

// Generate the directory list
const directoryList = getDirectories(START, 1);

// Display results
directoryList.join("\n");

