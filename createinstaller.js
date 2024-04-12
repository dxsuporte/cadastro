const Winstaller = require('electron-winstaller')

const start = async () => {
  try {
    await Winstaller.createWindowsInstaller({
      appDirectory: 'build/Cadastro-win32-x64',
      outputDirectory: 'build/installer',
      exe: 'Cadastro.exe',
      setupExe: 'Cadastro.exe',
      setupIcon: 'public/img/favicon.ico',
      iconUrl: 'public/img/favicon.ico',
    })
  } catch (error) {
    console.log(`No dice: ${error.message}`)
  }
}
start()
