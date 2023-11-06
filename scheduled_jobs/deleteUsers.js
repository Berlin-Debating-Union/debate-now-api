module.exports = (sequelize) => {
    const schedule = require('node-schedule');
    const Event = require('../models/events')(sequelize);
  
    schedule.scheduleJob('15 20 14 * *', () => {
        console.log('Run Scheduled Job: Delete old users.');
        try {
          User.destroy({
            where: {
              updatedAt: {
                lte: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString()
              }
            }
          }).then((event, err) => {
            if (err) {
              console.error(err);
            } else {
              console.info('Deleted all old users.');
            }
          });
        } catch (ex) {
          console.error(ex);
        }
      });
    };
  