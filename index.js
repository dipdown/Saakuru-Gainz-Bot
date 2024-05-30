const colors = require('colors');
const readlineSync = require('readline-sync');
const fs = require('fs');
const { getTasks, claimTask, getProfile } = require('./api');

(async () => {
  try {
    process.stdout.write('\x1Bc');
    console.log(colors.cyan(`
███████  █████   █████  ██   ██ ██    ██ ██████  ██    ██      ██████ ██       █████  ██ ███    ███ ███████ ██████  
██      ██   ██ ██   ██ ██  ██  ██    ██ ██   ██ ██    ██     ██      ██      ██   ██ ██ ████  ████ ██      ██   ██ 
███████ ███████ ███████ █████   ██    ██ ██████  ██    ██     ██      ██      ███████ ██ ██ ████ ██ █████   ██████  
     ██ ██   ██ ██   ██ ██  ██  ██    ██ ██   ██ ██    ██     ██      ██      ██   ██ ██ ██  ██  ██ ██      ██   ██ 
███████ ██   ██ ██   ██ ██   ██  ██████  ██   ██  ██████       ██████ ███████ ██   ██ ██ ██      ██ ███████ ██   ██ 
`));

    console.log();

    const myTokens = JSON.parse(fs.readFileSync('accounts.json'));

    const choice = readlineSync.question(
      'Pilihan:\n1. Cek Profile\n2. Claim Task\n\nMasukkan pilihan: '
    );

    console.log();

    if (choice === '1') {
      for (const token of myTokens) {
        try {
          const profile = await getProfile(token);
          console.log();
          console.log(
            colors.yellow('👋 Your Profile 👇')
          );
          console.log();
          console.log(
            colors.yellow(`Your level: ${JSON.stringify(profile.level)}`)
          );
          console.log(
            colors.yellow(`Your points: ${JSON.stringify(profile.totalPoints)}`)
          );
          console.log(colors.cyan('========================================'));
        } catch (error) {
          console.log(
            colors.red('❌ Error in fetching profile:'),
            error.message
          );
          console.log(colors.cyan('========================================'));
        }
      }
    } else if (choice === '2') {
      for (const token of myTokens) {
        try {
          const tasks = await getTasks(token);
          for (const task of tasks) {
            try {
              const totalPoints = await claimTask(token, task.id);
              console.log();
              console.log(
                colors.green(
                  `✅ Quest has been claimed bro! ${JSON.stringify(
                    totalPoints
                  )} has been added to your account.`
                )
              );
              console.log(
                colors.cyan('========================================')
              );
            } catch (error) {
              console.log();
              console.log(
                colors.red('❌ Error in claiming task:'),
                error.message
              );
              console.log(
                colors.cyan('========================================')
              );
            }
          }
        } catch (error) {
          console.log(colors.red('❌ Error in fetching tasks:'), error.message);
          console.log(colors.cyan('========================================'));
        }
      }
    } else {
      console.log(colors.red('❌ Invalid choice.'));
    }
  } catch (error) {
    console.log(colors.red('❌ Error:'), error);
  }
})();
