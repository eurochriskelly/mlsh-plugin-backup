// Backup a database
var DATABASES = ["Security", "Schemas"]
var PATH = "/export/Snapshots";
var IGNORE_HOST = [ 'cdb3-tst.cup.overheid.nl' ]
 
// === P L U M B I N G ===
const main = () => {
  const messages = [];
  const {
    databaseForests, database, filesystemDirectoryCreate,
    hosts, hostName, databaseBackup
  } = xdmp
  messages.push("Back up script started ...");

  const fullPath = PATH;
  DATABASES.forEach(db => {
    const forests = databaseForests(database(db));
    const hostList = Array.from(hosts()).map(x => hostName(x)).filter(x => !IGNORE_HOST.includes(x));
    // Create the directories on all hosts!
    hostList.forEach((h) => {
      // Create the backup parent directory if it doesn't exist
      filesystemDirectoryCreate(`file://${h}${fullPath}`);
      const path = `file://${h}/${fullPath}/${db}`;
      messages.push(`Creating backup directory [${path}]`);
      filesystemDirectoryCreate(path);
    });

    messages.push(`Backing up database [${db}]`);
    let backupId;
    try {
      messages.push(`Creating database now up database [${db}]`);
      messages.push(`Found ${fn.count(forests)} forests`);
      messages.push(`Backing up forests with ids [${Array.from(forests).join(", ")}]`);
      backupId = databaseBackup(
        forests, // Forest ids
        `${fullPath}/${db}`, // Backup directory created above
        false, // No journal archiving
        null,
      );
      messages.push("Backup started successfull with id " + backupId);
    } catch (e) {
      messages.push(`Error occurred: [${e}]`);
      backupId = e.name;
    }

    //returns the oneTime backup
    if (`${backupId}`.startsWith("XDMP-")) {
      messages.push(`Error backing up [${backupId}]. Try clearing space first!`);
    }
  })
  return {
    startedAt: new Date(),
    messages,
  };
};

const res = main();
`
startedAt: ${res.startedAt}
messages: 
${res.messages.map(x => `>  ${x}`).join('\n')}
`
