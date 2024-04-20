const CONF = {
  defined: true,
  message: 'RUN SESSION SCRIPT!',
  path: '/exports',
  bkupDir: 'Snapshots',
  databases: {
    content: 'cup-content',
    security: 'Security'
  },
  hostDirs: [],
}

const { path, bkupDir } = CONF
CONF.fullPath = `${path}/${bkupDir}`
CONF.ENV.loc.hosts.forEach(h => {
  CONF.hostDirs.push(`file://${h}${path}`)
})

xdmp.setServerField('MLSH_BACKUP_SESSION', JSON.stringify(CONF))
CONF
