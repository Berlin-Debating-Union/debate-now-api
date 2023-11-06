module.exports = (sequelize) => {
    const schedule = require('node-schedule');
    const Event = require('../models/events')(sequelize);
  
    schedule.scheduleJob('15 20 1 * *', () => {
        console.log('Run Scheduled Job: Close Open and Old Events.');
        try {
          Event.destroy({
            where: {
              date: {
                lte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
              }
            }
          }).then((event, err) => {
            if (err) {
              console.error(err);
            } else {
              console.info('Deleted all old events.');
            }
          });
        } catch (ex) {
          console.error(ex);
        }
      });
    };
  