var FOLDER_TO_DELETE = '/export/Snapshots/Security';
var IGNORE_HOST = ["cdb3-tst.cup.overheid.nl"];

// === P L U M B I N G ===
const {
  filesystemDirectoryDelete, hosts, hostName
} = xdmp
const messages = []

const fullPath = FOLDER_TO_DELETE;
const hostList = Array.from(hosts()).map(x => hostName(x)).filter(x => !IGNORE_HOST.includes(x));
// Create the directories on all hosts!
hostList.forEach((h) => {
  const path = `file://${h}/${fullPath}`;
  try {
    // TODO: Check if this is a backup. Only permit deletion of backups
    filesystemDirectoryDelete(path);
    messages.push(`Deleting backup directory [${path}]`);
  } catch (e) {
    messages.push(`Error deleting directory [${path}]: ${e}`);
  }
});
messages.join("\n");
