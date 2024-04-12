const Winstaller = require('electron-winstaller')

const start = async () => {
  try {
    await Winstaller.createWindowsInstaller({
      appDirectory: 'build/Cadastro-win32-x64',
      outputDirectory: 'build/installer64',
      authors: 'DX Suporte - Danilo Xavier',
      noMsi: true,
      exe: 'Cadastro.exe',
      setupExe: 'Cadastro.exe',
      setupIcon: './public/img/favicon.ico',
    })
  } catch (error) {
    console.log(`No dice: ${error.message}`)
  }
}
start()
